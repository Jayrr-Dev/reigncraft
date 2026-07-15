import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BREWED_CLAY_TEAPOT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_BOTTLE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_TEAPOT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_TEAPOT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_BOTTLE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_CUP,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_TEAPOT,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

/**
 * Ceramics ware inventory sprite sheet (5×1 @ 32px):
 * wet cup, wet teapot, empty teapot, wet bottle, empty bottle.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryCeramicsSpriteSheetConstants
 */

export const DEFINING_WORLD_PLAZA_INVENTORY_CERAMICS_SPRITE_SHEET_URL =
  '/inventory/sprites/inventory-ceramics-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_CERAMICS_SPRITE_SHEET_COLUMN_COUNT = 5;
export const DEFINING_WORLD_PLAZA_INVENTORY_CERAMICS_SPRITE_SHEET_ROW_COUNT = 1;

export const DEFINING_WORLD_PLAZA_INVENTORY_CERAMICS_SPRITE_SHEET_TYPE_IDS = [
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_CUP,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_TEAPOT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_TEAPOT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_BOTTLE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_BOTTLE,
] as const;

/** Watered / brewed teapots reuse the fired empty teapot cell until distinct art ships. */
const DEFINING_WORLD_PLAZA_INVENTORY_CERAMICS_SPRITE_ALIAS_TYPE_IDS: Readonly<
  Record<string, string>
> = {
  [DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_TEAPOT]:
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_TEAPOT,
  [DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BREWED_CLAY_TEAPOT]:
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_TEAPOT,
};

const DEFINING_WORLD_PLAZA_INVENTORY_CERAMICS_SPRITE_INDEX_BY_TYPE_ID = new Map<
  string,
  number
>(
  DEFINING_WORLD_PLAZA_INVENTORY_CERAMICS_SPRITE_SHEET_TYPE_IDS.map(
    (typeId, index) => [typeId, index]
  )
);

export function resolvingWorldPlazaInventoryCeramicsSpriteSheetIcon(
  itemTypeId: string
): DefiningWorldPlazaInventorySpriteSheetIcon | null {
  const resolvedTypeId =
    DEFINING_WORLD_PLAZA_INVENTORY_CERAMICS_SPRITE_ALIAS_TYPE_IDS[itemTypeId] ??
    itemTypeId;
  const sheetIndex =
    DEFINING_WORLD_PLAZA_INVENTORY_CERAMICS_SPRITE_INDEX_BY_TYPE_ID.get(
      resolvedTypeId
    );

  if (sheetIndex === undefined) {
    return null;
  }

  const columnIndex =
    sheetIndex %
    DEFINING_WORLD_PLAZA_INVENTORY_CERAMICS_SPRITE_SHEET_COLUMN_COUNT;
  const rowIndex = Math.floor(
    sheetIndex /
      DEFINING_WORLD_PLAZA_INVENTORY_CERAMICS_SPRITE_SHEET_COLUMN_COUNT
  );

  return {
    spriteSheetUrl: DEFINING_WORLD_PLAZA_INVENTORY_CERAMICS_SPRITE_SHEET_URL,
    columnCount:
      DEFINING_WORLD_PLAZA_INVENTORY_CERAMICS_SPRITE_SHEET_COLUMN_COUNT,
    rowCount: DEFINING_WORLD_PLAZA_INVENTORY_CERAMICS_SPRITE_SHEET_ROW_COUNT,
    columnIndex,
    rowIndex,
  };
}
