/**
 * Stalker shadowing intents: follow bands, patrol maneuvers, and pack cohesion.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeStalkEngagementIntent
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  mappingWorldPlazaGrassSeededUnitToFloatRange,
  seedingWorldPlazaGrassTileDecorationFromTileIndex,
} from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';
import { checkingWildlifeStalkerCaughtUpToStillPrey } from '@/components/world/wildlife/domains/checkingWildlifeStalkerCaughtUpToStillPrey';
import {
  DEFINING_WILDLIFE_STALK_CATCH_UP_RUN_EXTRA_DISTANCE_GRID,
  DEFINING_WILDLIFE_STALK_MANEUVER_BUCKET_MS,
  DEFINING_WILDLIFE_STALK_MANEUVER_CIRCLE_SWEEP_RAD,
  DEFINING_WILDLIFE_STALK_MANEUVER_HOLD_DRIFT_GRID,
  DEFINING_WILDLIFE_STALK_MANEUVER_WIDEN_STEP_GRID,
  DEFINING_WILDLIFE_STALK_TOO_CLOSE_RETREAT_STEP_GRID,
} from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';
import type { DefiningWildlifeBehaviorIntent } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import type { ResolvingWildlifeStalkPackFollowDistances } from '@/components/world/wildlife/domains/resolvingWildlifeStalkPackFollowDistances';
import type { ResolvingWildlifeStalkSpawnPackFormation } from '@/components/world/wildlife/domains/resolvingWildlifeStalkSpawnPackFormation';

const DEFINING_WILDLIFE_STALK_MANEUVER_SALT = 241;

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

function resolvingWildlifeStalkManeuverSeed(
  position: DefiningWorldPlazaWorldPoint,
  timeBucket: number,
  salt: number
): number {
  return seedingWorldPlazaGrassTileDecorationFromTileIndex(
    Math.floor(position.x),
    Math.floor(position.y),
    DEFINING_WILDLIFE_STALK_MANEUVER_SALT + salt + timeBucket * 5
  );
}

function resolvingWildlifeStalkCirclePatrolLeg({
  position,
  preyPosition,
  followDistanceGrid,
  sweepDirection,
}: {
  position: DefiningWorldPlazaWorldPoint;
  preyPosition: DefiningWorldPlazaWorldPoint;
  followDistanceGrid: number;
  sweepDirection: 1 | -1;
}): ResolvingWildlifeStalkManeuverLeg {
  const deltaX = position.x - preyPosition.x;
  const deltaY = position.y - preyPosition.y;
  const distance = Math.hypot(deltaX, deltaY);
  const bearing = distance <= 0.0001 ? 0 : Math.atan2(deltaY, deltaX);
  const nextBearing =
    bearing +
    sweepDirection * DEFINING_WILDLIFE_STALK_MANEUVER_CIRCLE_SWEEP_RAD;

  return {
    targetPoint: {
      x: preyPosition.x + Math.cos(nextBearing) * followDistanceGrid,
      y: preyPosition.y + Math.sin(nextBearing) * followDistanceGrid,
      layer: position.layer,
    },
    facingPoint: preyPosition,
    pace: 'walk',
  };
}

function resolvingWildlifeStalkWidenDistanceLeg({
  position,
  preyPosition,
  stepGrid,
}: {
  position: DefiningWorldPlazaWorldPoint;
  preyPosition: DefiningWorldPlazaWorldPoint;
  stepGrid: number;
}): ResolvingWildlifeStalkManeuverLeg {
  const deltaX = preyPosition.x - position.x;
  const deltaY = preyPosition.y - position.y;
  const distance = Math.hypot(deltaX, deltaY);
  const directionX = distance <= 0.0001 ? -1 : -deltaX / distance;
  const directionY = distance <= 0.0001 ? 0 : -deltaY / distance;

  return {
    targetPoint: {
      x: position.x + directionX * stepGrid,
      y: position.y + directionY * stepGrid,
      layer: position.layer,
    },
    facingPoint: preyPosition,
    pace: 'run',
  };
}

function resolvingWildlifeStalkHoldWatchLeg({
  position,
  preyPosition,
  driftRoll,
}: {
  position: DefiningWorldPlazaWorldPoint;
  preyPosition: DefiningWorldPlazaWorldPoint;
  driftRoll: number;
}): ResolvingWildlifeStalkManeuverLeg {
  const driftAngle = mappingWorldPlazaGrassSeededUnitToFloatRange(
    driftRoll,
    0,
    Math.PI * 2
  );

  return {
    targetPoint: {
      x:
        position.x +
        Math.cos(driftAngle) * DEFINING_WILDLIFE_STALK_MANEUVER_HOLD_DRIFT_GRID,
      y:
        position.y +
        Math.sin(driftAngle) * DEFINING_WILDLIFE_STALK_MANEUVER_HOLD_DRIFT_GRID,
      layer: position.layer,
    },
    facingPoint: preyPosition,
    pace: 'walk',
  };
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
    return resolvingWildlifeStalkCirclePatrolLeg({
      position,
      preyPosition,
      followDistanceGrid: followDistances.followDistanceGrid,
      sweepDirection: 1,
    });
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

function resolvingWildlifeStalkComfortBandManeuverLeg(
  params: ResolvingWildlifeStalkEngagementIntentParams
): ResolvingWildlifeStalkManeuverLeg {
  const timeBucket = Math.floor(
    params.nowMs / DEFINING_WILDLIFE_STALK_MANEUVER_BUCKET_MS
  );
  const maneuverRoll = resolvingWildlifeStalkManeuverSeed(
    params.position,
    timeBucket,
    0
  );
  const directionRoll = resolvingWildlifeStalkManeuverSeed(
    params.position,
    timeBucket,
    1
  );
  const driftRoll = resolvingWildlifeStalkManeuverSeed(
    params.position,
    timeBucket,
    2
  );
  const caughtUpToStillPrey = checkingWildlifeStalkerCaughtUpToStillPrey({
    position: params.position,
    preyPosition: params.preyPosition,
    preyStillDurationMs: params.preyStillDurationMs,
  });
  const mayJoinAlpha =
    !params.formation.isAlpha && params.alphaPosition !== null;

  if (caughtUpToStillPrey) {
    if (maneuverRoll < 0.45) {
      return resolvingWildlifeStalkCirclePatrolLeg({
        position: params.position,
        preyPosition: params.preyPosition,
        followDistanceGrid: params.followDistances.followDistanceGrid,
        sweepDirection: directionRoll < 0.5 ? 1 : -1,
      });
    }

    if (maneuverRoll < 0.75) {
      return resolvingWildlifeStalkWidenDistanceLeg({
        position: params.position,
        preyPosition: params.preyPosition,
        stepGrid: DEFINING_WILDLIFE_STALK_MANEUVER_WIDEN_STEP_GRID,
      });
    }

    if (mayJoinAlpha && maneuverRoll < 0.9 && params.alphaPosition !== null) {
      return resolvingWildlifeStalkJoinAlphaLeg({
        position: params.position,
        alphaPosition: params.alphaPosition,
        preyPosition: params.preyPosition,
        followDistances: params.followDistances,
      });
    }

    return resolvingWildlifeStalkHoldWatchLeg({
      position: params.position,
      preyPosition: params.preyPosition,
      driftRoll,
    });
  }

  if (maneuverRoll < 0.32) {
    return resolvingWildlifeStalkCirclePatrolLeg({
      position: params.position,
      preyPosition: params.preyPosition,
      followDistanceGrid: params.followDistances.followDistanceGrid,
      sweepDirection: directionRoll < 0.5 ? 1 : -1,
    });
  }

  if (maneuverRoll < 0.44) {
    const deltaX = params.preyPosition.x - params.position.x;
    const deltaY = params.preyPosition.y - params.position.y;
    const distance = Math.hypot(deltaX, deltaY);
    const directionX = distance <= 0.0001 ? 1 : deltaX / distance;
    const directionY = distance <= 0.0001 ? 0 : deltaY / distance;

    return {
      targetPoint: {
        x: params.position.x + directionX * 0.15,
        y: params.position.y + directionY * 0.15,
        layer: params.position.layer,
      },
      facingPoint: params.preyPosition,
      pace: 'walk',
    };
  }

  if (maneuverRoll < 0.64) {
    return resolvingWildlifeStalkWidenDistanceLeg({
      position: params.position,
      preyPosition: params.preyPosition,
      stepGrid: DEFINING_WILDLIFE_STALK_MANEUVER_WIDEN_STEP_GRID,
    });
  }

  if (maneuverRoll < 0.74) {
    return resolvingWildlifeStalkHoldWatchLeg({
      position: params.position,
      preyPosition: params.preyPosition,
      driftRoll,
    });
  }

  if (mayJoinAlpha && params.alphaPosition !== null) {
    return resolvingWildlifeStalkJoinAlphaLeg({
      position: params.position,
      alphaPosition: params.alphaPosition,
      preyPosition: params.preyPosition,
      followDistances: params.followDistances,
    });
  }

  return resolvingWildlifeStalkCirclePatrolLeg({
    position: params.position,
    preyPosition: params.preyPosition,
    followDistanceGrid: params.followDistances.followDistanceGrid,
    sweepDirection: directionRoll < 0.5 ? 1 : -1,
  });
}

/**
 * Picks a stalk intent with patrol variety: circle prey, run back, widen
 * distance, drift in place while watching, or close on the pack alpha.
 */
export function resolvingWildlifeStalkEngagementIntent(
  params: ResolvingWildlifeStalkEngagementIntentParams
): DefiningWildlifeBehaviorIntent {
  const { position, preyTargetId, preyPosition, followDistances } = params;
  const deltaX = preyPosition.x - position.x;
  const deltaY = preyPosition.y - position.y;
  const distance = Math.hypot(deltaX, deltaY);

  if (distance <= 0.0001) {
    const leg = resolvingWildlifeStalkWidenDistanceLeg({
      position,
      preyPosition,
      stepGrid: DEFINING_WILDLIFE_STALK_MANEUVER_WIDEN_STEP_GRID,
    });

    return {
      mode: 'stalk',
      targetInstanceId: preyTargetId,
      targetPoint: leg.targetPoint,
      facingPoint: leg.facingPoint,
      pace: leg.pace,
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
      pace: 'run',
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

  const leg = resolvingWildlifeStalkComfortBandManeuverLeg(params);

  return {
    mode: 'stalk',
    targetInstanceId: preyTargetId,
    targetPoint: leg.targetPoint,
    facingPoint: leg.facingPoint,
    pace: leg.pace,
  };
}
