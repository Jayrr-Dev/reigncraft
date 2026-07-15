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
import { checkingWorldPlazaInventoryItemHasStudiedOreMetadata } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryItemHasStudiedOreMetadata';
import { findingWorldPlazaInventoryFirstEmptySlotForItemTypeId } from '@/components/world/inventory/domains/findingWorldPlazaInventoryFirstEmptySlotForItemTypeId';
import { resolvingWorldPlazaSpritcoreCanonicalItemTypeId } from '@/components/world/spritcore/domains/resolvingWorldPlazaSpritcoreCanonicalItemTypeId';
import { checkingWorldPlazaTeaBrewingMetadataStackCompatible } from '@/components/world/tea-brewing/domains/resolvingWorldPlazaTeaBrewingMetadata';
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
  const canonicalItemInput = {
    ...itemInput,
    itemTypeId: resolvingWorldPlazaSpritcoreCanonicalItemTypeId(
      itemInput.itemTypeId
    ),
  };
  const slotIndex =
    targetSlotIndex ??
    findingWorldPlazaInventoryFirstEmptySlotForItemTypeId(
      state,
      canonicalItemInput.itemTypeId
    );

  if (slotIndex === null) {
    return state;
  }

  if (
    !checkingWorldPlazaInventoryHotbarSlotAcceptsItemTypeId(
      slotIndex,
      canonicalItemInput.itemTypeId
    )
  ) {
    return state;
  }

  return addingInventoryItem(state, canonicalItemInput, slotIndex);
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
  const canonicalItemTypeId = resolvingWorldPlazaSpritcoreCanonicalItemTypeId(
    itemInput.itemTypeId
  );
  const canonicalItemInput = {
    ...itemInput,
    itemTypeId: canonicalItemTypeId,
  };
  const typeDef = registry.resolvingItemType(canonicalItemTypeId);
  const requestedQuantity = Math.max(1, canonicalItemInput.quantity ?? 1);
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
        slotItem.itemTypeId !== canonicalItemTypeId ||
        slotItem.quantity >= typeDef.maxStack ||
        checkingWorldPlazaInventoryItemHasAggroDeerMeatMetadata(
          slotItem.metadata
        ) !==
          checkingWorldPlazaInventoryItemHasAggroDeerMeatMetadata(
            canonicalItemInput.metadata
          ) ||
        checkingWorldPlazaInventoryItemHasStudiedOreMetadata(
          slotItem.metadata
        ) !==
          checkingWorldPlazaInventoryItemHasStudiedOreMetadata(
            canonicalItemInput.metadata
          ) ||
        !checkingWorldPlazaTeaBrewingMetadataStackCompatible(
          slotItem.metadata,
          canonicalItemInput.metadata
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
        canonicalItemTypeId
      );

    if (emptySlotIndex === null) {
      break;
    }

    const stackQuantity = Math.min(remainingQuantity, maxStackPerSlot);

    nextState = addingWorldPlazaInventoryItem(
      nextState,
      {
        id: crypto.randomUUID(),
        itemTypeId: canonicalItemTypeId,
        quantity: stackQuantity,
        metadata: canonicalItemInput.metadata,
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
