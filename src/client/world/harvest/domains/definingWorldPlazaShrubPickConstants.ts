/**
 * Berry-shrub pick balance and interaction constants.
 *
 * @module components/world/harvest/domains/definingWorldPlazaShrubPickConstants
 */

/** Shortest berry-shrub pick channel (ms). */
export const DEFINING_WORLD_PLAZA_SHRUB_PICK_DURATION_MIN_MS = 800;

/** Longest berry-shrub pick channel (ms). */
export const DEFINING_WORLD_PLAZA_SHRUB_PICK_DURATION_MAX_MS = 1200;

/** Max Chebyshev distance from player to shrub tile center. */
export const DEFINING_WORLD_PLAZA_SHRUB_PICK_PLAYER_RANGE_TILES = 2;

/** Minimum pointer hit radius around the shrub tile center (tiles). */
export const DEFINING_WORLD_PLAZA_SHRUB_PICK_POINTER_HIT_RADIUS_TILES = 1;

/** Tile radius scanned around the pointer when resolving a shrub pick click. */
export const DEFINING_WORLD_PLAZA_SHRUB_PICK_POINTER_CANDIDATE_TILE_SEARCH_RADIUS_TILES = 2;

/** localStorage key prefix for picked shrub state. */
export const DEFINING_WORLD_PLAZA_PICKED_SHRUBS_LOCAL_STORAGE_KEY_PREFIX =
  'world-plaza-picked-shrubs' as const;

/** Player-facing verb for the timed interaction label. */
export const LABELING_WORLD_PLAZA_SHRUB_PICK_ACTION = 'Pick' as const;

/** Timed interaction progress icon (Iconify id). */
export const DEFINING_WORLD_PLAZA_SHRUB_PICK_TIMED_INTERACTION_PROGRESS_ICON =
  'mdi:fruit-cherries' as const;
