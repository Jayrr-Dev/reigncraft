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
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type {
  DefiningWildlifeAggressionLevel,
  DefiningWildlifeBehaviorIntent,
  DefiningWildlifeInstance,
  DefiningWildlifeTemperamentId,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { checkingWildlifeHazardAtPoint } from '@/components/world/wildlife/domains/checkingWildlifeHazardAtPoint';
import { checkingWildlifeFleeTargetReachableFromPosition } from '@/components/world/wildlife/domains/checkingWildlifeFleeTargetReachableFromPosition';
import { resolvingWildlifeReachableWalkableFleeTargetPoint } from '@/components/world/wildlife/domains/resolvingWildlifeWalkableFleeTargetPoint';
import type { ResolvingWildlifeSteeringHazardSampling } from '@/components/world/wildlife/domains/resolvingWildlifeSteeringStep';

const DEFINING_WILDLIFE_PLAYER_COLLISION_FLEE_TEMPERAMENTS: ReadonlySet<DefiningWildlifeTemperamentId> =
  new Set(['passive', 'skittish', 'retaliator']);

export type ResolvingWildlifeFleeFromThreatPointIntentParams = {
  position: DefiningWorldPlazaWorldPoint;
  threatPoint: DefiningWorldPlazaWorldPoint;
  fleeDistanceGrid?: number;
  species: DefiningWildlifeSpeciesDefinition;
  hazardSampling: ResolvingWildlifeSteeringHazardSampling;
};

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

function checkingWildlifeLockedFleeTargetStillValid(
  position: DefiningWorldPlazaWorldPoint,
  lockedFleeTargetPoint: DefiningWorldPlazaWorldPoint,
  species: DefiningWildlifeSpeciesDefinition,
  hazardSampling: ResolvingWildlifeSteeringHazardSampling
): boolean {
  return (
    checkingWildlifeHazardAtPoint({
      point: lockedFleeTargetPoint,
      species,
      placedBlocks: hazardSampling.placedBlocks,
      placedBlocksByTile: hazardSampling.placedBlocksByTile,
      isDaytime: hazardSampling.isDaytime,
    }) === 'safe' &&
    checkingWildlifeFleeTargetReachableFromPosition({
      position,
      fleeTargetPoint: lockedFleeTargetPoint,
      species,
      hazardSampling,
    })
  );
}

/** Resolves a flee intent away from a threat point on walkable terrain. */
export function resolvingWildlifeFleeFromThreatPointIntent({
  position,
  threatPoint,
  fleeDistanceGrid = DEFINING_WILDLIFE_PLAYER_COLLISION_FLEE_DISTANCE_GRID,
  species,
  hazardSampling,
}: ResolvingWildlifeFleeFromThreatPointIntentParams): DefiningWildlifeBehaviorIntent {
  return {
    mode: 'flee',
    targetPoint: resolvingWildlifeReachableWalkableFleeTargetPoint({
      position,
      threatPoint,
      fleeDistanceGrid,
      species,
      hazardSampling,
    }),
  };
}

export type ResolvingWildlifeLockedPlayerFleeIntentParams = {
  position: DefiningWorldPlazaWorldPoint;
  playerPosition: DefiningWorldPlazaWorldPoint;
  lockedFleeTargetPoint: DefiningWorldPlazaWorldPoint | null;
  species: DefiningWildlifeSpeciesDefinition;
  hazardSampling: ResolvingWildlifeSteeringHazardSampling;
};

/**
 * Reuses a locked flee heading for player panic so animals do not pivot every
 * frame toward a slowly walking player.
 */
export function resolvingWildlifeLockedPlayerFleeIntent({
  position,
  playerPosition,
  lockedFleeTargetPoint,
  species,
  hazardSampling,
}: ResolvingWildlifeLockedPlayerFleeIntentParams): DefiningWildlifeBehaviorIntent {
  if (
    lockedFleeTargetPoint &&
    checkingWildlifeLockedFleeTargetStillValid(
      position,
      lockedFleeTargetPoint,
      species,
      hazardSampling
    )
  ) {
    return {
      mode: 'flee',
      targetPoint: lockedFleeTargetPoint,
    };
  }

  return resolvingWildlifeFleeFromThreatPointIntent({
    position,
    threatPoint: playerPosition,
    species,
    hazardSampling,
  });
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
