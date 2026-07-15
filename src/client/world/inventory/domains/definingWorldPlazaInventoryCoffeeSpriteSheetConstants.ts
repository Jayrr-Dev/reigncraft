import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BREWED_COFFEE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COFFEE_BEANS,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CUP_OF_TEA,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_CUP,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

/**
 * Coffee inventory sprite sheet (3×1 @ 32px): beans, brewed cup, empty cup.
 * Cup of tea reuses the brewed coffee cell until dedicated art ships.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryCoffeeSpriteSheetConstants
 */

export const DEFINING_WORLD_PLAZA_INVENTORY_COFFEE_SPRITE_SHEET_URL =
  '/inventory/sprites/inventory-coffee-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_COFFEE_SPRITE_SHEET_COLUMN_COUNT = 3;
export const DEFINING_WORLD_PLAZA_INVENTORY_COFFEE_SPRITE_SHEET_ROW_COUNT = 1;

export const DEFINING_WORLD_PLAZA_INVENTORY_COFFEE_SPRITE_SHEET_TYPE_IDS = [
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COFFEE_BEANS,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BREWED_COFFEE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_CUP,
] as const;

const DEFINING_WORLD_PLAZA_INVENTORY_COFFEE_SPRITE_ALIAS_TYPE_IDS: Readonly<
  Record<string, string>
> = {
  [DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CUP_OF_TEA]:
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BREWED_COFFEE,
};

const DEFINING_WORLD_PLAZA_INVENTORY_COFFEE_SPRITE_INDEX_BY_TYPE_ID = new Map<
  string,
  number
>(
  DEFINING_WORLD_PLAZA_INVENTORY_COFFEE_SPRITE_SHEET_TYPE_IDS.map(
    (typeId, index) => [typeId, index]
  )
);

export function resolvingWorldPlazaInventoryCoffeeSpriteSheetIcon(
  itemTypeId: string
): DefiningWorldPlazaInventorySpriteSheetIcon | null {
  const resolvedTypeId =
    DEFINING_WORLD_PLAZA_INVENTORY_COFFEE_SPRITE_ALIAS_TYPE_IDS[itemTypeId] ??
    itemTypeId;
  const sheetIndex =
    DEFINING_WORLD_PLAZA_INVENTORY_COFFEE_SPRITE_INDEX_BY_TYPE_ID.get(
      resolvedTypeId
    );

  if (sheetIndex === undefined) {
    return null;
  }

  const columnIndex =
    sheetIndex % DEFINING_WORLD_PLAZA_INVENTORY_COFFEE_SPRITE_SHEET_COLUMN_COUNT;
  const rowIndex = Math.floor(
    sheetIndex /
      DEFINING_WORLD_PLAZA_INVENTORY_COFFEE_SPRITE_SHEET_COLUMN_COUNT
  );

  return {
    spriteSheetUrl: DEFINING_WORLD_PLAZA_INVENTORY_COFFEE_SPRITE_SHEET_URL,
    columnCount: DEFINING_WORLD_PLAZA_INVENTORY_COFFEE_SPRITE_SHEET_COLUMN_COUNT,
    rowCount: DEFINING_WORLD_PLAZA_INVENTORY_COFFEE_SPRITE_SHEET_ROW_COUNT,
    columnIndex,
    rowIndex,
  };
}
