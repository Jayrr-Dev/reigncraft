/**
 * All-or-nothing ingredient consumption for craft recipes.
 *
 * @module components/world/crafting/domains/consumingWorldPlazaCraftRecipeIngredients
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { checkingWorldPlazaCraftRecipeAffordable } from '@/components/world/crafting/domains/checkingWorldPlazaCraftRecipeAffordable';
import type { DefiningWorldPlazaCraftModeRecipeDefinition } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { consumingWorldPlazaInventoryItemByType } from '@/components/world/inventory/domains/consumingWorldPlazaInventoryItemByType';

export type ConsumingWorldPlazaCraftRecipeIngredientsResult =
  | {
      readonly outcome: 'consumed';
      readonly nextState: DefiningInventoryState;
    }
  | {
      readonly outcome: 'missing-materials';
    };

/**
 * Consumes every ingredient row atomically, or returns the original state.
 *
 * @param inventoryState - Current inventory state
 * @param recipeDefinition - Recipe whose ingredients should be consumed
 */
export function consumingWorldPlazaCraftRecipeIngredients(
  inventoryState: DefiningInventoryState,
  recipeDefinition: DefiningWorldPlazaCraftModeRecipeDefinition
): ConsumingWorldPlazaCraftRecipeIngredientsResult {
  if (
    !checkingWorldPlazaCraftRecipeAffordable(inventoryState, recipeDefinition)
  ) {
    return { outcome: 'missing-materials' };
  }

  let nextState = inventoryState;

  for (const ingredient of recipeDefinition.ingredients) {
    const consumeResult = consumingWorldPlazaInventoryItemByType(
      nextState,
      ingredient.itemTypeId,
      ingredient.quantity
    );

    if (!consumeResult.consumed) {
      return { outcome: 'missing-materials' };
    }

    nextState = consumeResult.nextState;
  }

  return {
    outcome: 'consumed',
    nextState,
  };
}
