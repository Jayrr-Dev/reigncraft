import type {
  DefiningInventoryItem,
  DefiningInventoryItemInput,
  DefiningInventorySlot,
  DefiningInventoryState,
} from "@/components/inventory/domains/definingInventoryItem";
import type { DefiningInventoryItemRegistry } from "@/components/inventory/domains/definingInventoryItemRegistry";

/**
 * Creates an empty inventory state with the given capacity.
 *
 * @param capacity - Number of slots
 */
export function creatingEmptyInventoryState(
  capacity: number,
): DefiningInventoryState {
  return {
    capacity,
    slots: Array.from({ length: capacity }, () => null),
  };
}

/**
 * Clones slots array with one slot updated.
 *
 * @param slots - Current slots
 * @param slotIndex - Target index
 * @param value - New slot value
 */
function cloningInventorySlotsWithUpdate(
  slots: readonly DefiningInventorySlot[],
  slotIndex: number,
  value: DefiningInventorySlot,
): DefiningInventorySlot[] {
  const nextSlots = [...slots];
  nextSlots[slotIndex] = value;
  return nextSlots;
}

/**
 * Validates a slot index is within bounds.
 *
 * @param state - Inventory state
 * @param slotIndex - Slot to check
 */
function checkingInventorySlotInBounds(
  state: DefiningInventoryState,
  slotIndex: number,
): boolean {
  return slotIndex >= 0 && slotIndex < state.capacity;
}

/**
 * Finds the first empty slot index, or null when full.
 *
 * @param state - Inventory state
 */
export function findingInventoryFirstEmptySlot(
  state: DefiningInventoryState,
): number | null {
  const emptyIndex = state.slots.findIndex((slot) => slot === null);
  return emptyIndex >= 0 ? emptyIndex : null;
}

/**
 * Resolves the slot index for an item by its instance id.
 *
 * @param state - Inventory state
 * @param itemId - Item instance id
 */
export function resolvingInventoryItemSlotIndex(
  state: DefiningInventoryState,
  itemId: string,
): number | null {
  const slotIndex = state.slots.findIndex((slot) => slot?.id === itemId);
  return slotIndex >= 0 ? slotIndex : null;
}

/**
 * Adds an item to the inventory at a specific or first-available slot.
 *
 * @param state - Current inventory state
 * @param itemInput - Item to add
 * @param targetSlotIndex - Optional explicit slot (auto-finds when omitted)
 */
export function addingInventoryItem(
  state: DefiningInventoryState,
  itemInput: DefiningInventoryItemInput,
  targetSlotIndex?: number,
): DefiningInventoryState {
  const slotIndex =
    targetSlotIndex ?? findingInventoryFirstEmptySlot(state);

  if (slotIndex === null || !checkingInventorySlotInBounds(state, slotIndex)) {
    return state;
  }

  if (state.slots[slotIndex] !== null) {
    return state;
  }

  const item: DefiningInventoryItem = {
    id: itemInput.id,
    itemTypeId: itemInput.itemTypeId,
    quantity: Math.max(1, itemInput.quantity ?? 1),
    slotIndex,
    metadata: itemInput.metadata,
  };

  return {
    capacity: state.capacity,
    slots: cloningInventorySlotsWithUpdate(state.slots, slotIndex, item),
  };
}

/**
 * Removes an item from a slot.
 *
 * @param state - Current inventory state
 * @param slotIndex - Slot to clear
 */
export function removingInventoryItemFromSlot(
  state: DefiningInventoryState,
  slotIndex: number,
): DefiningInventoryState {
  if (!checkingInventorySlotInBounds(state, slotIndex)) {
    return state;
  }

  return {
    capacity: state.capacity,
    slots: cloningInventorySlotsWithUpdate(state.slots, slotIndex, null),
  };
}

/**
 * Attempts to stack source onto target when types match and stacking is allowed.
 *
 * @param sourceItem - Item being moved
 * @param targetItem - Item in destination slot
 * @param registry - Item type registry
 */
