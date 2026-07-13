/**
 * 1-based storage slot ordinals for empty storage-page chrome (row 2+).
 *
 * @module components/world/inventory/domains/resolvingWorldPlazaInventoryStorageSlotOrdinal
 */

import {
  DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY,
  DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_SLOT_START,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';

/**
 * Returns the centered empty-slot label for a storage page cell (1, 2, 3…).
 * Main hotbar slots (page 0) return null.
 *
 * @param slotIndex - Absolute inventory slot index
 */
export function resolvingWorldPlazaInventoryStorageSlotOrdinal(
  slotIndex: number
): number | null {
  if (
    !Number.isFinite(slotIndex) ||
    slotIndex < DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_SLOT_START ||
    slotIndex >= DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY
  ) {
    return null;
  }

  return (
    Math.trunc(slotIndex) -
    DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_SLOT_START +
    1
  );
}
