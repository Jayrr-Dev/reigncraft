/**
 * Calm wander intent for wildlife with no active hunt target.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeWanderIntent
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  mappingWorldPlazaGrassSeededUnitToFloatRange,
  seedingWorldPlazaGrassTileDecorationFromTileIndex,
} from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';
import type { DefiningWildlifeBehaviorBlackboard } from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import {
  DEFINING_WILDLIFE_FLEE_ENTRY_RADIUS_MULTIPLIER,
  DEFINING_WILDLIFE_FLEE_EXIT_RADIUS_MULTIPLIER,
} from '@/components/world/wildlife/domains/definingWildlifeBehaviorHysteresisConstants';
import type { DefiningWildlifeBehaviorIntent } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeAggressionLevelProfile } from '@/components/world/wildlife/domains/resolvingWildlifeAggressionLevelFromAnchor';
import { checkingWildlifeFleesFromPlayerCollision } from '@/components/world/wildlife/domains/resolvingWildlifePlayerCollisionStartle';

const DEFINING_WILDLIFE_WANDER_SALT = 97;

/** Wander targets stay stable for this window, then re-roll. */
const DEFINING_WILDLIFE_WANDER_BUCKET_MS = 6_000;

/** Fraction of wander windows the animal simply stands still. */
const DEFINING_WILDLIFE_WANDER_IDLE_CHANCE = 0.45;

/** Reaching within this distance of a wander target counts as arrived. */
export const DEFINING_WILDLIFE_WANDER_ARRIVAL_RADIUS_GRID = 0.4;

function checkingWildlifeWanderLegApproachesNearbyPlayer(
  blackboard: DefiningWildlifeBehaviorBlackboard,
  targetPoint: DefiningWorldPlazaWorldPoint
): boolean {
  if (!blackboard.playerPosition) {
    return false;
  }

  if (
    !checkingWildlifeFleesFromPlayerCollision(
      blackboard.species.temperamentId,
      blackboard.instance.aggressionLevel
    )
  ) {
    return false;
  }

  const fleeRadiusMultiplier = resolvingWildlifeAggressionLevelProfile(
    blackboard.instance.aggressionLevel
  ).fleeRadiusMultiplier;
  const calmDownRadiusGrid =
    blackboard.species.aggro.aggroRadiusGrid *
    DEFINING_WILDLIFE_FLEE_ENTRY_RADIUS_MULTIPLIER *
    fleeRadiusMultiplier *
    DEFINING_WILDLIFE_FLEE_EXIT_RADIUS_MULTIPLIER;

  const currentDistanceToPlayer = Math.hypot(
    blackboard.instance.position.x - blackboard.playerPosition.x,
    blackboard.instance.position.y - blackboard.playerPosition.y
  );

  if (currentDistanceToPlayer > calmDownRadiusGrid) {
    return false;
  }

  const targetDistanceToPlayer = Math.hypot(
    targetPoint.x - blackboard.playerPosition.x,
    targetPoint.y - blackboard.playerPosition.y
  );

  return targetDistanceToPlayer < currentDistanceToPlayer;
}

/**
 * Resolves a calm wander intent: targets are stable for a whole time bucket
 * (no per-think re-rolls, which made animals jitter in circles), animals pause
 * between legs, and an already-reached target turns into idling.
 */
export function resolvingWildlifeWanderIntent(
  blackboard: DefiningWildlifeBehaviorBlackboard,
  spawnAnchorOverride?: DefiningWorldPlazaWorldPoint
): DefiningWildlifeBehaviorIntent {
  const roamAnchor = spawnAnchorOverride ?? blackboard.instance.spawnAnchor;
  const tileX = Math.floor(roamAnchor.x);
  const tileY = Math.floor(roamAnchor.y);
  const timeBucket = Math.floor(
    blackboard.nowMs / DEFINING_WILDLIFE_WANDER_BUCKET_MS
  );

  const idleRoll = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    tileX,
    tileY,
    DEFINING_WILDLIFE_WANDER_SALT + timeBucket * 3 + 2
  );

  if (idleRoll < DEFINING_WILDLIFE_WANDER_IDLE_CHANCE) {
    return { mode: 'idle' };
  }

  const offsetX = mappingWorldPlazaGrassSeededUnitToFloatRange(
    seedingWorldPlazaGrassTileDecorationFromTileIndex(
      tileX,
      tileY,
      DEFINING_WILDLIFE_WANDER_SALT + timeBucket * 3
    ),
    -3,
    3
  );
  const offsetY = mappingWorldPlazaGrassSeededUnitToFloatRange(
    seedingWorldPlazaGrassTileDecorationFromTileIndex(
      tileX,
      tileY,
      DEFINING_WILDLIFE_WANDER_SALT + timeBucket * 3 + 1
    ),
    -3,
    3
  );

  const targetPoint = {
    x: roamAnchor.x + offsetX,
    y: roamAnchor.y + offsetY,
    layer: roamAnchor.layer,
  };

  const distanceToTarget = Math.hypot(
    targetPoint.x - blackboard.instance.position.x,
    targetPoint.y - blackboard.instance.position.y
  );

  if (distanceToTarget <= DEFINING_WILDLIFE_WANDER_ARRIVAL_RADIUS_GRID) {
    return { mode: 'idle' };
  }

  if (
    checkingWildlifeWanderLegApproachesNearbyPlayer(blackboard, targetPoint)
  ) {
    return { mode: 'idle' };
  }

  return { mode: 'wander', targetPoint };
}
