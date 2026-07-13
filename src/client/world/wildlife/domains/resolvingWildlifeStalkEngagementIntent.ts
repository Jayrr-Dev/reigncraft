/**
 * PackHunter shadowing intents: follow bands, calm shadow wander, and pack cohesion.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeStalkEngagementIntent
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { seedingWorldPlazaGrassTileDecorationFromTileIndex } from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';
import {
  DEFINING_WILDLIFE_STALK_CATCH_UP_RUN_EXTRA_DISTANCE_GRID,
  DEFINING_WILDLIFE_STALK_SHADOW_WANDER_ARRIVAL_RADIUS_GRID,
  DEFINING_WILDLIFE_STALK_SHADOW_WANDER_BUCKET_MS,
  DEFINING_WILDLIFE_STALK_SHADOW_WANDER_IDLE_CHANCE,
  DEFINING_WILDLIFE_STALK_SHADOW_WANDER_SALT,
  DEFINING_WILDLIFE_STALK_TOO_CLOSE_RETREAT_STEP_GRID,
} from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';
import type { DefiningWildlifeBehaviorIntent } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import type { ResolvingWildlifeStalkPackFollowDistances } from '@/components/world/wildlife/domains/resolvingWildlifeStalkPackFollowDistances';
import { resolvingWildlifeStalkShadowWanderTargetPoint } from '@/components/world/wildlife/domains/resolvingWildlifeStalkShadowWanderTargetPoint';
import type { ResolvingWildlifeStalkSpawnPackFormation } from '@/components/world/wildlife/domains/resolvingWildlifeStalkSpawnPackFormation';

export type ResolvingWildlifeStalkEngagementIntentParams = {
  instanceId: string;
  nowMs: number;
  position: DefiningWorldPlazaWorldPoint;
  preyTargetId: string;
  preyPosition: DefiningWorldPlazaWorldPoint;
  preyStillDurationMs: number;
  followDistances: ResolvingWildlifeStalkPackFollowDistances;
  formation: ResolvingWildlifeStalkSpawnPackFormation;
  alphaPosition: DefiningWorldPlazaWorldPoint | null;
};

type ResolvingWildlifeStalkManeuverLeg = {
  targetPoint: DefiningWorldPlazaWorldPoint;
  facingPoint: DefiningWorldPlazaWorldPoint;
  pace: 'walk' | 'run';
};

function resolvingWildlifeStalkShadowWanderSeed(
  position: DefiningWorldPlazaWorldPoint,
  timeBucket: number,
  salt: number
): number {
  return seedingWorldPlazaGrassTileDecorationFromTileIndex(
    Math.floor(position.x),
    Math.floor(position.y),
    DEFINING_WILDLIFE_STALK_SHADOW_WANDER_SALT + salt + timeBucket * 5
  );
}

function resolvingWildlifeStalkJoinAlphaLeg({
  position,
  alphaPosition,
  preyPosition,
  followDistances,
}: {
  position: DefiningWorldPlazaWorldPoint;
  alphaPosition: DefiningWorldPlazaWorldPoint;
  preyPosition: DefiningWorldPlazaWorldPoint;
  followDistances: ResolvingWildlifeStalkPackFollowDistances;
}): ResolvingWildlifeStalkManeuverLeg {
  const deltaX = alphaPosition.x - position.x;
  const deltaY = alphaPosition.y - position.y;
  const distance = Math.hypot(deltaX, deltaY);

  if (distance <= followDistances.followMinDistanceGrid) {
    return {
      targetPoint: position,
      facingPoint: preyPosition,
      pace: 'walk',
    };
  }

  if (distance > followDistances.followMaxDistanceGrid) {
    const directionX = deltaX / distance;
    const directionY = deltaY / distance;
    const catchUpDistance = distance - followDistances.followDistanceGrid;

    return {
      targetPoint: {
        x: position.x + directionX * catchUpDistance,
        y: position.y + directionY * catchUpDistance,
        layer: position.layer,
      },
      facingPoint: preyPosition,
      pace: 'run',
    };
  }

  const directionX = deltaX / distance;
  const directionY = deltaY / distance;

  return {
    targetPoint: {
      x: position.x + directionX * 0.45,
      y: position.y + directionY * 0.45,
      layer: position.layer,
    },
    facingPoint: preyPosition,
    pace: 'walk',
  };
}

function resolvingWildlifeStalkComfortBandShadowWanderLeg(
  params: ResolvingWildlifeStalkEngagementIntentParams
): ResolvingWildlifeStalkManeuverLeg {
  const timeBucket = Math.floor(
    params.nowMs / DEFINING_WILDLIFE_STALK_SHADOW_WANDER_BUCKET_MS
  );
  const mayJoinAlpha =
    !params.formation.isAlpha && params.alphaPosition !== null;

  if (mayJoinAlpha && params.alphaPosition !== null) {
    const distanceToAlpha = Math.hypot(
      params.alphaPosition.x - params.position.x,
      params.alphaPosition.y - params.position.y
    );

    // Pack cohesion only when the follower has drifted past the ideal trail
    // gap; otherwise stay on the calm shadow wander so the pack does not
    // constantly tug toward the alpha.
    if (distanceToAlpha > params.followDistances.followDistanceGrid) {
      return resolvingWildlifeStalkJoinAlphaLeg({
        position: params.position,
        alphaPosition: params.alphaPosition,
        preyPosition: params.preyPosition,
        followDistances: params.followDistances,
      });
    }
  }

  const idleRoll = resolvingWildlifeStalkShadowWanderSeed(
    params.position,
    timeBucket,
    0
  );

  if (idleRoll < DEFINING_WILDLIFE_STALK_SHADOW_WANDER_IDLE_CHANCE) {
    return {
      targetPoint: params.position,
      facingPoint: params.preyPosition,
      pace: 'walk',
    };
  }

  const targetPoint = resolvingWildlifeStalkShadowWanderTargetPoint({
    instanceId: params.instanceId,
    position: params.position,
    preyPosition: params.preyPosition,
    followMinDistanceGrid: params.followDistances.followMinDistanceGrid,
    followMaxDistanceGrid: params.followDistances.followMaxDistanceGrid,
    timeBucket,
  });
  const distanceToTarget = Math.hypot(
    targetPoint.x - params.position.x,
    targetPoint.y - params.position.y
  );

  if (
    distanceToTarget <=
    DEFINING_WILDLIFE_STALK_SHADOW_WANDER_ARRIVAL_RADIUS_GRID
  ) {
    return {
      targetPoint: params.position,
      facingPoint: params.preyPosition,
      pace: 'walk',
    };
  }

  return {
    targetPoint,
    facingPoint: params.preyPosition,
    pace: 'walk',
  };
}

/**
 * Picks a stalk intent: retreat when too close, catch up when too far, otherwise
 * a calm random-walk leg inside the follow ring (same walker as idle roam).
 */
