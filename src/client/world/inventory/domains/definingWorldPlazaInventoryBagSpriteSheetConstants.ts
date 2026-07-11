/**
 * Sprite-sheet cells for plaza inventory bag icons.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryBagSpriteSheetConstants
 */

import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EXPEDITION_BAG,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PACK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_POUCH,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RUCKSACK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SATCHEL,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

export const DEFINING_WORLD_PLAZA_INVENTORY_BAG_SPRITE_SHEET_URL =
  '/inventory/sprites/inventory-bag-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_BAG_SPRITE_SHEET_COLUMN_COUNT = 5;
export const DEFINING_WORLD_PLAZA_INVENTORY_BAG_SPRITE_SHEET_ROW_COUNT = 1;

/** Bag type ids in sheet order: left → right, smallest → largest. */
export const DEFINING_WORLD_PLAZA_INVENTORY_BAG_SPRITE_SHEET_TYPE_IDS = [
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_POUCH,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SATCHEL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PACK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RUCKSACK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EXPEDITION_BAG,
] as const;

/** Resolves the 32px sprite-sheet cell for one bag item type. */
export function resolvingWorldPlazaInventoryBagSpriteSheetIcon(
  itemTypeId: string
): DefiningWorldPlazaInventorySpriteSheetIcon | null {
  const spriteIndex =
    DEFINING_WORLD_PLAZA_INVENTORY_BAG_SPRITE_SHEET_TYPE_IDS.findIndex(
      (typeId) => typeId === itemTypeId
    );

  if (spriteIndex < 0) {
    return null;
  }

  return {
    spriteSheetUrl: DEFINING_WORLD_PLAZA_INVENTORY_BAG_SPRITE_SHEET_URL,
    columnCount: DEFINING_WORLD_PLAZA_INVENTORY_BAG_SPRITE_SHEET_COLUMN_COUNT,
    rowCount: DEFINING_WORLD_PLAZA_INVENTORY_BAG_SPRITE_SHEET_ROW_COUNT,
    columnIndex: spriteIndex,
    rowIndex: 0,
  };
}
