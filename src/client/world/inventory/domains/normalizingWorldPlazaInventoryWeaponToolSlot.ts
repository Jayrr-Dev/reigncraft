import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { addingWorldPlazaInventoryItem } from '@/components/world/inventory/domains/addingWorldPlazaInventoryItemWithStacking';
import { checkingWorldPlazaInventoryItemIsWeaponOrTool } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryItemIsWeaponOrTool';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_STARTER_TOOL_ITEM_TYPE_ID,
  DEFINING_WORLD_PLAZA_INVENTORY_WEAPON_TOOL_SLOT_INDEX,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';

/**
 * If the reserved weapon/tool slot holds a non-equipment item, moves it to the
 * first empty general slot so slot 0 stays free for fists / weapons / tools.
 * When the reserved slot is empty, grants the starter wood axe.
 *
 * @param state - Inventory state (e.g. after load)
 */
export function normalizingWorldPlazaInventoryWeaponToolSlot(
  state: DefiningInventoryState
): DefiningInventoryState {
  const reservedSlotIndex =
    DEFINING_WORLD_PLAZA_INVENTORY_WEAPON_TOOL_SLOT_INDEX;
  const reservedItem = state.slots[reservedSlotIndex];

  if (
    reservedItem &&
    checkingWorldPlazaInventoryItemIsWeaponOrTool(reservedItem.itemTypeId)
  ) {
    return state;
  }

  let nextState = state;

  if (
    reservedItem &&
    !checkingWorldPlazaInventoryItemIsWeaponOrTool(reservedItem.itemTypeId)
  ) {
    let destinationSlotIndex: number | null = null;

    for (let slotIndex = 0; slotIndex < state.capacity; slotIndex += 1) {
      if (slotIndex === reservedSlotIndex) {
        continue;
      }

      if (state.slots[slotIndex] === null) {
        destinationSlotIndex = slotIndex;
        break;
      }
    }

    if (destinationSlotIndex === null) {
      return state;
    }

    const nextSlots = [...state.slots];
    nextSlots[reservedSlotIndex] = null;
    nextSlots[destinationSlotIndex] = {
      ...reservedItem,
      slotIndex: destinationSlotIndex,
    };

    nextState = {
      capacity: state.capacity,
      slots: nextSlots,
    };
  }

  if (nextState.slots[reservedSlotIndex] !== null) {
    return nextState;
  }

  return addingWorldPlazaInventoryItem(
    nextState,
    {
      id: crypto.randomUUID(),
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_STARTER_TOOL_ITEM_TYPE_ID,
      quantity: 1,
    },
    reservedSlotIndex
  );
}
