/**
 * Empty clay bottle → watered bottle (Add Water near liquid shore).
 *
 * @module components/world/ceramics/domains/fillingWorldPlazaClayBottleWithWater
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { addingInventoryItemWithStacking } from '@/components/inventory/domains/reducingInventoryState';
import { consumingWorldPlazaInventoryItemFromSlot } from '@/components/world/inventory/domains/consumingWorldPlazaInventoryItemFromSlot';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_BOTTLE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_BOTTLE,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';

export type FillingWorldPlazaClayBottleWithWaterResult =
  | {
      readonly outcome: 'filled';
      readonly nextState: DefiningInventoryState;
    }
  | {
      readonly outcome: 'no-empty-bottle';
    }
  | {
      readonly outcome: 'inventory-full';
    };

/**
 * Atomically consumes one empty clay bottle and adds one watered bottle.
 */
export function fillingWorldPlazaClayBottleWithWater(
  inventoryState: DefiningInventoryState,
  preferredSlotIndex?: number
): FillingWorldPlazaClayBottleWithWaterResult {
  const emptySlotIndex =
    preferredSlotIndex !== undefined &&
    inventoryState.slots[preferredSlotIndex]?.itemTypeId ===
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_BOTTLE
      ? preferredSlotIndex
      : inventoryState.slots.findIndex(
          (slot) =>
            slot !== null &&
            slot.itemTypeId ===
              DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_BOTTLE &&
            slot.quantity > 0
        );

  if (emptySlotIndex < 0) {
    return { outcome: 'no-empty-bottle' };
  }

  const capacityProbe = addingInventoryItemWithStacking(
    inventoryState,
    {
      id: 'clay-bottle-water-capacity-probe',
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_BOTTLE,
      quantity: 1,
    },
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
  );

  if (capacityProbe.quantityAccepted < 1) {
    const emptySlot = inventoryState.slots[emptySlotIndex];
    if (!emptySlot || emptySlot.quantity !== 1) {
      return { outcome: 'inventory-full' };
    }
  }

  const consumeResult = consumingWorldPlazaInventoryItemFromSlot(
    inventoryState,
    emptySlotIndex,
    1
  );

  if (!consumeResult.consumed) {
    return { outcome: 'no-empty-bottle' };
  }

  const addResult = addingInventoryItemWithStacking(
    consumeResult.nextState,
    {
      id: 'clay-bottle-watered',
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_BOTTLE,
      quantity: 1,
    },
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
  );

  if (addResult.quantityAccepted < 1) {
    return { outcome: 'inventory-full' };
  }

  return {
    outcome: 'filled',
    nextState: addResult.state,
  };
}

export function checkingWorldPlazaInventoryHasEmptyClayBottle(
  inventoryState: DefiningInventoryState
): boolean {
  return inventoryState.slots.some(
    (slot) =>
      slot !== null &&
      slot.itemTypeId ===
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_BOTTLE &&
      slot.quantity > 0
  );
}
