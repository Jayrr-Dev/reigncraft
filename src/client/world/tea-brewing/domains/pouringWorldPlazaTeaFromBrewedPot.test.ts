import { creatingEmptyInventoryState } from '@/components/inventory/domains/reducingInventoryState';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BREWED_CLAY_TEAPOT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CUP_OF_TEA,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_CUP,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TEA_LEAVES,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { DEFINING_WORLD_PLAZA_TEA_BREWING_POURS_PER_POT } from '@/components/world/tea-brewing/domains/definingWorldPlazaTeaBrewingConstants';
import { pouringWorldPlazaTeaFromBrewedPot } from '@/components/world/tea-brewing/domains/pouringWorldPlazaTeaFromBrewedPot';
import {
  writingWorldPlazaTeaBrewingMetadata,
  writingWorldPlazaTeaPotRemainingPours,
} from '@/components/world/tea-brewing/domains/resolvingWorldPlazaTeaBrewingMetadata';
import { resolvingWorldPlazaTeaBrewingRecipe } from '@/components/world/tea-brewing/domains/resolvingWorldPlazaTeaBrewingRecipe';
import { describe, expect, it } from 'vitest';

describe('pouringWorldPlazaTeaFromBrewedPot', () => {
  it('pours one cup and decrements remaining servings', () => {
    const recipe = resolvingWorldPlazaTeaBrewingRecipe([
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TEA_LEAVES,
    ]);
    expect(recipe).not.toBeNull();
    if (!recipe) {
      return;
    }

    const brewedMetadata = writingWorldPlazaTeaPotRemainingPours(
      writingWorldPlazaTeaBrewingMetadata(undefined, recipe),
      DEFINING_WORLD_PLAZA_TEA_BREWING_POURS_PER_POT
    );
    const empty = creatingEmptyInventoryState(8);
    const inventory = {
      ...empty,
      slots: empty.slots.map((slot, index) => {
        if (index === 0) {
          return {
            id: 'teapot-brewed',
            itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BREWED_CLAY_TEAPOT,
            quantity: 1,
            slotIndex: index,
            metadata: brewedMetadata,
          };
        }

        if (index === 1) {
          return {
            id: 'cup-empty',
            itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_CUP,
            quantity: 1,
            slotIndex: index,
          };
        }

        return slot;
      }),
    };

    const result = pouringWorldPlazaTeaFromBrewedPot(inventory, 1);

    expect(result.outcome).toBe('poured');
    if (result.outcome !== 'poured') {
      return;
    }

    expect(
      result.nextState.slots.some(
        (slot) =>
          slot?.itemTypeId === DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CUP_OF_TEA
      )
    ).toBe(true);
    expect(result.remainingPours).toBe(
      DEFINING_WORLD_PLAZA_TEA_BREWING_POURS_PER_POT - 1
    );
  });

  it('returns no-empty-cup when no cup is available', () => {
    const recipe = resolvingWorldPlazaTeaBrewingRecipe([
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TEA_LEAVES,
    ]);
    expect(recipe).not.toBeNull();
    if (!recipe) {
      return;
    }

    const empty = creatingEmptyInventoryState(8);
    const inventory = {
      ...empty,
      slots: empty.slots.map((slot, index) =>
        index === 0
          ? {
              id: 'teapot-brewed',
              itemTypeId:
                DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BREWED_CLAY_TEAPOT,
              quantity: 1,
              slotIndex: index,
              metadata: writingWorldPlazaTeaPotRemainingPours(
                writingWorldPlazaTeaBrewingMetadata(undefined, recipe),
                DEFINING_WORLD_PLAZA_TEA_BREWING_POURS_PER_POT
              ),
            }
          : slot
      ),
    };

    expect(pouringWorldPlazaTeaFromBrewedPot(inventory).outcome).toBe(
      'no-empty-cup'
    );
  });
});
