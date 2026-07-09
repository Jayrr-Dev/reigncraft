import { checkingWorldPlazaInventoryItemIsWeaponOrTool } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryItemIsWeaponOrTool';
import { DEFINING_WORLD_PLAZA_INVENTORY_WEAPON_TOOL_SLOT_INDEX } from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';

/**
 * Returns true when a hotbar slot may hold the given item type.
 * Slot 0 is reserved for weapons and tools only.
 *
 * @param slotIndex - Hotbar slot index
 * @param itemTypeId - Inventory item type id
 */
export function checkingWorldPlazaInventoryHotbarSlotAcceptsItemTypeId(
  slotIndex: number,
  itemTypeId: string
): boolean {
  if (slotIndex !== DEFINING_WORLD_PLAZA_INVENTORY_WEAPON_TOOL_SLOT_INDEX) {
    return true;
  }

  return checkingWorldPlazaInventoryItemIsWeaponOrTool(itemTypeId);
}
