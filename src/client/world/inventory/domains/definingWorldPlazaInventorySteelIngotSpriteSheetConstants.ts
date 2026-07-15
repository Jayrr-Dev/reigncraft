import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';

/**
 * Steel ingot inventory glyph (1×1 @ 32px).
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventorySteelIngotSpriteSheetConstants
 */

export const DEFINING_WORLD_PLAZA_INVENTORY_STEEL_INGOT_SPRITE_SHEET_URL =
  '/inventory/sprites/inventory-steel-ingot-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_STEEL_INGOT_SPRITE_SHEET_COLUMN_COUNT = 1;
export const DEFINING_WORLD_PLAZA_INVENTORY_STEEL_INGOT_SPRITE_SHEET_ROW_COUNT = 1;

/** Single-cell crop for the steel ingot inventory icon. */
export const DEFINING_WORLD_PLAZA_INVENTORY_STEEL_INGOT_SPRITE_SHEET_ICON = {
  spriteSheetUrl: DEFINING_WORLD_PLAZA_INVENTORY_STEEL_INGOT_SPRITE_SHEET_URL,
  columnCount:
    DEFINING_WORLD_PLAZA_INVENTORY_STEEL_INGOT_SPRITE_SHEET_COLUMN_COUNT,
  rowCount: DEFINING_WORLD_PLAZA_INVENTORY_STEEL_INGOT_SPRITE_SHEET_ROW_COUNT,
  columnIndex: 0,
  rowIndex: 0,
} as const satisfies DefiningWorldPlazaInventorySpriteSheetIcon;
