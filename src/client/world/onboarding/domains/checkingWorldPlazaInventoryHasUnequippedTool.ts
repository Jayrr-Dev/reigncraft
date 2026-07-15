import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { checkingWorldPlazaInventoryItemIsWeaponOrTool } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryItemIsWeaponOrTool';
import { DEFINING_WORLD_PLAZA_INVENTORY_WEAPON_TOOL_SLOT_INDEX } from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';

/**
 * Returns true when a weapon or tool sits in a hotbar slot other than the fist slot.
 */
export function checkingWorldPlazaInventoryHasUnequippedTool(
  inventoryState: DefiningInventoryState
): boolean {
  for (
    let slotIndex = 0;
    slotIndex < inventoryState.slots.length;
    slotIndex += 1
  ) {
    if (slotIndex === DEFINING_WORLD_PLAZA_INVENTORY_WEAPON_TOOL_SLOT_INDEX) {
      continue;
    }

    const slot = inventoryState.slots[slotIndex];

    if (
      slot &&
      slot.quantity > 0 &&
      checkingWorldPlazaInventoryItemIsWeaponOrTool(slot.itemTypeId)
    ) {
      return true;
    }
  }

  return false;
}
