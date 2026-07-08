/**
 * Screen offset for wildlife name tags above the painted sprite head.
 *
 * @module components/world/wildlife/domains/computingWildlifeNameTagScreenOffset
 */

import { DEFINING_WILDLIFE_NAME_TAG_LIFT_FRACTION_OF_SPEECH_OFFSET } from '@/components/world/wildlife/domains/definingWildlifeNameTagConstants';
import { computingWildlifeSpeechOffsetAboveAnchorPx } from '@/components/world/wildlife/domains/computingWildlifeSpeechBubbleScreenOffset';

/**
 * Lifts a name tag from the grid anchor to just above the sprite head,
 * lower than speech and combat float text.
 */
export function computingWildlifeNameTagOffsetAboveAnchorPx(
  sizeScale: number
): number {
  const speechLiftPx = computingWildlifeSpeechOffsetAboveAnchorPx(sizeScale);

  return Math.max(
    8,
    Math.ceil(speechLiftPx * DEFINING_WILDLIFE_NAME_TAG_LIFT_FRACTION_OF_SPEECH_OFFSET)
  );
}
