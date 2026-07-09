import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { addingInventoryItemWithStacking } from '@/components/inventory/domains/reducingInventoryState';
import { consumingWorldPlazaInventoryItemFromSlot } from '@/components/world/inventory/domains/consumingWorldPlazaInventoryItemFromSlot';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import {
  resolvingFirstWildlifeMeatCookSlotIndexInInventory,
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
  const rawSlotIndex =
    rawItemTypeId === undefined
      ? resolvingFirstWildlifeMeatCookSlotIndexInInventory(inventoryState.slots)
      : inventoryState.slots.findIndex(
          (slot) => slot !== null && slot.itemTypeId === rawItemTypeId
        );

  if (rawSlotIndex === null || rawSlotIndex < 0) {
    return { outcome: 'no-raw-meat' };
  }

  const rawSlot = inventoryState.slots[rawSlotIndex];

  if (!rawSlot) {
    return { outcome: 'no-raw-meat' };
  }

  const recipe = resolvingWildlifeMeatCookRecipeByRawItemTypeId(
    rawSlot.itemTypeId
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

  const consumeResult = consumingWorldPlazaInventoryItemFromSlot(
    inventoryState,
    rawSlotIndex,
    1
  );

  if (!consumeResult.consumed) {
    return { outcome: 'no-raw-meat' };
  }

  const cookedMetadata = rawSlot.metadata;

  const addResult = addingInventoryItemWithStacking(
    consumeResult.nextState,
    {
      id: 'campfire-cook-result',
      itemTypeId: recipe.cookedItemTypeId,
      quantity: 1,
      ...(cookedMetadata ? { metadata: cookedMetadata } : {}),
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
