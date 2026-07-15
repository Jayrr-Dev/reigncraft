/**
 * Load / unload brew ingredients on a watered clay teapot.
 *
 * @module components/world/tea-brewing/domains/mutatingWorldPlazaTeaPotIngredientSlots
 */

import type {
  DefiningInventoryItem,
  DefiningInventoryState,
} from '@/components/inventory/domains/definingInventoryItem';
import { addingInventoryItemWithStacking } from '@/components/inventory/domains/reducingInventoryState';
import { consumingWorldPlazaInventoryItemFromSlot } from '@/components/world/inventory/domains/consumingWorldPlazaInventoryItemFromSlot';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_TEAPOT } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { DEFINING_WORLD_PLAZA_TEA_BREWING_SLOT_COUNT } from '@/components/world/tea-brewing/domains/definingWorldPlazaTeaBrewingConstants';
import { resolvingWorldPlazaTeaBrewingIngredient } from '@/components/world/tea-brewing/domains/definingWorldPlazaTeaBrewingIngredientRegistry';
import {
  resolvingWorldPlazaTeaPotIngredientSlots,
  writingWorldPlazaTeaPotIngredientSlots,
} from '@/components/world/tea-brewing/domains/resolvingWorldPlazaTeaBrewingMetadata';

export type MutatingWorldPlazaTeaPotIngredientSlotsResult =
  | {
      readonly outcome: 'updated';
      readonly nextState: DefiningInventoryState;
    }
  | {
      readonly outcome: 'invalid';
      readonly reason: string;
    }
  | {
      readonly outcome: 'inventory-full';
    };

function updatingPotSlotItem(
  potItem: DefiningInventoryItem,
  slots: readonly (string | null)[]
): DefiningInventoryItem {
  return {
    ...potItem,
    metadata: writingWorldPlazaTeaPotIngredientSlots(potItem.metadata, slots),
  };
}

function replacingInventorySlotItem(
  state: DefiningInventoryState,
  slotIndex: number,
  item: DefiningInventoryItem
): DefiningInventoryState {
  const slots = [...state.slots];
  slots[slotIndex] = item;
  return {
    capacity: state.capacity,
    slots,
  };
}

/**
 * Consumes one ingredient from inventory and places it into an empty teapot slot.
 */
export function placingWorldPlazaTeaPotIngredientFromInventorySlot(
  inventoryState: DefiningInventoryState,
  potSlotIndex: number,
  ingredientSlotIndex: number,
  teapotIngredientSlotIndex: number
): MutatingWorldPlazaTeaPotIngredientSlotsResult {
  if (
    teapotIngredientSlotIndex < 0 ||
    teapotIngredientSlotIndex >= DEFINING_WORLD_PLAZA_TEA_BREWING_SLOT_COUNT
  ) {
    return { outcome: 'invalid', reason: 'Bad teapot slot.' };
  }

  const potItem = inventoryState.slots[potSlotIndex];

  if (
    !potItem ||
    potItem.itemTypeId !==
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_TEAPOT
  ) {
    return { outcome: 'invalid', reason: 'Need a watered teapot.' };
  }

  const ingredientItem = inventoryState.slots[ingredientSlotIndex];

  if (!ingredientItem || ingredientItem.quantity < 1) {
    return { outcome: 'invalid', reason: 'Need an ingredient.' };
  }

  if (!resolvingWorldPlazaTeaBrewingIngredient(ingredientItem.itemTypeId)) {
    return {
      outcome: 'invalid',
      reason: 'Only flowers, berries, tea, or coffee brew here.',
    };
  }

  const currentSlots = [...resolvingWorldPlazaTeaPotIngredientSlots(potItem.metadata)];

  if (currentSlots[teapotIngredientSlotIndex] !== null) {
    return { outcome: 'invalid', reason: 'That slot is full.' };
  }

  const consumeResult = consumingWorldPlazaInventoryItemFromSlot(
    inventoryState,
    ingredientSlotIndex,
    1
  );

  if (!consumeResult.consumed) {
    return { outcome: 'invalid', reason: 'Need an ingredient.' };
  }

  // Pot may have moved if ingredient shared its slot (should not). Re-find pot.
  let nextPotSlotIndex = potSlotIndex;
  let nextPotItem = consumeResult.nextState.slots[nextPotSlotIndex];

  if (
    !nextPotItem ||
    nextPotItem.itemTypeId !==
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_TEAPOT ||
    nextPotItem.id !== potItem.id
  ) {
    nextPotSlotIndex = consumeResult.nextState.slots.findIndex(
      (slot) => slot !== null && slot.id === potItem.id
    );
    nextPotItem =
      nextPotSlotIndex >= 0
        ? consumeResult.nextState.slots[nextPotSlotIndex]
        : null;
  }

  if (!nextPotItem) {
    return { outcome: 'invalid', reason: 'Need a watered teapot.' };
  }

  currentSlots[teapotIngredientSlotIndex] = ingredientItem.itemTypeId;

  return {
    outcome: 'updated',
    nextState: replacingInventorySlotItem(
      consumeResult.nextState,
      nextPotSlotIndex,
      updatingPotSlotItem(nextPotItem, currentSlots)
    ),
  };
}

