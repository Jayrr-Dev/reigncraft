import type { WorldInventoryDevvitPersistedState } from '../../shared/worldInventoryDevvit';

type InventorySlotRow = {
  id?: string;
  itemTypeId?: string;
  quantity?: number;
  slotIndex?: number;
};

function parsingInventorySlotRow(slot: unknown): InventorySlotRow | null {
  if (!slot || typeof slot !== 'object') {
    return null;
  }

  const row = slot as InventorySlotRow;

  if (
    typeof row.itemTypeId !== 'string' ||
    typeof row.quantity !== 'number' ||
    row.quantity <= 0
  ) {
    return null;
  }

  return row;
}

/** Result from consuming one inventory item stack. */
export type ConsumingWorldInventoryDevvitItemResult =
  | {
      type: 'consumed';
      state: WorldInventoryDevvitPersistedState;
    }
  | {
      type: 'missing';
    }
  | {
      type: 'invalid';
    };

/**
 * Removes one quantity of an item type from persisted inventory state.
 *
 * @param state - Current inventory state.
 * @param itemTypeId - Item type to consume.
 * @param quantity - Quantity to remove.
 */
export function consumingWorldInventoryDevvitItem(
  state: WorldInventoryDevvitPersistedState | null,
  itemTypeId: string,
  quantity: number,
): ConsumingWorldInventoryDevvitItemResult {
  if (!state || quantity <= 0) {
    return { type: 'invalid' };
  }

  let remainingQuantity = quantity;
  const nextSlots = [...state.slots];

  for (let slotIndex = 0; slotIndex < nextSlots.length; slotIndex += 1) {
    const slot = nextSlots[slotIndex];
    const parsedSlot = parsingInventorySlotRow(slot);

    if (!parsedSlot || parsedSlot.itemTypeId !== itemTypeId) {
      continue;
    }

    const slotQuantity = parsedSlot.quantity ?? 0;

    if (slotQuantity <= remainingQuantity) {
      remainingQuantity -= slotQuantity;
      nextSlots[slotIndex] = null;
    } else {
      nextSlots[slotIndex] = {
        ...parsedSlot,
        quantity: slotQuantity - remainingQuantity,
      };
      remainingQuantity = 0;
    }

    if (remainingQuantity <= 0) {
      break;
    }
  }

  if (remainingQuantity > 0) {
    return { type: 'missing' };
  }

  return {
    type: 'consumed',
    state: {
      capacity: state.capacity,
      slots: nextSlots,
    },
  };
}

/**
 * Parses persisted inventory JSON from Redis.
 *
 * @param rawValue - Serialized inventory state.
 */
export function parsingWorldInventoryDevvitPersistedState(
  rawValue: string,
): WorldInventoryDevvitPersistedState | null {
  try {
    const parsed = JSON.parse(rawValue) as Partial<WorldInventoryDevvitPersistedState>;

    if (typeof parsed.capacity !== 'number' || !Array.isArray(parsed.slots)) {
      return null;
    }

    return {
      capacity: parsed.capacity,
      slots: parsed.slots,
    };
  } catch {
    return null;
  }
}
