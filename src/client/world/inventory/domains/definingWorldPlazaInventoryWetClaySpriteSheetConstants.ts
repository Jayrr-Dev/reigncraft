import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

/**
 * Wet clay inventory sprite sheet (1×1 @ 32px).
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryWetClaySpriteSheetConstants
 */

export const DEFINING_WORLD_PLAZA_INVENTORY_WET_CLAY_SPRITE_SHEET_URL =
  '/inventory/sprites/inventory-wet-clay-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_WET_CLAY_SPRITE_SHEET_COLUMN_COUNT = 1;
export const DEFINING_WORLD_PLAZA_INVENTORY_WET_CLAY_SPRITE_SHEET_ROW_COUNT = 1;

export function resolvingWorldPlazaInventoryWetClaySpriteSheetIcon(
  itemTypeId: string
): DefiningWorldPlazaInventorySpriteSheetIcon | null {
  if (itemTypeId !== DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY) {
    return null;
  }

  return {
    spriteSheetUrl: DEFINING_WORLD_PLAZA_INVENTORY_WET_CLAY_SPRITE_SHEET_URL,
    columnCount:
      DEFINING_WORLD_PLAZA_INVENTORY_WET_CLAY_SPRITE_SHEET_COLUMN_COUNT,
    rowCount: DEFINING_WORLD_PLAZA_INVENTORY_WET_CLAY_SPRITE_SHEET_ROW_COUNT,
    columnIndex: 0,
    rowIndex: 0,
  };
}
