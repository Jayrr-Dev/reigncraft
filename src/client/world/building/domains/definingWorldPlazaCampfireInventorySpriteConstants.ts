import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';

/**
 * Cookbook / Recipes-guide HQ campfire glyph (1x1 @ 64px).
 *
 * @module components/world/building/domains/definingWorldPlazaCampfireInventorySpriteConstants
 */

export const DEFINING_WORLD_PLAZA_CAMPFIRE_INVENTORY_SPRITE_SHEET_URL =
  '/inventory/sprites/inventory-campfire-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_CAMPFIRE_INVENTORY_SPRITE_SHEET_COLUMN_COUNT = 1;
export const DEFINING_WORLD_PLAZA_CAMPFIRE_INVENTORY_SPRITE_SHEET_ROW_COUNT = 1;

/**
 * Resolves the 64px cookbook glyph for the campfire craft recipe.
 */
export function resolvingWorldPlazaCampfireInventorySpriteSheetIcon(): DefiningWorldPlazaInventorySpriteSheetIcon {
  return {
    spriteSheetUrl: DEFINING_WORLD_PLAZA_CAMPFIRE_INVENTORY_SPRITE_SHEET_URL,
    columnCount:
      DEFINING_WORLD_PLAZA_CAMPFIRE_INVENTORY_SPRITE_SHEET_COLUMN_COUNT,
    rowCount: DEFINING_WORLD_PLAZA_CAMPFIRE_INVENTORY_SPRITE_SHEET_ROW_COUNT,
    columnIndex: 0,
    rowIndex: 0,
  };
}