function stackingInventoryItems(
  sourceItem: DefiningInventoryItem,
  targetItem: DefiningInventoryItem,
  registry: DefiningInventoryItemRegistry,
): { merged: DefiningInventoryItem; remainder: DefiningInventoryItem | null } | null {
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

/** Result of {@link addingInventoryItemWithStacking}. */
export interface AddingInventoryItemWithStackingResult {
  readonly state: DefiningInventoryState;
  /** Quantity successfully added to inventory. */
  readonly quantityAccepted: number;
  /** Quantity that could not fit (inventory full or stacks capped). */
  readonly quantityOverflow: number;
}

/**
 * Adds items to inventory, merging into existing stacks when allowed.
 *
 * @param state - Current inventory state
 * @param itemInput - Item type and quantity to add
 * @param registry - Item type registry for stack rules
 */
export function addingInventoryItemWithStacking(
  state: DefiningInventoryState,
  itemInput: DefiningInventoryItemInput,
  registry: DefiningInventoryItemRegistry,
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
        slotItem.quantity >= typeDef.maxStack
      ) {
        continue;
      }

      const stackSpace = typeDef.maxStack - slotItem.quantity;
      const quantityToMerge = Math.min(stackSpace, remainingQuantity);

      nextState = {
        capacity: nextState.capacity,
        slots: cloningInventorySlotsWithUpdate(nextState.slots, slotIndex, {
          ...slotItem,
          quantity: slotItem.quantity + quantityToMerge,
        }),
      };
      remainingQuantity -= quantityToMerge;
    }
  }

  const maxStackPerSlot =
    typeDef?.isStackable && typeDef.maxStack > 1 ? typeDef.maxStack : 1;

  while (remainingQuantity > 0) {
    const emptySlotIndex = findingInventoryFirstEmptySlot(nextState);

    if (emptySlotIndex === null) {
      break;
    }

    const stackQuantity = Math.min(remainingQuantity, maxStackPerSlot);

    nextState = addingInventoryItem(
      nextState,
      {
        id: crypto.randomUUID(),
        itemTypeId: itemInput.itemTypeId,
        quantity: stackQuantity,
        metadata: itemInput.metadata,
      },
      emptySlotIndex,
    );
    remainingQuantity -= stackQuantity;
  }

  return {
    state: nextState,
    quantityAccepted: requestedQuantity - remainingQuantity,
    quantityOverflow: remainingQuantity,
  };
}

/**
 * Moves an item from one slot to another: move, swap, or stack.
 *
 * @param state - Current inventory state
 * @param fromSlotIndex - Source slot
 * @param toSlotIndex - Destination slot
 * @param registry - Item type registry for stack rules
 */
export function movingInventoryItemToSlot(
  state: DefiningInventoryState,
  fromSlotIndex: number,
  toSlotIndex: number,
  registry: DefiningInventoryItemRegistry,
): DefiningInventoryState {
  if (
    fromSlotIndex === toSlotIndex ||
    !checkingInventorySlotInBounds(state, fromSlotIndex) ||
    !checkingInventorySlotInBounds(state, toSlotIndex)
  ) {
    return state;
  }

  const sourceItem = state.slots[fromSlotIndex];

  if (!sourceItem) {
    return state;
  }

  const targetItem = state.slots[toSlotIndex];
  let nextSlots = [...state.slots];

  if (targetItem === null) {
    nextSlots[fromSlotIndex] = null;
    nextSlots[toSlotIndex] = { ...sourceItem, slotIndex: toSlotIndex };
  } else {
    const stackResult = stackingInventoryItems(
      sourceItem,
      targetItem,
      registry,
    );

    if (stackResult) {
      nextSlots[toSlotIndex] = {
        ...stackResult.merged,
        slotIndex: toSlotIndex,
      };

      if (stackResult.remainder) {
        nextSlots[fromSlotIndex] = {
          ...stackResult.remainder,
          slotIndex: fromSlotIndex,
        };
      } else {
        nextSlots[fromSlotIndex] = null;
      }
    } else {
      nextSlots[fromSlotIndex] = { ...targetItem, slotIndex: fromSlotIndex };
      nextSlots[toSlotIndex] = { ...sourceItem, slotIndex: toSlotIndex };
    }
  }

  return {
    capacity: state.capacity,
    slots: nextSlots,
  };
}

/** Comparator for sorting inventory items. */
export type DefiningInventoryItemComparator = (
  a: DefiningInventoryItem,
  b: DefiningInventoryItem,
) => number;

/**
 * Compacts and sorts items left-to-right by a comparator, leaving trailing empty slots.
 *
 * @param state - Current inventory state
 * @param comparator - Sort comparator for occupied items
 */
export function sortingInventoryItems(
  state: DefiningInventoryState,
  comparator: DefiningInventoryItemComparator,
): DefiningInventoryState {
  const occupiedItems = state.slots.filter(
    (slot): slot is DefiningInventoryItem => slot !== null,
  );

  occupiedItems.sort(comparator);

  const nextSlots: DefiningInventorySlot[] = Array.from(
    { length: state.capacity },
    () => null,
  );

  for (let index = 0; index < occupiedItems.length; index += 1) {
    if (index >= state.capacity) {
      break;
    }

    nextSlots[index] = { ...occupiedItems[index], slotIndex: index };
  }

  return {
    capacity: state.capacity,
    slots: nextSlots,
  };
}

/**
 * Default sort: alphabetical by item type id.
 */
export const comparingInventoryItemsByTypeId: DefiningInventoryItemComparator =
  (a, b) => a.itemTypeId.localeCompare(b.itemTypeId);
