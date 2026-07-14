/**
 * Cookbook recipe-page sprite sheet (themed loose pages).
 *
 * @module components/world/crafting/domains/definingWorldPlazaCraftRecipePageSpriteSheetConstants
 */

import {
  DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID,
  type DefiningWorldPlazaCraftModeCookbookId,
} from '@/components/world/building/domains/definingWorldPlazaCraftModeCookbookRegistry';
import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';

/** Loose recipe-page icons (Survival / Blacksmith / Healer / Ceramics). */
export const DEFINING_WORLD_PLAZA_CRAFT_RECIPE_PAGE_SPRITE_SHEET_URL =
  '/inventory/sprites/inventory-cookbook-page-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_CRAFT_RECIPE_PAGE_SPRITE_SHEET_COLUMN_COUNT = 4;
export const DEFINING_WORLD_PLAZA_CRAFT_RECIPE_PAGE_SPRITE_SHEET_ROW_COUNT = 1;

const DEFINING_WORLD_PLAZA_CRAFT_RECIPE_PAGE_SPRITE_COLUMN_BY_COOKBOOK = {
  [DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.SURVIVAL]: 0,
  [DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.BLACKSMITH]: 1,
  [DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.HEALER]: 2,
  [DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.CERAMICS]: 3,
} as const satisfies Record<DefiningWorldPlazaCraftModeCookbookId, number>;

/**
 * Resolves the 32px page glyph for one cookbook theme.
 *
 * @param cookbookId - Cookbook the recipe belongs to
 */
export function resolvingWorldPlazaCraftRecipePageSpriteSheetIcon(
  cookbookId: DefiningWorldPlazaCraftModeCookbookId
): DefiningWorldPlazaInventorySpriteSheetIcon {
  return {
    spriteSheetUrl: DEFINING_WORLD_PLAZA_CRAFT_RECIPE_PAGE_SPRITE_SHEET_URL,
    columnCount:
      DEFINING_WORLD_PLAZA_CRAFT_RECIPE_PAGE_SPRITE_SHEET_COLUMN_COUNT,
    rowCount: DEFINING_WORLD_PLAZA_CRAFT_RECIPE_PAGE_SPRITE_SHEET_ROW_COUNT,
    columnIndex:
      DEFINING_WORLD_PLAZA_CRAFT_RECIPE_PAGE_SPRITE_COLUMN_BY_COOKBOOK[
        cookbookId
      ],
    rowIndex: 0,
  };
}
