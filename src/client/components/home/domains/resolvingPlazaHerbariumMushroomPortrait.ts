/**
 * Resolves CSS crop for one mushroom species from the raw inventory sheet.
 *
 * @module components/home/domains/resolvingPlazaHerbariumMushroomPortrait
 */

import {
  DEFINING_WORLD_PLAZA_INVENTORY_MUSHROOM_SPRITE_SHEET_URL,
  resolvingWorldPlazaMushroomSpeciesSheetIndex,
  DEFINING_WORLD_PLAZA_MUSHROOM_SPRITE_SHEET_COLUMN_COUNT,
  DEFINING_WORLD_PLAZA_MUSHROOM_SPRITE_SHEET_ROW_COUNT,
} from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomSpriteSheetConstants';
import type { DefiningWorldPlazaMushroomSpeciesId } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomSpeciesIds';

export type PlazaHerbariumMushroomPortrait = {
  readonly sheetUrl: string;
  readonly backgroundSizeCss: string;
  readonly backgroundPositionCss: string;
};

/**
 * Resolves CSS crop for one mushroom species from the 4x4 inventory sprite sheet.
 */
export function resolvingPlazaHerbariumMushroomPortrait(
  speciesId: DefiningWorldPlazaMushroomSpeciesId
): PlazaHerbariumMushroomPortrait {
  const sheetIndex = resolvingWorldPlazaMushroomSpeciesSheetIndex(speciesId);
  const columnCount = DEFINING_WORLD_PLAZA_MUSHROOM_SPRITE_SHEET_COLUMN_COUNT;
  const rowCount = DEFINING_WORLD_PLAZA_MUSHROOM_SPRITE_SHEET_ROW_COUNT;
  const columnIndex = sheetIndex % columnCount;
  const rowIndex = Math.floor(sheetIndex / columnCount);
  const columnPercent = (columnIndex / Math.max(1, columnCount - 1)) * 100;
  const rowPercent = (rowIndex / Math.max(1, rowCount - 1)) * 100;

  return {
    sheetUrl: DEFINING_WORLD_PLAZA_INVENTORY_MUSHROOM_SPRITE_SHEET_URL,
    backgroundSizeCss: `${columnCount * 100}% ${rowCount * 100}%`,
    backgroundPositionCss: `${columnPercent}% ${rowPercent}%`,
  };
}
