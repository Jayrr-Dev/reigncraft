/**
 * Declarative raw-to-cooked campfire recipes (wildlife meat + forage).
 *
 * @module components/world/wildlife/domains/definingWildlifeMeatCookRecipes
 */

import { DEFINING_WORLD_PLAZA_MUSHROOM_CATALOG } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomRegistry';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COCONUT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COOKED_COCONUT,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { DEFINING_WILDLIFE_MEAT_CATALOG } from '@/components/world/wildlife/domains/definingWildlifeMeatRegistry';
import { DEFINING_WILDLIFE_VARIANT_MEAT_CATALOG } from '@/components/world/wildlife/domains/definingWildlifeVariantMeatRegistry';

export type DefiningWildlifeMeatCookRecipe = {
  rawItemTypeId: string;
  cookedItemTypeId: string;
  cookedDisplayName: string;
  cookDurationMs: number;
};

/** Palm coconut husk → roasted split coconut. */
const DEFINING_WORLD_PLAZA_FORAGE_COOK_RECIPES: readonly DefiningWildlifeMeatCookRecipe[] =
  [
    {
      rawItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COCONUT,
      cookedItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COOKED_COCONUT,
      cookedDisplayName: 'Cooked Coconut',
      cookDurationMs: 2_000,
    },
    ...DEFINING_WORLD_PLAZA_MUSHROOM_CATALOG.map((entry) => ({
      rawItemTypeId: entry.rawItemTypeId,
      cookedItemTypeId: entry.cookedItemTypeId,
      cookedDisplayName: entry.cookedDisplayName,
      cookDurationMs: entry.cookDurationMs,
    })),
  ];

export const DEFINING_WILDLIFE_MEAT_COOK_RECIPES: readonly DefiningWildlifeMeatCookRecipe[] =
  [
    ...[
      ...DEFINING_WILDLIFE_MEAT_CATALOG,
      ...DEFINING_WILDLIFE_VARIANT_MEAT_CATALOG,
    ].map((entry) => ({
      rawItemTypeId: entry.rawItemTypeId,
      cookedItemTypeId: entry.cookedItemTypeId,
      cookedDisplayName: entry.cookedDisplayName,
      cookDurationMs: entry.cookDurationMs,
    })),
    ...DEFINING_WORLD_PLAZA_FORAGE_COOK_RECIPES,
  ];

const DEFINING_WILDLIFE_MEAT_COOK_RECIPE_BY_RAW = Object.fromEntries(
  DEFINING_WILDLIFE_MEAT_COOK_RECIPES.map((recipe) => [
    recipe.rawItemTypeId,
    recipe,
  ])
) as Record<string, DefiningWildlifeMeatCookRecipe>;

/** Resolves the cook recipe for one raw meat item type id. */
export function resolvingWildlifeMeatCookRecipeByRawItemTypeId(
  rawItemTypeId: string
): DefiningWildlifeMeatCookRecipe | null {
  return DEFINING_WILDLIFE_MEAT_COOK_RECIPE_BY_RAW[rawItemTypeId] ?? null;
}

/** First raw meat stack in slot order that has a cook recipe. */
export function resolvingFirstWildlifeMeatCookRecipeInInventory(
  slots: readonly { itemTypeId: string; quantity: number }[]
): DefiningWildlifeMeatCookRecipe | null {
  for (const slot of slots) {
    if (slot.quantity <= 0) {
      continue;
    }

    const recipe = resolvingWildlifeMeatCookRecipeByRawItemTypeId(
      slot.itemTypeId
    );

    if (recipe) {
      return recipe;
    }
  }

  return null;
}

/** First inventory slot index holding raw meat that can be cooked. */
export function resolvingFirstWildlifeMeatCookSlotIndexInInventory(
  slots: readonly ({ itemTypeId: string; quantity: number } | null)[]
): number | null {
  for (let slotIndex = 0; slotIndex < slots.length; slotIndex += 1) {
    const slot = slots[slotIndex];

    if (!slot || slot.quantity <= 0) {
      continue;
    }

    const recipe = resolvingWildlifeMeatCookRecipeByRawItemTypeId(
      slot.itemTypeId
    );

    if (recipe) {
      return slotIndex;
    }
  }

  return null;
}
