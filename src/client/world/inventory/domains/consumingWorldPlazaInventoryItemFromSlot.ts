import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';

/** Result of consuming items from one inventory slot. */
export type ConsumingWorldPlazaInventoryItemFromSlotResult = {
  readonly consumed: boolean;
  readonly nextState: DefiningInventoryState;
};

/**
 * Consumes a quantity from one inventory slot by index.
 */
export function consumingWorldPlazaInventoryItemFromSlot(
  state: DefiningInventoryState,
  slotIndex: number,
  quantity: number
): ConsumingWorldPlazaInventoryItemFromSlotResult {
  if (quantity <= 0 || slotIndex < 0 || slotIndex >= state.capacity) {
    return { consumed: false, nextState: state };
  }

  const slotItem = state.slots[slotIndex];

  if (!slotItem || slotItem.quantity < quantity) {
    return { consumed: false, nextState: state };
  }

  const remainingQuantity = slotItem.quantity - quantity;
  const nextSlots = state.slots.map((slot, index) => {
    if (index !== slotIndex) {
      return slot;
    }

    return remainingQuantity > 0
      ? { ...slotItem, quantity: remainingQuantity }
      : null;
  });

  return {
    consumed: true,
    nextState: {
      capacity: state.capacity,
      slots: nextSlots,
    },
  };
}
