/**
 * Grows or trims inventory slot arrays when storage-row unlocks change.
 *
 * @module components/world/inventory/domains/resizingWorldPlazaInventoryStateToCapacity
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';

/**
 * Returns inventory state with `capacity` slots.
 * Growing pads empty null slots. Shrinking keeps the leading slice only when
 * trailing slots are empty; otherwise capacity stays large enough to hold items.
 * Idempotent: returns the same state reference when nothing changes.
 */
export function resizingWorldPlazaInventoryStateToCapacity(
  state: DefiningInventoryState,
  capacity: number
): DefiningInventoryState {
  if (!Number.isFinite(capacity) || capacity <= 0) {
    return state;
  }

  const nextCapacity = Math.trunc(capacity);

  if (nextCapacity === state.capacity && state.slots.length === nextCapacity) {
    return state;
  }

  if (nextCapacity > state.slots.length) {
    return {
      capacity: nextCapacity,
      slots: [
        ...state.slots,
        ...Array.from(
          { length: nextCapacity - state.slots.length },
          () => null
        ),
      ],
    };
  }

  let lastOccupiedIndex = -1;

  for (let index = state.slots.length - 1; index >= 0; index -= 1) {
    if (state.slots[index] !== null) {
      lastOccupiedIndex = index;
      break;
    }
  }

  const retainedCapacity = Math.max(nextCapacity, lastOccupiedIndex + 1);

  if (
    retainedCapacity === state.capacity &&
    state.slots.length === retainedCapacity
  ) {
    return state;
  }

  return {
    capacity: retainedCapacity,
    slots: state.slots.slice(0, retainedCapacity).map((slot, slotIndex) =>
      slot === null
        ? null
        : {
            ...slot,
            slotIndex,
          }
    ),
  };
}
