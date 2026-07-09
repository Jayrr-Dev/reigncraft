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
import { resolvingWildlifeSleepAmbushHealthDamageOptions } from '@/components/world/wildlife/domains/resolvingWildlifeSleepAmbushHealthDamageOptions';
import type { ResolvingWildlifeSteeringHazardSampling } from '@/components/world/wildlife/domains/resolvingWildlifeSteeringStep';
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
    'largeSizeFrame' | 'aiState'
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
  const damageOptions = sleepAmbushOptions ??
    obeseJumpAttackOptions ??
    obeseIncomingOptions ?? {
      skipDamageRoll: true,
    };
  const wasSleeping = sleepAmbushOptions !== null;

  let nextInstance = applyingWildlifeInstanceHealthDamageWithFloatFeedback({
    instance: wasSleeping
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

  if (wasSleeping && !nextInstance.isDead && wakeContext) {
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
