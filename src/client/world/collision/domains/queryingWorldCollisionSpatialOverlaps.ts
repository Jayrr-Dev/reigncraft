import { DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID } from '@/components/world/domains/definingWorldPlazaPlayerCollisionConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from '@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint';
import {
  checkingWorldCollisionCircleOverlapsAxisAlignedGridSquare,
} from '@/components/world/collision/domains/computingWorldCollisionShapeGeometry';
import type { DefiningWorldCollisionContext } from '@/components/world/collision/domains/definingWorldCollisionContext';
import type { DefiningWorldCollisionShape } from '@/components/world/collision/domains/definingWorldCollisionShape';
import { findingWorldCollisionBlockerAtPoint } from '@/components/world/collision/domains/findingWorldCollisionBlockerAtPoint';
import { DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HALF_EXTENT_GRID } from '@/components/world/domains/definingWorldPlazaIsometricTileLayoutConstants';

/**
 * Generic spatial overlap queries for movement and future combat hitboxes.
 *
 * @module components/world/collision/domains/queryingWorldCollisionSpatialOverlaps
 */

/** Tile rings scanned around a footprint center. */
const QUERYING_WORLD_COLLISION_FOOTPRINT_TILE_SCAN_RING = 1;

/**
 * Returns true when a shape overlaps a tile square at integer coordinates.
 */
function checkingWorldCollisionShapeOverlapsTileSquare(
  shape: DefiningWorldCollisionShape,
  tileX: number,
  tileY: number,
  playerRadiusGrid: number
): boolean {
  if (shape.kind === 'circle') {
    return checkingWorldCollisionCircleOverlapsAxisAlignedGridSquare(
      { x: shape.centerGridX, y: shape.centerGridY },
      shape.radiusGrid,
      tileX,
      tileY,
      DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HALF_EXTENT_GRID
    );
  }

  if (shape.kind === 'tileSquare') {
    return checkingWorldCollisionCircleOverlapsAxisAlignedGridSquare(
      { x: shape.centerGridX, y: shape.centerGridY },
      playerRadiusGrid,
      tileX,
      tileY,
      shape.halfExtentGrid
    );
  }

  if (shape.kind === 'cutSubSquares') {
    return shape.squares.some((square) =>
      checkingWorldCollisionShapeOverlapsTileSquare(
        square,
        tileX,
        tileY,
        playerRadiusGrid
      )
    );
  }

  return false;
}

/**
 * Returns true when a grid point is blocked for movement using the unified resolver.
 */
export function checkingWorldCollisionBlockedAtPoint(
  gridPoint: DefiningWorldPlazaWorldPoint,
  context: DefiningWorldCollisionContext & {
    readonly applyBlockCollision: boolean;
  }
): boolean {
  return (
    findingWorldCollisionBlockerAtPoint(gridPoint, {
      applyBlockCollision: context.applyBlockCollision,
      isJumping: context.isJumping ?? false,
      placedBlocks: context.placedBlocks
        ? [...context.placedBlocks]
        : undefined,
      playerLayer:
        context.playerLayer ?? resolvingWorldPlazaPlayerWorldLayer(gridPoint),
      playerRadiusGrid:
        context.playerRadiusGrid ?? DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID,
      terrainColumnCollisionContext: context.terrainColumnCollisionContext,
    }) !== null
  );
}

/**
 * Lists tile indices whose squares overlap a query shape (footprint sampling).
 */
export function listingWorldCollisionTileIndicesOverlappingShape(
  shape: DefiningWorldCollisionShape,
  playerRadiusGrid: number = DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID
): Array<{ readonly tileX: number; readonly tileY: number }> {
  const centerX =
    shape.kind === 'circle' ||
    shape.kind === 'tileSquare' ||
    shape.kind === 'baseDiamond'
      ? shape.centerGridX
      : shape.squares[0]?.centerGridX ?? 0;
  const centerY =
    shape.kind === 'circle' ||
    shape.kind === 'tileSquare' ||
    shape.kind === 'baseDiamond'
      ? shape.centerGridY
      : shape.squares[0]?.centerGridY ?? 0;
  const centerTile = resolvingWorldPlazaIsometricTileIndexAtGridPoint({
    x: centerX,
    y: centerY,
  });
  const overlappingTiles: Array<{ readonly tileX: number; readonly tileY: number }> =
    [];

  for (
    let offsetTileY = -QUERYING_WORLD_COLLISION_FOOTPRINT_TILE_SCAN_RING;
    offsetTileY <= QUERYING_WORLD_COLLISION_FOOTPRINT_TILE_SCAN_RING;
    offsetTileY += 1
  ) {
    for (
      let offsetTileX = -QUERYING_WORLD_COLLISION_FOOTPRINT_TILE_SCAN_RING;
      offsetTileX <= QUERYING_WORLD_COLLISION_FOOTPRINT_TILE_SCAN_RING;
      offsetTileX += 1
    ) {
      const tileX = centerTile.tileX + offsetTileX;
      const tileY = centerTile.tileY + offsetTileY;

      if (
        checkingWorldCollisionShapeOverlapsTileSquare(
          shape,
          tileX,
          tileY,
          playerRadiusGrid
        )
      ) {
        overlappingTiles.push({ tileX, tileY });
      }
    }
  }

  return overlappingTiles;
}

/**
 * Builds a circular query shape from a world point and radius.
 */
export function creatingWorldCollisionCircleQueryShape(
  center: DefiningWorldPlazaWorldPoint,
  radiusGrid: number
): DefiningWorldCollisionShape {
  return {
    kind: 'circle',
    centerGridX: center.x,
    centerGridY: center.y,
    radiusGrid,
  };
}
