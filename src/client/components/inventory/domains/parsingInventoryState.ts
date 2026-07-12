import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningInventoryItemRegistry } from '@/components/inventory/domains/definingInventoryItemRegistry';
import { expandingInventorySlotsByOneColumnPerRow } from '@/components/inventory/domains/expandingInventorySlotsByOneColumnPerRow';
import { creatingEmptyInventoryState } from '@/components/inventory/domains/reducingInventoryState';

/** Raw persisted slot shape (loosely typed for JSON parsing). */
interface ParsingInventorySlotRaw {
  id?: unknown;
  itemTypeId?: unknown;
  quantity?: unknown;
  slotIndex?: unknown;
  metadata?: unknown;
}

/** Raw persisted state shape. */
interface ParsingInventoryStateRaw {
  capacity?: unknown;
  slots?: unknown;
}

/**
 * Validates and sanitizes a single slot from persisted JSON.
 *
 * @param raw - Raw slot object
 * @param slotIndex - Expected slot index
 * @param registry - Item type registry
 */
function parsingInventorySlot(
  raw: unknown,
  slotIndex: number,
  registry: DefiningInventoryItemRegistry
): DefiningInventoryState['slots'][number] {
  if (raw === null || raw === undefined) {
    return null;
  }

  if (typeof raw !== 'object') {
    return null;
  }

  const slotRaw = raw as ParsingInventorySlotRaw;

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
 * Parses and validates persisted inventory JSON into domain state.
 * Drops unknown item types and normalizes slot indices.
 * When capacity grows by one column per row (e.g. 5×3 → 6×3), remaps slots
 * so each row keeps its items and gains a trailing empty cell.
 *
 * @param raw - Parsed JSON value
 * @param capacity - Expected capacity
 * @param registry - Item type registry
 */
export function parsingInventoryState(
  raw: unknown,
  capacity: number,
  registry: DefiningInventoryItemRegistry
): DefiningInventoryState {
  const emptyState = creatingEmptyInventoryState(capacity);

  if (raw === null || raw === undefined) {
    return emptyState;
  }

  if (typeof raw !== 'object') {
    return emptyState;
  }

  const stateRaw = raw as ParsingInventoryStateRaw;
  const rawSlots = Array.isArray(stateRaw.slots) ? stateRaw.slots : [];
  const remappedSlots =
    expandingInventorySlotsByOneColumnPerRow(rawSlots, capacity) ?? rawSlots;
  const nextSlots = emptyState.slots.map((_, index) => {
    const rawSlot = index < remappedSlots.length ? remappedSlots[index] : null;
    return parsingInventorySlot(rawSlot, index, registry);
  });

  return {
    capacity,
    slots: nextSlots,
  };
}
