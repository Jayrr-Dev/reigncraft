import { DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ANVIL } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID } from '@/components/world/building/domains/definingWorldPlazaCraftModeCookbookRegistry';
import { resolvingWorldPlazaCraftModeRecipeDefinition } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeRegistry';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { registeringWorldPlazaIronPlateArmorCraftModeRecipes } from '@/components/world/crafting/domains/registeringWorldPlazaIronPlateArmorCraftModeRecipes';
import { describe, expect, it } from 'vitest';

describe('registeringWorldPlazaIronPlateArmorCraftModeRecipes', () => {
  it('registers five Blacksmith anvil item recipes', () => {
    const recipes = registeringWorldPlazaIronPlateArmorCraftModeRecipes();

    expect(recipes).toHaveLength(5);
    expect(
      recipes.every(
        (recipe) =>
          recipe.cookbookId ===
            DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.BLACKSMITH &&
          recipe.recipeType === 'item' &&
          recipe.requiredNearbyBlockDefinitionId ===
            DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ANVIL
      )
    ).toBe(true);
  });

  it('wires breastplate into the craft registry', () => {
    const recipe = resolvingWorldPlazaCraftModeRecipeDefinition(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.IRON_PLATE_BREASTPLATE
    );

    expect(recipe?.title).toBe('Iron Breastplate');
    expect(recipe?.outcome).toEqual({
      kind: 'item',
      itemTypeId: 'world-plaza-iron-plate-breastplate',
      quantity: 1,
    });
  });
});
