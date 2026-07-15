import { creatingEmptyInventoryState } from '@/components/inventory/domains/reducingInventoryState';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_CLAY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import {
  checkingWorldPlazaInventoryHasClay,
  wettingWorldPlazaClayInInventory,
} from '@/components/world/wet-clay/domains/wettingWorldPlazaClayInInventory';
import { describe, expect, it } from 'vitest';

function creatingInventoryWithClay(quantity: number) {
  const empty = creatingEmptyInventoryState(8);
  return {
    ...empty,
    slots: empty.slots.map((slot, index) =>
      index === 0
        ? {
            id: 'clay-1',
            itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_CLAY,
            quantity,
            slotIndex: index,
          }
        : slot
    ),
  };
}

describe('wettingWorldPlazaClayInInventory', () => {
  it('converts one clay into wet clay', () => {
    const result = wettingWorldPlazaClayInInventory(
      creatingInventoryWithClay(3)
    );

    expect(result.outcome).toBe('wetted');
    if (result.outcome !== 'wetted') {
      return;
    }

    expect(result.nextState.slots[0]?.itemTypeId).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_CLAY
    );
    expect(result.nextState.slots[0]?.quantity).toBe(2);
    expect(
      result.nextState.slots.some(
        (slot) =>
          slot?.itemTypeId === DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY &&
          slot.quantity === 1
      )
    ).toBe(true);
  });

  it('returns no-clay when inventory has none', () => {
    const result = wettingWorldPlazaClayInInventory(
      creatingEmptyInventoryState(8)
    );

    expect(result.outcome).toBe('no-clay');
  });

  it('detects clay presence', () => {
    expect(checkingWorldPlazaInventoryHasClay(creatingInventoryWithClay(1))).toBe(
      true
    );
    expect(
      checkingWorldPlazaInventoryHasClay(creatingEmptyInventoryState(8))
    ).toBe(false);
  });
});
