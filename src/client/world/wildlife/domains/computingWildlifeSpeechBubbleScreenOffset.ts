/**
 * Screen offset for wildlife speech text above the painted sprite head.
 *
 * @module components/world/wildlife/domains/computingWildlifeSpeechBubbleScreenOffset
 */

import {
  DEFINING_WILDLIFE_GROUND_SHADOW_SPRITE_ANCHOR_Y_NORMALIZED,
  DEFINING_WILDLIFE_GROUND_SHADOW_TYPICAL_FRAME_HEIGHT_PX,
} from '@/components/world/wildlife/domains/computingWildlifeGroundShadowLayout';

/** Visible head line on wildlife frames (normalized from sprite top). */
const COMPUTING_WILDLIFE_SPEECH_VISIBLE_HEAD_TOP_Y_NORMALIZED = 0.14;

/** Gap between the head top and speech text bottom (world-local px). */
const COMPUTING_WILDLIFE_SPEECH_GAP_ABOVE_HEAD_PX = 2;

/**
 * Lifts speech text from the grid anchor to just above the sprite head.
 */
export function computingWildlifeSpeechOffsetAboveAnchorPx(
  sizeScale: number,
  frameHeightPx = DEFINING_WILDLIFE_GROUND_SHADOW_TYPICAL_FRAME_HEIGHT_PX,
  anchorYNormalized = DEFINING_WILDLIFE_GROUND_SHADOW_SPRITE_ANCHOR_Y_NORMALIZED
): number {
  return (
    Math.ceil(
      (anchorYNormalized -
        COMPUTING_WILDLIFE_SPEECH_VISIBLE_HEAD_TOP_Y_NORMALIZED) *
        frameHeightPx *
        sizeScale
    ) + COMPUTING_WILDLIFE_SPEECH_GAP_ABOVE_HEAD_PX
  );
}
