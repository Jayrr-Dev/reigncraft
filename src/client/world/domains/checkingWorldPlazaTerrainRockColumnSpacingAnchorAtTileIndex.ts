import {
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_SPACING_ANCHOR_TILE_X,
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_SPACING_ANCHOR_TILE_Y,
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_SPACING_CELL_TILES,
} from "@/components/world/domains/definingWorldPlazaTerrainRockConstants";

/**
 * Spacing anchor check for procedural column rock placement.
 *
 * @module components/world/domains/checkingWorldPlazaTerrainRockColumnSpacingAnchorAtTileIndex
 */

/**
 * Returns true when this tile is the spacing anchor for its cell.
 *
 * Only anchor tiles may spawn extruded column rocks so boulders stay one per
 * 6x6 spacing cell with room for up to a 6x6 footprint.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaTerrainRockColumnSpacingAnchorAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  const cellSize = DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_SPACING_CELL_TILES;
  const modX = ((tileX % cellSize) + cellSize) % cellSize;
  const modY = ((tileY % cellSize) + cellSize) % cellSize;

  return (
    modX === DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_SPACING_ANCHOR_TILE_X &&
    modY === DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_SPACING_ANCHOR_TILE_Y
  );
}
