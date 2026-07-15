import {
  DEFINING_WORLD_PLAZA_FORAGE_LOOT_KIND_TO_ITEM_TYPE_ID,
  resolvingWorldPlazaForageItemTypeIdFromLootKind,
} from '@/components/world/inventory/domains/definingWorldPlazaForageLootKindMapping';
import { resolvingWorldPlazaInventoryForageSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryBerrySpriteSheetConstants';
import type { WorldShrubBerryLootKind } from '../../../../shared/worldShrubBerryLoot';

export type PlazaHerbariumBerryPortrait = {
  readonly sheetUrl: string;
  readonly backgroundSizeCss: string;
  readonly backgroundPositionCss: string;
};

/**
 * Resolves CSS crop for one berry/tea/leaf loot kind from inventory sprite sheets.
 */
export function resolvingPlazaHerbariumBerryPortrait(
  berryLootKind: WorldShrubBerryLootKind
): PlazaHerbariumBerryPortrait | null {
  const itemTypeId =
    DEFINING_WORLD_PLAZA_FORAGE_LOOT_KIND_TO_ITEM_TYPE_ID[berryLootKind];
  const icon = resolvingWorldPlazaInventoryForageSpriteSheetIcon(itemTypeId);

  if (!icon) {
    return null;
  }

  const columnPercent =
    (icon.columnIndex / Math.max(1, icon.columnCount - 1)) * 100;
  const rowPercent = (icon.rowIndex / Math.max(1, icon.rowCount - 1)) * 100;

  return {
    sheetUrl: icon.spriteSheetUrl,
    backgroundSizeCss: `${icon.columnCount * 100}% ${icon.rowCount * 100}%`,
    backgroundPositionCss: `${columnPercent}% ${rowPercent}%`,
  };
}

/** @deprecated Use resolvingWorldPlazaForageItemTypeIdFromLootKind */
export function resolvingPlazaHerbariumBerryItemTypeIdFromLootKind(
  lootKind: WorldShrubBerryLootKind
): string {
  return resolvingWorldPlazaForageItemTypeIdFromLootKind(lootKind);
}
