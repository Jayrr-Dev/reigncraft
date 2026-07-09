import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { checkingWorldPlazaInventoryHotbarSlotAcceptsItemTypeId } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryHotbarSlotAcceptsItemTypeId';

/**
 * Finds the first empty hotbar slot that accepts the given item type.
 * Skips the reserved weapon/tool slot for non-equipment items.
 *
 * @param state - Inventory state
 * @param itemTypeId - Item type being placed
 */
export function findingWorldPlazaInventoryFirstEmptySlotForItemTypeId(
  state: DefiningInventoryState,
  itemTypeId: string
): number | null {
  for (let slotIndex = 0; slotIndex < state.capacity; slotIndex += 1) {
    if (state.slots[slotIndex] !== null) {
      continue;
    }

    if (
      !checkingWorldPlazaInventoryHotbarSlotAcceptsItemTypeId(
        slotIndex,
        itemTypeId
      )
    ) {
      continue;
    }

    return slotIndex;
  }

  return null;
}
