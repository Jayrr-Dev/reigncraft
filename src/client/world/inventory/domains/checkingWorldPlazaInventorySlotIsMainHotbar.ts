import {
  DEFINING_WORLD_PLAZA_INVENTORY_MAIN_HOTBAR_SLOT_COUNT,
  DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_SLOT_START,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';

/**
 * Returns true when the slot belongs to the always-visible main hotbar row.
 *
 * @param slotIndex - Absolute inventory slot index
 */
export function checkingWorldPlazaInventorySlotIsMainHotbar(
  slotIndex: number
): boolean {
  return (
    slotIndex >= 0 &&
    slotIndex < DEFINING_WORLD_PLAZA_INVENTORY_MAIN_HOTBAR_SLOT_COUNT
  );
}

/**
 * Returns true when the slot is storage (paged rows behind the arrows).
 *
 * @param slotIndex - Absolute inventory slot index
 */
export function checkingWorldPlazaInventorySlotIsStorage(
  slotIndex: number
): boolean {
  return slotIndex >= DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_SLOT_START;
}
