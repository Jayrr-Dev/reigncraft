import { creatingEmptyInventoryState } from '@/components/inventory/domains/reducingInventoryState';
import {
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CALTROPS_OUTPUT_QUANTITY,
  resolvingWorldPlazaCraftModeRecipeDefinition,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeRegistry';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { executingWorldPlazaCraftRecipeInventoryOutcome } from '@/components/world/crafting/domains/executingWorldPlazaCraftRecipeInventoryOutcome';
import { addingWorldPlazaInventoryItemWithStacking } from '@/components/world/inventory/domains/addingWorldPlazaInventoryItemWithStacking';
import { DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BEAR_TRAP,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CALTROPS,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { describe, expect, it } from 'vitest';

function countingItemType(
  state: ReturnType<typeof creatingEmptyInventoryState>,
  itemTypeId: string
): number {
  return state.slots.reduce(
    (sum, slot) =>
      slot?.itemTypeId === itemTypeId ? sum + slot.quantity : sum,
    0
  );
}

describe('trap item craft inventory outcomes', () => {
  it('registers bear trap and caltrops in the inventory registry', () => {
    expect(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY.resolvingItemType(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BEAR_TRAP
      )?.name
    ).toBe('Bear Trap');
    expect(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY.resolvingItemType(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CALTROPS
      )?.name
    ).toBe('Caltrops');
  });

  it('crafts a bear trap into inventory', () => {
    const recipe = resolvingWorldPlazaCraftModeRecipeDefinition(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.BEAR_TRAP
    );
    expect(recipe?.outcome.kind).toBe('item');

    let state = creatingEmptyInventoryState(20);
    state = addingWorldPlazaInventoryItemWithStacking(
      state,
      {
        id: 'iron',
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
        quantity: 5,
      },
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
    ).state;
    state = addingWorldPlazaInventoryItemWithStacking(
      state,
      {
        id: 'wood',
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
        quantity: 5,
      },
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
    ).state;

    const result = executingWorldPlazaCraftRecipeInventoryOutcome(
      state,
      recipe!
    );

    expect(result.outcome).toBe('crafted');
    if (result.outcome !== 'crafted') {
      return;
    }

    expect(
      countingItemType(
        result.nextState,
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BEAR_TRAP
      )
    ).toBe(1);
    expect(
      countingItemType(
        result.nextState,
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON
      )
    ).toBe(2);
    expect(
      countingItemType(
        result.nextState,
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD
      )
    ).toBe(3);
    expect(result.nextState.slots[0]?.itemTypeId).not.toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BEAR_TRAP
    );
  });

  it('crafts caltrops into inventory', () => {
    const recipe = resolvingWorldPlazaCraftModeRecipeDefinition(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CALTROPS
    );
    expect(recipe?.outcome.kind).toBe('item');

    let state = creatingEmptyInventoryState(20);
    state = addingWorldPlazaInventoryItemWithStacking(
      state,
      {
        id: 'iron',
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
        quantity: 2,
      },
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
    ).state;

    const result = executingWorldPlazaCraftRecipeInventoryOutcome(
      state,
      recipe!
    );

    expect(result.outcome).toBe('crafted');
    if (result.outcome !== 'crafted') {
      return;
    }

    expect(
      countingItemType(
        result.nextState,
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CALTROPS
      )
    ).toBe(DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CALTROPS_OUTPUT_QUANTITY);
  });

  it('refuses to craft into the reserved weapon slot when that is the only free slot', () => {
    const recipe = resolvingWorldPlazaCraftModeRecipeDefinition(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.BEAR_TRAP
    );
    expect(recipe).not.toBeNull();
    if (!recipe) {
      return;
    }

    let state = creatingEmptyInventoryState(
      DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY
    );
    state = {
      ...state,
      slots: state.slots.map((slot, slotIndex) => {
        if (slotIndex === 0) {
          return null;
        }

        if (slotIndex === 1) {
          return {
            id: 'iron',
            itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
            quantity: 5,
            slotIndex,
          };
        }

        if (slotIndex === 2) {
          return {
            id: 'wood',
            itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
            quantity: 5,
            slotIndex,
          };
        }

        return {
          id: `filler-${slotIndex}`,
          itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
          quantity: 1,
          slotIndex,
        };
      }),
    };

    expect(state.slots[0]).toBeNull();
    expect(
      state.slots.some((slot, slotIndex) => slotIndex > 0 && slot === null)
    ).toBe(false);

    const result = executingWorldPlazaCraftRecipeInventoryOutcome(state, recipe);

    expect(result.outcome).toBe('inventory-full');
    expect(
      countingItemType(state, DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BEAR_TRAP)
    ).toBe(0);
  });

  it('never places a crafted trap into the reserved weapon slot', () => {
    const recipe = resolvingWorldPlazaCraftModeRecipeDefinition(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CALTROPS
    );
    expect(recipe).not.toBeNull();
    if (!recipe) {
      return;
    }

    let state = creatingEmptyInventoryState(8);
    state = addingWorldPlazaInventoryItemWithStacking(
      state,
      {
        id: 'axe',
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE,
        quantity: 1,
      },
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
    ).state;
    state = addingWorldPlazaInventoryItemWithStacking(
      state,
      {
        id: 'iron',
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
        quantity: 1,
      },
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
    ).state;

    const result = executingWorldPlazaCraftRecipeInventoryOutcome(state, recipe);

    expect(result.outcome).toBe('crafted');
    if (result.outcome !== 'crafted') {
      return;
    }

    expect(result.nextState.slots[0]?.itemTypeId).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE
    );
    expect(
      result.nextState.slots.some(
        (slot) =>
          slot?.itemTypeId === DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CALTROPS
      )
    ).toBe(true);
  });
});
