/**
 * Ground shadow styling for GirlSample plaza avatars.
 *
 * Drawn as layered soft ellipses under the foot anchor so characters read
 * planted on the isometric floor without a harsh black spot.
 */

/** Warm dark tint that reads on grass tiles. */
export const DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_FILL_COLOR = 0x1a2410;

/** Default horizontal radius when facing lookup fails. */
export const DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_CORE_RADIUS_X_PX = 8;

/** Default vertical radius when facing lookup fails. */
export const DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_CORE_RADIUS_Y_PX = 4;

/** Lifts the shadow toward the feet / tile plane (negative = up on screen). */
export const DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_FOOT_NUDGE_Y_PX = -16;

/** Peak opacity for the innermost shadow layer. */
export const DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_BASE_ALPHA = 0.16;

/** Soft halo layers drawn largest first to mimic a radial falloff. */
export const DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_SOFT_LAYERS = [
  { radiusScale: 1.5, alphaScale: 0.28 },
  { radiusScale: 1.2, alphaScale: 0.58 },
  { radiusScale: 1, alphaScale: 1 },
] as const;

/** Extra opacity reduction at the peak of a jump (0 to 1). */
export const DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_JUMP_ALPHA_REDUCTION = 0.1;

/** Shadow scale reduction at the peak of a jump (0 to 1). */
export const DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_JUMP_SCALE_REDUCTION = 0.55;

/**
 * Tile radius checked around the avatar foot when sorting raised shadows above
 * coplanar procedural terrain caps only.
 */
export const DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_FOOTPRINT_TILE_RADIUS = 2;

/**
 * Entity-layer sort bias so the shadow draws at foot depth: above terrain
 * column caps on coplanar tiles, below column rocks (+4), and below the avatar
 * body (+80).
 */
export const DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_ENTITY_DEPTH_BIAS = 1 as const;

/**
 * Sort offset applied to the shadow relative to the avatar body sort key.
 *
 * The shadow shares the body depth so anything that occludes (or hides) the
 * sprite occludes the shadow in lockstep. The small negative keeps the body
 * drawing just above the shadow.
 */
export const DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_BODY_SYNC_Z_INDEX_OFFSET = -1 as const;

/**
 * Z-index gap subtracted from a foreground column when clamping the avatar body
 * behind it. Must clear integer rounding and the on-block depth bias at collision
 * edges so no sprite pixels win a tie against the column graphics.
 */
export const DEFINING_WORLD_PLAZA_AVATAR_BODY_FRONT_OCCLUDER_STANDING_Z_INDEX_MARGIN = 3 as const;

/**
 * Screen-Y slack (px) when deciding whether the avatar foot sits north of a
 * column foot. Collision resolution can push the foot slightly south while the
 * sprite still reads behind the stack.
 */
export const DEFINING_WORLD_PLAZA_AVATAR_BODY_BEHIND_OCCLUDER_SCREEN_Y_TOLERANCE_PX = 10 as const;

/**
 * Grid-Y slack paired with the screen-Y tolerance for coplanar tuck tests at
 * collision edges (fraction of one tile).
 */
export const DEFINING_WORLD_PLAZA_AVATAR_BODY_BEHIND_OCCLUDER_GRID_Y_TOLERANCE = 0.35 as const;
