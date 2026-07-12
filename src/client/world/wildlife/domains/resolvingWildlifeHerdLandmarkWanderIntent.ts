/**
 * Calm rest → landmark travel for herbivore herds (and solo grazers).
 *
 * Paired wander buckets: first bucket idle (rest), second bucket walk to
 * water / trees / pasture. Spawn-pack followers trail the alpha.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeHerdLandmarkWanderIntent
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { seedingWorldPlazaGrassTileDecorationFromTileIndex } from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';
import { checkingWildlifeHerdLandmarkEligibleTemperament } from '@/components/world/wildlife/domains/checkingWildlifeHerdLandmarkEligibleTemperament';
import type { DefiningWildlifeBehaviorBlackboard } from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import {
  DEFINING_WILDLIFE_HERD_LANDMARK_ARRIVAL_RADIUS_GRID,
  DEFINING_WILDLIFE_HERD_LANDMARK_SALT,
  DEFINING_WILDLIFE_HERD_LANDMARK_TRAVEL_CHANCE,
} from '@/components/world/wildlife/domains/definingWildlifeHerdLandmarkTravelConstants';
import type { DefiningWildlifeBehaviorIntent } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { DEFINING_WILDLIFE_WANDER_BUCKET_MS } from '@/components/world/wildlife/domains/definingWildlifeWanderConstants';
import { listingWildlifeSpawnPackmates } from '@/components/world/wildlife/domains/listingWildlifeSpawnPackmates';
import { resolvingWildlifeHerdLandmarkKind } from '@/components/world/wildlife/domains/resolvingWildlifeHerdLandmarkKind';
import { resolvingWildlifeHerdLandmarkTargetPoint } from '@/components/world/wildlife/domains/resolvingWildlifeHerdLandmarkTargetPoint';
import { resolvingWildlifePackRoamFollowDistances } from '@/components/world/wildlife/domains/resolvingWildlifePackRoamFollowDistances';
import { resolvingWildlifeSpawnPackAlphaInstance } from '@/components/world/wildlife/domains/resolvingWildlifeSpawnPackAlphaInstance';
import { resolvingWildlifeSpawnPackRoamAnchor } from '@/components/world/wildlife/domains/resolvingWildlifeSpawnPackRoamAnchor';
import { resolvingWildlifeSpawnPackRoamFormation } from '@/components/world/wildlife/domains/resolvingWildlifeSpawnPackRoamFormation';
import { resolvingWildlifeStalkFollowTargetPoint } from '@/components/world/wildlife/domains/resolvingWildlifeStalkFollowTargetPoint';
import {
  DEFINING_WILDLIFE_WANDER_ARRIVAL_RADIUS_GRID,
  resolvingWildlifeWanderIntent,
} from '@/components/world/wildlife/domains/resolvingWildlifeWanderIntent';

function listingWildlifeBehaviorNearbyAndSelf(
  blackboard: DefiningWildlifeBehaviorBlackboard
) {
  const byId = new Map(
    blackboard.nearbyInstances.map((instance) => [
      instance.instanceId,
      instance,
    ])
  );
  byId.set(blackboard.instance.instanceId, blackboard.instance);

  return [...byId.values()];
}

function resolvingWildlifeFollowHerdAlphaIntent(
  blackboard: DefiningWildlifeBehaviorBlackboard,
  alphaPosition: DefiningWorldPlazaWorldPoint,
  alphaIntent: DefiningWildlifeBehaviorIntent
): DefiningWildlifeBehaviorIntent {
  const formation = resolvingWildlifeSpawnPackRoamFormation({
    instance: blackboard.instance,
    nearbyInstances: blackboard.nearbyInstances,
    resolveSpecies: blackboard.resolveSpecies,
  });
  const followDistances = resolvingWildlifePackRoamFollowDistances(formation);
  const followTarget = resolvingWildlifeStalkFollowTargetPoint({
    position: blackboard.instance.position,
    playerPosition: alphaPosition,
    ...followDistances,
  });
  const distanceToAlpha = Math.hypot(
    alphaPosition.x - blackboard.instance.position.x,
    alphaPosition.y - blackboard.instance.position.y
  );

  if (
    (alphaIntent.mode === 'idle' || alphaIntent.mode === 'graze') &&
    distanceToAlpha <= followDistances.followMaxDistanceGrid
  ) {
    return { mode: 'idle' };
  }

  const distanceToFollowTarget = Math.hypot(
    followTarget.x - blackboard.instance.position.x,
    followTarget.y - blackboard.instance.position.y
  );

  if (distanceToFollowTarget <= DEFINING_WILDLIFE_WANDER_ARRIVAL_RADIUS_GRID) {
    return { mode: 'idle' };
  }

  return { mode: 'wander', targetPoint: followTarget };
}

function resolvingWildlifeHerdLandmarkLeaderIntent(
  blackboard: DefiningWildlifeBehaviorBlackboard,
  roamAnchor: DefiningWorldPlazaWorldPoint
): DefiningWildlifeBehaviorIntent {
  const tileX = Math.floor(roamAnchor.x);
  const tileY = Math.floor(roamAnchor.y);
  const timeBucket = Math.floor(
    blackboard.nowMs / DEFINING_WILDLIFE_WANDER_BUCKET_MS
  );
  const pairIndex = Math.floor(timeBucket / 2);
  const isRestHalf = timeBucket % 2 === 0;

  const landmarkCycleRoll = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    tileX,
    tileY,
    DEFINING_WILDLIFE_HERD_LANDMARK_SALT + pairIndex * 3
  );

  if (landmarkCycleRoll >= DEFINING_WILDLIFE_HERD_LANDMARK_TRAVEL_CHANCE) {
    return resolvingWildlifeWanderIntent(blackboard, roamAnchor);
  }

  if (isRestHalf) {
    return { mode: 'idle' };
  }

  const landmarkKind = resolvingWildlifeHerdLandmarkKind({
    tileX,
    tileY,
    pairIndex,
  });
  const targetPoint = resolvingWildlifeHerdLandmarkTargetPoint({
    position: blackboard.instance.position,
    roamAnchor,
    species: blackboard.species,
    landmarkKind,
    pairIndex,
  });

  if (!targetPoint) {
    return resolvingWildlifeWanderIntent(blackboard, roamAnchor);
  }

  const distanceToTarget = Math.hypot(
    targetPoint.x - blackboard.instance.position.x,
    targetPoint.y - blackboard.instance.position.y
  );

  if (distanceToTarget <= DEFINING_WILDLIFE_HERD_LANDMARK_ARRIVAL_RADIUS_GRID) {
    return { mode: 'idle' };
  }

  return { mode: 'wander', targetPoint };
}

/**
 * Rest awhile, then lead (or follow) a travel leg to water, trees, or pasture.
 * Falls back to plain wander when the temperament is not herd-eligible.
 */
