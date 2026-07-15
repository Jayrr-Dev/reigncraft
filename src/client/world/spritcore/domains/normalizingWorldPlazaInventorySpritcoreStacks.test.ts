import { creatingEmptyInventoryState } from '@/components/inventory/domains/reducingInventoryState';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_BRIGHT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_FAINT,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { normalizingWorldPlazaInventorySpritcoreStacks } from '@/components/world/spritcore/domains/normalizingWorldPlazaInventorySpritcoreStacks';
import { describe, expect, it } from 'vitest';

describe('normalizingWorldPlazaInventorySpritcoreStacks', () => {
  it('merges legacy tier stacks into the shared pool', () => {
    const state = creatingEmptyInventoryState(8);
    const withLegacy = {
      ...state,
      slots: [
        {
          id: 'a',
          itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_FAINT,
          quantity: 10,
          slotIndex: 0,
        },
        {
          id: 'b',
          itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_BRIGHT,
          quantity: 20,
          slotIndex: 1,
        },
        null,
        null,
        null,
        null,
        null,
        null,
      ],
    };

    const normalized = normalizingWorldPlazaInventorySpritcoreStacks(
      withLegacy,
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
    );

    const spritcoreSlots = normalized.slots.filter(
      (slot) =>
        slot?.itemTypeId === DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE
    );
    expect(spritcoreSlots).toHaveLength(1);
    expect(spritcoreSlots[0]?.quantity).toBe(30);
  });

  it('is a no-op when only the canonical type is present', () => {
    const state = creatingEmptyInventoryState(4);
    const withCanonical = {
      ...state,
      slots: [
        {
          id: 'a',
          itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE,
          quantity: 16,
          slotIndex: 0,
        },
        null,
        null,
        null,
      ],
    };

    expect(
      normalizingWorldPlazaInventorySpritcoreStacks(
        withCanonical,
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
      )
    ).toBe(withCanonical);
  });
});
