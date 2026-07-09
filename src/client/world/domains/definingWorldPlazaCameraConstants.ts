/**
 * Camera zoom and viewport tuning for the plaza isometric scene.
 *
 * @module components/world/domains/definingWorldPlazaCameraConstants
 */

/** Uniform scale applied to the world container (values above 1 zoom in). */
export const DEFINING_WORLD_PLAZA_CAMERA_ZOOM = 3;

/**
 * Reference zoom for visible tile bounds and chunk prefetch.
 *
 * Kept independent of {@link DEFINING_WORLD_PLAZA_CAMERA_ZOOM} so increasing
 * camera zoom does not shrink how many floor chunks stay loaded.
 */
export const DEFINING_WORLD_PLAZA_CAMERA_VISIBLE_TILE_BOUNDS_REFERENCE_ZOOM = 2;

/** Wider field of view on mobile so more of the plaza is visible around the avatar. */
export const DEFINING_WORLD_PLAZA_CAMERA_MOBILE_ZOOM = 1.4;

/** Minimum follow dead-zone radius on mobile viewports. */
export const DEFINING_WORLD_PLAZA_CAMERA_MOBILE_FOLLOW_DEAD_ZONE_MIN_RADIUS_PX = 28;

/**
 * Fraction of the smaller viewport dimension for the mobile follow dead zone.
 * Slightly larger than desktop so the pulled-back camera pans less often.
 */
export const DEFINING_WORLD_PLAZA_CAMERA_MOBILE_FOLLOW_DEAD_ZONE_SCREEN_FRACTION = 0.1;

/** Minimum upward dead-zone extent on mobile viewports. */
export const DEFINING_WORLD_PLAZA_CAMERA_MOBILE_FOLLOW_DEAD_ZONE_TOP_MIN_RADIUS_PX = 16;

/** Upward dead-zone multiplier on mobile viewports. */
export const DEFINING_WORLD_PLAZA_CAMERA_MOBILE_FOLLOW_DEAD_ZONE_TOP_RADIUS_MULTIPLIER = 0.55;

/** Minimum downward dead-zone extent on mobile viewports. */
export const DEFINING_WORLD_PLAZA_CAMERA_MOBILE_FOLLOW_DEAD_ZONE_BOTTOM_MIN_RADIUS_PX = 42;

/** Downward dead-zone multiplier on mobile viewports. */
export const DEFINING_WORLD_PLAZA_CAMERA_MOBILE_FOLLOW_DEAD_ZONE_BOTTOM_RADIUS_MULTIPLIER = 1.35;

/** Minimum follow dead-zone radius in viewport pixels. */
export const DEFINING_WORLD_PLAZA_CAMERA_FOLLOW_DEAD_ZONE_MIN_RADIUS_PX = 36;

/**
 * Fraction of the smaller viewport dimension used for the follow dead-zone radius.
 * The camera stays put until the player leaves this centered area.
 */
export const DEFINING_WORLD_PLAZA_CAMERA_FOLLOW_DEAD_ZONE_SCREEN_FRACTION = 0.07;

/** Minimum upward (screen-top) dead-zone extent in viewport pixels. */
export const DEFINING_WORLD_PLAZA_CAMERA_FOLLOW_DEAD_ZONE_TOP_MIN_RADIUS_PX = 18;

/**
 * Upward dead-zone size as a fraction of the base radius. Lower values start
 * camera follow sooner when the player moves toward the top of the screen.
 */
export const DEFINING_WORLD_PLAZA_CAMERA_FOLLOW_DEAD_ZONE_TOP_RADIUS_MULTIPLIER = 0.5;

/** Minimum downward (screen-bottom) dead-zone extent in viewport pixels. */
export const DEFINING_WORLD_PLAZA_CAMERA_FOLLOW_DEAD_ZONE_BOTTOM_MIN_RADIUS_PX = 54;

/**
 * Downward dead-zone size as a fraction of the base radius. Higher values delay
 * camera follow when the player moves toward the bottom of the screen.
 */
export const DEFINING_WORLD_PLAZA_CAMERA_FOLLOW_DEAD_ZONE_BOTTOM_RADIUS_MULTIPLIER = 1.5;
