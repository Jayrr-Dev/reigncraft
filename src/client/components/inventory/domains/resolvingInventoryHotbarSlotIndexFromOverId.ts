import {
  parsingInventoryItemDraggableId,
  parsingInventorySlotDroppableId,
} from '@/components/inventory/domains/definingInventoryDndIds';
import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { resolvingInventoryItemSlotIndex } from '@/components/inventory/domains/reducingInventoryState';

/**
 * Resolves a hotbar slot index from a dnd-kit `over` id (droppable or item draggable).
 *
 * @param overId - dnd-kit collision id
 * @param state - Current inventory state
 */
export function resolvingInventoryHotbarSlotIndexFromOverId(
  overId: string,
  state: DefiningInventoryState
): number | null {
  const droppableSlotIndex = parsingInventorySlotDroppableId(overId);

  if (droppableSlotIndex !== null) {
    return droppableSlotIndex;
  }

  const overItemId = parsingInventoryItemDraggableId(overId);

  if (overItemId === null) {
    return null;
  }

  return resolvingInventoryItemSlotIndex(state, overItemId);
}
