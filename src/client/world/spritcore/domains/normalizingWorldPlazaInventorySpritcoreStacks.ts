/**
 * Collapses legacy Spritcore tier stacks into the shared pool item type.
 *
 * @module components/world/spritcore/domains/normalizingWorldPlazaInventorySpritcoreStacks
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningInventoryItemRegistry } from '@/components/inventory/domains/definingInventoryItemRegistry';
import { addingWorldPlazaInventoryItemWithStacking } from '@/components/world/inventory/domains/addingWorldPlazaInventoryItemWithStacking';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { checkingWorldPlazaInventoryItemIsSpritcore } from '@/components/world/spritcore/domains/checkingWorldPlazaInventoryItemIsSpritcore';

/**
 * Remaps every Spritcore stack onto `world-plaza-spritcore` and merges quantities.
 * Also collapses duplicate canonical piles (shared pool should be one stack).
 * No-op when inventory already has a single canonical Spritcore stack.
 */
export function normalizingWorldPlazaInventorySpritcoreStacks(
  state: DefiningInventoryState,
  registry: DefiningInventoryItemRegistry
): DefiningInventoryState {
  let totalQuantity = 0;
  let spritcoreStackCount = 0;
  let needsRemap = false;

  for (const slot of state.slots) {
    if (slot === null) {
      continue;
    }

    if (!checkingWorldPlazaInventoryItemIsSpritcore(slot.itemTypeId)) {
      continue;
    }

    totalQuantity += slot.quantity;
    spritcoreStackCount += 1;

    if (
      slot.itemTypeId !== DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE
    ) {
      needsRemap = true;
    }
  }

  const needsCollapse = needsRemap || spritcoreStackCount > 1;

  if (!needsCollapse || totalQuantity <= 0) {
    return state;
  }

  const clearedSlots = state.slots.map((slot) =>
    slot !== null && checkingWorldPlazaInventoryItemIsSpritcore(slot.itemTypeId)
      ? null
      : slot
  );

  const clearedState: DefiningInventoryState = {
    capacity: state.capacity,
    slots: clearedSlots,
  };

  return addingWorldPlazaInventoryItemWithStacking(
    clearedState,
    {
      id: crypto.randomUUID(),
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE,
      quantity: totalQuantity,
    },
    registry
  ).state;
}
