import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningInventoryItemRegistry } from '@/components/inventory/domains/definingInventoryItemRegistry';
import { movingInventoryItemToSlot } from '@/components/inventory/domains/reducingInventoryState';
import { checkingWorldPlazaInventoryMoveRespectsWeaponToolSlot } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryMoveRespectsWeaponToolSlot';

/**
 * Moves or swaps hotbar items while keeping slot 0 reserved for weapons/tools.
 *
 * @param state - Current inventory state
 * @param fromSlotIndex - Source slot
 * @param toSlotIndex - Destination slot
 * @param registry - Item type registry for stack rules
 */
export function movingWorldPlazaInventoryItemToSlot(
  state: DefiningInventoryState,
  fromSlotIndex: number,
  toSlotIndex: number,
  registry: DefiningInventoryItemRegistry
): DefiningInventoryState {
  if (
    !checkingWorldPlazaInventoryMoveRespectsWeaponToolSlot(
      state,
      fromSlotIndex,
      toSlotIndex
    )
  ) {
    return state;
  }

  return movingInventoryItemToSlot(state, fromSlotIndex, toSlotIndex, registry);
}
