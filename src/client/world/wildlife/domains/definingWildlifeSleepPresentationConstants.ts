/**
 * Sleep pose presentation sampled from each species die animation sheet.
 *
 * @module components/world/wildlife/domains/definingWildlifeSleepPresentationConstants
 */

import { DEFINING_WILDLIFE_SHEET_COLUMN_COUNT } from '@/components/world/wildlife/domains/definingWildlifeSpriteSheetLayout';

/**
 * Zero-based column on the die sheet used as the prone resting pose.
 * The pack's die clips end on a laying-down frame in the last column.
 */
export const DEFINING_WILDLIFE_SLEEP_DIE_FRAME_INDEX =
  DEFINING_WILDLIFE_SHEET_COLUMN_COUNT - 1;
