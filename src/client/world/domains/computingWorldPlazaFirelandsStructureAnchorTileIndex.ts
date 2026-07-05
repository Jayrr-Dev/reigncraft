import {
  DEFINING_WORLD_PLAZA_FIRELANDS_STRUCTURE_SPACING_ANCHOR_TILE,
  DEFINING_WORLD_PLAZA_FIRELANDS_STRUCTURE_SPACING_CELL_TILES,
} from '@/components/world/domains/definingWorldPlazaFirelandsBiomeConstants';

/**
 * Coarse structure-grid anchor math for Firelands volcanoes and ruins.
 *
 * @module components/world/domains/computingWorldPlazaFirelandsStructureAnchorTileIndex
 */

/**
 * Returns the structure spacing anchor for the cell containing a tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function computingWorldPlazaFirelandsStructureAnchorTileIndex(
  tileX: number,
  tileY: number
): { readonly tileX: number; readonly tileY: number } {
  const cellSize = DEFINING_WORLD_PLAZA_FIRELANDS_STRUCTURE_SPACING_CELL_TILES;
  const anchorOffset =
    DEFINING_WORLD_PLAZA_FIRELANDS_STRUCTURE_SPACING_ANCHOR_TILE;

  return {
    tileX: Math.floor(tileX / cellSize) * cellSize + anchorOffset,
    tileY: Math.floor(tileY / cellSize) * cellSize + anchorOffset,
  };
}

/**
 * Returns true when a tile is the structure spacing anchor for its cell.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaFirelandsStructureSpacingAnchorAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
  const anchorTile = computingWorldPlazaFirelandsStructureAnchorTileIndex(
    tileX,
    tileY
  );

  return anchorTile.tileX === tileX && anchorTile.tileY === tileY;
}
