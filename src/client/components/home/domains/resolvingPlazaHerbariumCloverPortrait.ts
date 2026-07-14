import {
  DEFINING_WORLD_PLAZA_INVENTORY_CLOVER_SPRITE_SHEET_COLUMN_COUNT,
  DEFINING_WORLD_PLAZA_INVENTORY_CLOVER_SPRITE_SHEET_ROW_COUNT,
  DEFINING_WORLD_PLAZA_INVENTORY_CLOVER_SPRITE_SHEET_URL,
  resolvingWorldPlazaCloverItemTypeIdFromLootKind,
  resolvingWorldPlazaInventoryCloverSpriteSheetIcon,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryCloverSpriteSheetConstants';
import type { WorldCloverSearchLootKind } from '../../../../shared/worldCloverSearchLoot';

export type PlazaHerbariumCloverPortrait = {
  readonly sheetUrl: string;
  readonly backgroundSizeCss: string;
  readonly backgroundPositionCss: string;
};

/** Resolves CSS crop for one clover kind from the inventory sprite sheet. */
export function resolvingPlazaHerbariumCloverPortrait(
  cloverKind: WorldCloverSearchLootKind
): PlazaHerbariumCloverPortrait | null {
  const icon = resolvingWorldPlazaInventoryCloverSpriteSheetIcon(
    resolvingWorldPlazaCloverItemTypeIdFromLootKind(cloverKind)
  );

  if (!icon) {
    return null;
  }

  const columnPercent =
    (icon.columnIndex /
      Math.max(
        1,
        DEFINING_WORLD_PLAZA_INVENTORY_CLOVER_SPRITE_SHEET_COLUMN_COUNT - 1
      )) *
    100;
  const rowPercent =
    (icon.rowIndex /
      Math.max(
        1,
        DEFINING_WORLD_PLAZA_INVENTORY_CLOVER_SPRITE_SHEET_ROW_COUNT - 1
      )) *
    100;

  return {
    sheetUrl: DEFINING_WORLD_PLAZA_INVENTORY_CLOVER_SPRITE_SHEET_URL,
    backgroundSizeCss: `${DEFINING_WORLD_PLAZA_INVENTORY_CLOVER_SPRITE_SHEET_COLUMN_COUNT * 100}% ${DEFINING_WORLD_PLAZA_INVENTORY_CLOVER_SPRITE_SHEET_ROW_COUNT * 100}%`,
    backgroundPositionCss: `${columnPercent}% ${rowPercent}%`,
  };
}
