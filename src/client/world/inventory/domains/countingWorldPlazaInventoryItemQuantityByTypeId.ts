/**
 * Counts how many items of one type id are in inventory slots.
 *
 * @module components/world/inventory/domains/countingWorldPlazaInventoryItemQuantityByTypeId
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';

/** Returns total quantity for one item type id across all slots. */
export function countingWorldPlazaInventoryItemQuantityByTypeId(
  inventoryState: DefiningInventoryState,
  itemTypeId: string
): number {
  let total = 0;

  for (const slotItem of inventoryState.slots) {
    if (slotItem === null || slotItem.itemTypeId !== itemTypeId) {
      continue;
    }

    total += slotItem.quantity;
  }

  return total;
}
