/**
 * Biome flower pick balance and interaction constants.
 *
 * @module components/world/harvest/domains/definingWorldPlazaFlowerPickConstants
 */

/** Fixed pick duration (ms). */
export const DEFINING_WORLD_PLAZA_FLOWER_PICK_DURATION_MS = 350;

/** Max Chebyshev distance from player to flower tile center. */
export const DEFINING_WORLD_PLAZA_FLOWER_PICK_PLAYER_RANGE_TILES = 2;

/** Minimum pointer hit radius around the flower tile center (tiles). */
export const DEFINING_WORLD_PLAZA_FLOWER_PICK_POINTER_HIT_RADIUS_TILES = 0.6;

/** Tile radius scanned around the pointer when resolving a flower pick click. */
export const DEFINING_WORLD_PLAZA_FLOWER_PICK_POINTER_CANDIDATE_TILE_SEARCH_RADIUS_TILES = 2;

/** localStorage key prefix for picked flower state. */
export const DEFINING_WORLD_PLAZA_PICKED_FLOWERS_LOCAL_STORAGE_KEY_PREFIX =
  'world-plaza-picked-flowers' as const;

/** Eat channel duration for herbs (ms). */
export const DEFINING_WORLD_PLAZA_FLOWER_EAT_DURATION_MS = 1_200;
