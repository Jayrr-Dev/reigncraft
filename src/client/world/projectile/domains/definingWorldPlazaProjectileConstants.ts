/**
 * Tunable projectile engine constants.
 *
 * @module components/world/projectile/domains/definingWorldPlazaProjectileConstants
 */

/** Screen-space vertical band for jump-dodgeable low projectiles (px). */
export const DEFINING_WORLD_PLAZA_PROJECTILE_JUMP_DODGE_HIT_BAND_PX = 10;

/** Full-height hit band for non-dodgeable projectiles (px). */
export const DEFINING_WORLD_PLAZA_PROJECTILE_FULL_HEIGHT_HIT_BAND_PX = 120;

/** World-layer tolerance when comparing projectile vs target elevation. */
export const DEFINING_WORLD_PLAZA_PROJECTILE_LAYER_HIT_TOLERANCE = 4;

/** Default homing soft turn rate (radians per second). */
export const DEFINING_WORLD_PLAZA_PROJECTILE_HOMING_SOFT_MAX_TURN_RATE_RAD_PER_SEC =
  Math.PI * 1.25;

/** Default homing soft lead error (radians). */
export const DEFINING_WORLD_PLAZA_PROJECTILE_HOMING_SOFT_LEAD_ERROR_RAD = 0.35;

/** Minimum direction vector length before normalization. */
export const DEFINING_WORLD_PLAZA_PROJECTILE_MIN_DIRECTION_LENGTH = 1e-4;

/** Default gravity-pull acceleration toward target (grid / s²). */
export const DEFINING_WORLD_PLAZA_PROJECTILE_GRAVITY_PULL_DEFAULT_ACCELERATION_GRID_PER_SEC2 = 3.5;

/** Default gravity-pull influence radius (grid). */
export const DEFINING_WORLD_PLAZA_PROJECTILE_GRAVITY_PULL_DEFAULT_RADIUS_GRID = 8;

/** Default soft settle radius near the attractor (grid). */
export const DEFINING_WORLD_PLAZA_PROJECTILE_GRAVITY_PULL_DEFAULT_SETTLE_RADIUS_GRID = 0.08;

/** Default max speed while under gravity pull (grid / s). */
export const DEFINING_WORLD_PLAZA_PROJECTILE_GRAVITY_PULL_DEFAULT_MAX_SPEED_GRID_PER_SEC = 10;

/** Max spawn events bundled per online sync payload. */
export const DEFINING_WORLD_PLAZA_PROJECTILE_ONLINE_SYNC_MAX_SPAWN_EVENTS = 8;

/** Dev spawner offset from local player (grid units). */
export const DEFINING_WORLD_PLAZA_PROJECTILE_DEV_SPAWN_OFFSET_GRID = 6;
