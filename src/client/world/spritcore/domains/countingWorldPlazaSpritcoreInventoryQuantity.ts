/**
 * Counts and spends Spiritcore across all tier item stacks.
 *
 * @module components/world/spritcore/domains/countingWorldPlazaSpritcoreInventoryQuantity
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { consumingWorldPlazaInventoryItemByType } from '@/components/world/inventory/domains/consumingWorldPlazaInventoryItemByType';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { DEFINING_WORLD_PLAZA_SPRITCORE_TIERED_ITEM_TYPE_IDS } from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreDropTierConstants';

const COUNTING_WORLD_PLAZA_SPRITCORE_INVENTORY_ALL_TYPE_IDS = [
  ...DEFINING_WORLD_PLAZA_SPRITCORE_TIERED_ITEM_TYPE_IDS,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE,
] as const;

/** Sums every Spiritcore tier stack plus any legacy single-type stacks. */
export function countingWorldPlazaSpritcoreInventoryQuantity(
  inventoryState: DefiningInventoryState
): number {
  return COUNTING_WORLD_PLAZA_SPRITCORE_INVENTORY_ALL_TYPE_IDS.reduce(
    (total, itemTypeId) =>
      total +
      inventoryState.slots.reduce(
        (slotTotal, slot) =>
          slot !== null && slot.itemTypeId === itemTypeId
            ? slotTotal + slot.quantity
            : slotTotal,
        0
      ),
    0
  );
}

export type ConsumingWorldPlazaSpritcoreInventoryQuantityResult = {
  readonly consumed: boolean;
  readonly nextState: DefiningInventoryState;
};

/**
 * Consumes Spiritcore from inventory, smallest tier stacks first.
 */
export function consumingWorldPlazaSpritcoreInventoryQuantity(
  inventoryState: DefiningInventoryState,
  quantity: number
): ConsumingWorldPlazaSpritcoreInventoryQuantityResult {
  if (quantity <= 0) {
    return { consumed: false, nextState: inventoryState };
  }

  if (countingWorldPlazaSpritcoreInventoryQuantity(inventoryState) < quantity) {
    return { consumed: false, nextState: inventoryState };
  }

  let remainingToConsume = quantity;
  let nextState = inventoryState;

  for (const itemTypeId of COUNTING_WORLD_PLAZA_SPRITCORE_INVENTORY_ALL_TYPE_IDS) {
    if (remainingToConsume <= 0) {
      break;
    }

    const ownedQuantity = nextState.slots.reduce(
      (total, slot) =>
        slot !== null && slot.itemTypeId === itemTypeId
          ? total + slot.quantity
          : total,
      0
    );

    if (ownedQuantity <= 0) {
      continue;
    }

    const consumeQuantity = Math.min(ownedQuantity, remainingToConsume);
    const consumeResult = consumingWorldPlazaInventoryItemByType(
      nextState,
      itemTypeId,
      consumeQuantity
    );

    if (!consumeResult.consumed) {
      return { consumed: false, nextState: inventoryState };
    }

    nextState = consumeResult.nextState;
    remainingToConsume -= consumeQuantity;
  }

  return {
    consumed: remainingToConsume <= 0,
    nextState,
  };
}
