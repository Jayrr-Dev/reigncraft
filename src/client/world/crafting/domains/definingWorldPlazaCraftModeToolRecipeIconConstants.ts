/**
 * Tools Asset 16x16 sheet cells for blacksmith tool recipe emblems.
 *
 * Source pack: `public/inventory/Tools Asset 16x16/` (Selected Full Sheet).
 * Copied to a space-free public URL for runtime serving.
 *
 * Sheet layout (10×6 of 16px cells): material sets of
 * pickaxe, sword, shovel, hammer, axe — then misc (fishing rod at index 31).
 *
 * @module components/world/crafting/domains/definingWorldPlazaCraftModeToolRecipeIconConstants
 */

import type { DefiningWorldPlazaCraftModeToolRecipeFamily } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeToolRecipeConstants';
import type { DefiningWorldPlazaHeldItemTier } from '@/components/world/equipment/domains/definingWorldPlazaHeldItemTypes';
import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';

/** Space-free copy of the Selected Full Sheet (10×6 × 16px). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_SPRITE_SHEET_URL =
  '/inventory/sprites/inventory-tools-asset-16x16.png' as const;

export const DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_SPRITE_SHEET_COLUMN_COUNT = 10;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_SPRITE_SHEET_ROW_COUNT = 6;

/** Linear cell index of the first tool in each material set. */
const DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_TIER_BASE_INDEX: Record<
  DefiningWorldPlazaHeldItemTier,
  number
> = {
  wood: 0,
  iron: 5,
  /** Copper set on the pack sheet (between iron grey and gold). */
  steel: 10,
  gold: 15,
};

/**
 * Offset within a 5-tool material set.
 * Pack has shovel/hammer instead of hoe/scythe — closest shapes.
 */
const DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_FAMILY_OFFSET: Record<
  DefiningWorldPlazaCraftModeToolRecipeFamily,
  number
> = {
  pickaxe: 0,
  sword: 1,
  hoe: 2,
  scythe: 3,
  axe: 4,
  /** Single fishing-rod cell (not tier-colored on the pack sheet). */
  fishrod: 31,
};

/**
 * Resolves the cookbook / Guides sprite-sheet cell for one tool recipe.
 */
export function resolvingWorldPlazaCraftModeToolRecipeSpriteSheetIcon(
  family: DefiningWorldPlazaCraftModeToolRecipeFamily,
  tier: DefiningWorldPlazaHeldItemTier
): DefiningWorldPlazaInventorySpriteSheetIcon {
  const linearIndex =
    family === 'fishrod'
      ? DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_FAMILY_OFFSET.fishrod
      : DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_TIER_BASE_INDEX[tier] +
        DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_FAMILY_OFFSET[family];

  const columnIndex =
    linearIndex %
    DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_SPRITE_SHEET_COLUMN_COUNT;
  const rowIndex = Math.floor(
    linearIndex /
      DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_SPRITE_SHEET_COLUMN_COUNT
  );

  return {
    spriteSheetUrl:
      DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_SPRITE_SHEET_URL,
    columnCount:
      DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_SPRITE_SHEET_COLUMN_COUNT,
    rowCount:
      DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_SPRITE_SHEET_ROW_COUNT,
    columnIndex,
    rowIndex,
  };
}
