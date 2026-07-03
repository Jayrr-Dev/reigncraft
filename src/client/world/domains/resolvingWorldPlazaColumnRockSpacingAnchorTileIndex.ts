import {
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_SPACING_ANCHOR_TILE_X,
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_SPACING_ANCHOR_TILE_Y,
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_SPACING_CELL_TILES,
} from "@/components/world/domains/definingWorldPlazaTerrainRockConstants";

/**
 * Spacing-cell anchor tile index for procedural column rock placement.
 *
 * @module components/world/domains/resolvingWorldPlazaColumnRockSpacingAnchorTileIndex
 */

/** Anchor tile indices for one column-rock spacing cell. */
export interface ResolvingWorldPlazaColumnRockSpacingAnchorTileIndex {
  readonly anchorTileX: number;
  readonly anchorTileY: number;
}

/**
 * Returns the spacing anchor tile for the cell containing {@code tileX}/{@code tileY}.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaColumnRockSpacingAnchorTileIndex(
  tileX: number,
  tileY: number,
): ResolvingWorldPlazaColumnRockSpacingAnchorTileIndex {
  const cellSize = DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_SPACING_CELL_TILES;
  const modX = ((tileX % cellSize) + cellSize) % cellSize;
  const modY = ((tileY % cellSize) + cellSize) % cellSize;

  return {
    anchorTileX: tileX - modX + DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_SPACING_ANCHOR_TILE_X,
    anchorTileY: tileY - modY + DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_SPACING_ANCHOR_TILE_Y,
  };
}
