/**
 * Wet clay shore-wetting balance and timed interaction constants.
 *
 * @module components/world/wet-clay/domains/definingWorldPlazaWetClayConstants
 */

/** Max Chebyshev distance from player foot to water tile for wetting. */
export const DEFINING_WORLD_PLAZA_WET_CLAY_PLAYER_RANGE_TILES = 2;

/** Channel duration min per clay (ms). */
export const DEFINING_WORLD_PLAZA_WET_CLAY_DURATION_MIN_MS = 1000;

/** Channel duration max per clay (ms). */
export const DEFINING_WORLD_PLAZA_WET_CLAY_DURATION_MAX_MS = 3000;

/** Player-facing verb for the timed interaction label. */
export const DEFINING_WORLD_PLAZA_WET_CLAY_ACTION_LABEL = 'Wet Clay' as const;

/** Progress ring icon for wetting clay (Iconify id). */
export const DEFINING_WORLD_PLAZA_WET_CLAY_TIMED_INTERACTION_PROGRESS_ICON =
  'game-icons:clay-brick' as const;

/** Clay consumed / wet clay granted per successful wet. */
export const DEFINING_WORLD_PLAZA_WET_CLAY_CONVERT_QUANTITY = 1;
