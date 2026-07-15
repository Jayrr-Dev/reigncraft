import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';

/**
 * Spritcore inventory glyph (1×1 @ 32px).
 *
 * @module components/world/spritcore/domains/definingWorldPlazaSpritcoreSpriteSheetConstants
 */

export const DEFINING_WORLD_PLAZA_INVENTORY_SPRITCORE_SPRITE_SHEET_URL =
  '/inventory/sprites/inventory-spritcore-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_SPRITCORE_SPRITE_SHEET_COLUMN_COUNT = 1;
export const DEFINING_WORLD_PLAZA_INVENTORY_SPRITCORE_SPRITE_SHEET_ROW_COUNT = 1;

/** Single-cell crop for the Spritcore inventory icon. */
export const DEFINING_WORLD_PLAZA_INVENTORY_SPRITCORE_SPRITE_SHEET_ICON = {
  spriteSheetUrl: DEFINING_WORLD_PLAZA_INVENTORY_SPRITCORE_SPRITE_SHEET_URL,
  columnCount:
    DEFINING_WORLD_PLAZA_INVENTORY_SPRITCORE_SPRITE_SHEET_COLUMN_COUNT,
  rowCount: DEFINING_WORLD_PLAZA_INVENTORY_SPRITCORE_SPRITE_SHEET_ROW_COUNT,
  columnIndex: 0,
  rowIndex: 0,
} as const satisfies DefiningWorldPlazaInventorySpriteSheetIcon;
