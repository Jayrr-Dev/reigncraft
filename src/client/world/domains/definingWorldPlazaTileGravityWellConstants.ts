/**
 * Default tile gravity-well tuning for plaza movers.
 *
 * @module components/world/domains/definingWorldPlazaTileGravityWellConstants
 */

/** Default influence radius in grid units (~4 tiles). */
export const DEFINING_WORLD_PLAZA_TILE_GRAVITY_WELL_DEFAULT_RADIUS_GRID = 4;

/**
 * Default pull acceleration (grid / s²).
 * At full strength for 1s from rest, speed reaches this value.
 * Soft enough that walk/run (~2–3.5 grid/s) can still fight the pull.
 */
export const DEFINING_WORLD_PLAZA_TILE_GRAVITY_WELL_DEFAULT_ACCELERATION_GRID_PER_SEC2 = 1.8;

/** Soft settle radius so movers do not jitter on the attractor point. */
export const DEFINING_WORLD_PLAZA_TILE_GRAVITY_WELL_DEFAULT_SETTLE_RADIUS_GRID = 0.12;

/** Optional default speed cap for gravity-only velocity (grid / s). */
export const DEFINING_WORLD_PLAZA_TILE_GRAVITY_WELL_DEFAULT_MAX_SPEED_GRID_PER_SEC = 4.5;

/** Distances below this treat the mover as already at the attractor. */
export const DEFINING_WORLD_PLAZA_TILE_GRAVITY_WELL_MIN_DISTANCE_GRID = 1e-6;

/** Zero velocity used when a caller omits carried gravity velocity. */
export const DEFINING_WORLD_PLAZA_TILE_GRAVITY_WELL_VELOCITY_IDLE = {
  x: 0,
  y: 0,
} as const;
