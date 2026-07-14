import {
  DEFINING_WORLD_PLAZA_BERRY_LOOT_KIND_TO_ITEM_TYPE_ID,
  resolvingWorldPlazaInventoryBerrySpriteSheetIcon,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryBerrySpriteSheetConstants';
import { resolvingWorldPlazaInventoryTeaLeavesSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryTeaLeavesSpriteSheetConstants';
import type { WorldShrubBerryLootKind } from '../../../../shared/worldShrubBerryLoot';

export type PlazaHerbariumBerryPortrait = {
  readonly sheetUrl: string;
  readonly backgroundSizeCss: string;
  readonly backgroundPositionCss: string;
};

/**
 * Resolves CSS crop for one berry/tea loot kind from the inventory sprite sheets.
 *
 * Tea leaves live on a separate 1x1 sheet; the other three kinds share the
 * 3x1 berry sheet.
 */
export function resolvingPlazaHerbariumBerryPortrait(
  berryLootKind: WorldShrubBerryLootKind
): PlazaHerbariumBerryPortrait | null {
  const itemTypeId =
    DEFINING_WORLD_PLAZA_BERRY_LOOT_KIND_TO_ITEM_TYPE_ID[berryLootKind];
  const icon =
    resolvingWorldPlazaInventoryBerrySpriteSheetIcon(itemTypeId) ??
    resolvingWorldPlazaInventoryTeaLeavesSpriteSheetIcon(itemTypeId);

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