export function resolvingWildlifeHerdLandmarkWanderIntent(
  blackboard: DefiningWildlifeBehaviorBlackboard
): DefiningWildlifeBehaviorIntent {
  if (!checkingWildlifeHerdLandmarkEligibleTemperament(blackboard.species)) {
    return resolvingWildlifeWanderIntent(blackboard);
  }

  const liveInstances = listingWildlifeBehaviorNearbyAndSelf(blackboard);
  const spawnPack = listingWildlifeSpawnPackmates({
    instance: blackboard.instance,
    instances: liveInstances,
    includeDead: false,
  });
  const roamAnchor =
    spawnPack.length > 1
      ? resolvingWildlifeSpawnPackRoamAnchor(blackboard.instance)
      : blackboard.instance.spawnAnchor;

  if (spawnPack.length <= 1) {
    return resolvingWildlifeHerdLandmarkLeaderIntent(blackboard, roamAnchor);
  }

  const formation = resolvingWildlifeSpawnPackRoamFormation({
    instance: blackboard.instance,
    nearbyInstances: blackboard.nearbyInstances,
    resolveSpecies: blackboard.resolveSpecies,
  });

  if (formation.isAlpha) {
    return resolvingWildlifeHerdLandmarkLeaderIntent(blackboard, roamAnchor);
  }

  const alpha = resolvingWildlifeSpawnPackAlphaInstance({
    instance: blackboard.instance,
    instances: liveInstances,
    resolveSpecies: blackboard.resolveSpecies,
  });

  if (!alpha) {
    return resolvingWildlifeHerdLandmarkLeaderIntent(blackboard, roamAnchor);
  }

  return resolvingWildlifeFollowHerdAlphaIntent(
    blackboard,
    alpha.position,
    alpha.aiState.intent
  );
}
