import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { checkingWorldPlazaInventoryHotbarSlotAcceptsItemTypeId } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryHotbarSlotAcceptsItemTypeId';
import { DEFINING_WORLD_PLAZA_INVENTORY_WEAPON_TOOL_SLOT_INDEX } from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';

/**
 * Returns true when moving/swapping between hotbar slots would leave slot 0
 * empty or occupied only by a weapon/tool.
 *
 * @param state - Current inventory state
 * @param fromSlotIndex - Source hotbar slot
 * @param toSlotIndex - Destination hotbar slot
 */
export function checkingWorldPlazaInventoryMoveRespectsWeaponToolSlot(
  state: DefiningInventoryState,
  fromSlotIndex: number,
  toSlotIndex: number
): boolean {
  const sourceItem = state.slots[fromSlotIndex];

  if (!sourceItem) {
    return false;
  }

  const targetItem = state.slots[toSlotIndex] ?? null;
  const reservedSlotIndex =
    DEFINING_WORLD_PLAZA_INVENTORY_WEAPON_TOOL_SLOT_INDEX;

  if (toSlotIndex === reservedSlotIndex) {
    if (
      !checkingWorldPlazaInventoryHotbarSlotAcceptsItemTypeId(
        reservedSlotIndex,
        sourceItem.itemTypeId
      )
    ) {
      return false;
    }
  }

  if (
    fromSlotIndex === reservedSlotIndex &&
    targetItem !== null &&
    !checkingWorldPlazaInventoryHotbarSlotAcceptsItemTypeId(
      reservedSlotIndex,
      targetItem.itemTypeId
    )
  ) {
    return false;
  }

  return true;
}
