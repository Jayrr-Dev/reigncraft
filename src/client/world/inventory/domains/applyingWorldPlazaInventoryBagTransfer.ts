import type {
  DefiningInventoryItem,
  DefiningInventoryState,
} from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningInventoryItemRegistry } from '@/components/inventory/domains/definingInventoryItemRegistry';
import {
  movingInventoryItemToSlot,
  resolvingInventoryItemSlotIndex,
} from '@/components/inventory/domains/reducingInventoryState';
import { checkingWorldPlazaInventoryItemIsBag } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryItemIsBag';
import {
  findingWorldPlazaInventoryHotbarSlotForBagInstanceId,
  resolvingWorldPlazaInventoryBagContents,
  writingWorldPlazaInventoryBagContents,
} from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryBagContents';

/** Drag source or drop target inside the hotbar or a bag grid. */
export type DefiningWorldPlazaInventoryDragLocation =
  | { readonly kind: 'hotbar'; readonly slotIndex: number }
  | {
      readonly kind: 'bag';
      readonly bagItemInstanceId: string;
      readonly bagSlotIndex: number;
    };

/**
 * Returns true when two drag locations refer to the same slot.
 */
function checkingWorldPlazaInventoryDragLocationsAreEqual(
  left: DefiningWorldPlazaInventoryDragLocation,
  right: DefiningWorldPlazaInventoryDragLocation
): boolean {
  if (left.kind !== right.kind) {
    return false;
  }

  if (left.kind === 'hotbar' && right.kind === 'hotbar') {
    return left.slotIndex === right.slotIndex;
  }

  if (left.kind === 'bag' && right.kind === 'bag') {
    return (
      left.bagItemInstanceId === right.bagItemInstanceId &&
      left.bagSlotIndex === right.bagSlotIndex
    );
  }

  return false;
}

/**
 * Resolves the item at a drag location, if any.
 */
function resolvingWorldPlazaInventoryItemAtLocation(
  state: DefiningInventoryState,
  location: DefiningWorldPlazaInventoryDragLocation,
  registry: DefiningInventoryItemRegistry
): DefiningInventoryItem | null {
  if (location.kind === 'hotbar') {
    return state.slots[location.slotIndex] ?? null;
  }

  const bagHotbarSlotIndex = findingWorldPlazaInventoryHotbarSlotForBagInstanceId(
    state,
    location.bagItemInstanceId
  );

  if (bagHotbarSlotIndex === null) {
    return null;
  }

  const bagItem = state.slots[bagHotbarSlotIndex];

  if (!bagItem) {
    return null;
  }

  const bagContents = resolvingWorldPlazaInventoryBagContents(bagItem, registry);
  return bagContents.slots[location.bagSlotIndex] ?? null;
}

/**
 * Writes an item (or null) at a drag location and returns updated hotbar state.
 */
function writingWorldPlazaInventoryItemAtLocation(
  state: DefiningInventoryState,
  location: DefiningWorldPlazaInventoryDragLocation,
  item: DefiningInventoryItem | null,
  registry: DefiningInventoryItemRegistry
): DefiningInventoryState {
  if (location.kind === 'hotbar') {
    const nextSlots = [...state.slots];
    nextSlots[location.slotIndex] = item;
    return {
      capacity: state.capacity,
      slots: nextSlots,
    };
  }

  const bagHotbarSlotIndex = findingWorldPlazaInventoryHotbarSlotForBagInstanceId(
    state,
    location.bagItemInstanceId
  );

  if (bagHotbarSlotIndex === null) {
    return state;
  }

  const bagItem = state.slots[bagHotbarSlotIndex];

  if (!bagItem) {
    return state;
  }

  const bagContents = resolvingWorldPlazaInventoryBagContents(bagItem, registry);
  const nextBagSlots = [...bagContents.slots];
  nextBagSlots[location.bagSlotIndex] =
    item === null ? null : { ...item, slotIndex: location.bagSlotIndex };

  const nextBagItem = writingWorldPlazaInventoryBagContents(bagItem, {
    capacity: bagContents.capacity,
    slots: nextBagSlots,
  });

  const nextHotbarSlots = [...state.slots];
  nextHotbarSlots[bagHotbarSlotIndex] = nextBagItem;

  return {
    capacity: state.capacity,
    slots: nextHotbarSlots,
  };
}

/**
 * Attempts to stack source onto target when types match and stacking is allowed.
 */
function stackingWorldPlazaInventoryItems(
  sourceItem: DefiningInventoryItem,
  targetItem: DefiningInventoryItem,
  registry: DefiningInventoryItemRegistry
): {
  readonly merged: DefiningInventoryItem;
  readonly remainder: DefiningInventoryItem | null;
} | null {
  if (sourceItem.itemTypeId !== targetItem.itemTypeId) {
    return null;
  }

  const typeDef = registry.resolvingItemType(sourceItem.itemTypeId);

  if (!typeDef?.isStackable || typeDef.maxStack <= 1) {
    return null;
  }

  const combinedQuantity = sourceItem.quantity + targetItem.quantity;

  if (combinedQuantity <= typeDef.maxStack) {
    return {
      merged: {
        ...targetItem,
        quantity: combinedQuantity,
      },
      remainder: null,
    };
  }

  const mergedQuantity = typeDef.maxStack;
  const remainderQuantity = combinedQuantity - typeDef.maxStack;

  return {
    merged: {
      ...targetItem,
      quantity: mergedQuantity,
    },
    remainder: {
      ...sourceItem,
      quantity: remainderQuantity,
    },
  };
}

