/**
 * Plot aggregate tuning constants.
 *
 * @module components/world/building/domains/definingWorldBuildingPlotConstants
 */

/** Maximum placed blocks allowed on one plot. */
export const DEFINING_WORLD_BUILDING_PLOT_MAX_BLOCK_COUNT = 256;

/**
 * Maximum contiguous plots one player can own by default.
 * Increase later to allow multiple bases per player.
 */
export const DEFINING_WORLD_BUILDING_PLOT_DEFAULT_MAX_OWNER_PLOT_COUNT = 1;

/** Default maximum temporary build tiles allowed for one player. */
export const DEFINING_WORLD_BUILDING_PLOT_DEFAULT_MAX_TEMPORARY_TILE_COUNT = 5;

/** Maximum tile claims allowed across all owned plots for one player by default. */
export const DEFINING_WORLD_BUILDING_PLOT_DEFAULT_MAX_TILE_CLAIM_COUNT = 64;

/**
 * @deprecated Use {@link DEFINING_WORLD_BUILDING_PLOT_DEFAULT_MAX_OWNER_PLOT_COUNT}
 * or per-user limits from `user_profile.world_plot_max_count`.
 */
export const DEFINING_WORLD_BUILDING_PLOT_MAX_OWNER_PLOT_COUNT =
  DEFINING_WORLD_BUILDING_PLOT_DEFAULT_MAX_OWNER_PLOT_COUNT;

/**
 * @deprecated Use {@link DEFINING_WORLD_BUILDING_PLOT_DEFAULT_MAX_TILE_CLAIM_COUNT}
 * or per-user limits from `user_profile.world_tile_claim_max_count`.
 */
export const DEFINING_WORLD_BUILDING_PLOT_MAX_TILE_CLAIM_COUNT =
  DEFINING_WORLD_BUILDING_PLOT_DEFAULT_MAX_TILE_CLAIM_COUNT;

/**
 * @deprecated Use {@link DEFINING_WORLD_BUILDING_PLOT_DEFAULT_MAX_TILE_CLAIM_COUNT}.
 */
export const DEFINING_WORLD_BUILDING_PLOT_MAX_OWNER_CLAIM_COUNT =
  DEFINING_WORLD_BUILDING_PLOT_DEFAULT_MAX_TILE_CLAIM_COUNT;

/** TanStack Query key root for per-user plot owner limits. */
export const DEFINING_WORLD_BUILDING_PLOT_OWNER_LIMITS_QUERY_KEY_ROOT =
  "world-building-plot-owner-limits" as const;
export const DEFINING_WORLD_BUILDING_PLOTS_QUERY_KEY_ROOT =
  "world-building-plots" as const;

/** TanStack Query key root for placed blocks. */
export const DEFINING_WORLD_BUILDING_PLACED_BLOCKS_QUERY_KEY_ROOT =
  "world-building-placed-blocks" as const;

/** Supabase Realtime topic prefix for plot block changes. */
export const DEFINING_WORLD_BUILDING_PLOT_REALTIME_TOPIC_PREFIX =
  "world-building-plot" as const;

/** Hotkey that toggles build mode. */
export const DEFINING_WORLD_BUILDING_BUILD_MODE_TOGGLE_KEY = "b" as const;

/** Hotkey that toggles claim mode. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_TOGGLE_KEY = "c" as const;

/** Minimum Chebyshev tile distance required between a new claim and other players' plots. */
export const DEFINING_WORLD_BUILDING_PLOT_OTHER_OWNER_MIN_CLAIM_DISTANCE_TILES = 3;
