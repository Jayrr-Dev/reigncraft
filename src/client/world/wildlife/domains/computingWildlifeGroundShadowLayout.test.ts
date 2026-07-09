import { DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_FOOT_NUDGE_Y_PX } from '@/components/world/domains/definingWorldPlazaAvatarGroundShadowConstants';
import {
  computingWildlifeGroundShadowFootOffsetBelowGridAnchorPx,
  DEFINING_WILDLIFE_GROUND_SHADOW_SPRITE_ANCHOR_Y_NORMALIZED,
  DEFINING_WILDLIFE_GROUND_SHADOW_SPRITE_FOOT_Y_NORMALIZED,
  DEFINING_WILDLIFE_GROUND_SHADOW_TYPICAL_FRAME_HEIGHT_PX,
} from '@/components/world/wildlife/domains/computingWildlifeGroundShadowLayout';
import { describe, expect, it } from 'vitest';

/** Final shadow Y after the shared drawer appends its fixed foot nudge. */
function resolvingDrawnWildlifeGroundShadowYPx(
  sizeScale: number,
  options?: {
    footYNormalized?: number;
    anchorYNormalized?: number;
    speciesId?: 'chicken' | 'elephant';
  }
): number {
  return (
    computingWildlifeGroundShadowFootOffsetBelowGridAnchorPx(
      sizeScale,
      DEFINING_WILDLIFE_GROUND_SHADOW_TYPICAL_FRAME_HEIGHT_PX,
      options?.footYNormalized ??
        DEFINING_WILDLIFE_GROUND_SHADOW_SPRITE_FOOT_Y_NORMALIZED,
      options?.anchorYNormalized ??
        DEFINING_WILDLIFE_GROUND_SHADOW_SPRITE_ANCHOR_Y_NORMALIZED,
      options?.speciesId
    ) + DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_FOOT_NUDGE_Y_PX
  );
}

describe('computingWildlifeGroundShadowFootOffsetBelowGridAnchorPx', () => {
  it('keeps sizeScale 1 quadruped offset unchanged vs geometry + fixed nudge', () => {
    const geometryPx =
      (DEFINING_WILDLIFE_GROUND_SHADOW_SPRITE_FOOT_Y_NORMALIZED -
        DEFINING_WILDLIFE_GROUND_SHADOW_SPRITE_ANCHOR_Y_NORMALIZED) *
      DEFINING_WILDLIFE_GROUND_SHADOW_TYPICAL_FRAME_HEIGHT_PX;

    expect(computingWildlifeGroundShadowFootOffsetBelowGridAnchorPx(1)).toBe(
      geometryPx
    );
    expect(resolvingDrawnWildlifeGroundShadowYPx(1)).toBe(
      geometryPx + DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_FOOT_NUDGE_Y_PX
    );
  });

  it('scales the effective avatar foot nudge with sizeScale for quadrupeds', () => {
    for (const sizeScale of [0.42, 0.7, 0.9, 1.5, 1.9, 2]) {
      const geometryPx =
        (DEFINING_WILDLIFE_GROUND_SHADOW_SPRITE_FOOT_Y_NORMALIZED -
          DEFINING_WILDLIFE_GROUND_SHADOW_SPRITE_ANCHOR_Y_NORMALIZED) *
        DEFINING_WILDLIFE_GROUND_SHADOW_TYPICAL_FRAME_HEIGHT_PX *
        sizeScale;

      expect(resolvingDrawnWildlifeGroundShadowYPx(sizeScale)).toBeCloseTo(
        geometryPx +
          DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_FOOT_NUDGE_Y_PX * sizeScale
      );
    }
  });

  it('uses a smaller lift for runts than the fixed avatar nudge alone would', () => {
    const sizeScale = 0.42;
    const geometryPx =
      (DEFINING_WILDLIFE_GROUND_SHADOW_SPRITE_FOOT_Y_NORMALIZED -
        DEFINING_WILDLIFE_GROUND_SHADOW_SPRITE_ANCHOR_Y_NORMALIZED) *
      DEFINING_WILDLIFE_GROUND_SHADOW_TYPICAL_FRAME_HEIGHT_PX *
      sizeScale;
    const legacyFixedNudgeDrawnYPx =
      geometryPx + DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_FOOT_NUDGE_Y_PX;
    const scaledNudgeDrawnYPx = resolvingDrawnWildlifeGroundShadowYPx(sizeScale);

    // Fixed -16 over-lifts tiny sprites; scaled nudge stays nearer the feet.
    expect(scaledNudgeDrawnYPx).toBeGreaterThan(legacyFixedNudgeDrawnYPx);
    expect(scaledNudgeDrawnYPx).toBeCloseTo(
      geometryPx +
        DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_FOOT_NUDGE_Y_PX * sizeScale
    );
  });

  it('keeps chicken shadows on the grid anchor at every sizeScale', () => {
    const chickenPresentation = {
      footYNormalized: 0.65,
      anchorYNormalized: 0.65,
      speciesId: 'chicken' as const,
    };

    for (const sizeScale of [0.42, 1, 2.4]) {
      expect(
        resolvingDrawnWildlifeGroundShadowYPx(sizeScale, chickenPresentation)
      ).toBe(0);
    }
  });

  it('keeps elephant shadows on the planted foot line at every sizeScale', () => {
    const elephantPresentation = {
      footYNormalized: 0.68,
      anchorYNormalized: 0.68,
      speciesId: 'elephant' as const,
    };

    for (const sizeScale of [1, 1.6, 2.4]) {
      expect(
        resolvingDrawnWildlifeGroundShadowYPx(sizeScale, elephantPresentation)
      ).toBe(0);
    }
  });
});
