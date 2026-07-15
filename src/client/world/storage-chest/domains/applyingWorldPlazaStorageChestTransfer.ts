/**
 * Moves / stacks / swaps items between hotbar and a storage chest grid.
 *
 * @module components/world/storage-chest/domains/applyingWorldPlazaStorageChestTransfer
 */

import type {
  DefiningInventoryItem,
  DefiningInventoryState,
} from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningInventoryItemRegistry } from '@/components/inventory/domains/definingInventoryItemRegistry';
import { resolvingInventoryItemSlotIndex } from '@/components/inventory/domains/reducingInventoryState';
import { checkingWorldPlazaInventoryHotbarSlotAcceptsItemTypeId } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryHotbarSlotAcceptsItemTypeId';
import { checkingWorldPlazaInventoryItemIsBag } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryItemIsBag';
import { DEFINING_WORLD_PLAZA_STORAGE_CHEST_CAPACITY } from '@/components/world/storage-chest/domains/definingWorldPlazaStorageChestConstants';

export type DefiningWorldPlazaStorageChestDragLocation =
  | { readonly kind: 'hotbar'; readonly slotIndex: number }
  | {
      readonly kind: 'storage-chest';
      readonly blockId: string;
      readonly slotIndex: number;
    };

export type ApplyingWorldPlazaStorageChestTransferResult = {
  readonly inventoryState: DefiningInventoryState;
  readonly chestContents: DefiningInventoryState;
};

function stackingWorldPlazaStorageChestItems(
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
      merged: { ...targetItem, quantity: combinedQuantity },
      remainder: null,
    };
  }

  return {
    merged: { ...targetItem, quantity: typeDef.maxStack },
    remainder: {
      ...sourceItem,
      quantity: combinedQuantity - typeDef.maxStack,
    },
  };
}

function resolvingItemAtLocation(
  inventoryState: DefiningInventoryState,
  chestContents: DefiningInventoryState,
  location: DefiningWorldPlazaStorageChestDragLocation
): DefiningInventoryItem | null {
  if (location.kind === 'hotbar') {
    return inventoryState.slots[location.slotIndex] ?? null;
  }

  return chestContents.slots[location.slotIndex] ?? null;
}

function writingItemAtLocation(
  inventoryState: DefiningInventoryState,
  chestContents: DefiningInventoryState,
  location: DefiningWorldPlazaStorageChestDragLocation,
  item: DefiningInventoryItem | null
): ApplyingWorldPlazaStorageChestTransferResult {
  if (location.kind === 'hotbar') {
    const nextSlots = [...inventoryState.slots];
    nextSlots[location.slotIndex] = item;
    return {
      inventoryState: {
        capacity: inventoryState.capacity,
        slots: nextSlots,
      },
      chestContents,
    };
  }

  const nextChestSlots = [...chestContents.slots];
  nextChestSlots[location.slotIndex] = item;
  return {
    inventoryState,
    chestContents: {
      capacity: chestContents.capacity,
      slots: nextChestSlots,
    },
  };
}

function checkingLocationsEqual(
  left: DefiningWorldPlazaStorageChestDragLocation,
  right: DefiningWorldPlazaStorageChestDragLocation
): boolean {
  if (left.kind !== right.kind) {
    return false;
  }

  if (left.kind === 'hotbar' && right.kind === 'hotbar') {
    return left.slotIndex === right.slotIndex;
  }

  if (left.kind === 'storage-chest' && right.kind === 'storage-chest') {
    return left.blockId === right.blockId && left.slotIndex === right.slotIndex;
  }

  return false;
}

/**
 * Finds a hotbar or open-chest location for a dragged item instance id.
 */
export function resolvingWorldPlazaStorageChestDragLocationForItemId(
  inventoryState: DefiningInventoryState,
  chestContents: DefiningInventoryState,
  blockId: string,
  itemInstanceId: string
): DefiningWorldPlazaStorageChestDragLocation | null {
  const hotbarSlotIndex = resolvingInventoryItemSlotIndex(
    inventoryState,
    itemInstanceId
  );

  if (hotbarSlotIndex !== null) {
    return { kind: 'hotbar', slotIndex: hotbarSlotIndex };
  }

  const chestSlotIndex = resolvingInventoryItemSlotIndex(
    chestContents,
    itemInstanceId
  );

  if (chestSlotIndex !== null) {
    return {
      kind: 'storage-chest',
      blockId,
      slotIndex: chestSlotIndex,
    };
  }

  return null;
}

