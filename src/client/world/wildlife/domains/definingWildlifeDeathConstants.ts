/**
 * Wildlife corpse fade and distant random respawn tuning.
 *
 * @module components/world/wildlife/domains/definingWildlifeDeathConstants
 */

/** How long a corpse stays in the world before despawn (ms). */
export const DEFINING_WILDLIFE_CORPSE_LIFETIME_MS = 60_000;

/**
 * Final fade window at the end of the corpse lifetime (ms).
 * Corpse stays fully opaque until this window begins.
 */
export const DEFINING_WILDLIFE_CORPSE_FADE_DURATION_MS = 10_000;

/** Player must be at least this far from the death site before respawn (grid). */
export const DEFINING_WILDLIFE_RESPAWN_MIN_PLAYER_DISTANCE_GRID = 20;

/** Respawn point must be at least this far from the original death position (grid). */
export const DEFINING_WILDLIFE_RESPAWN_MIN_DEATH_SITE_DISTANCE_GRID = 12;

/** Max random placement attempts per pending respawn per hydration pass. */
export const DEFINING_WILDLIFE_RESPAWN_RANDOM_ATTEMPT_COUNT = 24;

/** Salt mixed into seeded respawn placement rolls. */
export const DEFINING_WILDLIFE_RESPAWN_RANDOM_PLACEMENT_SALT = 91_337;
