/**
 * Removes a quantity of one item type from inventory slots.
 *
 * @module components/world/inventory/domains/removingWorldPlazaInventoryItemQuantityByTypeId
 */

import type {
  DefiningInventorySlot,
  DefiningInventoryState,
} from '@/components/inventory/domains/definingInventoryItem';

export type RemovingWorldPlazaInventoryItemQuantityByTypeIdResult = {
  readonly state: DefiningInventoryState;
  readonly quantityRemoved: number;
};

/**
 * Removes up to `quantity` of `itemTypeId` from the first matching stacks.
 * Returns null when inventory does not contain enough quantity.
 */
export function removingWorldPlazaInventoryItemQuantityByTypeId(
  inventoryState: DefiningInventoryState,
  itemTypeId: string,
  quantity: number
): RemovingWorldPlazaInventoryItemQuantityByTypeIdResult | null {
  if (quantity <= 0) {
    return { state: inventoryState, quantityRemoved: 0 };
  }

  let remaining = quantity;
  let nextSlots: DefiningInventorySlot[] = [...inventoryState.slots];

  for (let slotIndex = 0; slotIndex < nextSlots.length; slotIndex += 1) {
    const slotItem = nextSlots[slotIndex];

    if (slotItem === null || slotItem.itemTypeId !== itemTypeId) {
      continue;
    }

    const quantityToRemove = Math.min(slotItem.quantity, remaining);

    if (quantityToRemove <= 0) {
      continue;
    }

    const nextQuantity = slotItem.quantity - quantityToRemove;

    nextSlots = [...nextSlots];
    nextSlots[slotIndex] =
      nextQuantity > 0 ? { ...slotItem, quantity: nextQuantity } : null;
    remaining -= quantityToRemove;

    if (remaining <= 0) {
      break;
    }
  }

  if (remaining > 0) {
    return null;
  }

  return {
    state: {
      capacity: inventoryState.capacity,
      slots: nextSlots,
    },
    quantityRemoved: quantity,
  };
}
