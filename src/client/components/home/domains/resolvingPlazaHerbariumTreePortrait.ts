/**
 * Resolves the CSS crop for a tree's herbarium portrait from the shared
 * tree sprite sheet (4 columns x 3 rows @ 32px).
 *
 * @module components/home/domains/resolvingPlazaHerbariumTreePortrait
 */

import {
  DEFINING_PLAZA_HERBARIUM_TREE_SPRITE_SHEET_COLUMN_COUNT,
  DEFINING_PLAZA_HERBARIUM_TREE_SPRITE_SHEET_ROW_COUNT,
  DEFINING_PLAZA_HERBARIUM_TREE_SPRITE_SHEET_URL,
  resolvingPlazaHerbariumTreeSpriteSheetCrop,
} from '@/components/home/domains/definingPlazaHerbariumTreePortraitSpriteSheetConstants';
import type { DefiningWorldPlazaTreeVariantKind } from '@/components/world/domains/definingWorldPlazaTreeConstants';

export type PlazaHerbariumTreePortrait = {
  /** Public URL of the shared tree sprite sheet. */
  sheetUrl: string;
  /** CSS background-size for one cell filling the box. */
  backgroundSizeCss: string;
  /** CSS background-position selecting the sampled cell. */
  backgroundPositionCss: string;
};

/**
 * Builds the CSS sprite crop for one tree variant portrait, or null when
 * the variant has no registered sprite cell.
 */
export function resolvingPlazaHerbariumTreePortrait(
  variant: DefiningWorldPlazaTreeVariantKind
): PlazaHerbariumTreePortrait | null {
  const crop = resolvingPlazaHerbariumTreeSpriteSheetCrop(variant);

  if (!crop) {
    return null;
  }

  const columnPercent =
    (crop.columnIndex /
      (DEFINING_PLAZA_HERBARIUM_TREE_SPRITE_SHEET_COLUMN_COUNT - 1)) *
    100;
  const rowPercent =
    (crop.rowIndex /
      (DEFINING_PLAZA_HERBARIUM_TREE_SPRITE_SHEET_ROW_COUNT - 1)) *
    100;

  return {
    sheetUrl: DEFINING_PLAZA_HERBARIUM_TREE_SPRITE_SHEET_URL,
    backgroundSizeCss: `${DEFINING_PLAZA_HERBARIUM_TREE_SPRITE_SHEET_COLUMN_COUNT * 100}% ${DEFINING_PLAZA_HERBARIUM_TREE_SPRITE_SHEET_ROW_COUNT * 100}%`,
    backgroundPositionCss: `${columnPercent}% ${rowPercent}%`,
  };
}
