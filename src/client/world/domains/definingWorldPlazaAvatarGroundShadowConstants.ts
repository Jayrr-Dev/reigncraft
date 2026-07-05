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
export {
  DEFINING_WORLD_DEPTH_AVATAR_GROUND_SHADOW_ENTITY_DEPTH_BIAS as DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_ENTITY_DEPTH_BIAS,
  DEFINING_WORLD_DEPTH_AVATAR_GROUND_SHADOW_BODY_SYNC_Z_INDEX_OFFSET as DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_BODY_SYNC_Z_INDEX_OFFSET,
  DEFINING_WORLD_DEPTH_AVATAR_BODY_FRONT_OCCLUDER_STANDING_Z_INDEX_MARGIN as DEFINING_WORLD_PLAZA_AVATAR_BODY_FRONT_OCCLUDER_STANDING_Z_INDEX_MARGIN,
  DEFINING_WORLD_DEPTH_AVATAR_GROUND_SHADOW_FOOTPRINT_TILE_RADIUS as DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_FOOTPRINT_TILE_RADIUS,
  DEFINING_WORLD_DEPTH_AVATAR_BODY_SORT_FOOTPRINT_TILE_RADIUS as DEFINING_WORLD_PLAZA_AVATAR_BODY_SORT_FOOTPRINT_TILE_RADIUS,
} from '@/components/world/depth';