/**
 * Moves, swaps, or stacks between inventory hotbar and one storage chest.
 */
export function applyingWorldPlazaStorageChestTransfer(
  inventoryState: DefiningInventoryState,
  chestContents: DefiningInventoryState,
  from: DefiningWorldPlazaStorageChestDragLocation,
  to: DefiningWorldPlazaStorageChestDragLocation,
  registry: DefiningInventoryItemRegistry
): ApplyingWorldPlazaStorageChestTransferResult {
  if (checkingLocationsEqual(from, to)) {
    return { inventoryState, chestContents };
  }

  if (
    from.kind === 'storage-chest' &&
    to.kind === 'storage-chest' &&
    from.blockId !== to.blockId
  ) {
    return { inventoryState, chestContents };
  }

  const sourceItem = resolvingItemAtLocation(
    inventoryState,
    chestContents,
    from
  );

  if (!sourceItem) {
    return { inventoryState, chestContents };
  }

  if (
    to.kind === 'storage-chest' &&
    checkingWorldPlazaInventoryItemIsBag(sourceItem.itemTypeId)
  ) {
    return { inventoryState, chestContents };
  }

  if (
    to.kind === 'hotbar' &&
    !checkingWorldPlazaInventoryHotbarSlotAcceptsItemTypeId(
      to.slotIndex,
      sourceItem.itemTypeId
    )
  ) {
    return { inventoryState, chestContents };
  }

  const targetItem = resolvingItemAtLocation(inventoryState, chestContents, to);

  if (targetItem === null) {
    let result = writingItemAtLocation(
      inventoryState,
      chestContents,
      from,
      null
    );
    const movedItem: DefiningInventoryItem = {
      ...sourceItem,
      slotIndex: to.slotIndex,
    };
    result = writingItemAtLocation(
      result.inventoryState,
      result.chestContents,
      to,
      movedItem
    );
    return result;
  }

  const stackResult = stackingWorldPlazaStorageChestItems(
    sourceItem,
    targetItem,
    registry
  );

  if (stackResult) {
    let result = writingItemAtLocation(inventoryState, chestContents, to, {
      ...stackResult.merged,
      slotIndex: to.slotIndex,
    });
    result = writingItemAtLocation(
      result.inventoryState,
      result.chestContents,
      from,
      stackResult.remainder
        ? { ...stackResult.remainder, slotIndex: from.slotIndex }
        : null
    );
    return result;
  }

  const swappedSource: DefiningInventoryItem = {
    ...targetItem,
    slotIndex: from.slotIndex,
  };
  const swappedTarget: DefiningInventoryItem = {
    ...sourceItem,
    slotIndex: to.slotIndex,
  };

  if (
    to.kind === 'storage-chest' &&
    checkingWorldPlazaInventoryItemIsBag(swappedSource.itemTypeId)
  ) {
    return { inventoryState, chestContents };
  }

  if (
    from.kind === 'storage-chest' &&
    checkingWorldPlazaInventoryItemIsBag(swappedTarget.itemTypeId)
  ) {
    return { inventoryState, chestContents };
  }

  if (
    from.kind === 'hotbar' &&
    !checkingWorldPlazaInventoryHotbarSlotAcceptsItemTypeId(
      from.slotIndex,
      swappedSource.itemTypeId
    )
  ) {
    return { inventoryState, chestContents };
  }

  if (
    to.kind === 'hotbar' &&
    !checkingWorldPlazaInventoryHotbarSlotAcceptsItemTypeId(
      to.slotIndex,
      swappedTarget.itemTypeId
    )
  ) {
    return { inventoryState, chestContents };
  }

  let result = writingItemAtLocation(
    inventoryState,
    chestContents,
    from,
    swappedSource
  );
  result = writingItemAtLocation(
    result.inventoryState,
    result.chestContents,
    to,
    swappedTarget
  );
  return result;
}

/**
 * Ensures chest contents always expose the declarative capacity.
 */
export function normalizingWorldPlazaStorageChestContents(
  contents: DefiningInventoryState
): DefiningInventoryState {
  if (contents.capacity === DEFINING_WORLD_PLAZA_STORAGE_CHEST_CAPACITY) {
    return contents;
  }

  const slots = Array.from(
    { length: DEFINING_WORLD_PLAZA_STORAGE_CHEST_CAPACITY },
    (_, index) => contents.slots[index] ?? null
  );

  return {
    capacity: DEFINING_WORLD_PLAZA_STORAGE_CHEST_CAPACITY,
    slots,
  };
}
