import {
  DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY,
  DEFINING_WORLD_PLAZA_INVENTORY_MAIN_HOTBAR_SLOT_COUNT,
  DEFINING_WORLD_PLAZA_INVENTORY_PAGE_COUNT,
  DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_PAGE_COUNT,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import {
  resolvingWorldPlazaInventoryClampedStoragePageIndex,
  resolvingWorldPlazaInventoryStoragePageSlotIndices,
  resolvingWorldPlazaInventoryVisibleSlotIndices,
} from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryStoragePage';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaInventoryStoragePage', () => {
  it('keeps capacity as main hotbar plus storage pages', () => {
    expect(DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY).toBe(18);
    expect(DEFINING_WORLD_PLAZA_INVENTORY_MAIN_HOTBAR_SLOT_COUNT).toBe(6);
    expect(DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_PAGE_COUNT).toBe(2);
    expect(DEFINING_WORLD_PLAZA_INVENTORY_PAGE_COUNT).toBe(3);
  });

  it('clamps hotbar page indices across main and storage', () => {
    expect(resolvingWorldPlazaInventoryClampedStoragePageIndex(-1)).toBe(0);
    expect(resolvingWorldPlazaInventoryClampedStoragePageIndex(0)).toBe(0);
    expect(resolvingWorldPlazaInventoryClampedStoragePageIndex(1)).toBe(1);
    expect(resolvingWorldPlazaInventoryClampedStoragePageIndex(2)).toBe(2);
    expect(resolvingWorldPlazaInventoryClampedStoragePageIndex(99)).toBe(2);
  });

  it('pages storage six slots at a time', () => {
    expect(resolvingWorldPlazaInventoryStoragePageSlotIndices(0)).toEqual([
      6, 7, 8, 9, 10, 11,
    ]);
    expect(resolvingWorldPlazaInventoryStoragePageSlotIndices(1)).toEqual([
      12, 13, 14, 15, 16, 17,
    ]);
  });

  it('shows one row at a time (main first, then storage)', () => {
    expect(resolvingWorldPlazaInventoryVisibleSlotIndices(0)).toEqual([
      0, 1, 2, 3, 4, 5,
    ]);
    expect(resolvingWorldPlazaInventoryVisibleSlotIndices(1)).toEqual([
      6, 7, 8, 9, 10, 11,
    ]);
    expect(resolvingWorldPlazaInventoryVisibleSlotIndices(2)).toEqual([
      12, 13, 14, 15, 16, 17,
    ]);
  });
});
