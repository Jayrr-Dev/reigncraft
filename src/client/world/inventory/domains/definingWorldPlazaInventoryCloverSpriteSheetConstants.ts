import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLOVER_3_LEAF,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLOVER_4_LEAF,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import type { WorldCloverSearchLootKind } from '../../../../shared/worldCloverSearchLoot';

/**
 * Clover inventory sprite sheet (2×1 @ 32px).
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryCloverSpriteSheetConstants
 */

export const DEFINING_WORLD_PLAZA_INVENTORY_CLOVER_SPRITE_SHEET_URL =
  '/inventory/sprites/inventory-clover-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_CLOVER_SPRITE_SHEET_COLUMN_COUNT = 2;
export const DEFINING_WORLD_PLAZA_INVENTORY_CLOVER_SPRITE_SHEET_ROW_COUNT = 1;

export const DEFINING_WORLD_PLAZA_INVENTORY_CLOVER_SPRITE_SHEET_TYPE_IDS = [
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLOVER_3_LEAF,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLOVER_4_LEAF,
] as const;

const DEFINING_WORLD_PLAZA_INVENTORY_CLOVER_SPRITE_INDEX_BY_TYPE_ID = new Map<
  string,
  number
>(
  DEFINING_WORLD_PLAZA_INVENTORY_CLOVER_SPRITE_SHEET_TYPE_IDS.map(
    (typeId, index) => [typeId, index]
  )
);

export const DEFINING_WORLD_PLAZA_CLOVER_LOOT_KIND_TO_ITEM_TYPE_ID: Record<
  WorldCloverSearchLootKind,
  (typeof DEFINING_WORLD_PLAZA_INVENTORY_CLOVER_SPRITE_SHEET_TYPE_IDS)[number]
> = {
  three_leaf: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLOVER_3_LEAF,
  four_leaf: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLOVER_4_LEAF,
};

export function resolvingWorldPlazaInventoryCloverSpriteSheetIcon(
  itemTypeId: string
): DefiningWorldPlazaInventorySpriteSheetIcon | null {
  const sheetIndex =
    DEFINING_WORLD_PLAZA_INVENTORY_CLOVER_SPRITE_INDEX_BY_TYPE_ID.get(itemTypeId);

  if (sheetIndex === undefined) {
    return null;
  }

  const columnIndex =
    sheetIndex % DEFINING_WORLD_PLAZA_INVENTORY_CLOVER_SPRITE_SHEET_COLUMN_COUNT;
  const rowIndex = Math.floor(
    sheetIndex / DEFINING_WORLD_PLAZA_INVENTORY_CLOVER_SPRITE_SHEET_COLUMN_COUNT
  );

  return {
    spriteSheetUrl: DEFINING_WORLD_PLAZA_INVENTORY_CLOVER_SPRITE_SHEET_URL,
    columnCount: DEFINING_WORLD_PLAZA_INVENTORY_CLOVER_SPRITE_SHEET_COLUMN_COUNT,
    rowCount: DEFINING_WORLD_PLAZA_INVENTORY_CLOVER_SPRITE_SHEET_ROW_COUNT,
    columnIndex,
    rowIndex,
  };
}

export function resolvingWorldPlazaCloverItemTypeIdFromLootKind(
  lootKind: WorldCloverSearchLootKind
): string {
  return DEFINING_WORLD_PLAZA_CLOVER_LOOT_KIND_TO_ITEM_TYPE_ID[lootKind];
}
