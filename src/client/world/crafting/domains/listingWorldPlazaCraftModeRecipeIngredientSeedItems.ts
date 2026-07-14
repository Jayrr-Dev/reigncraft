/**
 * Lists unique craft-recipe ingredients as inventory seed rows.
 *
 * @module components/world/crafting/domains/listingWorldPlazaCraftModeRecipeIngredientSeedItems
 */

import { DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_REGISTRY } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeRegistry';
import { DEFINING_WORLD_PLAZA_DEV_QA_CRAFT_INGREDIENT_SEED_QUANTITY } from '@/components/world/domains/definingWorldPlazaDevQaLoadConstants';
import type { DefiningWorldPlazaInventoryDemoSeedItem } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';

/**
 * Returns one seed row per distinct craft ingredient item type.
 * Quantity comes from Dev QA craft seed constants.
 */
export function listingWorldPlazaCraftModeRecipeIngredientSeedItems(
  quantity: number = DEFINING_WORLD_PLAZA_DEV_QA_CRAFT_INGREDIENT_SEED_QUANTITY
): readonly DefiningWorldPlazaInventoryDemoSeedItem[] {
  const seedQuantity = Math.max(1, Math.floor(quantity));
  const seenItemTypeIds = new Set<string>();
  const seedItems: DefiningWorldPlazaInventoryDemoSeedItem[] = [];

  for (const recipeDefinition of DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_REGISTRY) {
    for (const ingredient of recipeDefinition.ingredients) {
      if (seenItemTypeIds.has(ingredient.itemTypeId)) {
        continue;
      }

      seenItemTypeIds.add(ingredient.itemTypeId);
      seedItems.push({
        itemTypeId: ingredient.itemTypeId,
        quantity: seedQuantity,
      });
    }
  }

  return seedItems;
}
