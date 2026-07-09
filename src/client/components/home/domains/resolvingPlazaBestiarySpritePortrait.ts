/**
 * Resolves the CSS crop for a species' bestiary portrait from its
 * idle sprite sheet (15 columns x 8 direction rows).
 *
 * @module components/home/domains/resolvingPlazaBestiarySpritePortrait
 */

import {
  DEFINING_PLAZA_BESTIARY_PORTRAIT_FRAME_COLUMN_INDEX,
  DEFINING_PLAZA_BESTIARY_PORTRAIT_FRAME_ROW_INDEX,
} from '@/components/home/domains/definingPlazaBestiarySpritePortraitConstants';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import {
  buildingWildlifeMotionSheetUrls,
  DEFINING_WILDLIFE_SHEET_COLUMN_COUNT,
  DEFINING_WILDLIFE_SHEET_ROW_COUNT,
} from '@/components/world/wildlife/domains/definingWildlifeSpriteSheetLayout';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type PlazaBestiarySpritePortrait = {
  /** Public URL of the idle sprite sheet. */
  sheetUrl: string;
  /** CSS background-size for one frame filling the box (e.g. "1500% 800%"). */
  backgroundSizeCss: string;
  /** CSS background-position selecting the sampled frame. */
  backgroundPositionCss: string;
};

/**
 * Builds the CSS sprite crop for one species portrait, or null when the
 * species has no registered sprite sheet.
 */
export function resolvingPlazaBestiarySpritePortrait(
  speciesId: DefiningWildlifeSpeciesId
): PlazaBestiarySpritePortrait | null {
  const speciesDefinition = resolvingWildlifeSpeciesDefinition(speciesId);

  if (!speciesDefinition) {
    return null;
  }

  const sheetUrls = buildingWildlifeMotionSheetUrls(
    speciesDefinition.spriteFolder,
    'idle',
    speciesId
  );
  const sheetUrl = sheetUrls[0];

  if (!sheetUrl) {
    return null;
  }

  const columnPercent =
    (DEFINING_PLAZA_BESTIARY_PORTRAIT_FRAME_COLUMN_INDEX /
      (DEFINING_WILDLIFE_SHEET_COLUMN_COUNT - 1)) *
    100;
  const rowPercent =
    (DEFINING_PLAZA_BESTIARY_PORTRAIT_FRAME_ROW_INDEX /
      (DEFINING_WILDLIFE_SHEET_ROW_COUNT - 1)) *
    100;

  return {
    sheetUrl,
    backgroundSizeCss: `${DEFINING_WILDLIFE_SHEET_COLUMN_COUNT * 100}% ${DEFINING_WILDLIFE_SHEET_ROW_COUNT * 100}%`,
    backgroundPositionCss: `${columnPercent}% ${rowPercent}%`,
  };
}
