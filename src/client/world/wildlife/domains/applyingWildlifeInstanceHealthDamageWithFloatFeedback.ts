/**
 * Applies incoming damage to one wildlife instance and enqueues combat floats.
 *
 * @module components/world/wildlife/domains/applyingWildlifeInstanceHealthDamageWithFloatFeedback
 */

import { computingWorldPlazaEntityHealthDamage } from '@/components/world/health/domains/computingWorldPlazaEntityHealthDamage';
import type {
  DefiningWorldPlazaEntityDamageKind,
  DefiningWorldPlazaEntityHealthDamageOptions,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import {
  enqueueingWorldPlazaEntityHealthFloatText,
  pruningWorldPlazaEntityHealthFloatTexts,
} from '@/components/world/health/domains/managingWorldPlazaEntityHealthFloatTexts';
import { mappingWorldPlazaDamageOutcomeTierToFloatTextKind } from '@/components/world/health/domains/mappingWorldPlazaDamageOutcomeTierToFloatTextKind';
import { checkingWildlifeSpeciesIsImmortal } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesIsImmortal';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type ApplyingWildlifeInstanceHealthDamageWithFloatFeedbackParams = {
  instance: DefiningWildlifeInstance;
  rawAmount: number;
  kind: DefiningWorldPlazaEntityDamageKind;
  nowMs: number;
  options?: Pick<
    DefiningWorldPlazaEntityHealthDamageOptions,
    'skipDamageRoll' | 'attackerDamageRollModifiers' | 'forcedDeviationScore'
  >;
  motionClipOnHit?: DefiningWildlifeInstance['aiState']['motionClip'];
  onAppliedDamage?: (params: {
    outcomeTier: string | null;
    healthDamage: number;
  }) => void;
};

/**
 * Runs the health damage pipeline and appends floating combat numbers.
 */
export function applyingWildlifeInstanceHealthDamageWithFloatFeedback({
  instance,
  rawAmount,
  kind,
  nowMs,
  options,
  motionClipOnHit = 'takeDamage',
  onAppliedDamage,
}: ApplyingWildlifeInstanceHealthDamageWithFloatFeedbackParams): DefiningWildlifeInstance {
  const species = resolvingWildlifeSpeciesDefinition(instance.speciesId);

  if (species && checkingWildlifeSpeciesIsImmortal(species)) {
    return {
      ...instance,
      floatingTexts: pruningWorldPlazaEntityHealthFloatTexts(
        instance.floatingTexts,
        nowMs
      ),
    };
  }

  const prunedFloats = pruningWorldPlazaEntityHealthFloatTexts(
    instance.floatingTexts,
    nowMs
  );

  const damageResult = computingWorldPlazaEntityHealthDamage({
    state: instance.healthState,
    rawAmount,
    kind,
    nowMs,
    options: {
      skipDamageRoll: true,
      ...options,
    },
  });

  let nextFloats = prunedFloats;

  if (damageResult.appliedDamage.wasBlocked) {
    const blockedResult = enqueueingWorldPlazaEntityHealthFloatText({
      floats: nextFloats,
      kind: 'blocked',
      amount: 0,
      damageKind: kind,
      nowMs,
    });
    nextFloats = blockedResult.floats;
  } else if (damageResult.appliedDamage.healthDamage > 0) {
    const outcomeTier = damageResult.appliedDamage.tier;
    onAppliedDamage?.({
      outcomeTier,
      healthDamage: damageResult.appliedDamage.healthDamage,
    });
    const floatKind =
      outcomeTier !== null
        ? mappingWorldPlazaDamageOutcomeTierToFloatTextKind(outcomeTier)
        : 'damage';
    const enqueueResult = enqueueingWorldPlazaEntityHealthFloatText({
      floats: nextFloats,
      kind: floatKind,
      amount: damageResult.appliedDamage.healthDamage,
      damageKind: kind,
      outcomeTier,
      deviationScore: damageResult.appliedDamage.deviationScore,
      nowMs,
    });
    nextFloats = enqueueResult.floats;
  }

  const died = damageResult.state.currentHealth <= 0;

  return {
    ...instance,
    healthState: damageResult.state,
    isDead: died,
    diedAtMs: died ? nowMs : instance.diedAtMs,
    floatingTexts: nextFloats,
    aiState: {
      ...instance.aiState,
      motionClip: died ? 'die' : motionClipOnHit,
    },
  };
}
