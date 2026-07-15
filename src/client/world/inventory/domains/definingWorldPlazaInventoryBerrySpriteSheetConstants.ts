import {
  DEFINING_WORLD_PLAZA_FORAGE_LOOT_KIND_TO_ITEM_TYPE_ID,
  resolvingWorldPlazaForageItemTypeIdFromLootKind,
} from '@/components/world/inventory/domains/definingWorldPlazaForageLootKindMapping';
import { resolvingWorldPlazaInventoryExtendedBerrySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryExtendedBerrySpriteSheetConstants';
import { resolvingWorldPlazaInventoryExtendedLeafSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryExtendedLeafSpriteSheetConstants';
import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_BLUE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_GOLDEN,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RED,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { resolvingWorldPlazaInventoryTeaLeavesSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryTeaLeavesSpriteSheetConstants';
import type { WorldShrubBerryLootKind } from '../../../../shared/worldShrubBerryLoot';

/**
 * Berry inventory sprite sheet (3×1 @ 32px).
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryBerrySpriteSheetConstants
 */

export const DEFINING_WORLD_PLAZA_INVENTORY_BERRY_SPRITE_SHEET_URL =
  '/inventory/sprites/inventory-berry-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_BERRY_SPRITE_SHEET_COLUMN_COUNT = 3;
export const DEFINING_WORLD_PLAZA_INVENTORY_BERRY_SPRITE_SHEET_ROW_COUNT = 1;

export const DEFINING_WORLD_PLAZA_INVENTORY_BERRY_SPRITE_SHEET_TYPE_IDS = [
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RED,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_BLUE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_GOLDEN,
] as const;

const DEFINING_WORLD_PLAZA_INVENTORY_BERRY_SPRITE_INDEX_BY_TYPE_ID = new Map<
  string,
  number
>(
  DEFINING_WORLD_PLAZA_INVENTORY_BERRY_SPRITE_SHEET_TYPE_IDS.map(
    (typeId, index) => [typeId, index]
  )
);

/** @deprecated Use DEFINING_WORLD_PLAZA_FORAGE_LOOT_KIND_TO_ITEM_TYPE_ID */
export const DEFINING_WORLD_PLAZA_BERRY_LOOT_KIND_TO_ITEM_TYPE_ID =
  DEFINING_WORLD_PLAZA_FORAGE_LOOT_KIND_TO_ITEM_TYPE_ID;

export function resolvingWorldPlazaInventoryBerrySpriteSheetIcon(
  itemTypeId: string
): DefiningWorldPlazaInventorySpriteSheetIcon | null {
  const sheetIndex =
    DEFINING_WORLD_PLAZA_INVENTORY_BERRY_SPRITE_INDEX_BY_TYPE_ID.get(
      itemTypeId
    );

  if (sheetIndex === undefined) {
    return null;
  }

  const columnIndex =
    sheetIndex % DEFINING_WORLD_PLAZA_INVENTORY_BERRY_SPRITE_SHEET_COLUMN_COUNT;
  const rowIndex = Math.floor(
    sheetIndex / DEFINING_WORLD_PLAZA_INVENTORY_BERRY_SPRITE_SHEET_COLUMN_COUNT
  );

  return {
    spriteSheetUrl: DEFINING_WORLD_PLAZA_INVENTORY_BERRY_SPRITE_SHEET_URL,
    columnCount: DEFINING_WORLD_PLAZA_INVENTORY_BERRY_SPRITE_SHEET_COLUMN_COUNT,
    rowCount: DEFINING_WORLD_PLAZA_INVENTORY_BERRY_SPRITE_SHEET_ROW_COUNT,
    columnIndex,
    rowIndex,
  };
}

/** Resolves icon from legacy berry, extended berry, extended leaf, or tea sheets. */
export function resolvingWorldPlazaInventoryForageSpriteSheetIcon(
  itemTypeId: string
): DefiningWorldPlazaInventorySpriteSheetIcon | null {
  return (
    resolvingWorldPlazaInventoryBerrySpriteSheetIcon(itemTypeId) ??
    resolvingWorldPlazaInventoryExtendedBerrySpriteSheetIcon(itemTypeId) ??
    resolvingWorldPlazaInventoryExtendedLeafSpriteSheetIcon(itemTypeId) ??
    resolvingWorldPlazaInventoryTeaLeavesSpriteSheetIcon(itemTypeId)
  );
}

export function resolvingWorldPlazaBerryItemTypeIdFromLootKind(
  lootKind: WorldShrubBerryLootKind
): string {
  return resolvingWorldPlazaForageItemTypeIdFromLootKind(lootKind);
}
