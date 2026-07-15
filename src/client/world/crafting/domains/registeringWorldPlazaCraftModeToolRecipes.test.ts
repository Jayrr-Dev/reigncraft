import { DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID } from '@/components/world/building/domains/definingWorldPlazaCraftModeCookbookRegistry';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeToolRecipeIds';
import { registeringWorldPlazaCraftModeToolRecipes } from '@/components/world/crafting/domains/registeringWorldPlazaCraftModeToolRecipes';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_STEEL } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { describe, expect, it } from 'vitest';

describe('registeringWorldPlazaCraftModeToolRecipes', () => {
  it('registers one blacksmith recipe per tool family and tier', () => {
    const recipes = registeringWorldPlazaCraftModeToolRecipes();

    expect(recipes).toHaveLength(
      Object.keys(DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID).length
    );
    expect(
      recipes.every(
        (recipe) =>
          recipe.cookbookId ===
            DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.BLACKSMITH &&
          recipe.recipeType === 'item' &&
          recipe.outcome.quantity === 1
      )
    ).toBe(true);
  });

  it('makes steel tools cost steel ingots at an anvil', () => {
    const steelAxe = registeringWorldPlazaCraftModeToolRecipes().find(
      (recipe) =>
        recipe.id === DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.AXE_STEEL
    );

    expect(steelAxe?.requiredNearbyBlockDefinitionId).toBeTruthy();
    expect(
      steelAxe?.ingredients.some(
        (ingredient) =>
          ingredient.itemTypeId ===
            DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_STEEL &&
          ingredient.quantity === 5
      )
    ).toBe(true);
  });

  it('lets wood tools craft without an anvil', () => {
    const woodPickaxe = registeringWorldPlazaCraftModeToolRecipes().find(
      (recipe) =>
        recipe.id ===
        DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.PICKAXE_WOOD
    );

    expect(woodPickaxe?.requiredNearbyBlockDefinitionId).toBeUndefined();
    expect(
      woodPickaxe?.ingredients.some((ingredient) =>
        ingredient.itemTypeId.includes('wood')
      )
    ).toBe(true);
  });
});
