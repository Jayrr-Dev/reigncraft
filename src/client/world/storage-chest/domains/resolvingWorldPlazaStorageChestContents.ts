/**
 * Parse / serialize storage chest slot grids.
 *
 * @module components/world/storage-chest/domains/resolvingWorldPlazaStorageChestContents
 */

import type {
  DefiningInventoryItem,
  DefiningInventorySlot,
  DefiningInventoryState,
} from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningInventoryItemRegistry } from '@/components/inventory/domains/definingInventoryItemRegistry';
import { creatingEmptyInventoryState } from '@/components/inventory/domains/reducingInventoryState';
import { checkingWorldPlazaInventoryItemIsBag } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryItemIsBag';
import { DEFINING_WORLD_PLAZA_STORAGE_CHEST_CAPACITY } from '@/components/world/storage-chest/domains/definingWorldPlazaStorageChestConstants';

type ParsingWorldPlazaStorageChestSlotRaw = {
  readonly id?: unknown;
  readonly itemTypeId?: unknown;
  readonly quantity?: unknown;
  readonly slotIndex?: unknown;
  readonly metadata?: unknown;
};

function parsingWorldPlazaStorageChestSlot(
  raw: unknown,
  slotIndex: number,
  registry: DefiningInventoryItemRegistry
): DefiningInventorySlot {
  if (raw === null || raw === undefined) {
    return null;
  }

  if (typeof raw !== 'object') {
    return null;
  }

  const slotRaw = raw as ParsingWorldPlazaStorageChestSlotRaw;

  if (
    typeof slotRaw.id !== 'string' ||
    typeof slotRaw.itemTypeId !== 'string'
  ) {
    return null;
  }

  const typeDef = registry.resolvingItemType(slotRaw.itemTypeId);

  if (!typeDef) {
    return null;
  }

  if (checkingWorldPlazaInventoryItemIsBag(slotRaw.itemTypeId)) {
    return null;
  }

  const quantity =
    typeof slotRaw.quantity === 'number' && slotRaw.quantity >= 1
      ? Math.min(slotRaw.quantity, typeDef.maxStack)
      : 1;

  const metadata =
    slotRaw.metadata !== null &&
    slotRaw.metadata !== undefined &&
    typeof slotRaw.metadata === 'object' &&
    !Array.isArray(slotRaw.metadata)
      ? (slotRaw.metadata as Record<string, unknown>)
      : undefined;

  return {
    id: slotRaw.id,
    itemTypeId: slotRaw.itemTypeId,
    quantity,
    slotIndex,
    metadata,
  };
}

/**
 * Builds an empty chest inventory state at default capacity.
 */
export function creatingWorldPlazaStorageChestEmptyContents(
  capacity: number = DEFINING_WORLD_PLAZA_STORAGE_CHEST_CAPACITY
): DefiningInventoryState {
  return creatingEmptyInventoryState(capacity);
}

/**
 * Parses persisted chest slot JSON into a fixed-capacity inventory state.
 */
export function resolvingWorldPlazaStorageChestContentsFromPersistedSlots(
  rawSlots: unknown,
  registry: DefiningInventoryItemRegistry,
  capacity: number = DEFINING_WORLD_PLAZA_STORAGE_CHEST_CAPACITY
): DefiningInventoryState {
  const slots: DefiningInventorySlot[] = Array.from(
    { length: capacity },
    () => null
  );

  if (!Array.isArray(rawSlots)) {
    return { capacity, slots };
  }

  for (let index = 0; index < capacity; index += 1) {
    slots[index] = parsingWorldPlazaStorageChestSlot(
      rawSlots[index],
      index,
      registry
    );
  }

  return { capacity, slots };
}

/**
 * Serializes chest slots for localStorage (nulls kept for stable indices).
 */
export function serializingWorldPlazaStorageChestContents(
  contents: DefiningInventoryState
): readonly (DefiningInventoryItem | null)[] {
  return contents.slots.map((slot, slotIndex) => {
    if (!slot) {
      return null;
    }

    return {
      id: slot.id,
      itemTypeId: slot.itemTypeId,
      quantity: slot.quantity,
      slotIndex,
      ...(slot.metadata ? { metadata: slot.metadata } : {}),
    };
  });
}
