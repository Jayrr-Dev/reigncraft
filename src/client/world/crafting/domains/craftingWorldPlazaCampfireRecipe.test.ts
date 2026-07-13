import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import {
  checkingWorldBuildingBlockDefinitionIsPaletteVisible,
  DEFINING_WORLD_BUILDING_BLOCK_DEFINITIONS,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE,
} from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID } from '@/components/world/building/domains/definingWorldPlazaCraftModeCookbookRegistry';
import { checkingWorldPlazaCraftRecipeAffordable } from '@/components/world/crafting/domains/checkingWorldPlazaCraftRecipeAffordable';
import { committingWorldPlazaCraftRecipePlaceablePlacement } from '@/components/world/crafting/domains/committingWorldPlazaCraftRecipePlaceablePlacement';
import { consumingWorldPlazaCraftRecipeIngredients } from '@/components/world/crafting/domains/consumingWorldPlazaCraftRecipeIngredients';
import { countingWorldPlazaInventoryItemTypeQuantity } from '@/components/world/crafting/domains/countingWorldPlazaInventoryItemTypeQuantity';
import {
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_STONE_COST,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_WOOD_COST,
  resolvingWorldPlazaCraftModeRecipeDefinition,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeRegistry';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { executingWorldPlazaCraftRecipeInventoryOutcome } from '@/components/world/crafting/domains/executingWorldPlazaCraftRecipeInventoryOutcome';
import { listingWorldPlazaCraftRecipesForCookbook } from '@/components/world/crafting/domains/listingWorldPlazaCraftRecipesForCookbook';
import { refundingWorldPlazaCraftRecipeIngredients } from '@/components/world/crafting/domains/refundingWorldPlazaCraftRecipeIngredients';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { describe, expect, it } from 'vitest';

function buildingInventoryState(
  slots: DefiningInventoryState['slots']
): DefiningInventoryState {
  return {
    capacity: slots.length,
    slots,
  };
}

describe('campfire build block registry', () => {
  it('keeps utility:campfire registered but hidden from the build palette', () => {
    const campfireDefinition =
      DEFINING_WORLD_BUILDING_BLOCK_DEFINITIONS[
        DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE
      ];

    expect(campfireDefinition.name).toBe('Campfire');
    expect(
      checkingWorldBuildingBlockDefinitionIsPaletteVisible(campfireDefinition)
    ).toBe(false);
  });
});

describe('listingWorldPlazaCraftRecipesForCookbook', () => {
  it('returns the campfire recipe for the survival cookbook', () => {
    const recipes = listingWorldPlazaCraftRecipesForCookbook(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.SURVIVAL
    );

    expect(recipes).toHaveLength(1);
    expect(recipes[0]?.id).toBe(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CAMPFIRE
    );
    expect(recipes[0]?.outcome).toEqual({
      kind: 'placeable',
      blockDefinitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE,
      blockHeight: 0,
    });
  });
});

describe('checkingWorldPlazaCraftRecipeAffordable', () => {
  const campfireRecipe = resolvingWorldPlazaCraftModeRecipeDefinition(
    DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CAMPFIRE
  );

  it('requires exactly 8 stone and 5 wood', () => {
    expect(campfireRecipe).not.toBeNull();
    if (!campfireRecipe) {
      return;
    }

    const shortStone = buildingInventoryState([
      {
        id: 'stone',
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
        quantity:
          DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_STONE_COST - 1,
      },
      {
        id: 'wood',
        itemTypeId: 'world-plaza-wood',
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_WOOD_COST,
      },
    ]);

    expect(
      checkingWorldPlazaCraftRecipeAffordable(shortStone, campfireRecipe)
    ).toBe(false);

    const exactMaterials = buildingInventoryState([
      {
        id: 'stone',
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_STONE_COST,
      },
      {
        id: 'wood',
        itemTypeId: 'world-plaza-wood',
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_WOOD_COST,
      },
    ]);

    expect(
      checkingWorldPlazaCraftRecipeAffordable(exactMaterials, campfireRecipe)
    ).toBe(true);
  });
});

describe('consumingWorldPlazaCraftRecipeIngredients', () => {
  const campfireRecipe = resolvingWorldPlazaCraftModeRecipeDefinition(
    DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CAMPFIRE
  );

  it('consumes all ingredients atomically or leaves inventory unchanged', () => {
    expect(campfireRecipe).not.toBeNull();
    if (!campfireRecipe) {
      return;
    }

    const startingState = buildingInventoryState([
      {
        id: 'stone',
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_STONE_COST,
      },
      {
        id: 'wood',
        itemTypeId: 'world-plaza-wood',
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_WOOD_COST,
      },
    ]);

    const consumeResult = consumingWorldPlazaCraftRecipeIngredients(
      startingState,
      campfireRecipe
    );

    expect(consumeResult.outcome).toBe('consumed');
    if (consumeResult.outcome !== 'consumed') {
      return;
    }

    expect(
      countingWorldPlazaInventoryItemTypeQuantity(
        consumeResult.nextState,
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE
      )
    ).toBe(0);
    expect(
      countingWorldPlazaInventoryItemTypeQuantity(
        consumeResult.nextState,
        'world-plaza-wood'
      )
    ).toBe(0);
  });
});

describe('committingWorldPlazaCraftRecipePlaceablePlacement', () => {
  const campfireRecipe = resolvingWorldPlazaCraftModeRecipeDefinition(
    DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CAMPFIRE
  );

  it('commits ingredient consumption only when materials are still available', () => {
    expect(campfireRecipe).not.toBeNull();
    if (!campfireRecipe) {
      return;
    }

    const depletedState = buildingInventoryState([
      {
        id: 'wood',
        itemTypeId: 'world-plaza-wood',
        quantity: 1,
      },
    ]);

    expect(
      committingWorldPlazaCraftRecipePlaceablePlacement(
        depletedState,
        campfireRecipe
      ).outcome
    ).toBe('missing-materials');
  });
});

describe('refundingWorldPlazaCraftRecipeIngredients', () => {
  const campfireRecipe = resolvingWorldPlazaCraftModeRecipeDefinition(
    DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CAMPFIRE
  );

  it('returns stone and wood after a crafted campfire is removed', () => {
    expect(campfireRecipe).not.toBeNull();
    if (!campfireRecipe) {
      return;
    }

    const emptyState = buildingInventoryState(
      Array.from({ length: 8 }, () => null)
    );
    const refundResult = refundingWorldPlazaCraftRecipeIngredients(
      emptyState,
      campfireRecipe
    );

    expect(refundResult.outcome).toBe('refunded');
    if (refundResult.outcome !== 'refunded') {
      return;
    }

    expect(
      countingWorldPlazaInventoryItemTypeQuantity(
        refundResult.nextState,
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE
      )
    ).toBe(DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_STONE_COST);
    expect(
      countingWorldPlazaInventoryItemTypeQuantity(
        refundResult.nextState,
        'world-plaza-wood'
      )
    ).toBe(DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_WOOD_COST);
  });
});

describe('executingWorldPlazaCraftRecipeInventoryOutcome', () => {
  it('rejects placeable recipes', () => {
    const campfireRecipe = resolvingWorldPlazaCraftModeRecipeDefinition(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CAMPFIRE
    );

    expect(campfireRecipe).not.toBeNull();
    if (!campfireRecipe) {
      return;
    }

    expect(
      executingWorldPlazaCraftRecipeInventoryOutcome(
        buildingInventoryState(Array.from({ length: 8 }, () => null)),
        campfireRecipe
      ).outcome
    ).toBe('missing-materials');
  });
});
