/**
 * Ground shadow layout for SmallScaleInt wildlife sprites.
 *
 * Wildlife uses the same layered ellipse shadow as plaza avatars. Foot offset is
 * derived from the shared sprite anchor and a typical pack frame height.
 *
 * @module components/world/wildlife/domains/computingWildlifeGroundShadowLayout
 */

/** Grid anchor Y on wildlife sprite frames (matches rendering anchor). */
export const DEFINING_WILDLIFE_GROUND_SHADOW_SPRITE_ANCHOR_Y_NORMALIZED = 0.72;

/** Painted foot line on wildlife sprite frames. */
export const DEFINING_WILDLIFE_GROUND_SHADOW_SPRITE_FOOT_Y_NORMALIZED = 0.88;

/** Median frame height across the animal pack (84 px for most quadrupeds). */
export const DEFINING_WILDLIFE_GROUND_SHADOW_TYPICAL_FRAME_HEIGHT_PX = 84;

/** Extra shadow width vs raw species sizeScale so hooves read on grass. */
export const DEFINING_WILDLIFE_GROUND_SHADOW_SIZE_SCALE_MULTIPLIER = 1.15;

/**
 * Distance from the grid anchor down to painted feet (world-local px).
 */
export function computingWildlifeGroundShadowFootOffsetBelowGridAnchorPx(
  sizeScale: number,
  frameHeightPx = DEFINING_WILDLIFE_GROUND_SHADOW_TYPICAL_FRAME_HEIGHT_PX,
  footYNormalized = DEFINING_WILDLIFE_GROUND_SHADOW_SPRITE_FOOT_Y_NORMALIZED,
  anchorYNormalized = DEFINING_WILDLIFE_GROUND_SHADOW_SPRITE_ANCHOR_Y_NORMALIZED
): number {
  return (footYNormalized - anchorYNormalized) * frameHeightPx * sizeScale;
}

/**
 * Shadow ellipse scale passed into the shared avatar shadow drawer.
 */
export function computingWildlifeGroundShadowSizeScale(
  sizeScale: number
): number {
  return sizeScale * DEFINING_WILDLIFE_GROUND_SHADOW_SIZE_SCALE_MULTIPLIER;
}
