/**
 * Checks whether inventory can afford one craft recipe.
 *
 * @module components/world/crafting/domains/checkingWorldPlazaCraftRecipeAffordable
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { countingWorldPlazaInventoryItemTypeQuantity } from '@/components/world/crafting/domains/countingWorldPlazaInventoryItemTypeQuantity';
import type { DefiningWorldPlazaCraftModeRecipeDefinition } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';

/**
 * Returns true when every ingredient row is satisfied.
 *
 * @param inventoryState - Current inventory state
 * @param recipeDefinition - Recipe to validate
 */
export function checkingWorldPlazaCraftRecipeAffordable(
  inventoryState: DefiningInventoryState,
  recipeDefinition: DefiningWorldPlazaCraftModeRecipeDefinition
): boolean {
  return recipeDefinition.ingredients.every((ingredient) => {
    const ownedQuantity = countingWorldPlazaInventoryItemTypeQuantity(
      inventoryState,
      ingredient.itemTypeId
    );

    return ownedQuantity >= ingredient.quantity;
  });
}
