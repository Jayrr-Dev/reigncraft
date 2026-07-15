import {
  DEFINING_WORLD_PLAZA_INVENTORY_MAIN_HOTBAR_SLOT_COUNT,
  DEFINING_WORLD_PLAZA_INVENTORY_PAGE_COUNT,
  DEFINING_WORLD_PLAZA_INVENTORY_PAGE_SIZE,
  DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_PAGE_COUNT,
  DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_SLOT_START,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';

/**
 * Clamps a hotbar page index into the valid range.
 *
 * Page 0 is the main equippable row; pages 1+ are storage rows.
 *
 * @param storagePageIndex - Requested page (0 = main hotbar)
 */
export function resolvingWorldPlazaInventoryClampedStoragePageIndex(
  storagePageIndex: number
): number {
  if (!Number.isFinite(storagePageIndex)) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      DEFINING_WORLD_PLAZA_INVENTORY_PAGE_COUNT - 1,
      Math.trunc(storagePageIndex)
    )
  );
}

/**
 * Absolute slot indices for one storage-only page (length = page size).
 *
 * @param storagePageIndex - Storage-only page (0 = first storage row)
 */
export function resolvingWorldPlazaInventoryStoragePageSlotIndices(
  storagePageIndex: number
): readonly number[] {
  const page = Math.max(
    0,
    Math.min(
      DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_PAGE_COUNT - 1,
      Math.trunc(Number.isFinite(storagePageIndex) ? storagePageIndex : 0)
    )
  );
  const start =
    DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_SLOT_START +
    page * DEFINING_WORLD_PLAZA_INVENTORY_PAGE_SIZE;

  return Array.from(
    { length: DEFINING_WORLD_PLAZA_INVENTORY_PAGE_SIZE },
    (_, offset) => start + offset
  );
}

/**
 * Slot indices shown in the single-row hotbar UI for one page.
 *
 * Page 0 = main equippable row. Later pages = storage rows.
 *
 * @param storagePageIndex - Hotbar page (0-based)
 */
export function resolvingWorldPlazaInventoryVisibleSlotIndices(
  storagePageIndex: number
): readonly number[] {
  const page =
    resolvingWorldPlazaInventoryClampedStoragePageIndex(storagePageIndex);

  if (page === 0) {
    return Array.from(
      { length: DEFINING_WORLD_PLAZA_INVENTORY_MAIN_HOTBAR_SLOT_COUNT },
      (_, index) => index
    );
  }

  return resolvingWorldPlazaInventoryStoragePageSlotIndices(page - 1);
}

/**
 * Next hotbar page from a wheel delta while hovering the items row.
 *
 * Scroll down (positive deltaY) pages toward later storage rows.
 * Scroll up pages back toward the main hotbar.
 *
 * @param storagePageIndex - Current page (0-based)
 * @param storagePageCount - Total pages (main + storage)
 * @param wheelDeltaY - Wheel event deltaY
 */
export function resolvingWorldPlazaInventoryStoragePageIndexFromWheelDeltaY(
  storagePageIndex: number,
  storagePageCount: number,
  wheelDeltaY: number
): number {
  const currentPage =
    resolvingWorldPlazaInventoryClampedStoragePageIndex(storagePageIndex);
  const maxPage = Math.max(0, Math.trunc(storagePageCount) - 1);

  if (!Number.isFinite(wheelDeltaY) || wheelDeltaY === 0) {
    return Math.min(currentPage, maxPage);
  }

  const step = wheelDeltaY > 0 ? 1 : -1;
  return Math.max(0, Math.min(maxPage, currentPage + step));
}
