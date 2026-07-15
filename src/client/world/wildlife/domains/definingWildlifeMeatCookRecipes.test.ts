import { DEFINING_WORLD_PLAZA_COFFEE_BEANS_CAMPFIRE_ROAST_DURATION_MS } from '@/components/world/inventory/domains/definingWorldPlazaCoffeeProcessingConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COFFEE_BEANS,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ROASTED_COFFEE_BEANS,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import {
  resolvingFirstWildlifeMeatCookRecipeInInventory,
  resolvingWildlifeMeatCookRecipeByRawItemTypeId,
} from '@/components/world/wildlife/domains/definingWildlifeMeatCookRecipes';
import { describe, expect, it } from 'vitest';

describe('definingWildlifeMeatCookRecipes coffee roast', () => {
  it('maps coffee beans to roasted coffee beans at the campfire', () => {
    const recipe = resolvingWildlifeMeatCookRecipeByRawItemTypeId(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COFFEE_BEANS
    );

    expect(recipe).toMatchObject({
      rawItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COFFEE_BEANS,
      cookedItemTypeId:
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ROASTED_COFFEE_BEANS,
      cookedDisplayName: 'Roasted Coffee Beans',
      cookDurationMs:
        DEFINING_WORLD_PLAZA_COFFEE_BEANS_CAMPFIRE_ROAST_DURATION_MS,
    });
  });

  it('finds coffee beans in inventory for campfire cook', () => {
    const recipe = resolvingFirstWildlifeMeatCookRecipeInInventory([
      { itemTypeId: 'world-plaza-apple', quantity: 1 },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COFFEE_BEANS,
        quantity: 3,
      },
    ]);

    expect(recipe?.cookedItemTypeId).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ROASTED_COFFEE_BEANS
    );
  });
});
