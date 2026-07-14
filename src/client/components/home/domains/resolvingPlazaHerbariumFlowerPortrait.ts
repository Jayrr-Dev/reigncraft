/**
 * Resolves the CSS crop for a flower's herbarium portrait from the shared
 * flower inventory sprite sheet (4 columns x 3 rows @ 32px).
 *
 * @module components/home/domains/resolvingPlazaHerbariumFlowerPortrait
 */

import {
  DEFINING_WORLD_PLAZA_FLOWER_SPECIES_TO_ITEM_TYPE_ID,
  DEFINING_WORLD_PLAZA_INVENTORY_FLOWER_SPRITE_SHEET_COLUMN_COUNT,
  DEFINING_WORLD_PLAZA_INVENTORY_FLOWER_SPRITE_SHEET_ROW_COUNT,
  DEFINING_WORLD_PLAZA_INVENTORY_FLOWER_SPRITE_SHEET_URL,
  resolvingWorldPlazaInventoryFlowerSpriteSheetIcon,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryFlowerSpriteSheetConstants';
import type { WorldFlowerSpeciesId } from '../../../../shared/worldFlowerRarity';

export type PlazaHerbariumFlowerPortrait = {
  /** Public URL of the shared flower inventory sprite sheet. */
  sheetUrl: string;
  /** CSS background-size for one cell filling the box. */
  backgroundSizeCss: string;
  /** CSS background-position selecting the sampled cell. */
  backgroundPositionCss: string;
};

/**
 * Builds the CSS sprite crop for one flower species portrait, or null when
 * the species has no registered sprite cell.
 */
export function resolvingPlazaHerbariumFlowerPortrait(
  speciesId: WorldFlowerSpeciesId
): PlazaHerbariumFlowerPortrait | null {
  const itemTypeId = DEFINING_WORLD_PLAZA_FLOWER_SPECIES_TO_ITEM_TYPE_ID[speciesId];
  const icon = resolvingWorldPlazaInventoryFlowerSpriteSheetIcon(itemTypeId);

  if (!icon) {
    return null;
  }

  const columnPercent =
    (icon.columnIndex /
      (DEFINING_WORLD_PLAZA_INVENTORY_FLOWER_SPRITE_SHEET_COLUMN_COUNT - 1)) *
    100;
  const rowPercent =
    (icon.rowIndex /
      (DEFINING_WORLD_PLAZA_INVENTORY_FLOWER_SPRITE_SHEET_ROW_COUNT - 1)) *
    100;

  return {
    sheetUrl: DEFINING_WORLD_PLAZA_INVENTORY_FLOWER_SPRITE_SHEET_URL,
    backgroundSizeCss: `${DEFINING_WORLD_PLAZA_INVENTORY_FLOWER_SPRITE_SHEET_COLUMN_COUNT * 100}% ${DEFINING_WORLD_PLAZA_INVENTORY_FLOWER_SPRITE_SHEET_ROW_COUNT * 100}%`,
    backgroundPositionCss: `${columnPercent}% ${rowPercent}%`,
  };
}
