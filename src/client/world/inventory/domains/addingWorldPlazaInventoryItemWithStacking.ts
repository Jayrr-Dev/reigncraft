import type {
  DefiningInventoryItemInput,
  DefiningInventoryState,
} from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningInventoryItemRegistry } from '@/components/inventory/domains/definingInventoryItemRegistry';
import {
  addingInventoryItem,
  type AddingInventoryItemWithStackingResult,
} from '@/components/inventory/domains/reducingInventoryState';
import { checkingWorldPlazaInventoryHotbarSlotAcceptsItemTypeId } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryHotbarSlotAcceptsItemTypeId';
import { findingWorldPlazaInventoryFirstEmptySlotForItemTypeId } from '@/components/world/inventory/domains/findingWorldPlazaInventoryFirstEmptySlotForItemTypeId';
import { checkingWorldPlazaInventoryItemHasAggroDeerMeatMetadata } from '@/components/world/wildlife/domains/checkingWorldPlazaInventoryItemHasAggroDeerMeatMetadata';

/**
 * Adds an item at an explicit slot or the first empty slot that accepts it.
 * Rejects placements into the reserved weapon/tool slot for non-equipment items.
 *
 * @param state - Current inventory state
 * @param itemInput - Item to add
 * @param targetSlotIndex - Optional explicit slot
 */
export function addingWorldPlazaInventoryItem(
  state: DefiningInventoryState,
  itemInput: DefiningInventoryItemInput,
  targetSlotIndex?: number
): DefiningInventoryState {
  const slotIndex =
    targetSlotIndex ??
    findingWorldPlazaInventoryFirstEmptySlotForItemTypeId(
      state,
      itemInput.itemTypeId
    );

  if (slotIndex === null) {
    return state;
  }

  if (
    !checkingWorldPlazaInventoryHotbarSlotAcceptsItemTypeId(
      slotIndex,
      itemInput.itemTypeId
    )
  ) {
    return state;
  }

  return addingInventoryItem(state, itemInput, slotIndex);
}

/**
 * Adds items with stacking, skipping the reserved weapon/tool slot for
 * non-equipment item types when opening new stacks.
 *
 * @param state - Current inventory state
 * @param itemInput - Item type and quantity to add
 * @param registry - Item type registry for stack rules
 */
export function addingWorldPlazaInventoryItemWithStacking(
  state: DefiningInventoryState,
  itemInput: DefiningInventoryItemInput,
  registry: DefiningInventoryItemRegistry
): AddingInventoryItemWithStackingResult {
  const typeDef = registry.resolvingItemType(itemInput.itemTypeId);
  const requestedQuantity = Math.max(1, itemInput.quantity ?? 1);
  let remainingQuantity = requestedQuantity;
  let nextState = state;

  if (typeDef?.isStackable && typeDef.maxStack > 1) {
    for (
      let slotIndex = 0;
      slotIndex < nextState.capacity && remainingQuantity > 0;
      slotIndex += 1
    ) {
      const slotItem = nextState.slots[slotIndex];

      if (
        slotItem === null ||
        slotItem.itemTypeId !== itemInput.itemTypeId ||
        slotItem.quantity >= typeDef.maxStack ||
        checkingWorldPlazaInventoryItemHasAggroDeerMeatMetadata(
          slotItem.metadata
        ) !==
          checkingWorldPlazaInventoryItemHasAggroDeerMeatMetadata(
            itemInput.metadata
          )
      ) {
        continue;
      }

      const stackSpace = typeDef.maxStack - slotItem.quantity;
      const quantityToMerge = Math.min(stackSpace, remainingQuantity);
      const slots = [...nextState.slots];
      slots[slotIndex] = {
        ...slotItem,
        quantity: slotItem.quantity + quantityToMerge,
      };
      nextState = {
        capacity: nextState.capacity,
        slots,
      };
      remainingQuantity -= quantityToMerge;
    }
  }

  const maxStackPerSlot =
    typeDef?.isStackable && typeDef.maxStack > 1 ? typeDef.maxStack : 1;

  while (remainingQuantity > 0) {
    const emptySlotIndex =
      findingWorldPlazaInventoryFirstEmptySlotForItemTypeId(
        nextState,
        itemInput.itemTypeId
      );

    if (emptySlotIndex === null) {
      break;
    }

    const stackQuantity = Math.min(remainingQuantity, maxStackPerSlot);

    nextState = addingWorldPlazaInventoryItem(
      nextState,
      {
        id: crypto.randomUUID(),
        itemTypeId: itemInput.itemTypeId,
        quantity: stackQuantity,
        metadata: itemInput.metadata,
      },
      emptySlotIndex
    );
    remainingQuantity -= stackQuantity;
  }

  return {
    state: nextState,
    quantityAccepted: requestedQuantity - remainingQuantity,
    quantityOverflow: remainingQuantity,
  };
}
