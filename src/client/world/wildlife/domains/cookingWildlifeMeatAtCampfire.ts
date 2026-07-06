import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { addingInventoryItemWithStacking } from '@/components/inventory/domains/reducingInventoryState';
import { consumingWorldPlazaInventoryItemByType } from '@/components/world/inventory/domains/consumingWorldPlazaInventoryItemByType';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import {
  resolvingFirstWildlifeMeatCookRecipeInInventory,
  resolvingWildlifeMeatCookRecipeByRawItemTypeId,
} from '@/components/world/wildlife/domains/definingWildlifeMeatCookRecipes';

export type CookingWildlifeMeatAtCampfireResult =
  | {
      readonly outcome: 'cooked';
      readonly nextState: DefiningInventoryState;
      readonly cookedDisplayName: string;
    }
  | {
      readonly outcome: 'no-raw-meat';
    }
  | {
      readonly outcome: 'inventory-full';
    };

/**
 * Atomically consumes one raw meat stack and adds one cooked meat stack.
 */
export function cookingWildlifeMeatAtCampfire(
  inventoryState: DefiningInventoryState,
  rawItemTypeId?: string
): CookingWildlifeMeatAtCampfireResult {
  const recipe = rawItemTypeId
    ? resolvingWildlifeMeatCookRecipeByRawItemTypeId(rawItemTypeId)
    : resolvingFirstWildlifeMeatCookRecipeInInventory(
        inventoryState.slots.filter(
          (slot): slot is NonNullable<typeof slot> => slot !== null
        )
      );

  if (!recipe) {
    return { outcome: 'no-raw-meat' };
  }

  const capacityProbe = addingInventoryItemWithStacking(
    inventoryState,
    {
      id: 'campfire-cook-capacity-probe',
      itemTypeId: recipe.cookedItemTypeId,
      quantity: 1,
    },
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
  );

  if (capacityProbe.quantityAccepted < 1) {
    return { outcome: 'inventory-full' };
  }

  const consumeResult = consumingWorldPlazaInventoryItemByType(
    inventoryState,
    recipe.rawItemTypeId,
    1
  );

  if (!consumeResult.consumed) {
    return { outcome: 'no-raw-meat' };
  }

  const addResult = addingInventoryItemWithStacking(
    consumeResult.nextState,
    {
      id: 'campfire-cook-result',
      itemTypeId: recipe.cookedItemTypeId,
      quantity: 1,
    },
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
  );

  if (addResult.quantityAccepted < 1) {
    return { outcome: 'inventory-full' };
  }

  return {
    outcome: 'cooked',
    nextState: addResult.state,
    cookedDisplayName: recipe.cookedDisplayName,
  };
}
