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
 * CSS filters that shift the shared brown fishrod toward each material set.
 * Wood keeps the pack colors; metal tiers approximate iron / copper-steel / gold.
 */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_FISHROD_TIER_CSS_FILTER: Record<
  DefiningWorldPlazaHeldItemTier,
  string | undefined
> = {
  wood: undefined,
  iron: 'saturate(0.2) brightness(1.18) contrast(1.12)',
  steel: 'sepia(0.6) saturate(1.9) hue-rotate(-22deg) brightness(1.02)',
  gold: 'sepia(0.9) saturate(2.6) hue-rotate(8deg) brightness(1.18)',
};

/**
 * Pack "gold" set reads copper/red; push heads toward bright yellow gold.
 * Applied to every gold-tier tool recipe (pickaxe, sword, axe, …).
 */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_GOLD_TOOL_CSS_FILTER =
  'sepia(1) saturate(3.2) hue-rotate(18deg) brightness(1.22)' as const;

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
  const cssFilter =
    family === 'fishrod'
      ? DEFINING_WORLD_PLAZA_CRAFT_MODE_FISHROD_TIER_CSS_FILTER[tier]
      : tier === 'gold'
        ? DEFINING_WORLD_PLAZA_CRAFT_MODE_GOLD_TOOL_CSS_FILTER
        : undefined;

  return {
    spriteSheetUrl:
      DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_SPRITE_SHEET_URL,
    columnCount:
      DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_SPRITE_SHEET_COLUMN_COUNT,
    rowCount:
      DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_SPRITE_SHEET_ROW_COUNT,
    columnIndex,
    rowIndex,
    ...(cssFilter ? { cssFilter } : {}),
  };
}
