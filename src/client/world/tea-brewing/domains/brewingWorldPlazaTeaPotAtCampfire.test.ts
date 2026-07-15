import { creatingEmptyInventoryState } from '@/components/inventory/domains/reducingInventoryState';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BREWED_CLAY_TEAPOT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TEA_LEAVES,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_TEAPOT,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { brewingWorldPlazaTeaPotAtCampfire } from '@/components/world/tea-brewing/domains/brewingWorldPlazaTeaPotAtCampfire';
import { writingWorldPlazaTeaPotIngredientSlots } from '@/components/world/tea-brewing/domains/resolvingWorldPlazaTeaBrewingMetadata';
import { describe, expect, it } from 'vitest';

function creatingInventoryWithWateredTeaPot(
  ingredientTypeIds: readonly string[]
) {
  const empty = creatingEmptyInventoryState(8);

  return {
    ...empty,
    slots: empty.slots.map((slot, index) =>
      index === 0
        ? {
            id: 'teapot-watered',
            itemTypeId:
              DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_TEAPOT,
            quantity: 1,
            slotIndex: index,
            metadata: writingWorldPlazaTeaPotIngredientSlots(
              undefined,
              ingredientTypeIds.map((itemTypeId) => itemTypeId)
            ),
          }
        : slot
    ),
  };
}

describe('brewingWorldPlazaTeaPotAtCampfire', () => {
  it('brews a watered teapot with ingredients', () => {
    const inventory = creatingInventoryWithWateredTeaPot([
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TEA_LEAVES,
    ]);
    const result = brewingWorldPlazaTeaPotAtCampfire(inventory);

    expect(result.outcome).toBe('brewed');
    if (result.outcome !== 'brewed') {
      return;
    }

    const brewedItem = result.nextState.slots[0];
    expect(brewedItem?.itemTypeId).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BREWED_CLAY_TEAPOT
    );
    expect(result.displayName.length).toBeGreaterThan(0);
  });

  it('returns no-ingredients when the watered pot is empty', () => {
    const inventory = creatingInventoryWithWateredTeaPot([]);
    const result = brewingWorldPlazaTeaPotAtCampfire(inventory);

    expect(result.outcome).toBe('no-ingredients');
  });
});