/**
 * Moves, swaps, or stacks items between hotbar and bag locations.
 *
 * @param state - Current hotbar inventory state
 * @param from - Source drag location
 * @param to - Destination drag location
 * @param registry - Item type registry
 */
export function applyingWorldPlazaInventoryBagTransfer(
  state: DefiningInventoryState,
  from: DefiningWorldPlazaInventoryDragLocation,
  to: DefiningWorldPlazaInventoryDragLocation,
  registry: DefiningInventoryItemRegistry
): DefiningInventoryState {
  if (checkingWorldPlazaInventoryDragLocationsAreEqual(from, to)) {
    return state;
  }

  if (from.kind === 'hotbar' && to.kind === 'hotbar') {
    return movingInventoryItemToSlot(
      state,
      from.slotIndex,
      to.slotIndex,
      registry
    );
  }

  const sourceItem = resolvingWorldPlazaInventoryItemAtLocation(
    state,
    from,
    registry
  );

  if (!sourceItem) {
    return state;
  }

  if (
    to.kind === 'bag' &&
    checkingWorldPlazaInventoryItemIsBag(sourceItem.itemTypeId)
  ) {
    return state;
  }

  const targetItem = resolvingWorldPlazaInventoryItemAtLocation(
    state,
    to,
    registry
  );

  if (targetItem === null) {
    let nextState = writingWorldPlazaInventoryItemAtLocation(
      state,
      from,
      null,
      registry
    );

    const movedItem: DefiningInventoryItem = {
      ...sourceItem,
      slotIndex: to.kind === 'hotbar' ? to.slotIndex : to.bagSlotIndex,
    };

    nextState = writingWorldPlazaInventoryItemAtLocation(
      nextState,
      to,
      movedItem,
      registry
    );

    return nextState;
  }

  const stackResult = stackingWorldPlazaInventoryItems(
    sourceItem,
    targetItem,
    registry
  );

  if (stackResult) {
    let nextState = writingWorldPlazaInventoryItemAtLocation(
      state,
      to,
      {
        ...stackResult.merged,
        slotIndex: to.kind === 'hotbar' ? to.slotIndex : to.bagSlotIndex,
      },
      registry
    );

    nextState = writingWorldPlazaInventoryItemAtLocation(
      nextState,
      from,
      stackResult.remainder
        ? {
            ...stackResult.remainder,
            slotIndex:
              from.kind === 'hotbar' ? from.slotIndex : from.bagSlotIndex,
          }
        : null,
      registry
    );

    return nextState;
  }

  const swappedSourceItem: DefiningInventoryItem = {
    ...targetItem,
    slotIndex: from.kind === 'hotbar' ? from.slotIndex : from.bagSlotIndex,
  };
  const swappedTargetItem: DefiningInventoryItem = {
    ...sourceItem,
    slotIndex: to.kind === 'hotbar' ? to.slotIndex : to.bagSlotIndex,
  };

  if (checkingWorldPlazaInventoryItemIsBag(swappedSourceItem.itemTypeId)) {
    return state;
  }

  let nextState = writingWorldPlazaInventoryItemAtLocation(
    state,
    from,
    swappedSourceItem,
    registry
  );

  nextState = writingWorldPlazaInventoryItemAtLocation(
    nextState,
    to,
    swappedTargetItem,
    registry
  );

  return nextState;
}

/**
 * Resolves a drag location for an item instance id in the hotbar or any bag.
 *
 * @param state - Hotbar inventory state
 * @param itemInstanceId - Dragged item instance id
 * @param registry - Item type registry
 */
export function resolvingWorldPlazaInventoryDragLocationForItemId(
  state: DefiningInventoryState,
  itemInstanceId: string,
  registry: DefiningInventoryItemRegistry
): DefiningWorldPlazaInventoryDragLocation | null {
  const hotbarSlotIndex = resolvingInventoryItemSlotIndex(state, itemInstanceId);

  if (hotbarSlotIndex !== null) {
    return { kind: 'hotbar', slotIndex: hotbarSlotIndex };
  }

  for (let slotIndex = 0; slotIndex < state.capacity; slotIndex += 1) {
    const slotItem = state.slots[slotIndex];

    if (!slotItem || !checkingWorldPlazaInventoryItemIsBag(slotItem.itemTypeId)) {
      continue;
    }

    const bagContents = resolvingWorldPlazaInventoryBagContents(
      slotItem,
      registry
    );
    const bagSlotIndex = resolvingInventoryItemSlotIndex(
      bagContents,
      itemInstanceId
    );

    if (bagSlotIndex !== null) {
      return {
        kind: 'bag',
        bagItemInstanceId: slotItem.id,
        bagSlotIndex,
      };
    }
  }

  return null;
}

/**
 * Resolves the dragged item instance from hotbar or bag contents.
 *
 * @param state - Hotbar inventory state
 * @param itemInstanceId - Dragged item instance id
 * @param registry - Item type registry
 */
export function resolvingWorldPlazaInventoryDraggedItemById(
  state: DefiningInventoryState,
  itemInstanceId: string,
  registry: DefiningInventoryItemRegistry
): DefiningInventoryItem | null {
  const location = resolvingWorldPlazaInventoryDragLocationForItemId(
    state,
    itemInstanceId,
    registry
  );

  if (!location) {
    return null;
  }

  return resolvingWorldPlazaInventoryItemAtLocation(state, location, registry);
}
