/**
 * Applies physical damage to one wildlife instance through the health pipeline.
 *
 * @module components/world/wildlife/domains/applyingWildlifeInstancePhysicalDamage
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { applyingWildlifeInstanceHealthDamageWithFloatFeedback } from '@/components/world/wildlife/domains/applyingWildlifeInstanceHealthDamageWithFloatFeedback';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  resolvingWildlifeObeseIncomingPhysicalDamageOptions,
  resolvingWildlifeObeseJumpAttackDamageOptions,
} from '@/components/world/wildlife/domains/resolvingWildlifeLargeSizeFrameDamageOptions';
import { resolvingWildlifeOmegaWolfOutgoingDamageOptions } from '@/components/world/wildlife/domains/resolvingWildlifeOmegaWolfOutgoingDamageOptions';
import { resolvingWildlifePlayerOutgoingPhysicalDamageOptions } from '@/components/world/wildlife/domains/resolvingWildlifePlayerOutgoingPhysicalDamageOptions';
import { resolvingWildlifeSleepAmbushHealthDamageOptions } from '@/components/world/wildlife/domains/resolvingWildlifeSleepAmbushHealthDamageOptions';
import type { ResolvingWildlifeSteeringHazardSampling } from '@/components/world/wildlife/domains/resolvingWildlifeSteeringStep';
import { checkingWorldPlazaEntityHealthSleepCanWakeFromDamage } from '@/components/world/health/domains/checkingWorldPlazaEntityHealthSleepCanWakeFromDamage';
import { wakingWildlifeFromSleepHit } from '@/components/world/wildlife/domains/wakingWildlifeFromSleepHit';

export type ApplyingWildlifeInstancePhysicalDamageWakeContext = {
  threatPoint: DefiningWorldPlazaWorldPoint;
  threatTargetId: string | null;
  species: DefiningWildlifeSpeciesDefinition;
  hazardSampling: ResolvingWildlifeSteeringHazardSampling;
};

export type ApplyingWildlifeInstancePhysicalDamageParams = {
  instance: DefiningWildlifeInstance;
  rawAmount: number;
  nowMs: number;
  wakeContext?: ApplyingWildlifeInstancePhysicalDamageWakeContext | null;
  attacker?: Pick<
    DefiningWildlifeInstance,
    'largeSizeFrame' | 'aiState' | 'speciesId'
  > | null;
};

/**
 * Runs wildlife physical damage, forcing a lethal EV tier roll on sleeping targets.
 */
export function applyingWildlifeInstancePhysicalDamage({
  instance,
  rawAmount,
  nowMs,
  wakeContext = null,
  attacker = null,
}: ApplyingWildlifeInstancePhysicalDamageParams): DefiningWildlifeInstance {
  const sleepAmbushOptions =
    resolvingWildlifeSleepAmbushHealthDamageOptions(instance);
  const obeseIncomingOptions =
    resolvingWildlifeObeseIncomingPhysicalDamageOptions(instance);
  const obeseJumpAttackOptions = attacker
    ? resolvingWildlifeObeseJumpAttackDamageOptions(attacker, nowMs)
    : null;
  const omegaOutgoingOptions = attacker?.speciesId
    ? resolvingWildlifeOmegaWolfOutgoingDamageOptions(attacker.speciesId)
    : null;
  const damageOptions =
    sleepAmbushOptions ??
    omegaOutgoingOptions ??
    obeseJumpAttackOptions ??
    obeseIncomingOptions ??
    (attacker
      ? { skipDamageRoll: true }
      : resolvingWildlifePlayerOutgoingPhysicalDamageOptions());
  const wasSleeping = sleepAmbushOptions !== null;
  const canWakeFromDamage = checkingWorldPlazaEntityHealthSleepCanWakeFromDamage(
    instance.healthState,
    nowMs
  );
  const shouldWakeFromHit = wasSleeping && canWakeFromDamage;

  let nextInstance = applyingWildlifeInstanceHealthDamageWithFloatFeedback({
    instance: shouldWakeFromHit
      ? {
          ...instance,
          aiState: {
            ...instance.aiState,
            isSleeping: false,
            hasSleepBeenDisturbed: true,
          },
        }
      : instance,
    rawAmount,
    kind: 'physical',
    nowMs,
    options: damageOptions,
  });

  if (shouldWakeFromHit && !nextInstance.isDead && wakeContext) {
    nextInstance = wakingWildlifeFromSleepHit({
      instance: nextInstance,
      species: wakeContext.species,
      threatPoint: wakeContext.threatPoint,
      threatTargetId: wakeContext.threatTargetId,
      hazardSampling: wakeContext.hazardSampling,
      nowMs,
    });
  }

  return nextInstance;
}
