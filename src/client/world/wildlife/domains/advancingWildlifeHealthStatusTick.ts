/**
 * Status effect and DoT tick for one wildlife instance.
 *
 * @module components/world/wildlife/domains/advancingWildlifeHealthStatusTick
 */

import {
  enqueueingWorldPlazaEntityHealthFloatText,
  pruningWorldPlazaEntityHealthFloatTexts,
} from '@/components/world/health/domains/managingWorldPlazaEntityHealthFloatTexts';
import { tickingWorldPlazaEntityHealthState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { checkingWildlifeSpeciesIsImmortal } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesIsImmortal';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { notifyingWildlifeVocalSfxOnDeath } from '@/components/world/wildlife/domains/notifyingWildlifeVocalSfxOnDeath';

export type AdvancingWildlifeHealthStatusTickParams = {
  instance: DefiningWildlifeInstance;
  deltaMs: number;
  nowMs: number;
};

/**
 * Advances bleed, poison, potential damage, and other timed health effects.
 */
export function advancingWildlifeHealthStatusTick({
  instance,
  deltaMs,
  nowMs,
}: AdvancingWildlifeHealthStatusTickParams): DefiningWildlifeInstance {
  if (instance.isDead) {
    return {
      ...instance,
      floatingTexts: pruningWorldPlazaEntityHealthFloatTexts(
        instance.floatingTexts,
        nowMs
      ),
    };
  }

  const species = resolvingWildlifeSpeciesDefinition(instance.speciesId);

  if (species && checkingWildlifeSpeciesIsImmortal(species)) {
    return {
      ...instance,
      healthState: {
        ...instance.healthState,
        currentHealth: instance.healthState.baseMaxHealth,
        bleedEffects: [],
        poisonEffects: [],
      },
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
  const previousHealth = instance.healthState.currentHealth;
  const previousShield = instance.healthState.shieldPoints;
  const nextHealthState = tickingWorldPlazaEntityHealthState(
    instance.healthState,
    nowMs,
    deltaMs,
    false
  );
  const healthLost = previousHealth - nextHealthState.currentHealth;
  const shieldLost = previousShield - nextHealthState.shieldPoints;
  let nextFloats = prunedFloats;

  if (shieldLost > 0) {
    const shieldResult = enqueueingWorldPlazaEntityHealthFloatText({
      floats: nextFloats,
      kind: 'shield_absorb',
      amount: shieldLost,
      damageKind: nextHealthState.lastDamageKind,
      nowMs,
    });
    nextFloats = shieldResult.floats;
  }

  if (healthLost > 0) {
    const damageResult = enqueueingWorldPlazaEntityHealthFloatText({
      floats: nextFloats,
      kind: 'damage',
      amount: healthLost,
      damageKind: nextHealthState.lastDamageKind,
      nowMs,
    });
    nextFloats = damageResult.floats;
  }

  const died = nextHealthState.currentHealth <= 0;

  const nextInstance: DefiningWildlifeInstance = {
    ...instance,
    healthState: nextHealthState,
    floatingTexts: nextFloats,
    isDead: died,
    diedAtMs: died ? nowMs : instance.diedAtMs,
    aiState: {
      ...instance.aiState,
      motionClip: died ? 'die' : instance.aiState.motionClip,
    },
  };

  notifyingWildlifeVocalSfxOnDeath({
    instanceId: instance.instanceId,
    wasDead: instance.isDead,
    isDead: nextInstance.isDead,
  });

  return nextInstance;
}
