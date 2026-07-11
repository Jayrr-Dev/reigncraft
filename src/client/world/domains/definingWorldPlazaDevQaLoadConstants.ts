/**
 * Declarative layout for the single-player "This a dev load" QA world.
 *
 * Compact grid near origin with every biome kind so terrain, wildlife spawn,
 * and biome-gated systems can be tested without long teleports.
 *
 * @module components/world/domains/definingWorldPlazaDevQaLoadConstants
 */

import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';

/** Home-screen label for the QA load option. */
export const LABELING_WORLD_PLAZA_DEV_QA_LOAD_BUTTON = 'This a dev load';

/** Short subtitle under the QA load button. */
export const LABELING_WORLD_PLAZA_DEV_QA_LOAD_SUBTITLE =
  'All biomes nearby. Animals frozen. No aggro. Dev spawner on.';

/** Local persistence owner id for the ephemeral QA session. */
export const DEFINING_WORLD_PLAZA_DEV_QA_LOAD_OWNER_ID = 'single-player:dev-qa';

/** Edge length of one biome cell in world tiles. */
export const DEFINING_WORLD_PLAZA_DEV_QA_BIOME_CELL_TILE_SIZE = 24;

/** Biome cells per row in the showcase grid. */
export const DEFINING_WORLD_PLAZA_DEV_QA_BIOME_GRID_COLUMNS = 4;

/**
 * Ordered biome kinds for the QA grid (row-major).
 *
 * Length may be shorter than columns×rows; leftover cells use plains.
 */
export const DEFINING_WORLD_PLAZA_DEV_QA_BIOME_GRID_KINDS = [
  'plains',
  'forest',
  'flower_forest',
  'jungle',
  'desert',
  'snowy_plains',
  'swamp',
  'savanna',
  'badlands',
  'beach',
  'ocean',
  'rocky',
  'firelands',
] as const satisfies readonly DefiningWorldPlazaBiomeKind[];

/** Biome used outside the showcase grid and for unused cells. */
export const DEFINING_WORLD_PLAZA_DEV_QA_OUTSIDE_BIOME_KIND: DefiningWorldPlazaBiomeKind =
  'plains';

/** Row count derived from biome list + column count. */
export const DEFINING_WORLD_PLAZA_DEV_QA_BIOME_GRID_ROWS = Math.ceil(
  DEFINING_WORLD_PLAZA_DEV_QA_BIOME_GRID_KINDS.length /
    DEFINING_WORLD_PLAZA_DEV_QA_BIOME_GRID_COLUMNS
);

/** Total showcase width in tiles. */
export const DEFINING_WORLD_PLAZA_DEV_QA_BIOME_GRID_WIDTH_TILES =
  DEFINING_WORLD_PLAZA_DEV_QA_BIOME_GRID_COLUMNS *
  DEFINING_WORLD_PLAZA_DEV_QA_BIOME_CELL_TILE_SIZE;

/** Total showcase height in tiles. */
export const DEFINING_WORLD_PLAZA_DEV_QA_BIOME_GRID_HEIGHT_TILES =
  DEFINING_WORLD_PLAZA_DEV_QA_BIOME_GRID_ROWS *
  DEFINING_WORLD_PLAZA_DEV_QA_BIOME_CELL_TILE_SIZE;

/**
 * Top-left tile of the showcase so the grid is centered on world origin.
 * Spawn (0, 0) lands in the plains cell near the middle of the first row.
 */
export const DEFINING_WORLD_PLAZA_DEV_QA_BIOME_GRID_ORIGIN_TILE_X = -Math.floor(
  DEFINING_WORLD_PLAZA_DEV_QA_BIOME_GRID_WIDTH_TILES / 2
);

/** Top-left tile Y of the showcase grid. */
export const DEFINING_WORLD_PLAZA_DEV_QA_BIOME_GRID_ORIGIN_TILE_Y = -Math.floor(
  DEFINING_WORLD_PLAZA_DEV_QA_BIOME_GRID_HEIGHT_TILES / 2
);
