import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';

/** Result of consuming items from inventory state by type. */
export type ConsumingWorldPlazaInventoryItemByTypeResult = {
  readonly consumed: boolean;
  readonly nextState: DefiningInventoryState;
};

/**
 * Consumes a quantity of one item type from inventory state.
 *
 * Pure client-side mirror of the server-side inventory consumption used by
 * fire actions; single-player sessions apply the returned state through the
 * inventory engine so it persists to the active save.
 *
 * @param state - Current inventory state.
 * @param itemTypeId - Item type to consume.
 * @param quantity - Units to consume (must be positive).
 */
export function consumingWorldPlazaInventoryItemByType(
  state: DefiningInventoryState,
  itemTypeId: string,
  quantity: number
): ConsumingWorldPlazaInventoryItemByTypeResult {
  if (quantity <= 0) {
    return { consumed: false, nextState: state };
  }

  const totalAvailable = state.slots.reduce(
    (total, slot) =>
      slot !== null && slot.itemTypeId === itemTypeId
        ? total + slot.quantity
        : total,
    0
  );

  if (totalAvailable < quantity) {
    return { consumed: false, nextState: state };
  }

  let remainingToConsume = quantity;
  const nextSlots = state.slots.map((slot) => {
    if (
      remainingToConsume <= 0 ||
      slot === null ||
      slot.itemTypeId !== itemTypeId
    ) {
      return slot;
    }

    const consumedFromSlot = Math.min(slot.quantity, remainingToConsume);
    remainingToConsume -= consumedFromSlot;

    const remainingQuantity = slot.quantity - consumedFromSlot;

    return remainingQuantity > 0
      ? { ...slot, quantity: remainingQuantity }
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
