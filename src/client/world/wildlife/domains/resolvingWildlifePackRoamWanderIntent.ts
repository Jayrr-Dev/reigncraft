/**
 * Alpha-led calm wander for spawn-pack stalkers with no active prey.
 *
 * @module components/world/wildlife/domains/resolvingWildlifePackRoamWanderIntent
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWildlifeBehaviorBlackboard } from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import type { DefiningWildlifeBehaviorIntent } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { listingWildlifeSpawnPackmates } from '@/components/world/wildlife/domains/listingWildlifeSpawnPackmates';
import { resolvingWildlifeHerdLandmarkWanderIntent } from '@/components/world/wildlife/domains/resolvingWildlifeHerdLandmarkWanderIntent';
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

function resolvingWildlifeFollowAlphaRoamIntent(
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
    alphaIntent.mode === 'idle' &&
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

/**
 * Keeps wolf packs together while calm: the alpha picks roam legs from the
 * shared spawn tile and followers trail behind it.
 */
export function resolvingWildlifePackRoamWanderIntent(
  blackboard: DefiningWildlifeBehaviorBlackboard
): DefiningWildlifeBehaviorIntent {
  if (blackboard.species.temperamentId !== 'stalker') {
    // Passive / skittish herds rest then travel to water, trees, or pasture.
    return resolvingWildlifeHerdLandmarkWanderIntent(blackboard);
  }

  if (blackboard.instance.aggroState.activeTargetId) {
    return resolvingWildlifeWanderIntent(blackboard);
  }

  const liveInstances = listingWildlifeBehaviorNearbyAndSelf(blackboard);
  const spawnPack = listingWildlifeSpawnPackmates({
    instance: blackboard.instance,
    instances: liveInstances,
    includeDead: false,
  });

  if (spawnPack.length <= 1) {
    return resolvingWildlifeWanderIntent(blackboard);
  }

  const formation = resolvingWildlifeSpawnPackRoamFormation({
    instance: blackboard.instance,
    nearbyInstances: blackboard.nearbyInstances,
    resolveSpecies: blackboard.resolveSpecies,
  });

  if (formation.isAlpha) {
    return resolvingWildlifeWanderIntent(
      blackboard,
      resolvingWildlifeSpawnPackRoamAnchor(blackboard.instance)
    );
  }

  const alpha = resolvingWildlifeSpawnPackAlphaInstance({
    instance: blackboard.instance,
    instances: liveInstances,
    resolveSpecies: blackboard.resolveSpecies,
  });

  if (!alpha) {
    return resolvingWildlifeWanderIntent(blackboard);
  }

  return resolvingWildlifeFollowAlphaRoamIntent(
    blackboard,
    alpha.position,
    alpha.aiState.intent
  );
}
