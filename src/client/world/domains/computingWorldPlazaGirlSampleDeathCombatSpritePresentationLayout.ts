import { DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_MOTION_SHEET_LAYOUT } from '@/components/world/domains/definingWorldPlazaGirlSampleCombatMotionConstants';
import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_SPRITE_COLLAPSE_START_FRAME_INDEX,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_SPRITE_PRESENTATION_COLLAPSED_LAYOUT,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_SPRITE_PRESENTATION_STANDING_LAYOUT,
  type DefiningWorldPlazaGirlSampleCombatSpritePresentationLayout,
} from '@/components/world/domains/definingWorldPlazaGirlSampleCombatSpritePresentationConstants';

function computingWorldPlazaGirlSampleCombatSpritePresentationScalarLerp(
  startValue: number,
  endValue: number,
  progressRatio: number
): number {
  return startValue + (endValue - startValue) * progressRatio;
}

/**
 * Interpolates death sprite anchor/offset as the strip collapses to the floor.
 */
export function computingWorldPlazaGirlSampleDeathCombatSpritePresentationLayout(
  frameIndex: number
): DefiningWorldPlazaGirlSampleCombatSpritePresentationLayout {
  const collapseStartFrameIndex =
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_SPRITE_COLLAPSE_START_FRAME_INDEX;
  const collapseEndFrameIndex =
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_MOTION_SHEET_LAYOUT.frameCount - 1;

  if (frameIndex <= collapseStartFrameIndex) {
    return DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_SPRITE_PRESENTATION_STANDING_LAYOUT;
  }

  const collapseProgressRatio = Math.min(
    1,
    (frameIndex - collapseStartFrameIndex) /
      Math.max(1, collapseEndFrameIndex - collapseStartFrameIndex)
  );
  const standingLayout =
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_SPRITE_PRESENTATION_STANDING_LAYOUT;
  const collapsedLayout =
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_SPRITE_PRESENTATION_COLLAPSED_LAYOUT;

  return {
    anchorXNormalized: 0.5,
    anchorYNormalized:
      computingWorldPlazaGirlSampleCombatSpritePresentationScalarLerp(
        standingLayout.anchorYNormalized,
        collapsedLayout.anchorYNormalized,
        collapseProgressRatio
      ),
    offsetBelowGridAnchorPx:
      computingWorldPlazaGirlSampleCombatSpritePresentationScalarLerp(
        standingLayout.offsetBelowGridAnchorPx,
        collapsedLayout.offsetBelowGridAnchorPx,
        collapseProgressRatio
      ),
  };
}
