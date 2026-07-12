import {
  DEFINING_WORLD_PLAZA_INVENTORY_MAIN_HOTBAR_SLOT_COUNT,
  DEFINING_WORLD_PLAZA_INVENTORY_PAGE_SIZE,
  DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_PAGE_COUNT,
  DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_SLOT_START,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';

/**
 * Clamps a storage page index into the valid range.
 *
 * @param storagePageIndex - Requested page (0 = first storage row)
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
      DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_PAGE_COUNT - 1,
      Math.trunc(storagePageIndex)
    )
  );
}

/**
 * Absolute slot indices for one storage page (length = page size).
 *
 * @param storagePageIndex - Storage page (0-based)
 */
export function resolvingWorldPlazaInventoryStoragePageSlotIndices(
  storagePageIndex: number
): readonly number[] {
  const page =
    resolvingWorldPlazaInventoryClampedStoragePageIndex(storagePageIndex);
  const start =
    DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_SLOT_START +
    page * DEFINING_WORLD_PLAZA_INVENTORY_PAGE_SIZE;

  return Array.from(
    { length: DEFINING_WORLD_PLAZA_INVENTORY_PAGE_SIZE },
    (_, offset) => start + offset
  );
}

/**
 * Slot indices shown in the hotbar UI: main row, then the active storage page.
 *
 * @param storagePageIndex - Storage page (0-based)
 */
export function resolvingWorldPlazaInventoryVisibleSlotIndices(
  storagePageIndex: number
): readonly number[] {
  const mainSlots = Array.from(
    { length: DEFINING_WORLD_PLAZA_INVENTORY_MAIN_HOTBAR_SLOT_COUNT },
    (_, index) => index
  );

  return [
    ...mainSlots,
    ...resolvingWorldPlazaInventoryStoragePageSlotIndices(storagePageIndex),
  ];
}
