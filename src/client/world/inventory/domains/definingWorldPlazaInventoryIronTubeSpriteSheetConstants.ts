import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';

/**
 * Iron tube inventory glyph (1×1 @ 32px).
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryIronTubeSpriteSheetConstants
 */

export const DEFINING_WORLD_PLAZA_INVENTORY_IRON_TUBE_SPRITE_SHEET_URL =
  '/inventory/sprites/inventory-iron-tube-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_IRON_TUBE_SPRITE_SHEET_COLUMN_COUNT = 1;
export const DEFINING_WORLD_PLAZA_INVENTORY_IRON_TUBE_SPRITE_SHEET_ROW_COUNT = 1;

/** Single-cell crop for the iron tube inventory icon. */
export const DEFINING_WORLD_PLAZA_INVENTORY_IRON_TUBE_SPRITE_SHEET_ICON = {
  spriteSheetUrl: DEFINING_WORLD_PLAZA_INVENTORY_IRON_TUBE_SPRITE_SHEET_URL,
  columnCount:
    DEFINING_WORLD_PLAZA_INVENTORY_IRON_TUBE_SPRITE_SHEET_COLUMN_COUNT,
  rowCount: DEFINING_WORLD_PLAZA_INVENTORY_IRON_TUBE_SPRITE_SHEET_ROW_COUNT,
  columnIndex: 0,
  rowIndex: 0,
} as const satisfies DefiningWorldPlazaInventorySpriteSheetIcon;