export function resolvingWildlifeStalkEngagementIntent(
  params: ResolvingWildlifeStalkEngagementIntentParams
): DefiningWildlifeBehaviorIntent {
  const { position, preyTargetId, preyPosition, followDistances } = params;
  const deltaX = preyPosition.x - position.x;
  const deltaY = preyPosition.y - position.y;
  const distance = Math.hypot(deltaX, deltaY);

  if (distance <= 0.0001) {
    return {
      mode: 'stalk',
      targetInstanceId: preyTargetId,
      targetPoint: {
        x: position.x - DEFINING_WILDLIFE_STALK_TOO_CLOSE_RETREAT_STEP_GRID,
        y: position.y,
        layer: position.layer,
      },
      facingPoint: preyPosition,
      pace: 'walk',
    };
  }

  const directionX = deltaX / distance;
  const directionY = deltaY / distance;

  if (distance < followDistances.followMinDistanceGrid) {
    return {
      mode: 'stalk',
      targetInstanceId: preyTargetId,
      targetPoint: {
        x:
          position.x -
          directionX * DEFINING_WILDLIFE_STALK_TOO_CLOSE_RETREAT_STEP_GRID,
        y:
          position.y -
          directionY * DEFINING_WILDLIFE_STALK_TOO_CLOSE_RETREAT_STEP_GRID,
        layer: position.layer,
      },
      facingPoint: preyPosition,
      pace: 'walk',
    };
  }

  if (distance > followDistances.followMaxDistanceGrid) {
    const catchUpDistance = distance - followDistances.followDistanceGrid;
    const runCatchUp =
      distance >=
      followDistances.followMaxDistanceGrid +
        DEFINING_WILDLIFE_STALK_CATCH_UP_RUN_EXTRA_DISTANCE_GRID;

    return {
      mode: 'stalk',
      targetInstanceId: preyTargetId,
      targetPoint: {
        x: position.x + directionX * catchUpDistance,
        y: position.y + directionY * catchUpDistance,
        layer: position.layer,
      },
      facingPoint: preyPosition,
      pace: runCatchUp ? 'run' : 'walk',
    };
  }

  const leg = resolvingWildlifeStalkComfortBandShadowWanderLeg(params);

  return {
    mode: 'stalk',
    targetInstanceId: preyTargetId,
    targetPoint: leg.targetPoint,
    facingPoint: leg.facingPoint,
    pace: leg.pace,
  };
}
