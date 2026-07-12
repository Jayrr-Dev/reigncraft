import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { addingWorldPlazaInventoryItem } from '@/components/world/inventory/domains/addingWorldPlazaInventoryItemWithStacking';
import { DEFINING_WORLD_PLAZA_INVENTORY_HUD_MODE_TOOL_TYPE_IDS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryHudModeToolConstants';

/**
 * Returns true when the inventory already holds the given item type.
 *
 * @param state - Inventory state
 * @param itemTypeId - Item type id to find
 */
function checkingWorldPlazaInventoryHasItemTypeId(
  state: DefiningInventoryState,
  itemTypeId: string
): boolean {
  return state.slots.some(
    (slotItem) => slotItem !== null && slotItem.itemTypeId === itemTypeId
  );
}

/**
 * Grants missing Craft / Build / Claim tools into empty general slots.
 * Existing saves keep their layout; only absent tools are added.
 *
 * @param state - Inventory state after load / seed
 */
export function ensuringWorldPlazaInventoryHudModeTools(
  state: DefiningInventoryState
): DefiningInventoryState {
  let nextState = state;

  for (const itemTypeId of DEFINING_WORLD_PLAZA_INVENTORY_HUD_MODE_TOOL_TYPE_IDS) {
    if (checkingWorldPlazaInventoryHasItemTypeId(nextState, itemTypeId)) {
      continue;
    }

    nextState = addingWorldPlazaInventoryItem(nextState, {
      id: crypto.randomUUID(),
      itemTypeId,
      quantity: 1,
    });
  }

  return nextState;
}
