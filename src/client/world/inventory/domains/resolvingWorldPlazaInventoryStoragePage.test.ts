import {
  DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY,
  DEFINING_WORLD_PLAZA_INVENTORY_MAIN_HOTBAR_SLOT_COUNT,
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
    expect(DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY).toBe(15);
    expect(DEFINING_WORLD_PLAZA_INVENTORY_MAIN_HOTBAR_SLOT_COUNT).toBe(5);
    expect(DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_PAGE_COUNT).toBe(2);
  });

  it('clamps storage page indices', () => {
    expect(resolvingWorldPlazaInventoryClampedStoragePageIndex(-1)).toBe(0);
    expect(resolvingWorldPlazaInventoryClampedStoragePageIndex(0)).toBe(0);
    expect(resolvingWorldPlazaInventoryClampedStoragePageIndex(1)).toBe(1);
    expect(resolvingWorldPlazaInventoryClampedStoragePageIndex(99)).toBe(1);
  });

  it('pages storage five slots at a time', () => {
    expect(resolvingWorldPlazaInventoryStoragePageSlotIndices(0)).toEqual([
      5, 6, 7, 8, 9,
    ]);
    expect(resolvingWorldPlazaInventoryStoragePageSlotIndices(1)).toEqual([
      10, 11, 12, 13, 14,
    ]);
  });

  it('always includes the main hotbar before the storage page', () => {
    expect(resolvingWorldPlazaInventoryVisibleSlotIndices(0)).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    ]);
    expect(resolvingWorldPlazaInventoryVisibleSlotIndices(1)).toEqual([
      0, 1, 2, 3, 4, 10, 11, 12, 13, 14,
    ]);
  });
});
