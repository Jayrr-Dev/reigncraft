import {
  parsingInventoryItemDraggableId,
  parsingInventorySlotDroppableId,
} from '@/components/inventory/domains/definingInventoryDndIds';
import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningInventoryItemRegistry } from '@/components/inventory/domains/definingInventoryItemRegistry';
import { resolvingInventoryItemSlotIndex } from '@/components/inventory/domains/reducingInventoryState';
import {
  applyingWorldPlazaInventoryBagTransfer,
  resolvingWorldPlazaInventoryDragLocationForItemId,
} from '@/components/world/inventory/domains/applyingWorldPlazaInventoryBagTransfer';
import { parsingWorldPlazaInventoryBagSlotDroppableId } from '@/components/world/inventory/domains/definingWorldPlazaInventoryBagDndIds';
import { checkingWorldPlazaInventoryBagHasContents } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryBagContents';
import { checkingWorldPlazaInventoryItemIsBag } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryItemIsBag';
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
 * Resolves a drop target location from a dnd-kit droppable id.
 *
 * @param overId - dnd-kit droppable id
 */
function resolvingWorldPlazaInventoryDropLocationFromOverId(
  overId: string
):
  | { readonly kind: 'hotbar'; readonly slotIndex: number }
  | {
      readonly kind: 'bag';
      readonly bagItemInstanceId: string;
      readonly bagSlotIndex: number;
    }
  | null {
  const hotbarSlotIndex = parsingInventorySlotDroppableId(overId);

  if (hotbarSlotIndex !== null) {
    return { kind: 'hotbar', slotIndex: hotbarSlotIndex };
  }

  const bagSlot = parsingWorldPlazaInventoryBagSlotDroppableId(overId);

  if (bagSlot) {
    return {
      kind: 'bag',
      bagItemInstanceId: bagSlot.bagItemInstanceId,
      bagSlotIndex: bagSlot.bagSlotIndex,
    };
  }

  return null;
}

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
      ? resolvingWorldPlazaInventoryDropLocationFromOverId(overId)
      : null;

  const involvesBag =
    fromLocation.kind === 'bag' || toLocation?.kind === 'bag';

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

      return { kind: 'hotbar-ground-drop', fromSlotIndex: fromLocation.slotIndex };
    }

    const toHotbarSlotIndex = parsingInventorySlotDroppableId(overId);

    if (toHotbarSlotIndex !== null && fromLocation.kind === 'hotbar') {
      actions.moveItem(fromLocation.slotIndex, toHotbarSlotIndex);
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
