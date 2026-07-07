/**
 * Trailing follow point for stalker temperament shadowing.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeStalkFollowTargetPoint
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WILDLIFE_STALK_FOLLOW_DISTANCE_GRID,
  DEFINING_WILDLIFE_STALK_FOLLOW_MAX_DISTANCE_GRID,
  DEFINING_WILDLIFE_STALK_FOLLOW_MIN_DISTANCE_GRID,
  DEFINING_WILDLIFE_STALK_TOO_CLOSE_RETREAT_STEP_GRID,
} from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';

export type ResolvingWildlifeStalkFollowTargetPointParams = {
  position: DefiningWorldPlazaWorldPoint;
  playerPosition: DefiningWorldPlazaWorldPoint;
  followDistanceGrid?: number;
  followMinDistanceGrid?: number;
  followMaxDistanceGrid?: number;
};

/**
 * Picks a shadowing waypoint: trail at distance, close the gap when too far,
 * or back off when the player closes inside the comfort band.
 */
export function resolvingWildlifeStalkFollowTargetPoint({
  position,
  playerPosition,
  followDistanceGrid = DEFINING_WILDLIFE_STALK_FOLLOW_DISTANCE_GRID,
  followMinDistanceGrid = DEFINING_WILDLIFE_STALK_FOLLOW_MIN_DISTANCE_GRID,
  followMaxDistanceGrid = DEFINING_WILDLIFE_STALK_FOLLOW_MAX_DISTANCE_GRID,
}: ResolvingWildlifeStalkFollowTargetPointParams): DefiningWorldPlazaWorldPoint {
  const deltaX = playerPosition.x - position.x;
  const deltaY = playerPosition.y - position.y;
  const distance = Math.hypot(deltaX, deltaY);

  if (distance <= 0.0001) {
    return {
      x: position.x - followDistanceGrid,
      y: position.y,
      layer: position.layer,
    };
  }

  const directionX = deltaX / distance;
  const directionY = deltaY / distance;

  if (distance < followMinDistanceGrid) {
    return {
      x:
        position.x -
        directionX * DEFINING_WILDLIFE_STALK_TOO_CLOSE_RETREAT_STEP_GRID,
      y:
        position.y -
        directionY * DEFINING_WILDLIFE_STALK_TOO_CLOSE_RETREAT_STEP_GRID,
      layer: position.layer,
    };
  }

  if (distance > followMaxDistanceGrid) {
    const catchUpDistance = distance - followDistanceGrid;

    return {
      x: position.x + directionX * catchUpDistance,
      y: position.y + directionY * catchUpDistance,
      layer: position.layer,
    };
  }

  return {
    x: position.x + directionX * 0.15,
    y: position.y + directionY * 0.15,
    layer: position.layer,
  };
}
