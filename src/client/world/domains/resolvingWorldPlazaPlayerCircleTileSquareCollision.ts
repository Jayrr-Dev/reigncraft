import { DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HALF_EXTENT_GRID } from '@/components/world/domains/definingWorldPlazaIsometricTileLayoutConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  checkingWorldCollisionCircleOverlapsAxisAlignedGridSquare,
  pushingWorldCollisionCircleOutsideAxisAlignedGridSquare,
} from '@/components/world/collision/domains/computingWorldCollisionShapeGeometry';

/**
 * Circle-vs-tile-square collision for the player footprint in grid space.
 *
 * @module components/world/domains/resolvingWorldPlazaPlayerCircleTileSquareCollision
 */

export {
  checkingWorldCollisionCircleOverlapsAxisAlignedGridSquare as checkingWorldPlazaPlayerCircleOverlapsAxisAlignedGridSquare,
  pushingWorldCollisionCircleOutsideAxisAlignedGridSquare as pushingWorldPlazaPlayerCircleOutsideAxisAlignedGridSquare,
} from '@/components/world/collision/domains/computingWorldCollisionShapeGeometry';

/**
 * Returns true when the player footprint circle overlaps a tile square.
 */
export function checkingWorldPlazaPlayerCircleOverlapsTileSquare(
  center: DefiningWorldPlazaWorldPoint,
  radiusGrid: number,
  tileX: number,
  tileY: number
): boolean {
  return checkingWorldCollisionCircleOverlapsAxisAlignedGridSquare(
    center,
    radiusGrid,
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HALF_EXTENT_GRID
  );
}

/**
 * Pushes the player footprint circle to rest just outside a tile square.
 */
export function pushingWorldPlazaPlayerCircleOutsideTileSquare(
  center: DefiningWorldPlazaWorldPoint,
  radiusGrid: number,
  tileX: number,
  tileY: number,
  edgeExitEpsilon: number
): DefiningWorldPlazaWorldPoint {
  return pushingWorldCollisionCircleOutsideAxisAlignedGridSquare(
    center,
    radiusGrid,
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HALF_EXTENT_GRID,
    edgeExitEpsilon
  );
}
