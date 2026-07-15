import type { DefiningInventorySlot } from '@/components/inventory/domains/definingInventoryItem';
import { creatingEmptyInventoryState } from '@/components/inventory/domains/reducingInventoryState';
import {
  listingWorldPlazaActiveLockedChestKeySources,
  resettingWorldPlazaChestInstanceStoreForTests,
  unlockingAndOpeningWorldPlazaChest,
  upsertingWorldPlazaChestInstanceFromPlacement,
} from '@/components/world/chest/domains/managingWorldPlazaChestInstanceStore';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CHEST_KEY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { removingWorldPlazaInventoryItemQuantityByTypeId } from '@/components/world/inventory/domains/removingWorldPlazaInventoryItemQuantityByTypeId';
import { describe, expect, it } from 'vitest';

describe('managingWorldPlazaChestInstanceStore unlock helpers', () => {
  it('tracks active locked key sources', () => {
    const store = resettingWorldPlazaChestInstanceStoreForTests();

    upsertingWorldPlazaChestInstanceFromPlacement(
      {
        chestId: 'chest-proc-1-1',
        worldX: 1.5,
        worldY: 1.5,
        facing: 's',
        variant: 'a',
        initialState: 'locked',
        loot: { kind: 'pool', poolId: 'starter-forage' },
        keySource: 'wildlife',
      },
      null,
      store
    );

    expect(listingWorldPlazaActiveLockedChestKeySources(store)).toEqual(
      new Set(['wildlife'])
    );

    unlockingAndOpeningWorldPlazaChest('chest-proc-1-1', store);

    expect(listingWorldPlazaActiveLockedChestKeySources(store)).toEqual(
      new Set()
    );
  });
});

describe('removingWorldPlazaInventoryItemQuantityByTypeId', () => {
  it('consumes one chest key from a stack', () => {
    const baseState = creatingEmptyInventoryState(4);
    const slots: DefiningInventorySlot[] = [...baseState.slots];
    slots[0] = {
      id: 'key-1',
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CHEST_KEY,
      quantity: 2,
      slotIndex: 0,
    };
    const inventoryState: DefiningInventoryState = {
      capacity: baseState.capacity,
      slots,
    };

    const removal = removingWorldPlazaInventoryItemQuantityByTypeId(
      inventoryState,
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CHEST_KEY,
      1
    );

    expect(removal?.quantityRemoved).toBe(1);
    expect(removal?.state.slots[0]?.quantity).toBe(1);
  });
});
