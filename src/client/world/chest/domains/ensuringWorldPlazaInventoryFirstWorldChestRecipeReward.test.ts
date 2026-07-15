import { creatingEmptyInventoryState } from '@/components/inventory/domains/reducingInventoryState';
import { DEFINING_WORLD_PLAZA_FIRST_WORLD_CHEST_RECIPE_ID } from '@/components/world/chest/domains/definingWorldPlazaFirstWorldChestRecipeRewardConstants';
import { ensuringWorldPlazaInventoryFirstWorldChestRecipeReward } from '@/components/world/chest/domains/ensuringWorldPlazaInventoryFirstWorldChestRecipeReward';
import { countingWorldPlazaInventoryItemTypeQuantity } from '@/components/world/crafting/domains/countingWorldPlazaInventoryItemTypeQuantity';
import { resolvingWorldPlazaCraftRecipePageItemTypeId } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { addingWorldPlazaInventoryItemWithStacking } from '@/components/world/inventory/domains/addingWorldPlazaInventoryItemWithStacking';
import { DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { describe, expect, it } from 'vitest';

describe('ensuringWorldPlazaInventoryFirstWorldChestRecipeReward', () => {
  const recipePageTypeId = resolvingWorldPlazaCraftRecipePageItemTypeId(
    DEFINING_WORLD_PLAZA_FIRST_WORLD_CHEST_RECIPE_ID
  );

  it('grants the Storage Chest recipe page on the first opened chest', () => {
    const state = creatingEmptyInventoryState(
      DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY
    );
    const result = ensuringWorldPlazaInventoryFirstWorldChestRecipeReward(
      state,
      { openedWorldChestCount: 1, storageOwnerId: 'owner-a' }
    );

    expect(result.grantedRecipeId).toBe(
      DEFINING_WORLD_PLAZA_FIRST_WORLD_CHEST_RECIPE_ID
    );
    expect(result.rewardToast).toContain('Storage Chest');
    expect(
      countingWorldPlazaInventoryItemTypeQuantity(
        result.state,
        recipePageTypeId
      )
    ).toBe(1);
  });

  it('does not grant on the second opened chest', () => {
    const state = creatingEmptyInventoryState(
      DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY
    );
    const result = ensuringWorldPlazaInventoryFirstWorldChestRecipeReward(
      state,
      { openedWorldChestCount: 2, storageOwnerId: 'owner-a' }
    );

    expect(result.grantedRecipeId).toBeNull();
    expect(
      countingWorldPlazaInventoryItemTypeQuantity(
        result.state,
        recipePageTypeId
      )
    ).toBe(0);
  });

  it('skips grant when the recipe page is already in inventory', () => {
    let state = creatingEmptyInventoryState(
      DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY
    );
    state = addingWorldPlazaInventoryItemWithStacking(
      state,
      {
        id: 'page-1',
        itemTypeId: recipePageTypeId,
        quantity: 1,
      },
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
    ).state;

    const result = ensuringWorldPlazaInventoryFirstWorldChestRecipeReward(
      state,
      { openedWorldChestCount: 1, storageOwnerId: 'owner-a' }
    );

    expect(result.grantedRecipeId).toBeNull();
    expect(
      countingWorldPlazaInventoryItemTypeQuantity(
        result.state,
        recipePageTypeId
      )
    ).toBe(1);
  });
});
