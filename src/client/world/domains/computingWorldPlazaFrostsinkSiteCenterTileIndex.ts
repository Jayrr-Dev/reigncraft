import {
  DEFINING_WORLD_PLAZA_FROSTSINK_SITE_SPACING_ANCHOR_TILE,
  DEFINING_WORLD_PLAZA_FROSTSINK_SITE_SPACING_CELL_TILES,
} from '@/components/world/domains/definingWorldPlazaFrostsinkBiomeConstants';

/**
 * Coarse site-grid center math for Frostsink Cryocore discs.
 *
 * @module components/world/domains/computingWorldPlazaFrostsinkSiteCenterTileIndex
 */

/**
 * Returns the Frostsink site center for the spacing cell containing a tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function computingWorldPlazaFrostsinkSiteCenterTileIndex(
  tileX: number,
  tileY: number
): { readonly tileX: number; readonly tileY: number } {
  const cellSize = DEFINING_WORLD_PLAZA_FROSTSINK_SITE_SPACING_CELL_TILES;
  const anchorOffset = DEFINING_WORLD_PLAZA_FROSTSINK_SITE_SPACING_ANCHOR_TILE;

  return {
    tileX: Math.floor(tileX / cellSize) * cellSize + anchorOffset,
    tileY: Math.floor(tileY / cellSize) * cellSize + anchorOffset,
  };
}

/**
 * Returns true when a tile is the Frostsink site center for its spacing cell.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaFrostsinkSiteCenterAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
  const center = computingWorldPlazaFrostsinkSiteCenterTileIndex(tileX, tileY);

  return center.tileX === tileX && center.tileY === tileY;
}
