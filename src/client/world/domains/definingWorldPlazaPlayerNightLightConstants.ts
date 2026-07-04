/**
 * Local player torch lighting during the night cycle.
 *
 * @module components/world/domains/definingWorldPlazaPlayerNightLightConstants
 */

/** Lit radius around the player in unscaled isometric world-local pixels. */
export const DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_RADIUS_WORLD_LOCAL_PX = 76;

/** Extra nudge below the avatar foot anchor (world-local pixels). */
export const DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_VERTICAL_OFFSET_WORLD_LOCAL_PX = 2;

/**
 * Vertical squash of the light pool so it reads as light cast on the ground.
 * Matches the 2:1 isometric tile projection (64x32).
 */
export const DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_ISOMETRIC_VERTICAL_RATIO = 0.5;

/** Extra darkness applied outside the lit radius at full night strength. */
export const DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_OUTER_DARKNESS_ALPHA = 0.42;

/** Warm core brightness at full night strength (screen blend). */
export const DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_WARM_CORE_ALPHA = 0.54;

/** Minimum torch strength right after sunset / before sunrise. */
export const DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_MIN_STRENGTH = 0.5;
