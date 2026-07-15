/**
 * Pour one serving from a brewed teapot into an empty clay cup.
 *
 * @module components/world/tea-brewing/domains/pouringWorldPlazaTeaFromBrewedPot
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { addingInventoryItemWithStacking } from '@/components/inventory/domains/reducingInventoryState';
import { consumingWorldPlazaInventoryItemFromSlot } from '@/components/world/inventory/domains/consumingWorldPlazaInventoryItemFromSlot';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BREWED_CLAY_TEAPOT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CUP_OF_TEA,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_CUP,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_TEAPOT,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { DEFINING_WORLD_PLAZA_TEA_BREWING_POURS_PER_POT } from '@/components/world/tea-brewing/domains/definingWorldPlazaTeaBrewingConstants';
import {
  resolvingWorldPlazaTeaBrewingMetadata,
  resolvingWorldPlazaTeaPotRemainingPours,
  writingWorldPlazaTeaBrewingMetadata,
  writingWorldPlazaTeaPotRemainingPours,
} from '@/components/world/tea-brewing/domains/resolvingWorldPlazaTeaBrewingMetadata';

export type PouringWorldPlazaTeaFromBrewedPotResult =
  | {
      readonly outcome: 'poured';
      readonly nextState: DefiningInventoryState;
      readonly displayName: string;
      readonly remainingPours: number;
    }
  | {
      readonly outcome: 'no-brewed-teapot';
    }
  | {
      readonly outcome: 'no-empty-cup';
    }
  | {
      readonly outcome: 'inventory-full';
    }
  | {
      readonly outcome: 'invalid-brew';
    };

/**
 * Consumes one empty cup and one pour from a brewed pot. Empty pot returns when
 * pours hit zero.
 */
export function pouringWorldPlazaTeaFromBrewedPot(
  inventoryState: DefiningInventoryState,
  emptyCupSlotIndex?: number
): PouringWorldPlazaTeaFromBrewedPotResult {
  const brewedSlotIndex = inventoryState.slots.findIndex(
    (slot) =>
      slot !== null &&
      slot.itemTypeId ===
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BREWED_CLAY_TEAPOT &&
      slot.quantity > 0
  );

  if (brewedSlotIndex < 0) {
    return { outcome: 'no-brewed-teapot' };
  }

  const brewedItem = inventoryState.slots[brewedSlotIndex];

  if (!brewedItem) {
    return { outcome: 'no-brewed-teapot' };
  }

  const brew = resolvingWorldPlazaTeaBrewingMetadata(brewedItem.metadata);

  if (!brew) {
    return { outcome: 'invalid-brew' };
  }

  const remainingPours =
    resolvingWorldPlazaTeaPotRemainingPours(brewedItem.metadata) ??
    DEFINING_WORLD_PLAZA_TEA_BREWING_POURS_PER_POT;

  if (remainingPours < 1) {
    return { outcome: 'invalid-brew' };
  }

  const cupSlotIndex =
    emptyCupSlotIndex !== undefined &&
    inventoryState.slots[emptyCupSlotIndex]?.itemTypeId ===
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_CUP
      ? emptyCupSlotIndex
      : inventoryState.slots.findIndex(
          (slot) =>
            slot !== null &&
            slot.itemTypeId ===
              DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_CUP &&
            slot.quantity > 0
        );

  if (cupSlotIndex < 0) {
    return { outcome: 'no-empty-cup' };
  }

  const cupMetadata = writingWorldPlazaTeaBrewingMetadata(undefined, brew);

  const capacityProbe = addingInventoryItemWithStacking(
    inventoryState,
    {
      id: 'cup-of-tea-capacity-probe',
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CUP_OF_TEA,
      quantity: 1,
      metadata: cupMetadata,
    },
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
  );

  const cupSlot = inventoryState.slots[cupSlotIndex];
  const canFreeCupSlot = cupSlot?.quantity === 1;

  if (capacityProbe.quantityAccepted < 1 && !canFreeCupSlot) {
    return { outcome: 'inventory-full' };
  }

  const consumeCup = consumingWorldPlazaInventoryItemFromSlot(
    inventoryState,
    cupSlotIndex,
    1
  );

  if (!consumeCup.consumed) {
    return { outcome: 'no-empty-cup' };
  }

  let nextBrewedSlotIndex = brewedSlotIndex;
  let nextBrewedItem = consumeCup.nextState.slots[nextBrewedSlotIndex];

  if (
    !nextBrewedItem ||
    nextBrewedItem.itemTypeId !==
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BREWED_CLAY_TEAPOT ||
    nextBrewedItem.id !== brewedItem.id
  ) {
    nextBrewedSlotIndex = consumeCup.nextState.slots.findIndex(
      (slot) => slot !== null && slot.id === brewedItem.id
    );
    nextBrewedItem =
      nextBrewedSlotIndex >= 0
        ? consumeCup.nextState.slots[nextBrewedSlotIndex]
        : null;
  }

  if (!nextBrewedItem) {
    return { outcome: 'no-brewed-teapot' };
  }

  const nextRemainingPours = remainingPours - 1;
  const slots = [...consumeCup.nextState.slots];

  if (nextRemainingPours <= 0) {
    slots[nextBrewedSlotIndex] = {
      ...nextBrewedItem,
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_TEAPOT,
      metadata: undefined,
    };
  } else {
    slots[nextBrewedSlotIndex] = {
      ...nextBrewedItem,
      metadata: writingWorldPlazaTeaPotRemainingPours(
        writingWorldPlazaTeaBrewingMetadata(undefined, brew),
        nextRemainingPours
      ),
    };
  }

  const afterPotState: DefiningInventoryState = {
    capacity: consumeCup.nextState.capacity,
    slots,
  };

  const addCup = addingInventoryItemWithStacking(
    afterPotState,
    {
      id: 'cup-of-tea',
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CUP_OF_TEA,
      quantity: 1,
      metadata: cupMetadata,
    },
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
  );

  if (addCup.quantityAccepted < 1) {
    return { outcome: 'inventory-full' };
  }

  return {
    outcome: 'poured',
    nextState: addCup.state,
    displayName: brew.displayName,
    remainingPours: Math.max(0, nextRemainingPours),
  };
}
