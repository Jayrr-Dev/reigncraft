/**
 * Resolves the CSS crop for an ore's lapidary portrait from the shared
 * ore inventory sprite sheet (3 columns x 3 rows @ 32px).
 *
 * @module components/home/domains/resolvingPlazaLapidaryOrePortrait
 */

import {
  DEFINING_WORLD_PLAZA_INVENTORY_ORE_SPRITE_SHEET_COLUMN_COUNT,
  DEFINING_WORLD_PLAZA_INVENTORY_ORE_SPRITE_SHEET_ROW_COUNT,
  DEFINING_WORLD_PLAZA_INVENTORY_ORE_SPRITE_SHEET_URL,
  DEFINING_WORLD_PLAZA_ORE_SPECIES_TO_ITEM_TYPE_ID,
  resolvingWorldPlazaInventoryOreSpriteSheetIcon,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryOreSpriteSheetConstants';
import type { WorldOreSpeciesId } from '../../../../shared/worldOreRarity';

export type PlazaLapidaryOrePortrait = {
  /** Public URL of the shared ore inventory sprite sheet. */
  sheetUrl: string;
  /** CSS background-size for one cell filling the box. */
  backgroundSizeCss: string;
  /** CSS background-position selecting the sampled cell. */
  backgroundPositionCss: string;
};

/**
 * Builds the CSS sprite crop for one ore species portrait, or null when
 * the species has no registered sprite cell.
 */
export function resolvingPlazaLapidaryOrePortrait(
  speciesId: WorldOreSpeciesId
): PlazaLapidaryOrePortrait | null {
  const itemTypeId = DEFINING_WORLD_PLAZA_ORE_SPECIES_TO_ITEM_TYPE_ID[speciesId];
  const icon = resolvingWorldPlazaInventoryOreSpriteSheetIcon(itemTypeId);

  if (!icon) {
    return null;
  }

  const columnPercent =
    (icon.columnIndex /
      (DEFINING_WORLD_PLAZA_INVENTORY_ORE_SPRITE_SHEET_COLUMN_COUNT - 1)) *
    100;
  const rowPercent =
    (icon.rowIndex /
      (DEFINING_WORLD_PLAZA_INVENTORY_ORE_SPRITE_SHEET_ROW_COUNT - 1)) *
    100;

  return {
    sheetUrl: DEFINING_WORLD_PLAZA_INVENTORY_ORE_SPRITE_SHEET_URL,
    backgroundSizeCss: `${DEFINING_WORLD_PLAZA_INVENTORY_ORE_SPRITE_SHEET_COLUMN_COUNT * 100}% ${DEFINING_WORLD_PLAZA_INVENTORY_ORE_SPRITE_SHEET_ROW_COUNT * 100}%`,
    backgroundPositionCss: `${columnPercent}% ${rowPercent}%`,
  };
}
