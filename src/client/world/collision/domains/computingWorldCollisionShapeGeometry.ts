import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  resolvingWorldPlazaPointPushedOutsideColumnRockBaseDiamond,
  type DefiningWorldPlazaColumnRockBaseDiamond,
} from '@/components/world/domains/resolvingWorldPlazaColumnRockBaseDiamondFromMetadata';

/**
 * Pure grid-space collision geometry: overlap, closest point, push-out.
 *
 * @module components/world/collision/domains/computingWorldCollisionShapeGeometry
 */

/** Distance below which push direction is treated as degenerate. */
export const COMPUTING_WORLD_COLLISION_MIN_PUSH_DISTANCE = 1e-4;

/**
 * Returns the closest point on an axis-aligned grid square to a position.
 */
export function computingWorldCollisionClosestPointOnAxisAlignedGridSquare(
  point: DefiningWorldPlazaWorldPoint,
  squareCenterGridX: number,
  squareCenterGridY: number,
  squareHalfExtentGrid: number
): DefiningWorldPlazaWorldPoint {
  return {
    x: Math.max(
      squareCenterGridX - squareHalfExtentGrid,
      Math.min(point.x, squareCenterGridX + squareHalfExtentGrid)
    ),
    y: Math.max(
      squareCenterGridY - squareHalfExtentGrid,
      Math.min(point.y, squareCenterGridY + squareHalfExtentGrid)
    ),
  };
}

/**
 * Returns true when a circle overlaps an axis-aligned square.
 */
export function checkingWorldCollisionCircleOverlapsAxisAlignedGridSquare(
  center: DefiningWorldPlazaWorldPoint,
  radiusGrid: number,
  squareCenterGridX: number,
  squareCenterGridY: number,
  squareHalfExtentGrid: number
): boolean {
  if (radiusGrid <= 0) {
    return (
      Math.max(
        Math.abs(center.x - squareCenterGridX),
        Math.abs(center.y - squareCenterGridY)
      ) <= squareHalfExtentGrid
    );
  }

  const closest = computingWorldCollisionClosestPointOnAxisAlignedGridSquare(
    center,
    squareCenterGridX,
    squareCenterGridY,
    squareHalfExtentGrid
  );
  const deltaX = center.x - closest.x;
  const deltaY = center.y - closest.y;

  return deltaX * deltaX + deltaY * deltaY < radiusGrid * radiusGrid;
}

/**
 * Pushes a circle to rest just outside an axis-aligned square.
 */
export function pushingWorldCollisionCircleOutsideAxisAlignedGridSquare(
  center: DefiningWorldPlazaWorldPoint,
  radiusGrid: number,
  squareCenterGridX: number,
  squareCenterGridY: number,
  squareHalfExtentGrid: number,
  edgeExitEpsilon: number
): DefiningWorldPlazaWorldPoint {
  const restDistance = radiusGrid + edgeExitEpsilon;
  const closest = computingWorldCollisionClosestPointOnAxisAlignedGridSquare(
    center,
    squareCenterGridX,
    squareCenterGridY,
    squareHalfExtentGrid
  );
  const deltaX = center.x - closest.x;
  const deltaY = center.y - closest.y;
  const distance = Math.hypot(deltaX, deltaY);

  if (distance >= radiusGrid) {
    return { x: center.x, y: center.y };
  }

  if (distance > COMPUTING_WORLD_COLLISION_MIN_PUSH_DISTANCE) {
    const pushScale = restDistance / distance;

    return {
      x: closest.x + deltaX * pushScale,
      y: closest.y + deltaY * pushScale,
    };
  }

  const distanceToWest = center.x - (squareCenterGridX - squareHalfExtentGrid);
  const distanceToEast =
    squareCenterGridX + squareHalfExtentGrid - center.x;
  const distanceToNorth = center.y - (squareCenterGridY - squareHalfExtentGrid);
  const distanceToSouth =
    squareCenterGridY + squareHalfExtentGrid - center.y;
  const shallowest = Math.min(
    distanceToWest,
    distanceToEast,
    distanceToNorth,
    distanceToSouth
  );

  if (shallowest === distanceToWest) {
    return {
      x: squareCenterGridX - squareHalfExtentGrid - restDistance,
      y: center.y,
    };
  }

  if (shallowest === distanceToEast) {
    return {
      x: squareCenterGridX + squareHalfExtentGrid + restDistance,
      y: center.y,
    };
  }

  if (shallowest === distanceToNorth) {
    return {
      x: center.x,
      y: squareCenterGridY - squareHalfExtentGrid - restDistance,
    };
  }

  return {
    x: center.x,
    y: squareCenterGridY + squareHalfExtentGrid + restDistance,
  };
}

/**
 * Returns true when a circle overlaps another circle (Minkowski contact).
 */
export function checkingWorldCollisionCircleOverlapsCircle(
  center: DefiningWorldPlazaWorldPoint,
  radiusGrid: number,
  colliderCenterX: number,
  colliderCenterY: number,
  colliderRadiusGrid: number
): boolean {
  const contactRadius = colliderRadiusGrid + radiusGrid;

  return (
    Math.hypot(center.x - colliderCenterX, center.y - colliderCenterY) <
    contactRadius
  );
}

/**
 * Pushes a point outside a circular collider (Minkowski sum with player radius).
 */
export function pushingWorldCollisionPointOutsideCircularCollider(
  resolvedX: number,
  resolvedY: number,
  centerX: number,
  centerY: number,
  collisionRadiusGrid: number,
  playerRadiusGrid: number
): DefiningWorldPlazaWorldPoint {
  const contactRadius = collisionRadiusGrid + playerRadiusGrid;
  const deltaX = resolvedX - centerX;
  const deltaY = resolvedY - centerY;
  const distance = Math.hypot(deltaX, deltaY);

  if (distance >= contactRadius) {
    return { x: resolvedX, y: resolvedY };
  }

  if (distance < COMPUTING_WORLD_COLLISION_MIN_PUSH_DISTANCE) {
    return {
      x: centerX + contactRadius,
      y: centerY,
    };
  }

  const pushScale = contactRadius / distance;

  return {
    x: centerX + deltaX * pushScale,
    y: centerY + deltaY * pushScale,
  };
}

/**
 * Pushes a point outside a column-rock base diamond.
 */
export function pushingWorldCollisionPointOutsideBaseDiamond(
  baseDiamond: DefiningWorldPlazaColumnRockBaseDiamond,
  resolvedX: number,
  resolvedY: number,
  playerRadiusGrid: number
): DefiningWorldPlazaWorldPoint {
  return resolvingWorldPlazaPointPushedOutsideColumnRockBaseDiamond(
    baseDiamond,
    resolvedX,
    resolvedY,
    playerRadiusGrid
  );
}
