import {
  DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY,
  DEFINING_WORLD_PLAZA_INVENTORY_MAIN_HOTBAR_SLOT_COUNT,
  DEFINING_WORLD_PLAZA_INVENTORY_PAGE_COUNT,
  DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_PAGE_COUNT,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import {
  resolvingWorldPlazaInventoryClampedStoragePageIndex,
  resolvingWorldPlazaInventoryStoragePageIndexFromWheelDeltaY,
  resolvingWorldPlazaInventoryStoragePageSlotIndices,
  resolvingWorldPlazaInventoryVisibleSlotIndices,
} from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryStoragePage';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaInventoryStoragePage', () => {
  it('keeps capacity as main hotbar plus storage pages', () => {
    expect(DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY).toBe(24);
    expect(DEFINING_WORLD_PLAZA_INVENTORY_MAIN_HOTBAR_SLOT_COUNT).toBe(6);
    expect(DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_PAGE_COUNT).toBe(3);
    expect(DEFINING_WORLD_PLAZA_INVENTORY_PAGE_COUNT).toBe(4);
  });

  it('clamps hotbar page indices across main and storage', () => {
    expect(resolvingWorldPlazaInventoryClampedStoragePageIndex(-1)).toBe(0);
    expect(resolvingWorldPlazaInventoryClampedStoragePageIndex(0)).toBe(0);
    expect(resolvingWorldPlazaInventoryClampedStoragePageIndex(1)).toBe(1);
    expect(resolvingWorldPlazaInventoryClampedStoragePageIndex(2)).toBe(2);
    expect(resolvingWorldPlazaInventoryClampedStoragePageIndex(3)).toBe(3);
    expect(resolvingWorldPlazaInventoryClampedStoragePageIndex(99)).toBe(3);
  });

  it('pages storage six slots at a time', () => {
    expect(resolvingWorldPlazaInventoryStoragePageSlotIndices(0)).toEqual([
      6, 7, 8, 9, 10, 11,
    ]);
    expect(resolvingWorldPlazaInventoryStoragePageSlotIndices(1)).toEqual([
      12, 13, 14, 15, 16, 17,
    ]);
    expect(resolvingWorldPlazaInventoryStoragePageSlotIndices(2)).toEqual([
      18, 19, 20, 21, 22, 23,
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
    expect(resolvingWorldPlazaInventoryVisibleSlotIndices(3)).toEqual([
      18, 19, 20, 21, 22, 23,
    ]);
  });

  it('pages from wheel delta without leaving the page range', () => {
    expect(
      resolvingWorldPlazaInventoryStoragePageIndexFromWheelDeltaY(0, 4, 120)
    ).toBe(1);
    expect(
      resolvingWorldPlazaInventoryStoragePageIndexFromWheelDeltaY(1, 4, -40)
    ).toBe(0);
    expect(
      resolvingWorldPlazaInventoryStoragePageIndexFromWheelDeltaY(0, 4, -40)
    ).toBe(0);
    expect(
      resolvingWorldPlazaInventoryStoragePageIndexFromWheelDeltaY(3, 4, 120)
    ).toBe(3);
    expect(
      resolvingWorldPlazaInventoryStoragePageIndexFromWheelDeltaY(2, 4, 0)
    ).toBe(2);
  });
});
