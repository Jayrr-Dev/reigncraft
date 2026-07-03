/**
 * Island world layout radii and feature-toggle storage.
 *
 * @module components/world/domains/definingWorldPlazaIslandModeConstants
 */

/** Chebyshev tile distance from origin for playable island land. */
export const DEFINING_WORLD_PLAZA_ISLAND_MODE_LAND_RADIUS_TILES = 1000;

/** localStorage key for the island world feature toggle. */
export const DEFINING_WORLD_PLAZA_ISLAND_MODE_FEATURE_STORAGE_KEY =
  "world-plaza-island-mode-enabled" as const;

/** Default island mode when no saved preference exists. */
export const DEFINING_WORLD_PLAZA_ISLAND_MODE_FEATURE_DEFAULT_ENABLED = false;

/** Island world zones used while the feature toggle is enabled. */
export type DefiningWorldPlazaIslandModeZone = "core_land" | "outer_ocean";

/**
 * @deprecated Use {@link DEFINING_WORLD_PLAZA_ISLAND_MODE_LAND_RADIUS_TILES}.
 */
export const DEFINING_WORLD_PLAZA_ISLAND_MODE_COASTAL_LAND_RADIUS_TILES =
  DEFINING_WORLD_PLAZA_ISLAND_MODE_LAND_RADIUS_TILES;

/**
 * @deprecated Use {@link DEFINING_WORLD_PLAZA_ISLAND_MODE_LAND_RADIUS_TILES}.
 */
export const DEFINING_WORLD_PLAZA_ISLAND_MODE_INNER_LAND_RADIUS_TILES =
  DEFINING_WORLD_PLAZA_ISLAND_MODE_LAND_RADIUS_TILES;
