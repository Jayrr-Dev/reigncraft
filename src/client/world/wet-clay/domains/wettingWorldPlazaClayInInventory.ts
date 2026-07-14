import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { addingInventoryItemWithStacking } from '@/components/inventory/domains/reducingInventoryState';
import { consumingWorldPlazaInventoryItemFromSlot } from '@/components/world/inventory/domains/consumingWorldPlazaInventoryItemFromSlot';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_CLAY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { DEFINING_WORLD_PLAZA_WET_CLAY_CONVERT_QUANTITY } from '@/components/world/wet-clay/domains/definingWorldPlazaWetClayConstants';

export type WettingWorldPlazaClayInInventoryResult =
  | {
      readonly outcome: 'wetted';
      readonly nextState: DefiningInventoryState;
    }
  | {
      readonly outcome: 'no-clay';
    }
  | {
      readonly outcome: 'inventory-full';
    };

/**
 * Atomically consumes one dry clay and adds one wet clay.
 */
export function wettingWorldPlazaClayInInventory(
  inventoryState: DefiningInventoryState
): WettingWorldPlazaClayInInventoryResult {
  const claySlotIndex = inventoryState.slots.findIndex(
    (slot) =>
      slot !== null &&
      slot.itemTypeId === DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_CLAY &&
      slot.quantity >= DEFINING_WORLD_PLAZA_WET_CLAY_CONVERT_QUANTITY
  );

  if (claySlotIndex < 0) {
    return { outcome: 'no-clay' };
  }

  const consumeResult = consumingWorldPlazaInventoryItemFromSlot(
    inventoryState,
    claySlotIndex,
    DEFINING_WORLD_PLAZA_WET_CLAY_CONVERT_QUANTITY
  );

  if (!consumeResult.consumed) {
    return { outcome: 'no-clay' };
  }

  const addResult = addingInventoryItemWithStacking(
    consumeResult.nextState,
    {
      id: 'wet-clay-result',
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY,
      quantity: DEFINING_WORLD_PLAZA_WET_CLAY_CONVERT_QUANTITY,
    },
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
  );

  if (
    addResult.quantityAccepted < DEFINING_WORLD_PLAZA_WET_CLAY_CONVERT_QUANTITY
  ) {
    return { outcome: 'inventory-full' };
  }

  return {
    outcome: 'wetted',
    nextState: addResult.state,
  };
}

/**
 * True when inventory holds at least one dry clay.
 */
export function checkingWorldPlazaInventoryHasClay(
  inventoryState: DefiningInventoryState
): boolean {
  return inventoryState.slots.some(
    (slot) =>
      slot !== null &&
      slot.itemTypeId === DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_CLAY &&
      slot.quantity > 0
  );
}
