/**
 * Comfort-band stalk destination via the same bounded random walk as calm wander.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeStalkShadowWanderTargetPoint
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WILDLIFE_STALK_SHADOW_WANDER_SALT,
  DEFINING_WILDLIFE_STALK_SHADOW_WANDER_STEP_COUNT,
} from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';
import { computingBoundedRandomWalk2dPathFromSeed } from '@/lib/probability/computingBoundedRandomWalk';
import { definingRandomWalkCircleAreaFromCenter } from '@/lib/probability/definingRandomWalkArea';

export type ResolvingWildlifeStalkShadowWanderTargetPointParams = {
  readonly instanceId: string;
  readonly position: DefiningWorldPlazaWorldPoint;
  readonly preyPosition: DefiningWorldPlazaWorldPoint;
  readonly followMinDistanceGrid: number;
  readonly followMaxDistanceGrid: number;
  readonly timeBucket: number;
};

function hashingWildlifeStalkShadowWanderInstanceSalt(
  instanceId: string
): number {
  let hash = 0;

  for (let index = 0; index < instanceId.length; index += 1) {
    hash = (hash * 31 + instanceId.charCodeAt(index)) | 0;
  }

  return Math.abs(hash);
}

/**
 * Outer roam disc radius so the walk can reach the far edge of the follow band.
 */
function resolvingWildlifeStalkShadowWanderOuterRadiusGrid(
  followMaxDistanceGrid: number
): number {
  return followMaxDistanceGrid;
}

/**
 * If a walk endpoint lands inside the too-close ring, push it out to the min band.
 */
function clampingWildlifeStalkShadowWanderAwayFromPrey(
  destination: DefiningWorldPlazaWorldPoint,
  preyPosition: DefiningWorldPlazaWorldPoint,
  followMinDistanceGrid: number
): DefiningWorldPlazaWorldPoint {
  const deltaX = destination.x - preyPosition.x;
  const deltaY = destination.y - preyPosition.y;
  const distance = Math.hypot(deltaX, deltaY);

  if (distance >= followMinDistanceGrid) {
    return destination;
  }

  if (distance <= 0.0001) {
    return {
      x: preyPosition.x - followMinDistanceGrid,
      y: preyPosition.y,
      layer: destination.layer,
    };
  }

  const scale = followMinDistanceGrid / distance;

  return {
    x: preyPosition.x + deltaX * scale,
    y: preyPosition.y + deltaY * scale,
    layer: destination.layer,
  };
}

/**
 * Returns a seeded random-walk destination inside the stalk follow ring around prey.
 */
export function resolvingWildlifeStalkShadowWanderTargetPoint({
  instanceId,
  position,
  preyPosition,
  followMinDistanceGrid,
  followMaxDistanceGrid,
  timeBucket,
}: ResolvingWildlifeStalkShadowWanderTargetPointParams): DefiningWorldPlazaWorldPoint {
  const area = definingRandomWalkCircleAreaFromCenter(
    preyPosition,
    resolvingWildlifeStalkShadowWanderOuterRadiusGrid(followMaxDistanceGrid)
  );
  const path = computingBoundedRandomWalk2dPathFromSeed({
    seed:
      DEFINING_WILDLIFE_STALK_SHADOW_WANDER_SALT +
      timeBucket * 17 +
      hashingWildlifeStalkShadowWanderInstanceSalt(instanceId),
    start: position,
    stepCount: DEFINING_WILDLIFE_STALK_SHADOW_WANDER_STEP_COUNT,
    area,
    boundaryMode: 'rejectStep',
  });
  const destination = path[path.length - 1] ?? position;

  return clampingWildlifeStalkShadowWanderAwayFromPrey(
    {
      x: destination.x,
      y: destination.y,
      layer: position.layer,
    },
    preyPosition,
    followMinDistanceGrid
  );
}
