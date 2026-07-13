/**
 * Counts owned inventory quantity for one item type.
 *
 * @module components/world/crafting/domains/countingWorldPlazaInventoryItemTypeQuantity
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';

/**
 * Sums stack quantities for one item type across all slots.
 *
 * @param inventoryState - Current inventory state
 * @param itemTypeId - Item type to count
 */
export function countingWorldPlazaInventoryItemTypeQuantity(
  inventoryState: DefiningInventoryState,
  itemTypeId: string
): number {
  return inventoryState.slots.reduce(
    (total, slot) =>
      slot !== null && slot.itemTypeId === itemTypeId
        ? total + slot.quantity
        : total,
    0
  );
}
