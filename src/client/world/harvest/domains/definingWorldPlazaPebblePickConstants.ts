/**
 * Floor-pebble pick balance and interaction constants.
 *
 * @module components/world/harvest/domains/definingWorldPlazaPebblePickConstants
 */

/** Stone granted when a floor pebble is picked. */
export const DEFINING_WORLD_PLAZA_PEBBLE_PICK_STONE_QUANTITY = 1;

/** Shortest pebble pick channel (ms); no layer scaling. */
export const DEFINING_WORLD_PLAZA_PEBBLE_PICK_DURATION_MIN_MS = 600;

/** Longest pebble pick channel (ms); no layer scaling. */
export const DEFINING_WORLD_PLAZA_PEBBLE_PICK_DURATION_MAX_MS = 800;

/** Max Chebyshev distance from player to pebble tile center. */
export const DEFINING_WORLD_PLAZA_PEBBLE_PICK_PLAYER_RANGE_TILES = 2;

/** Minimum pointer hit radius around the pebble tile center (tiles). */
export const DEFINING_WORLD_PLAZA_PEBBLE_PICK_POINTER_HIT_RADIUS_TILES = 0.6;

/** Tile radius scanned around the pointer when resolving a pebble pick click. */
export const DEFINING_WORLD_PLAZA_PEBBLE_PICK_POINTER_CANDIDATE_TILE_SEARCH_RADIUS_TILES = 2;

/** localStorage key prefix for picked pebble state. */
export const DEFINING_WORLD_PLAZA_PICKED_PEBBLES_LOCAL_STORAGE_KEY_PREFIX =
  'world-plaza-picked-pebbles' as const;
