import { creatingEmptyInventoryState } from '@/components/inventory/domains/reducingInventoryState';
import {
  checkingWorldPlazaInventoryHasEmptyClayBottle,
  fillingWorldPlazaClayBottleWithWater,
} from '@/components/world/ceramics/domains/fillingWorldPlazaClayBottleWithWater';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_BOTTLE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_BOTTLE,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { describe, expect, it } from 'vitest';

function creatingInventoryWithEmptyBottle() {
  const empty = creatingEmptyInventoryState(8);

  return {
    ...empty,
    slots: empty.slots.map((slot, index) =>
      index === 0
        ? {
            id: 'bottle-empty',
            itemTypeId:
              DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_BOTTLE,
            quantity: 1,
            slotIndex: index,
          }
        : slot
    ),
  };
}

describe('fillingWorldPlazaClayBottleWithWater', () => {
  it('converts an empty bottle into a watered bottle', () => {
    const inventory = creatingInventoryWithEmptyBottle();
    expect(checkingWorldPlazaInventoryHasEmptyClayBottle(inventory)).toBe(true);

    const result = fillingWorldPlazaClayBottleWithWater(inventory, 0);

    expect(result.outcome).toBe('filled');
    if (result.outcome !== 'filled') {
      return;
    }

    expect(
      result.nextState.slots.some(
        (slot) =>
          slot?.itemTypeId ===
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_BOTTLE
      )
    ).toBe(true);
    expect(
      checkingWorldPlazaInventoryHasEmptyClayBottle(result.nextState)
    ).toBe(false);
  });

  it('returns no-empty-bottle when inventory has none', () => {
    const result = fillingWorldPlazaClayBottleWithWater(
      creatingEmptyInventoryState(8)
    );
    expect(result.outcome).toBe('no-empty-bottle');
  });
});
