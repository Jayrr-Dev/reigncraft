/**
 * Flee-or-attack intent when a sleeping animal is startled awake.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeSleepWakeStartleIntent
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { DEFINING_WILDLIFE_SLEEP_WAKE_STARTLE_DURATION_MS } from '@/components/world/wildlife/domains/definingWildlifeSleepConstants';
import type {
  DefiningWildlifeAggressionLevel,
  DefiningWildlifeBehaviorIntent,
  DefiningWildlifeTemperamentId,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  checkingWildlifeFleesFromPlayerCollision,
  resolvingWildlifeFleeFromThreatPointIntent,
} from '@/components/world/wildlife/domains/resolvingWildlifePlayerCollisionStartle';
import type { ResolvingWildlifeSteeringHazardSampling } from '@/components/world/wildlife/domains/resolvingWildlifeSteeringStep';

const DEFINING_WILDLIFE_SLEEP_WAKE_ATTACK_TEMPERAMENTS: ReadonlySet<DefiningWildlifeTemperamentId> =
  new Set(['predator', 'ambusher']);

export type ResolvingWildlifeSleepWakeStartleIntentParams = {
  position: DefiningWorldPlazaWorldPoint;
  playerPosition: DefiningWorldPlazaWorldPoint;
  playerUserId: string | null;
  species: DefiningWildlifeSpeciesDefinition;
  temperamentId: DefiningWildlifeTemperamentId;
  aggressionLevel: DefiningWildlifeAggressionLevel;
  hazardSampling: ResolvingWildlifeSteeringHazardSampling;
  nowMs: number;
};

function checkingWildlifeSleepWakeAttacksOnStartle(
  temperamentId: DefiningWildlifeTemperamentId,
  aggressionLevel: DefiningWildlifeAggressionLevel
): boolean {
  if (aggressionLevel === 'aggressive') {
    return true;
  }

  if (aggressionLevel === 'tame') {
    return false;
  }

  if (DEFINING_WILDLIFE_SLEEP_WAKE_ATTACK_TEMPERAMENTS.has(temperamentId)) {
    return true;
  }

  if (temperamentId === 'retaliator') {
    return true;
  }

  return !checkingWildlifeFleesFromPlayerCollision(temperamentId, aggressionLevel);
}

export type ResolvingWildlifeSleepWakeStartleIntentResult = {
  intent: DefiningWildlifeBehaviorIntent;
  startledUntilMs: number | null;
  fleeTargetPoint: DefiningWorldPlazaWorldPoint | null;
};

/**
 * Picks flee or attack when a sleeper is disturbed by the player.
 */
export function resolvingWildlifeSleepWakeStartleIntent({
  position,
  playerPosition,
  playerUserId,
  species,
  temperamentId,
  aggressionLevel,
  hazardSampling,
  nowMs,
}: ResolvingWildlifeSleepWakeStartleIntentParams): ResolvingWildlifeSleepWakeStartleIntentResult {
  const startledUntilMs = nowMs + DEFINING_WILDLIFE_SLEEP_WAKE_STARTLE_DURATION_MS;
  const shouldAttack = checkingWildlifeSleepWakeAttacksOnStartle(
    temperamentId,
    aggressionLevel
  );

  if (shouldAttack && playerUserId) {
    return {
      intent: {
        mode: 'attack',
        targetInstanceId: playerUserId,
        targetPoint: playerPosition,
      },
      startledUntilMs: null,
      fleeTargetPoint: null,
    };
  }

  const fleeIntent = resolvingWildlifeFleeFromThreatPointIntent({
    position,
    threatPoint: playerPosition,
    species,
    hazardSampling,
  });

  return {
    intent: fleeIntent,
    startledUntilMs,
    fleeTargetPoint: fleeIntent.targetPoint ?? null,
  };
}
