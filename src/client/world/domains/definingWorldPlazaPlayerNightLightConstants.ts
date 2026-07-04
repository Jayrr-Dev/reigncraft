/**
 * Local player torch lighting during the night cycle.
 *
 * @module components/world/domains/definingWorldPlazaPlayerNightLightConstants
 */

/** Lit radius around the player in unscaled isometric world-local pixels. */
export const DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_RADIUS_WORLD_LOCAL_PX = 76;

/** Extra nudge applied after the foot-offset fraction (negative = up on screen). */
export const DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_VERTICAL_OFFSET_WORLD_LOCAL_PX = -6;

/**
 * How far down from the grid anchor the torch center sits, as a fraction of the
 * painted foot offset. Lower values pull the pool up under the sprite body.
 */
export const DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_FOOT_OFFSET_FRACTION = 0.52;

/**
 * Vertical squash of the light pool so it reads as light cast on the ground.
 * Lower values bend the ellipse more along the isometric floor plane.
 */
export const DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_ISOMETRIC_VERTICAL_RATIO = 0.38;

/** Extra darkness applied outside the lit radius at full night strength. */
export const DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_OUTER_DARKNESS_ALPHA = 0.42;

/** Warm core brightness at full midnight strength (screen blend). */
export const DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_WARM_CORE_ALPHA = 0.48;

/** Glow brightness at early night / twilight (0..1). */
export const DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_GLOW_BRIGHTNESS_MIN = 0.14;

/** Glow brightness at deepest midnight (0..1). */
export const DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_GLOW_BRIGHTNESS_MAX = 1;

/** Outer vignette strength at early night (0..1). */
export const DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_VIGNETTE_STRENGTH_MIN = 0.22;

/** Outer vignette strength at deepest midnight (0..1). */
export const DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_VIGNETTE_STRENGTH_MAX = 1;

/**
 * Exponent for mapping darkness to glow brightness. Values above 1 keep twilight
 * soft while ramping brightness faster toward midnight.
 */
export const DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_DARKNESS_RESPONSE_EXPONENT = 1.5;

/** Blur applied to the warm glow pool so it reads as diffuse light. */
export const DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_GLOW_BLUR_STRENGTH_PX = 6;

/** Blur quality for the warm glow pool. */
export const DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_GLOW_BLUR_QUALITY = 4;
