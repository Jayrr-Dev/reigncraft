/**
 * Sleep pose presentation sampled from each species die animation sheet.
 *
 * @module components/world/wildlife/domains/definingWildlifeSleepPresentationConstants
 */

import { DEFINING_WILDLIFE_SHEET_COLUMN_COUNT } from '@/components/world/wildlife/domains/definingWildlifeSpriteSheetLayout';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/**
 * Zero-based column on the die sheet used as the prone resting pose.
 * The pack's die clips end on a laying-down frame in the last column.
 */
export const DEFINING_WILDLIFE_SLEEP_DIE_FRAME_INDEX =
  DEFINING_WILDLIFE_SHEET_COLUMN_COUNT - 1;

/**
 * Species whose die sheet does not end on a prone pose.
 * The chicken die clip ends in a feather poof that fades to ~1 opaque pixel;
 * column 5 is its collapsed lying-down pose.
 */
export const DEFINING_WILDLIFE_SLEEP_DIE_FRAME_INDEX_OVERRIDES: Partial<
  Record<DefiningWildlifeSpeciesId, number>
> = {
  chicken: 5,
};

/** Returns the die-sheet column used as one species' sleep pose. */
export function resolvingWildlifeSleepDieFrameIndex(
  speciesId: DefiningWildlifeSpeciesId
): number {
  return (
    DEFINING_WILDLIFE_SLEEP_DIE_FRAME_INDEX_OVERRIDES[speciesId] ??
    DEFINING_WILDLIFE_SLEEP_DIE_FRAME_INDEX
  );
}
