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
 * Per-frame lerp toward the target alpha (0 to 1).
 * Higher values snap faster; lower values ease in and out.
 */
export const DEFINING_WORLD_PLAZA_TREE_CANOPY_PLAYER_OCCLUSION_ALPHA_LERP = 0.22;
