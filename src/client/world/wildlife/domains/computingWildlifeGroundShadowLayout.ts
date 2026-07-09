/**
 * Ground shadow layout for SmallScaleInt wildlife sprites.
 *
 * Wildlife uses the same layered ellipse shadow as plaza avatars. Foot offset is
 * derived from the shared sprite anchor and a typical pack frame height.
 *
 * @module components/world/wildlife/domains/computingWildlifeGroundShadowLayout
 */

import { DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_FOOT_NUDGE_Y_PX } from '@/components/world/domains/definingWorldPlazaAvatarGroundShadowConstants';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Grid anchor Y on wildlife sprite frames (matches rendering anchor). */
export const DEFINING_WILDLIFE_GROUND_SHADOW_SPRITE_ANCHOR_Y_NORMALIZED = 0.72;

/** Painted foot line on wildlife sprite frames. */
export const DEFINING_WILDLIFE_GROUND_SHADOW_SPRITE_FOOT_Y_NORMALIZED = 0.88;

/** Median frame height across the animal pack (84 px for most quadrupeds). */
export const DEFINING_WILDLIFE_GROUND_SHADOW_TYPICAL_FRAME_HEIGHT_PX = 84;

/** Extra shadow width vs raw species sizeScale so hooves read on grass. */
export const DEFINING_WILDLIFE_GROUND_SHADOW_SIZE_SCALE_MULTIPLIER = 1.15;

export type DefiningWildlifeGroundShadowSpeciesOverride = {
  /** Shrinks the shared avatar ellipse for species whose painted body is tiny. */
  sizeScaleMultiplier: number;
  /**
   * Cancels the avatar-tuned foot nudge inside the shared shadow drawer.
   * Quadrupeds offset it with their anchor-to-foot distance; species whose
   * anchor already sits on the painted feet need the nudge zeroed out.
   */
  cancelsAvatarFootNudge: boolean;
};

/**
 * Species whose shadow diverges from the shared quadruped layout.
 * Chicken body pixels are ~8px wide in a 64px frame with feet at the anchor.
 */
export const DEFINING_WILDLIFE_GROUND_SHADOW_SPECIES_OVERRIDES: Partial<
  Record<DefiningWildlifeSpeciesId, DefiningWildlifeGroundShadowSpeciesOverride>
> = {
  chicken: { sizeScaleMultiplier: 0.5, cancelsAvatarFootNudge: true },
  // Feet planted on the grid via sprite presentation; cancel the avatar nudge.
  elephant: { sizeScaleMultiplier: 1.35, cancelsAvatarFootNudge: true },
  'elephant-female': { sizeScaleMultiplier: 1.3, cancelsAvatarFootNudge: true },
  mammoth: { sizeScaleMultiplier: 1.35, cancelsAvatarFootNudge: true },
  hippo: { sizeScaleMultiplier: 1.25, cancelsAvatarFootNudge: true },
  rhino: { sizeScaleMultiplier: 1.2, cancelsAvatarFootNudge: true },
  'rhino-female': { sizeScaleMultiplier: 1.2, cancelsAvatarFootNudge: true },
  giraffe: { sizeScaleMultiplier: 1.15, cancelsAvatarFootNudge: true },
};

/**
 * Distance from the grid anchor down to painted feet (world-local px).
 *
 * The shared avatar shadow drawer always adds a fixed
 * {@link DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_FOOT_NUDGE_Y_PX}. Wildlife
 * sprite sheets also have empty margin below the painted feet; that margin
 * scales with `sizeScale` in both directions:
 * - large / bruiser: margin grows, fixed nudge leaves a gap under the feet
 * - small / runt (`sizeScale` < 1): margin shrinks, fixed nudge over-lifts
 *   the ellipse into the body
 *
 * Compensate here so the drawn nudge is `avatarFootNudgePx * sizeScale`.
 */
export function computingWildlifeGroundShadowFootOffsetBelowGridAnchorPx(
  sizeScale: number,
  frameHeightPx = DEFINING_WILDLIFE_GROUND_SHADOW_TYPICAL_FRAME_HEIGHT_PX,
  footYNormalized = DEFINING_WILDLIFE_GROUND_SHADOW_SPRITE_FOOT_Y_NORMALIZED,
  anchorYNormalized = DEFINING_WILDLIFE_GROUND_SHADOW_SPRITE_ANCHOR_Y_NORMALIZED,
  speciesId?: DefiningWildlifeSpeciesId
): number {
  const override = speciesId
    ? DEFINING_WILDLIFE_GROUND_SHADOW_SPECIES_OVERRIDES[speciesId]
    : undefined;
  const footGeometryBelowAnchorPx =
    (footYNormalized - anchorYNormalized) * frameHeightPx * sizeScale;
  const avatarFootNudgePx =
    DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_FOOT_NUDGE_Y_PX;

  if (override?.cancelsAvatarFootNudge) {
    // Drawer still adds the fixed nudge; cancel it for feet-at-anchor species.
    return footGeometryBelowAnchorPx - avatarFootNudgePx;
  }

  // Drawer adds `avatarFootNudgePx` once. Pass the extra `(sizeScale - 1)` so
  // the effective nudge is `avatarFootNudgePx * sizeScale` for runts and bruisers.
  return footGeometryBelowAnchorPx + avatarFootNudgePx * (sizeScale - 1);
}

/**
 * Shadow ellipse scale passed into the shared avatar shadow drawer.
 */
export function computingWildlifeGroundShadowSizeScale(
  sizeScale: number,
  speciesId?: DefiningWildlifeSpeciesId
): number {
  const override = speciesId
    ? DEFINING_WILDLIFE_GROUND_SHADOW_SPECIES_OVERRIDES[speciesId]
    : undefined;

  return (
    sizeScale *
    DEFINING_WILDLIFE_GROUND_SHADOW_SIZE_SCALE_MULTIPLIER *
    (override?.sizeScaleMultiplier ?? 1)
  );
}
