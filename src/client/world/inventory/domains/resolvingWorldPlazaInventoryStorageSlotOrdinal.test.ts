import { DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_MAX_CAPACITY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryStorageExpansionConstants';
import { resolvingWorldPlazaInventoryStorageSlotOrdinal } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryStorageSlotOrdinal';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaInventoryStorageSlotOrdinal', () => {
  it('returns null for main hotbar slots', () => {
    expect(resolvingWorldPlazaInventoryStorageSlotOrdinal(0)).toBeNull();
    expect(resolvingWorldPlazaInventoryStorageSlotOrdinal(5)).toBeNull();
  });

  it('numbers storage slots from 1 across pages', () => {
    expect(resolvingWorldPlazaInventoryStorageSlotOrdinal(6)).toBe(1);
    expect(resolvingWorldPlazaInventoryStorageSlotOrdinal(11)).toBe(6);
    expect(resolvingWorldPlazaInventoryStorageSlotOrdinal(12)).toBe(7);
    expect(
      resolvingWorldPlazaInventoryStorageSlotOrdinal(
        DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY - 1
      )
    ).toBe(18);
    expect(
      resolvingWorldPlazaInventoryStorageSlotOrdinal(
        DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_MAX_CAPACITY - 1
      )
    ).toBe(36);
  });

  it('returns null for out-of-range indices', () => {
    expect(resolvingWorldPlazaInventoryStorageSlotOrdinal(-1)).toBeNull();
    expect(
      resolvingWorldPlazaInventoryStorageSlotOrdinal(
        DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_MAX_CAPACITY
      )
    ).toBeNull();
  });
});
