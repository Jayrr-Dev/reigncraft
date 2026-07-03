import { DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HALF_EXTENT_GRID } from "@/components/world/domains/definingWorldPlazaIsometricConstants";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";

/**
 * Circle-vs-tile-square collision for the player footprint in grid space.
 *
 * The isometric diamond test `|dx|/halfW + |dy|/halfH <= 1` reduces, after the
 * grid-to-screen projection, to `max(|gridDx|, |gridDy|) <= 0.5`. So every tile
 * is an axis-aligned unit square in grid space, and the player footprint is a
 * circle. That lets standard circle-vs-AABB math resolve wall collision without
 * any screen-space trigonometry.
 *
 * @module components/world/domains/resolvingWorldPlazaPlayerCircleTileSquareCollision
 */

/** Distance below which the push direction is treated as degenerate. */
const RESOLVING_WORLD_PLAZA_PLAYER_CIRCLE_MIN_PUSH_DISTANCE = 1e-4;

/**
 * Returns the closest point on an axis-aligned grid square to a position.
 *
 * @param point - Position in grid space.
 * @param squareCenterGridX - Square center X in grid space.
 * @param squareCenterGridY - Square center Y in grid space.
 * @param squareHalfExtentGrid - Half side length in grid tiles.
 */
function resolvingWorldPlazaClosestPointOnAxisAlignedGridSquare(
  point: DefiningWorldPlazaWorldPoint,
  squareCenterGridX: number,
  squareCenterGridY: number,
  squareHalfExtentGrid: number,
): DefiningWorldPlazaWorldPoint {
  return {
    x: Math.max(
      squareCenterGridX - squareHalfExtentGrid,
      Math.min(point.x, squareCenterGridX + squareHalfExtentGrid),
    ),
    y: Math.max(
      squareCenterGridY - squareHalfExtentGrid,
      Math.min(point.y, squareCenterGridY + squareHalfExtentGrid),
    ),
  };
}

/**
 * Returns the closest point on a tile's grid square to a position.
 *
 * @param point - Position in grid space.
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function resolvingWorldPlazaClosestPointOnTileSquare(
  point: DefiningWorldPlazaWorldPoint,
  tileX: number,
  tileY: number,
): DefiningWorldPlazaWorldPoint {
  return resolvingWorldPlazaClosestPointOnAxisAlignedGridSquare(
    point,
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HALF_EXTENT_GRID,
  );
}

/**
 * Returns true when the player footprint circle overlaps an axis-aligned square.
 *
 * @param center - Player footprint center in grid space.
 * @param radiusGrid - Player footprint radius in grid tiles.
 * @param squareCenterGridX - Square center X in grid space.
 * @param squareCenterGridY - Square center Y in grid space.
 * @param squareHalfExtentGrid - Half side length in grid tiles.
 */
export function checkingWorldPlazaPlayerCircleOverlapsAxisAlignedGridSquare(
  center: DefiningWorldPlazaWorldPoint,
  radiusGrid: number,
  squareCenterGridX: number,
  squareCenterGridY: number,
  squareHalfExtentGrid: number,
): boolean {
  if (radiusGrid <= 0) {
    return (
      Math.max(
        Math.abs(center.x - squareCenterGridX),
        Math.abs(center.y - squareCenterGridY),
      ) <= squareHalfExtentGrid
    );
  }

  const closest = resolvingWorldPlazaClosestPointOnAxisAlignedGridSquare(
    center,
    squareCenterGridX,
    squareCenterGridY,
    squareHalfExtentGrid,
  );
  const deltaX = center.x - closest.x;
  const deltaY = center.y - closest.y;

  return deltaX * deltaX + deltaY * deltaY < radiusGrid * radiusGrid;
}

/**
 * Returns true when the player footprint circle overlaps a tile square.
 *
 * @param center - Player footprint center in grid space.
 * @param radiusGrid - Player footprint radius in grid tiles.
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaPlayerCircleOverlapsTileSquare(
  center: DefiningWorldPlazaWorldPoint,
  radiusGrid: number,
  tileX: number,
  tileY: number,
): boolean {
  return checkingWorldPlazaPlayerCircleOverlapsAxisAlignedGridSquare(
    center,
    radiusGrid,
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HALF_EXTENT_GRID,
  );
}

/**
 * Pushes the player footprint circle to rest just outside an axis-aligned square.
 *
 * @param center - Player footprint center in grid space.
 * @param radiusGrid - Player footprint radius in grid tiles.
 * @param squareCenterGridX - Square center X in grid space.
 * @param squareCenterGridY - Square center Y in grid space.
 * @param squareHalfExtentGrid - Half side length in grid tiles.
 * @param edgeExitEpsilon - Extra gap kept past the contact distance.
 */
export function pushingWorldPlazaPlayerCircleOutsideAxisAlignedGridSquare(
  center: DefiningWorldPlazaWorldPoint,
  radiusGrid: number,
  squareCenterGridX: number,
  squareCenterGridY: number,
  squareHalfExtentGrid: number,
  edgeExitEpsilon: number,
): DefiningWorldPlazaWorldPoint {
  const restDistance = radiusGrid + edgeExitEpsilon;
  const closest = resolvingWorldPlazaClosestPointOnAxisAlignedGridSquare(
    center,
    squareCenterGridX,
    squareCenterGridY,
    squareHalfExtentGrid,
  );
  const deltaX = center.x - closest.x;
  const deltaY = center.y - closest.y;
  const distance = Math.hypot(deltaX, deltaY);

  if (distance >= radiusGrid) {
    return { x: center.x, y: center.y };
  }

  if (distance > RESOLVING_WORLD_PLAZA_PLAYER_CIRCLE_MIN_PUSH_DISTANCE) {
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
    distanceToSouth,
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
 * Pushes the player footprint circle to rest just outside a tile square.
 *
 * Handles both the outside case (push along the nearest edge or corner normal)
 * and the fully-enclosed case (eject along the shallowest face), so the avatar
 * never tunnels through walls and never sticks inside one.
 *
 * @param center - Player footprint center in grid space.
 * @param radiusGrid - Player footprint radius in grid tiles.
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param edgeExitEpsilon - Extra gap kept past the contact distance.
 */
export function pushingWorldPlazaPlayerCircleOutsideTileSquare(
  center: DefiningWorldPlazaWorldPoint,
  radiusGrid: number,
  tileX: number,
  tileY: number,
  edgeExitEpsilon: number,
): DefiningWorldPlazaWorldPoint {
  return pushingWorldPlazaPlayerCircleOutsideAxisAlignedGridSquare(
    center,
    radiusGrid,
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HALF_EXTENT_GRID,
    edgeExitEpsilon,
  );
}
