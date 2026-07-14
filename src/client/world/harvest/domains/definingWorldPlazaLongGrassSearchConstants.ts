/**
 * Long-grass search balance and interaction constants.
 *
 * @module components/world/harvest/domains/definingWorldPlazaLongGrassSearchConstants
 */

/** Fixed search duration (ms). */
export const DEFINING_WORLD_PLAZA_LONG_GRASS_SEARCH_DURATION_MS = 500;

/** Max Chebyshev distance from player to grass tile center. */
export const DEFINING_WORLD_PLAZA_LONG_GRASS_SEARCH_PLAYER_RANGE_TILES = 2;

/** Minimum pointer hit radius around the grass tile center (tiles). */
export const DEFINING_WORLD_PLAZA_LONG_GRASS_SEARCH_POINTER_HIT_RADIUS_TILES = 0.75;

/** Tile radius scanned around the pointer when resolving a grass search click. */
export const DEFINING_WORLD_PLAZA_LONG_GRASS_SEARCH_POINTER_CANDIDATE_TILE_SEARCH_RADIUS_TILES = 2;

/** localStorage key prefix for cleared long-grass state. */
export const DEFINING_WORLD_PLAZA_CLEARED_LONG_GRASS_LOCAL_STORAGE_KEY_PREFIX =
  'world-plaza-cleared-long-grass' as const;

/** Player-facing verb for the timed interaction label. */
export const LABELING_WORLD_PLAZA_LONG_GRASS_SEARCH_ACTION = 'Search' as const;

/** Timed interaction progress icon (Iconify id). */
export const DEFINING_WORLD_PLAZA_LONG_GRASS_SEARCH_TIMED_INTERACTION_PROGRESS_ICON =
  'mdi:clover' as const;
