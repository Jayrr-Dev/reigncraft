/**
 * Canopy fade when the local player walks under tree foliage.
 *
 * @module components/world/domains/definingWorldPlazaTreeCanopyPlayerOcclusionConstants
 */

/** Canopy opacity when the player stands under the crown. */
export const DEFINING_WORLD_PLAZA_TREE_CANOPY_UNDER_PLAYER_ALPHA = 0.1;

/** Canopy opacity when the player is outside the crown footprint. */
export const DEFINING_WORLD_PLAZA_TREE_CANOPY_DEFAULT_ALPHA = 1;

/**
 * Scales the painted canopy footprint radius used to trigger under-player fade.
 * Values above 1 start fading before the crown fully covers the avatar.
 */
export const DEFINING_WORLD_PLAZA_TREE_CANOPY_PLAYER_OCCLUSION_FOOTPRINT_RADIUS_MULTIPLIER = 3;

/**
 * Fraction of the occlusion footprint radius where fade is at full strength.
 * Inside this radius the canopy hits the under-player alpha; between it and
 * the footprint edge the fade eases off with distance.
 */
export const DEFINING_WORLD_PLAZA_TREE_CANOPY_PLAYER_OCCLUSION_FULL_FADE_RADIUS_FRACTION = 0.6;

/**
 * Widens the screen-space crown ellipse horizontally for the overlap test.
 */
export const DEFINING_WORLD_PLAZA_TREE_CANOPY_SCREEN_ELLIPSE_RADIUS_X_MULTIPLIER = 1.2;

/**
 * Flattens the screen-space crown ellipse vertically for the overlap test.
 */
export const DEFINING_WORLD_PLAZA_TREE_CANOPY_SCREEN_ELLIPSE_RADIUS_Y_MULTIPLIER = 1.05;

/**
 * Normalized ellipse distance at or under which fade is at full strength.
 */
export const DEFINING_WORLD_PLAZA_TREE_CANOPY_SCREEN_FULL_FADE_NORMALIZED_DISTANCE = 0.85;

/**
 * Normalized ellipse distance at or past which the canopy is fully opaque.
 */
export const DEFINING_WORLD_PLAZA_TREE_CANOPY_SCREEN_ZERO_FADE_NORMALIZED_DISTANCE = 1.35;

/**
 * Per-frame lerp toward the target alpha (0 to 1).
 * Higher values snap faster; lower values ease in and out.
 */
export const DEFINING_WORLD_PLAZA_TREE_CANOPY_PLAYER_OCCLUSION_ALPHA_LERP = 0.22;
