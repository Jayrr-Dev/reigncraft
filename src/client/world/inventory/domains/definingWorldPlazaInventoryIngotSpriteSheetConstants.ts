import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_COPPER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_GOLD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_LEAD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_SILVER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_MERCURY,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

/**
 * Refined metal / mercury inventory sprite sheet (3×2 @ 32px).
 *
 * Order: iron, copper, silver, gold, lead, mercury.
 * Scarlet ore refines to mercury (not an ingot bar).
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryIngotSpriteSheetConstants
 */

export const DEFINING_WORLD_PLAZA_INVENTORY_INGOT_SPRITE_SHEET_URL =
  '/inventory/sprites/inventory-ingot-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_INGOT_SPRITE_SHEET_COLUMN_COUNT = 3;
export const DEFINING_WORLD_PLAZA_INVENTORY_INGOT_SPRITE_SHEET_ROW_COUNT = 2;

/** Sprite sheet cell order (matches art export). */
export const DEFINING_WORLD_PLAZA_INVENTORY_INGOT_SPRITE_SHEET_TYPE_IDS = [
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_COPPER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_SILVER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_GOLD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_LEAD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_MERCURY,
] as const;

const DEFINING_WORLD_PLAZA_INVENTORY_INGOT_SPRITE_INDEX_BY_TYPE_ID = new Map<
  string,
  number
>(
  DEFINING_WORLD_PLAZA_INVENTORY_INGOT_SPRITE_SHEET_TYPE_IDS.map(
    (typeId, index) => [typeId, index]
  )
);

/**
 * Resolves sprite crop for one ingot / mercury item type.
 */
export function resolvingWorldPlazaInventoryIngotSpriteSheetIcon(
  itemTypeId: string
): DefiningWorldPlazaInventorySpriteSheetIcon | null {
  const sheetIndex =
    DEFINING_WORLD_PLAZA_INVENTORY_INGOT_SPRITE_INDEX_BY_TYPE_ID.get(itemTypeId);

  if (sheetIndex === undefined) {
    return null;
  }

  const columnIndex =
    sheetIndex % DEFINING_WORLD_PLAZA_INVENTORY_INGOT_SPRITE_SHEET_COLUMN_COUNT;
  const rowIndex = Math.floor(
    sheetIndex / DEFINING_WORLD_PLAZA_INVENTORY_INGOT_SPRITE_SHEET_COLUMN_COUNT
  );

  return {
    spriteSheetUrl: DEFINING_WORLD_PLAZA_INVENTORY_INGOT_SPRITE_SHEET_URL,
    columnCount: DEFINING_WORLD_PLAZA_INVENTORY_INGOT_SPRITE_SHEET_COLUMN_COUNT,
    rowCount: DEFINING_WORLD_PLAZA_INVENTORY_INGOT_SPRITE_SHEET_ROW_COUNT,
    columnIndex,
    rowIndex,
  };
}
