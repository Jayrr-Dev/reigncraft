import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TEA_LEAVES } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

/**
 * Tea leaves inventory sprite sheet (1×1 @ 32px).
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryTeaLeavesSpriteSheetConstants
 */

export const DEFINING_WORLD_PLAZA_INVENTORY_TEA_LEAVES_SPRITE_SHEET_URL =
  '/inventory/sprites/inventory-tea-leaves-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_TEA_LEAVES_SPRITE_SHEET_COLUMN_COUNT = 1;
export const DEFINING_WORLD_PLAZA_INVENTORY_TEA_LEAVES_SPRITE_SHEET_ROW_COUNT = 1;

export function resolvingWorldPlazaInventoryTeaLeavesSpriteSheetIcon(
  itemTypeId: string
): DefiningWorldPlazaInventorySpriteSheetIcon | null {
  if (itemTypeId !== DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TEA_LEAVES) {
    return null;
  }

  return {
    spriteSheetUrl: DEFINING_WORLD_PLAZA_INVENTORY_TEA_LEAVES_SPRITE_SHEET_URL,
    columnCount:
      DEFINING_WORLD_PLAZA_INVENTORY_TEA_LEAVES_SPRITE_SHEET_COLUMN_COUNT,
    rowCount: DEFINING_WORLD_PLAZA_INVENTORY_TEA_LEAVES_SPRITE_SHEET_ROW_COUNT,
    columnIndex: 0,
    rowIndex: 0,
  };
}
