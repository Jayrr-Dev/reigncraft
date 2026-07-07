/**
 * Applies physical damage to one wildlife instance through the health pipeline.
 *
 * @module components/world/wildlife/domains/applyingWildlifeInstancePhysicalDamage
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { applyingWildlifeInstanceHealthDamageWithFloatFeedback } from '@/components/world/wildlife/domains/applyingWildlifeInstanceHealthDamageWithFloatFeedback';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeSleepAmbushHealthDamageOptions } from '@/components/world/wildlife/domains/resolvingWildlifeSleepAmbushHealthDamageOptions';
import { wakingWildlifeFromSleepHit } from '@/components/world/wildlife/domains/wakingWildlifeFromSleepHit';
import type { ResolvingWildlifeSteeringHazardSampling } from '@/components/world/wildlife/domains/resolvingWildlifeSteeringStep';

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
};

/**
 * Runs wildlife physical damage, forcing a lethal EV tier roll on sleeping targets.
 */
export function applyingWildlifeInstancePhysicalDamage({
  instance,
  rawAmount,
  nowMs,
  wakeContext = null,
}: ApplyingWildlifeInstancePhysicalDamageParams): DefiningWildlifeInstance {
  const sleepAmbushOptions =
    resolvingWildlifeSleepAmbushHealthDamageOptions(instance);
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
    options: sleepAmbushOptions ?? {
      skipDamageRoll: true,
    },
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
