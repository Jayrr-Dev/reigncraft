/**
 * Returns crafted recipe ingredients to inventory.
 *
 * @module components/world/crafting/domains/refundingWorldPlazaCraftRecipeIngredients
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningWorldPlazaCraftModeRecipeDefinition } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { addingWorldPlazaInventoryItemWithStacking } from '@/components/world/inventory/domains/addingWorldPlazaInventoryItemWithStacking';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';

export type RefundingWorldPlazaCraftRecipeIngredientsResult =
  | {
      readonly outcome: 'refunded';
      readonly nextState: DefiningInventoryState;
    }
  | {
      readonly outcome: 'inventory-full';
    };

/**
 * Adds every ingredient row back into inventory (capacity-checked per row).
 *
 * @param inventoryState - Current inventory state
 * @param recipeDefinition - Recipe whose ingredients should be returned
 */
export function refundingWorldPlazaCraftRecipeIngredients(
  inventoryState: DefiningInventoryState,
  recipeDefinition: DefiningWorldPlazaCraftModeRecipeDefinition
): RefundingWorldPlazaCraftRecipeIngredientsResult {
  let nextState = inventoryState;

  for (const ingredient of recipeDefinition.ingredients) {
    const addResult = addingWorldPlazaInventoryItemWithStacking(
      nextState,
      {
        id: `craft-refund-${ingredient.itemTypeId}`,
        itemTypeId: ingredient.itemTypeId,
        quantity: ingredient.quantity,
      },
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
    );

    if (addResult.quantityAccepted < ingredient.quantity) {
      return { outcome: 'inventory-full' };
    }

    nextState = addResult.state;
  }

  return {
    outcome: 'refunded',
    nextState,
  };
}
