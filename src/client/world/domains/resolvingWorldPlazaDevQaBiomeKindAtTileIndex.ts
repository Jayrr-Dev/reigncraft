/**
 * Resolves biome kind from the compact QA showcase grid.
 *
 * @module components/world/domains/resolvingWorldPlazaDevQaBiomeKindAtTileIndex
 */

import {
  DEFINING_WORLD_PLAZA_DEV_QA_BIOME_CELL_TILE_SIZE,
  DEFINING_WORLD_PLAZA_DEV_QA_BIOME_GRID_COLUMNS,
  DEFINING_WORLD_PLAZA_DEV_QA_BIOME_GRID_HEIGHT_TILES,
  DEFINING_WORLD_PLAZA_DEV_QA_BIOME_GRID_KINDS,
  DEFINING_WORLD_PLAZA_DEV_QA_BIOME_GRID_ORIGIN_TILE_X,
  DEFINING_WORLD_PLAZA_DEV_QA_BIOME_GRID_ORIGIN_TILE_Y,
  DEFINING_WORLD_PLAZA_DEV_QA_BIOME_GRID_WIDTH_TILES,
  DEFINING_WORLD_PLAZA_DEV_QA_OUTSIDE_BIOME_KIND,
} from '@/components/world/domains/definingWorldPlazaDevQaLoadConstants';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';

/**
 * Picks the QA showcase biome for one tile, or plains outside the grid.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaDevQaBiomeKindAtTileIndex(
  tileX: number,
  tileY: number
): DefiningWorldPlazaBiomeKind {
  const localX = tileX - DEFINING_WORLD_PLAZA_DEV_QA_BIOME_GRID_ORIGIN_TILE_X;
  const localY = tileY - DEFINING_WORLD_PLAZA_DEV_QA_BIOME_GRID_ORIGIN_TILE_Y;

  if (
    localX < 0 ||
    localY < 0 ||
    localX >= DEFINING_WORLD_PLAZA_DEV_QA_BIOME_GRID_WIDTH_TILES ||
    localY >= DEFINING_WORLD_PLAZA_DEV_QA_BIOME_GRID_HEIGHT_TILES
  ) {
    return DEFINING_WORLD_PLAZA_DEV_QA_OUTSIDE_BIOME_KIND;
  }

  const cellColumn = Math.floor(
    localX / DEFINING_WORLD_PLAZA_DEV_QA_BIOME_CELL_TILE_SIZE
  );
  const cellRow = Math.floor(
    localY / DEFINING_WORLD_PLAZA_DEV_QA_BIOME_CELL_TILE_SIZE
  );
  const cellIndex =
    cellRow * DEFINING_WORLD_PLAZA_DEV_QA_BIOME_GRID_COLUMNS + cellColumn;

  return (
    DEFINING_WORLD_PLAZA_DEV_QA_BIOME_GRID_KINDS[cellIndex] ??
    DEFINING_WORLD_PLAZA_DEV_QA_OUTSIDE_BIOME_KIND
  );
}
