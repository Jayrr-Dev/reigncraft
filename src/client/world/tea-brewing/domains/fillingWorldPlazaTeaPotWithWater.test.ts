import { creatingEmptyInventoryState } from '@/components/inventory/domains/reducingInventoryState';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_TEAPOT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_TEAPOT,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import {
  checkingWorldPlazaInventoryHasEmptyClayTeaPot,
  fillingWorldPlazaTeaPotWithWater,
} from '@/components/world/tea-brewing/domains/fillingWorldPlazaTeaPotWithWater';
import { describe, expect, it } from 'vitest';

function creatingInventoryWithEmptyTeaPot() {
  const empty = creatingEmptyInventoryState(8);

  return {
    ...empty,
    slots: empty.slots.map((slot, index) =>
      index === 0
        ? {
            id: 'teapot-empty',
            itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_TEAPOT,
            quantity: 1,
            slotIndex: index,
          }
        : slot
    ),
  };
}

describe('fillingWorldPlazaTeaPotWithWater', () => {
  it('converts an empty teapot into a watered teapot', () => {
    const result = fillingWorldPlazaTeaPotWithWater(
      creatingInventoryWithEmptyTeaPot()
    );

    expect(result.outcome).toBe('filled');
    if (result.outcome !== 'filled') {
      return;
    }

    expect(
      result.nextState.slots.some(
        (slot) =>
          slot?.itemTypeId ===
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_TEAPOT
      )
    ).toBe(true);
    expect(
      result.nextState.slots.some(
        (slot) =>
          slot?.itemTypeId ===
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_TEAPOT
      )
    ).toBe(false);
  });

  it('returns no-empty-teapot when inventory has none', () => {
    const result = fillingWorldPlazaTeaPotWithWater(
      creatingEmptyInventoryState(8)
    );

    expect(result.outcome).toBe('no-empty-teapot');
  });

  it('detects empty teapot presence', () => {
    expect(
      checkingWorldPlazaInventoryHasEmptyClayTeaPot(
        creatingInventoryWithEmptyTeaPot()
      )
    ).toBe(true);
    expect(
      checkingWorldPlazaInventoryHasEmptyClayTeaPot(
        creatingEmptyInventoryState(8)
      )
    ).toBe(false);
  });
});
