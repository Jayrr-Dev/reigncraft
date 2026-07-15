import { DEFINING_WORLD_PLAZA_INVENTORY_PAGE_COUNT } from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import { resolvingWorldPlazaInventoryVisibleSlotIndices } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryStoragePage';

/**
 * Slot indices that must stay mounted (but hidden) while dragging across pages.
 *
 * Paging unmounts off-page slots. If the drag source unmounts mid-drag, dnd-kit
 * loses the active `useDraggable` and moves can fail or look like dupes.
 *
 * @param storagePageIndex - Current hotbar page
 * @param draggingFromSlotIndex - Absolute source slot, or null when idle
 * @param pageCount - Total hotbar pages (main + storage)
 */
export function resolvingWorldPlazaInventoryRetainedDragSlotIndices(
  storagePageIndex: number,
  draggingFromSlotIndex: number | null,
  pageCount: number = DEFINING_WORLD_PLAZA_INVENTORY_PAGE_COUNT
): readonly number[] {
  if (draggingFromSlotIndex === null) {
    return [];
  }

  if (
    !Number.isFinite(draggingFromSlotIndex) ||
    draggingFromSlotIndex < 0 ||
    !Number.isInteger(draggingFromSlotIndex)
  ) {
    return [];
  }

  const visibleSlotIndices = resolvingWorldPlazaInventoryVisibleSlotIndices(
    storagePageIndex,
    pageCount
  );

  if (visibleSlotIndices.includes(draggingFromSlotIndex)) {
    return [];
  }

  return [draggingFromSlotIndex];
}
