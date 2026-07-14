/**
 * Immediate inventory-output craft transaction.
 *
 * @module components/world/crafting/domains/executingWorldPlazaCraftRecipeInventoryOutcome
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { consumingWorldPlazaCraftRecipeIngredients } from '@/components/world/crafting/domains/consumingWorldPlazaCraftRecipeIngredients';
import type { DefiningWorldPlazaCraftModeRecipeDefinition } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { addingWorldPlazaInventoryItemWithStacking } from '@/components/world/inventory/domains/addingWorldPlazaInventoryItemWithStacking';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';

export type ExecutingWorldPlazaCraftRecipeInventoryOutcomeResult =
  | {
      readonly outcome: 'crafted';
      readonly nextState: DefiningInventoryState;
    }
  | {
      readonly outcome: 'missing-materials';
    }
  | {
      readonly outcome: 'inventory-full';
    };

/**
 * Capacity-probes output, consumes ingredients, and adds crafted items atomically.
 * Uses plaza stacking so non-tools never occupy the reserved weapon/tool slot.
 *
 * @param inventoryState - Current inventory state
 * @param recipeDefinition - Recipe with an inventory outcome
 */
export function executingWorldPlazaCraftRecipeInventoryOutcome(
  inventoryState: DefiningInventoryState,
  recipeDefinition: DefiningWorldPlazaCraftModeRecipeDefinition
): ExecutingWorldPlazaCraftRecipeInventoryOutcomeResult {
  if (recipeDefinition.outcome.kind !== 'item') {
    return { outcome: 'missing-materials' };
  }

  const capacityProbe = addingWorldPlazaInventoryItemWithStacking(
    inventoryState,
    {
      id: 'craft-recipe-capacity-probe',
      itemTypeId: recipeDefinition.outcome.itemTypeId,
      quantity: recipeDefinition.outcome.quantity,
    },
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
  );

  if (capacityProbe.quantityAccepted < recipeDefinition.outcome.quantity) {
    return { outcome: 'inventory-full' };
  }

  const consumeResult = consumingWorldPlazaCraftRecipeIngredients(
    inventoryState,
    recipeDefinition
  );

  if (consumeResult.outcome !== 'consumed') {
    return { outcome: 'missing-materials' };
  }

  const addResult = addingWorldPlazaInventoryItemWithStacking(
    consumeResult.nextState,
    {
      id: 'craft-recipe-output',
      itemTypeId: recipeDefinition.outcome.itemTypeId,
      quantity: recipeDefinition.outcome.quantity,
    },
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
  );

  if (addResult.quantityAccepted < recipeDefinition.outcome.quantity) {
    return { outcome: 'inventory-full' };
  }

  return {
    outcome: 'crafted',
    nextState: addResult.state,
  };
}
