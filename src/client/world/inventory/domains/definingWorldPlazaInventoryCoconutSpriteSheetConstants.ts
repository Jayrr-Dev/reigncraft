/**
 * Coconut inventory sprite sheet (2×1 @ 32px): raw, cooked.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryCoconutSpriteSheetConstants
 */

import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COCONUT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COOKED_COCONUT,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

export const DEFINING_WORLD_PLAZA_INVENTORY_COCONUT_SPRITE_SHEET_URL =
  '/inventory/sprites/inventory-coconut-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_COCONUT_SPRITE_SHEET_COLUMN_COUNT = 2;
export const DEFINING_WORLD_PLAZA_INVENTORY_COCONUT_SPRITE_SHEET_ROW_COUNT = 1;

export const DEFINING_WORLD_PLAZA_INVENTORY_COCONUT_SPRITE_SHEET_TYPE_IDS = [
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COCONUT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COOKED_COCONUT,
] as const;

const DEFINING_WORLD_PLAZA_INVENTORY_COCONUT_SPRITE_INDEX_BY_TYPE_ID = new Map<
  string,
  number
>(
  DEFINING_WORLD_PLAZA_INVENTORY_COCONUT_SPRITE_SHEET_TYPE_IDS.map(
    (typeId, index) => [typeId, index]
  )
);

export function resolvingWorldPlazaInventoryCoconutSpriteSheetIcon(
  itemTypeId: string
): DefiningWorldPlazaInventorySpriteSheetIcon | null {
  const sheetIndex =
    DEFINING_WORLD_PLAZA_INVENTORY_COCONUT_SPRITE_INDEX_BY_TYPE_ID.get(
      itemTypeId
    );

  if (sheetIndex === undefined) {
    return null;
  }

  const columnIndex =
    sheetIndex %
    DEFINING_WORLD_PLAZA_INVENTORY_COCONUT_SPRITE_SHEET_COLUMN_COUNT;
  const rowIndex = Math.floor(
    sheetIndex /
      DEFINING_WORLD_PLAZA_INVENTORY_COCONUT_SPRITE_SHEET_COLUMN_COUNT
  );

  return {
    spriteSheetUrl: DEFINING_WORLD_PLAZA_INVENTORY_COCONUT_SPRITE_SHEET_URL,
    columnCount:
      DEFINING_WORLD_PLAZA_INVENTORY_COCONUT_SPRITE_SHEET_COLUMN_COUNT,
    rowCount: DEFINING_WORLD_PLAZA_INVENTORY_COCONUT_SPRITE_SHEET_ROW_COUNT,
    columnIndex,
    rowIndex,
  };
}
