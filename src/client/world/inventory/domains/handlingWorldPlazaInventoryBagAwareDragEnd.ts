import { parsingInventoryItemDraggableId } from '@/components/inventory/domains/definingInventoryDndIds';
import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningInventoryItemRegistry } from '@/components/inventory/domains/definingInventoryItemRegistry';
import { resolvingInventoryItemSlotIndex } from '@/components/inventory/domains/reducingInventoryState';
import {
  applyingWorldPlazaInventoryBagTransfer,
  resolvingWorldPlazaInventoryDragLocationForItemId,
} from '@/components/world/inventory/domains/applyingWorldPlazaInventoryBagTransfer';
import { checkingWorldPlazaInventoryItemIsBag } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryItemIsBag';
import { checkingWorldPlazaInventoryMoveRespectsWeaponToolSlot } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryMoveRespectsWeaponToolSlot';
import { checkingWorldPlazaInventoryBagHasContents } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryBagContents';
import { resolvingWorldPlazaInventoryDropLocationFromOverId } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryDropLocationFromOverId';
import type { DragEndEvent } from '@dnd-kit/core';

/** Actions required to commit bag-aware inventory drag results. */
export type HandlingWorldPlazaInventoryBagAwareDragEndActions = {
  readonly moveItem: (fromSlotIndex: number, toSlotIndex: number) => void;
  readonly removeItem: (slotIndex: number) => void;
  readonly updateState: (
    updater: (
      currentState: DefiningInventoryState
    ) => DefiningInventoryState | null
  ) => void;
};

/** Result of {@link handlingWorldPlazaInventoryBagAwareDragEnd}. */
export type HandlingWorldPlazaInventoryBagAwareDragEndResult =
  | { readonly kind: 'handled' }
  | { readonly kind: 'hotbar-ground-drop'; readonly fromSlotIndex: number }
  | { readonly kind: 'blocked-non-empty-bag-drop' }
  | { readonly kind: 'unhandled' };

/**
 * Handles drag-end when the source or target is a bag slot. Hotbar-only moves
 * delegate to {@link moveItem}; cross-container moves use {@link updateState}.
 *
 * @param event - dnd-kit drag end event
 * @param state - Current hotbar inventory state
 * @param registry - Item type registry
 * @param actions - Inventory mutation callbacks
 */
export function handlingWorldPlazaInventoryBagAwareDragEnd(
  event: DragEndEvent,
  state: DefiningInventoryState,
  registry: DefiningInventoryItemRegistry,
  actions: HandlingWorldPlazaInventoryBagAwareDragEndActions
): HandlingWorldPlazaInventoryBagAwareDragEndResult {
  const activeId = String(event.active.id);
  const fromItemId = parsingInventoryItemDraggableId(activeId);

  if (!fromItemId) {
    return { kind: 'unhandled' };
  }

  const fromLocation = resolvingWorldPlazaInventoryDragLocationForItemId(
    state,
    fromItemId,
    registry
  );

  if (!fromLocation) {
    return { kind: 'unhandled' };
  }

  const overId = event.over ? String(event.over.id) : null;
  const toLocation =
    overId !== null
      ? resolvingWorldPlazaInventoryDropLocationFromOverId(
          overId,
          state,
          registry
        )
      : null;

  const involvesBag = fromLocation.kind === 'bag' || toLocation?.kind === 'bag';

  if (!involvesBag) {
    if (!overId) {
      if (fromLocation.kind !== 'hotbar') {
        return { kind: 'handled' };
      }

      const slotItem = state.slots[fromLocation.slotIndex];

      if (
        slotItem &&
        checkingWorldPlazaInventoryItemIsBag(slotItem.itemTypeId) &&
        checkingWorldPlazaInventoryBagHasContents(slotItem, registry)
      ) {
        return { kind: 'blocked-non-empty-bag-drop' };
      }

      return {
        kind: 'hotbar-ground-drop',
        fromSlotIndex: fromLocation.slotIndex,
      };
    }

    if (toLocation?.kind === 'hotbar' && fromLocation.kind === 'hotbar') {
      if (
        !checkingWorldPlazaInventoryMoveRespectsWeaponToolSlot(
          state,
          fromLocation.slotIndex,
          toLocation.slotIndex
        )
      ) {
        return { kind: 'handled' };
      }

      actions.moveItem(fromLocation.slotIndex, toLocation.slotIndex);
      return { kind: 'handled' };
    }

    return { kind: 'unhandled' };
  }

  if (!toLocation) {
    return { kind: 'handled' };
  }

  actions.updateState((currentState) =>
    applyingWorldPlazaInventoryBagTransfer(
      currentState,
      fromLocation,
      toLocation,
      registry
    )
  );

  return { kind: 'handled' };
}

/**
 * Resolves hotbar slot index for a dragged hotbar item id (bag-aware fallback).
 *
 * @param state - Hotbar inventory state
 * @param itemId - Dragged item instance id
 */
export function resolvingWorldPlazaInventoryHotbarSlotIndexForItemId(
  state: DefiningInventoryState,
  itemId: string
): number | null {
  return resolvingInventoryItemSlotIndex(state, itemId);
}
