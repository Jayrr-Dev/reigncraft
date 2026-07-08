import {
  parsingInventoryItemDraggableId,
  parsingInventorySlotDroppableId,
} from '@/components/inventory/domains/definingInventoryDndIds';
import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningInventoryItemRegistry } from '@/components/inventory/domains/definingInventoryItemRegistry';
import type { DefiningWorldPlazaInventoryDragLocation } from '@/components/world/inventory/domains/applyingWorldPlazaInventoryBagTransfer';
import { resolvingWorldPlazaInventoryDragLocationForItemId } from '@/components/world/inventory/domains/applyingWorldPlazaInventoryBagTransfer';
import { parsingWorldPlazaInventoryBagSlotDroppableId } from '@/components/world/inventory/domains/definingWorldPlazaInventoryBagDndIds';

/**
 * Resolves a hotbar or bag drop target from a dnd-kit `over` id.
 *
 * Filled slots register both a droppable container and an inner item draggable.
 * `pointerWithin` often returns the item draggable, so this falls back to the
 * item's slot location for stacking and swaps.
 *
 * @param overId - dnd-kit collision id
 * @param state - Current hotbar inventory state
 * @param registry - Item type registry
 */
export function resolvingWorldPlazaInventoryDropLocationFromOverId(
  overId: string,
  state: DefiningInventoryState,
  registry: DefiningInventoryItemRegistry
): DefiningWorldPlazaInventoryDragLocation | null {
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

  const overItemId = parsingInventoryItemDraggableId(overId);

  if (overItemId === null) {
    return null;
  }

  return resolvingWorldPlazaInventoryDragLocationForItemId(
    state,
    overItemId,
    registry
  );
}
