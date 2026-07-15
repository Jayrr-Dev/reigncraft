import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningInventoryItemRegistry } from '@/components/inventory/domains/definingInventoryItemRegistry';
import { movingInventoryItemToSlot } from '@/components/inventory/domains/reducingInventoryState';
import { checkingWorldPlazaInventoryMoveRespectsWeaponToolSlot } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryMoveRespectsWeaponToolSlot';
import { resolvingWorldPlazaSpritcoreCanonicalItemTypeId } from '@/components/world/spritcore/domains/resolvingWorldPlazaSpritcoreCanonicalItemTypeId';

/**
 * Moves or swaps hotbar items while keeping slot 0 reserved for weapons/tools.
 * Remaps legacy Spritcore tier ids onto the shared pool before stack/swap.
 *
 * @param state - Current inventory state
 * @param fromSlotIndex - Source slot
 * @param toSlotIndex - Destination slot
 * @param registry - Item type registry for stack rules
 */
export function movingWorldPlazaInventoryItemToSlot(
  state: DefiningInventoryState,
  fromSlotIndex: number,
  toSlotIndex: number,
  registry: DefiningInventoryItemRegistry
): DefiningInventoryState {
  if (
    !checkingWorldPlazaInventoryMoveRespectsWeaponToolSlot(
      state,
      fromSlotIndex,
      toSlotIndex
    )
  ) {
    return state;
  }

  const fromItem = state.slots[fromSlotIndex];
  const toItem = state.slots[toSlotIndex];
  const canonicalFromTypeId =
    fromItem === null
      ? null
      : resolvingWorldPlazaSpritcoreCanonicalItemTypeId(fromItem.itemTypeId);
  const canonicalToTypeId =
    toItem === null
      ? null
      : resolvingWorldPlazaSpritcoreCanonicalItemTypeId(toItem.itemTypeId);

  const needsCanonicalRemap =
    (fromItem !== null && fromItem.itemTypeId !== canonicalFromTypeId) ||
    (toItem !== null && toItem.itemTypeId !== canonicalToTypeId);

  const moveState = needsCanonicalRemap
    ? {
        ...state,
        slots: state.slots.map((slot, slotIndex) => {
          if (slot === null) {
            return null;
          }

          if (slotIndex !== fromSlotIndex && slotIndex !== toSlotIndex) {
            return slot;
          }

          const canonicalItemTypeId =
            resolvingWorldPlazaSpritcoreCanonicalItemTypeId(slot.itemTypeId);

          return canonicalItemTypeId === slot.itemTypeId
            ? slot
            : { ...slot, itemTypeId: canonicalItemTypeId };
        }),
      }
    : state;

  return movingInventoryItemToSlot(
    moveState,
    fromSlotIndex,
    toSlotIndex,
    registry
  );
}