/**
 * Returns one teapot-slot ingredient to inventory and clears that slot.
 */
export function returningWorldPlazaTeaPotIngredientToInventory(
  inventoryState: DefiningInventoryState,
  potSlotIndex: number,
  teapotIngredientSlotIndex: number
): MutatingWorldPlazaTeaPotIngredientSlotsResult {
  if (
    teapotIngredientSlotIndex < 0 ||
    teapotIngredientSlotIndex >= DEFINING_WORLD_PLAZA_TEA_BREWING_SLOT_COUNT
  ) {
    return { outcome: 'invalid', reason: 'Bad teapot slot.' };
  }

  const potItem = inventoryState.slots[potSlotIndex];

  if (
    !potItem ||
    potItem.itemTypeId !==
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_TEAPOT
  ) {
    return { outcome: 'invalid', reason: 'Need a watered teapot.' };
  }

  const currentSlots = [...resolvingWorldPlazaTeaPotIngredientSlots(potItem.metadata)];
  const ingredientTypeId = currentSlots[teapotIngredientSlotIndex];

  if (!ingredientTypeId) {
    return { outcome: 'invalid', reason: 'Slot is empty.' };
  }

  const addResult = addingInventoryItemWithStacking(
    inventoryState,
    {
      id: 'tea-pot-ingredient-return',
      itemTypeId: ingredientTypeId,
      quantity: 1,
    },
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
  );

  if (addResult.quantityAccepted < 1) {
    return { outcome: 'inventory-full' };
  }

  let nextPotSlotIndex = potSlotIndex;
  let nextPotItem = addResult.state.slots[nextPotSlotIndex];

  if (
    !nextPotItem ||
    nextPotItem.itemTypeId !==
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_TEAPOT ||
    nextPotItem.id !== potItem.id
  ) {
    nextPotSlotIndex = addResult.state.slots.findIndex(
      (slot) => slot !== null && slot.id === potItem.id
    );
    nextPotItem =
      nextPotSlotIndex >= 0 ? addResult.state.slots[nextPotSlotIndex] : null;
  }

  if (!nextPotItem) {
    return { outcome: 'invalid', reason: 'Need a watered teapot.' };
  }

  currentSlots[teapotIngredientSlotIndex] = null;

  return {
    outcome: 'updated',
    nextState: replacingInventorySlotItem(
      addResult.state,
      nextPotSlotIndex,
      updatingPotSlotItem(nextPotItem, currentSlots)
    ),
  };
}

export function countingWorldPlazaTeaPotFilledIngredientSlots(
  metadata: DefiningInventoryItem['metadata']
): number {
  return resolvingWorldPlazaTeaPotIngredientSlots(metadata).filter(
    (slot) => slot !== null
  ).length;
}
