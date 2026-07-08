import type {
  DefiningInventoryItem,
  DefiningInventorySlot,
  DefiningInventoryState,
} from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningInventoryItemRegistry } from '@/components/inventory/domains/definingInventoryItemRegistry';
import { creatingEmptyInventoryState } from '@/components/inventory/domains/reducingInventoryState';
import { checkingWorldPlazaInventoryItemIsBag } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryItemIsBag';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_BAG_DEFINITION_BY_TYPE_ID,
  DEFINING_WORLD_PLAZA_INVENTORY_BAG_SLOTS_METADATA_KEY,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryBagConstants';

/** Raw persisted bag slot shape (loosely typed for JSON parsing). */
type ParsingWorldPlazaInventoryBagSlotRaw = {
  readonly id?: unknown;
  readonly itemTypeId?: unknown;
  readonly quantity?: unknown;
  readonly slotIndex?: unknown;
  readonly metadata?: unknown;
};

/**
 * Resolves bag capacity from a bag item type id.
 *
 * @param itemTypeId - Bag item type id
 */
export function resolvingWorldPlazaInventoryBagCapacity(
  itemTypeId: string
): number | null {
  const definition =
    DEFINING_WORLD_PLAZA_INVENTORY_BAG_DEFINITION_BY_TYPE_ID[itemTypeId];

  if (!definition) {
    return null;
  }

  return definition.columns * definition.rows;
}

/**
 * Validates and sanitizes one bag slot from persisted metadata.
 *
 * @param raw - Raw slot object
 * @param slotIndex - Expected slot index
 * @param registry - Item type registry
 */
function parsingWorldPlazaInventoryBagSlot(
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

  const slotRaw = raw as ParsingWorldPlazaInventoryBagSlotRaw;

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
 * Reads bag contents from a bag item instance into inventory state.
 *
 * @param bagItem - Bag item occupying a hotbar slot
 * @param registry - Item type registry
 */
export function resolvingWorldPlazaInventoryBagContents(
  bagItem: DefiningInventoryItem,
  registry: DefiningInventoryItemRegistry
): DefiningInventoryState {
  const capacity = resolvingWorldPlazaInventoryBagCapacity(bagItem.itemTypeId);

  if (capacity === null) {
    return creatingEmptyInventoryState(0);
  }

  const emptyState = creatingEmptyInventoryState(capacity);
  const rawMetadata =
    bagItem.metadata?.[DEFINING_WORLD_PLAZA_INVENTORY_BAG_SLOTS_METADATA_KEY];

  if (!Array.isArray(rawMetadata)) {
    return emptyState;
  }

  const nextSlots = emptyState.slots.map((_, index) => {
    const rawSlot = index < rawMetadata.length ? rawMetadata[index] : null;
    return parsingWorldPlazaInventoryBagSlot(rawSlot, index, registry);
  });

  return {
    capacity,
    slots: nextSlots,
  };
}

/**
 * Returns true when a bag item has at least one occupied internal slot.
 *
 * @param bagItem - Bag item instance
 * @param registry - Item type registry
 */
export function checkingWorldPlazaInventoryBagHasContents(
  bagItem: DefiningInventoryItem,
  registry: DefiningInventoryItemRegistry
): boolean {
  const contents = resolvingWorldPlazaInventoryBagContents(bagItem, registry);
  return contents.slots.some((slot) => slot !== null);
}

/**
 * Writes bag contents back onto a bag item instance metadata.
 *
 * @param bagItem - Bag item occupying a hotbar slot
 * @param contentsState - Internal bag inventory state
 */
export function writingWorldPlazaInventoryBagContents(
  bagItem: DefiningInventoryItem,
  contentsState: DefiningInventoryState
): DefiningInventoryItem {
  const serializedSlots = contentsState.slots.map((slot) =>
    slot === null
      ? null
      : {
          id: slot.id,
          itemTypeId: slot.itemTypeId,
          quantity: slot.quantity,
          slotIndex: slot.slotIndex,
          metadata: slot.metadata,
        }
  );

  return {
    ...bagItem,
    metadata: {
      ...bagItem.metadata,
      [DEFINING_WORLD_PLAZA_INVENTORY_BAG_SLOTS_METADATA_KEY]: serializedSlots,
    },
  };
}

/**
 * Finds the hotbar slot index holding a bag with the given instance id.
 *
 * @param state - Hotbar inventory state
 * @param bagItemInstanceId - Bag item instance id
 */
export function findingWorldPlazaInventoryHotbarSlotForBagInstanceId(
  state: DefiningInventoryState,
  bagItemInstanceId: string
): number | null {
  for (let slotIndex = 0; slotIndex < state.capacity; slotIndex += 1) {
    const slotItem = state.slots[slotIndex];

    if (slotItem?.id === bagItemInstanceId) {
      return slotIndex;
    }
  }

  return null;
}

/**
 * Returns the first hotbar slot index containing a bag item, if any.
 *
 * @param state - Hotbar inventory state
 */
export function findingWorldPlazaInventoryFirstBagHotbarSlotIndex(
  state: DefiningInventoryState
): number | null {
  for (let slotIndex = 0; slotIndex < state.capacity; slotIndex += 1) {
    const slotItem = state.slots[slotIndex];

    if (slotItem && checkingWorldPlazaInventoryItemIsBag(slotItem.itemTypeId)) {
      return slotIndex;
    }
  }

  return null;
}
