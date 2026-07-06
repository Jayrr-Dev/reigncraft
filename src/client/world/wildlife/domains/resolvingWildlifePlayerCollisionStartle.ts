/**
 * Flee intent and temperament checks for player collision startle.
 *
 * @module components/world/wildlife/domains/resolvingWildlifePlayerCollisionStartle
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WILDLIFE_PLAYER_COLLISION_FLEE_DISTANCE_GRID,
  DEFINING_WILDLIFE_PLAYER_COLLISION_STARTLE_DURATION_MS,
} from '@/components/world/wildlife/domains/definingWildlifeCollisionConstants';
import type {
  DefiningWildlifeAggressionLevel,
  DefiningWildlifeBehaviorIntent,
  DefiningWildlifeInstance,
  DefiningWildlifeTemperamentId,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';

const DEFINING_WILDLIFE_PLAYER_COLLISION_FLEE_TEMPERAMENTS: ReadonlySet<DefiningWildlifeTemperamentId> =
  new Set(['passive', 'skittish', 'retaliator']);

/** Returns true while the animal is actively chasing or attacking the player. */
export function checkingWildlifeIsHuntingPlayer(
  instance: DefiningWildlifeInstance,
  playerUserId: string | null
): boolean {
  if (!playerUserId) {
    return false;
  }

  const intent = instance.aiState.intent;

  return (
    (intent.mode === 'chase' || intent.mode === 'attack') &&
    intent.targetInstanceId === playerUserId
  );
}

/** Returns true when bumping this animal should trigger a short flee. */
export function checkingWildlifeFleesFromPlayerCollision(
  temperamentId: DefiningWildlifeTemperamentId,
  aggressionLevel: DefiningWildlifeAggressionLevel = 'normal'
): boolean {
  if (aggressionLevel === 'aggressive') {
    return false;
  }

  if (aggressionLevel === 'tame') {
    return true;
  }

  return DEFINING_WILDLIFE_PLAYER_COLLISION_FLEE_TEMPERAMENTS.has(
    temperamentId
  );
}

/** Resolves a flee intent away from a threat point. */
export function resolvingWildlifeFleeFromThreatPointIntent(
  position: DefiningWorldPlazaWorldPoint,
  threatPoint: DefiningWorldPlazaWorldPoint
): DefiningWildlifeBehaviorIntent {
  const deltaX = position.x - threatPoint.x;
  const deltaY = position.y - threatPoint.y;
  const length = Math.hypot(deltaX, deltaY) || 1;

  return {
    mode: 'flee',
    targetPoint: {
      x:
        position.x +
        (deltaX / length) *
          DEFINING_WILDLIFE_PLAYER_COLLISION_FLEE_DISTANCE_GRID,
      y:
        position.y +
        (deltaY / length) *
          DEFINING_WILDLIFE_PLAYER_COLLISION_FLEE_DISTANCE_GRID,
      layer: position.layer,
    },
  };
}

/** Timestamp until which a startled flee should continue. */
export function resolvingWildlifePlayerCollisionStartleUntilMs(
  nowMs: number
): number {
  return nowMs + DEFINING_WILDLIFE_PLAYER_COLLISION_STARTLE_DURATION_MS;
}

/** Returns true while a prior player bump should keep the animal fleeing. */
export function checkingWildlifeIsStartledFromPlayerCollision(
  startledUntilMs: number | null,
  nowMs: number
): boolean {
  return startledUntilMs !== null && startledUntilMs > nowMs;
}
