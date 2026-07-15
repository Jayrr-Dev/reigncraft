/**
 * Empty clay teapot → watered teapot (Add Water near liquid shore).
 *
 * @module components/world/tea-brewing/domains/fillingWorldPlazaTeaPotWithWater
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { addingInventoryItemWithStacking } from '@/components/inventory/domains/reducingInventoryState';
import { consumingWorldPlazaInventoryItemFromSlot } from '@/components/world/inventory/domains/consumingWorldPlazaInventoryItemFromSlot';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_TEAPOT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_TEAPOT,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { DEFINING_WORLD_PLAZA_TEA_BREWING_SLOT_COUNT } from '@/components/world/tea-brewing/domains/definingWorldPlazaTeaBrewingConstants';
import { writingWorldPlazaTeaPotIngredientSlots } from '@/components/world/tea-brewing/domains/resolvingWorldPlazaTeaBrewingMetadata';

export type FillingWorldPlazaTeaPotWithWaterResult =
  | {
      readonly outcome: 'filled';
      readonly nextState: DefiningInventoryState;
    }
  | {
      readonly outcome: 'no-empty-teapot';
    }
  | {
      readonly outcome: 'inventory-full';
    };

/**
 * Atomically consumes one empty clay teapot and adds one watered teapot with empty slots.
 */
export function fillingWorldPlazaTeaPotWithWater(
  inventoryState: DefiningInventoryState,
  preferredSlotIndex?: number
): FillingWorldPlazaTeaPotWithWaterResult {
  const emptySlotIndex =
    preferredSlotIndex !== undefined &&
    inventoryState.slots[preferredSlotIndex]?.itemTypeId ===
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_TEAPOT
      ? preferredSlotIndex
      : inventoryState.slots.findIndex(
          (slot) =>
            slot !== null &&
            slot.itemTypeId ===
              DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_TEAPOT &&
            slot.quantity > 0
        );

  if (emptySlotIndex < 0) {
    return { outcome: 'no-empty-teapot' };
  }

  const capacityProbe = addingInventoryItemWithStacking(
    inventoryState,
    {
      id: 'tea-pot-water-capacity-probe',
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_TEAPOT,
      quantity: 1,
      metadata: writingWorldPlazaTeaPotIngredientSlots(
        undefined,
        Array.from({ length: DEFINING_WORLD_PLAZA_TEA_BREWING_SLOT_COUNT }, () => null)
      ),
    },
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
  );

  if (capacityProbe.quantityAccepted < 1) {
    // Non-stackable maxStack 1: probe fails when every slot is full even if we
    // free a stack by consuming. Allow consume-then-add when the empty pot is
    // the only blocker (quantity 1 in its slot).
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
    return { outcome: 'no-empty-teapot' };
  }

  const addResult = addingInventoryItemWithStacking(
    consumeResult.nextState,
    {
      id: 'tea-pot-watered',
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_TEAPOT,
      quantity: 1,
      metadata: writingWorldPlazaTeaPotIngredientSlots(
        undefined,
        Array.from(
          { length: DEFINING_WORLD_PLAZA_TEA_BREWING_SLOT_COUNT },
          () => null
        )
      ),
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

export function checkingWorldPlazaInventoryHasEmptyClayTeaPot(
  inventoryState: DefiningInventoryState
): boolean {
  return inventoryState.slots.some(
    (slot) =>
      slot !== null &&
      slot.itemTypeId ===
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_TEAPOT &&
      slot.quantity > 0
  );
}
