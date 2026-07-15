/**
 * Rock mining balance and interaction constants.
 *
 * @module components/world/harvest/domains/definingWorldPlazaRockMineConstants
 */

/** Stone granted per world layer when no tool tier is supplied (wood baseline). */
export const DEFINING_WORLD_PLAZA_ROCK_MINE_STONE_PER_LAYER = 1;

/** Visual layers removed per swing when no tool tier is supplied (wood baseline). */
export const DEFINING_WORLD_PLAZA_ROCK_MINE_LAYERS_PER_SWING = 1;

/** Base swing duration before layer scaling (ms). */
export const DEFINING_WORLD_PLAZA_ROCK_MINE_BASE_DURATION_MS = 500;

/** Extra ms per remaining mineable layer (taller rocks take longer). */
export const DEFINING_WORLD_PLAZA_ROCK_MINE_DURATION_PER_REMAINING_LAYER_MS = 75;

/** Max Chebyshev distance from player to boulder footprint center. */
export const DEFINING_WORLD_PLAZA_ROCK_MINE_PLAYER_RANGE_TILES = 2;

/** Minimum pointer hit radius around the boulder footprint center (tiles). */
export const DEFINING_WORLD_PLAZA_ROCK_MINE_POINTER_HIT_RADIUS_TILES = 1.2;

/** Tile radius scanned around the pointer when resolving a rock mine click. */
export const DEFINING_WORLD_PLAZA_ROCK_MINE_POINTER_CANDIDATE_TILE_SEARCH_RADIUS_TILES = 4;

/** Extra tiles scanned around the player so rock clicks still resolve nearby boulders. */
export const DEFINING_WORLD_PLAZA_ROCK_MINE_PLAYER_CANDIDATE_TILE_SEARCH_EXTRA_TILES = 2;

/** localStorage key prefix for mined rock state. */
export const DEFINING_WORLD_PLAZA_MINED_ROCKS_LOCAL_STORAGE_KEY_PREFIX =
  'world-plaza-mined-rocks' as const;
