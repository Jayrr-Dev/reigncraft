/**
 * Wakes a sleeping animal after it takes damage and applies flee or attack intent.
 *
 * @module components/world/wildlife/domains/wakingWildlifeFromSleepHit
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeSleepWakeStartleIntent } from '@/components/world/wildlife/domains/resolvingWildlifeSleepWakeStartleIntent';
import type { ResolvingWildlifeSteeringHazardSampling } from '@/components/world/wildlife/domains/resolvingWildlifeSteeringStep';

export type WakingWildlifeFromSleepHitParams = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  threatPoint: DefiningWorldPlazaWorldPoint;
  threatTargetId: string | null;
  hazardSampling: ResolvingWildlifeSteeringHazardSampling;
  nowMs: number;
};

/**
 * Clears sleep, marks the animal awake for the rest of its life, and startles it.
 */
export function wakingWildlifeFromSleepHit({
  instance,
  species,
  threatPoint,
  threatTargetId,
  hazardSampling,
  nowMs,
}: WakingWildlifeFromSleepHitParams): DefiningWildlifeInstance {
  const wakeResult = resolvingWildlifeSleepWakeStartleIntent({
    position: instance.position,
    playerPosition: threatPoint,
    playerUserId: threatTargetId,
    species,
    temperamentId: species.temperamentId,
    aggressionLevel: instance.aggressionLevel,
    hazardSampling,
    nowMs,
  });

  return {
    ...instance,
    aiState: {
      ...instance.aiState,
      isSleeping: false,
      hasSleepBeenDisturbed: true,
      intent: wakeResult.intent,
      startledUntilMs: wakeResult.startledUntilMs,
      fleeTargetPoint: wakeResult.fleeTargetPoint,
      isMoving:
        wakeResult.intent.mode === 'flee' || wakeResult.intent.mode === 'attack',
      motionClip:
        wakeResult.intent.mode === 'attack'
          ? 'takeDamage'
          : wakeResult.intent.mode === 'flee'
            ? 'run'
            : 'takeDamage',
      steeringCache: null,
      chargeWindupStartedAtMs: null,
      jumpState: null,
    },
  };
}
