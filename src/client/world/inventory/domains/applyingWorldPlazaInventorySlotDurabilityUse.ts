import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_DURABILITY_DEFAULT_BREAK_CHANCE_AT_ZERO,
  DEFINING_WORLD_PLAZA_INVENTORY_DURABILITY_DEFAULT_WEAR_PER_USE,
  DEFINING_WORLD_PLAZA_INVENTORY_DURABILITY_METADATA_KEY,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryDurabilityConstants';
import {
  resolvingWorldPlazaInventoryItemDurability,
  resolvingWorldPlazaInventoryItemDurabilityBehavior,
} from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemDurability';

export type ApplyingWorldPlazaInventorySlotDurabilityUseResult = {
  readonly applied: boolean;
  readonly broken: boolean;
  readonly nextState: DefiningInventoryState;
  readonly remainingDurability: number | null;
};

function cloningInventorySlotsWithSlotUpdate(
  slots: DefiningInventoryState['slots'],
  slotIndex: number,
  nextSlot: DefiningInventoryState['slots'][number]
): DefiningInventoryState['slots'] {
  const nextSlots = [...slots];
  nextSlots[slotIndex] = nextSlot;
  return nextSlots;
}

/**
 * Applies one durability wear step to the item in a slot.
 *
 * While remaining durability is above zero, each use subtracts wear. At zero the
 * item still works, but each further use rolls for destruction.
 */
export function applyingWorldPlazaInventorySlotDurabilityUse(
  state: DefiningInventoryState,
  slotIndex: number,
  random: () => number = Math.random
): ApplyingWorldPlazaInventorySlotDurabilityUseResult {
  if (slotIndex < 0 || slotIndex >= state.capacity) {
    return {
      applied: false,
      broken: false,
      nextState: state,
      remainingDurability: null,
    };
  }

  const slotItem = state.slots[slotIndex];

  if (!slotItem || slotItem.quantity <= 0) {
    return {
      applied: false,
      broken: false,
      nextState: state,
      remainingDurability: null,
    };
  }

  const durabilityBehavior = resolvingWorldPlazaInventoryItemDurabilityBehavior(
    slotItem.itemTypeId
  );

  if (!durabilityBehavior) {
    return {
      applied: false,
      broken: false,
      nextState: state,
      remainingDurability: null,
    };
  }

  const durabilitySnapshot = resolvingWorldPlazaInventoryItemDurability(slotItem);

  if (!durabilitySnapshot) {
    return {
      applied: false,
      broken: false,
      nextState: state,
      remainingDurability: null,
    };
  }

  const wearPerUse =
    durabilityBehavior.wearPerUse ??
    DEFINING_WORLD_PLAZA_INVENTORY_DURABILITY_DEFAULT_WEAR_PER_USE;
  const breakChanceAtZero =
    durabilityBehavior.breakChanceAtZero ??
    DEFINING_WORLD_PLAZA_INVENTORY_DURABILITY_DEFAULT_BREAK_CHANCE_AT_ZERO;

  let nextRemaining = durabilitySnapshot.remaining;
  let broken = false;

  if (nextRemaining > 0) {
    nextRemaining = Math.max(0, nextRemaining - wearPerUse);
  } else if (random() < breakChanceAtZero) {
    broken = true;
  }

  if (broken) {
    return {
      applied: true,
      broken: true,
      nextState: {
        capacity: state.capacity,
        slots: cloningInventorySlotsWithSlotUpdate(state.slots, slotIndex, null),
      },
      remainingDurability: 0,
    };
  }

  return {
    applied: true,
    broken: false,
    nextState: {
      capacity: state.capacity,
      slots: cloningInventorySlotsWithSlotUpdate(state.slots, slotIndex, {
        ...slotItem,
        metadata: {
          ...slotItem.metadata,
          [DEFINING_WORLD_PLAZA_INVENTORY_DURABILITY_METADATA_KEY]: nextRemaining,
        },
      }),
    },
    remainingDurability: nextRemaining,
  };
}
