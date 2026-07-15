import { DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ANVIL } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID } from '@/components/world/building/domains/definingWorldPlazaCraftModeCookbookRegistry';
import { resolvingWorldPlazaCraftModeRecipeDefinition } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeRegistry';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { registeringWorldPlazaCraftablePlateArmorCraftModeRecipes } from '@/components/world/crafting/domains/registeringWorldPlazaCraftablePlateArmorCraftModeRecipes';
import { describe, expect, it } from 'vitest';

describe('registeringWorldPlazaCraftablePlateArmorCraftModeRecipes', () => {
  it('registers five tiers × five pieces for Blacksmith anvil', () => {
    const recipes = registeringWorldPlazaCraftablePlateArmorCraftModeRecipes();

    expect(recipes).toHaveLength(25);
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

  it('wires gold breastplate into the craft registry', () => {
    const recipe = resolvingWorldPlazaCraftModeRecipeDefinition(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.GOLD_PLATE_BREASTPLATE
    );

    expect(recipe?.title).toBe('Gold Breastplate');
    expect(recipe?.outcome).toEqual({
      kind: 'item',
      itemTypeId: 'world-plaza-gold-plate-breastplate',
      quantity: 1,
    });
  });

  it('wires leather cap into the craft registry', () => {
    const recipe = resolvingWorldPlazaCraftModeRecipeDefinition(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.LEATHER_PLATE_CASQUE
    );

    expect(recipe?.title).toBe('Leather Cap');
    expect(recipe?.outcome).toEqual({
      kind: 'item',
      itemTypeId: 'world-plaza-leather-plate-casque',
      quantity: 1,
    });
    expect(recipe?.ingredients).toEqual([
      { itemTypeId: 'world-plaza-wildlife-hide', quantity: 2 },
    ]);
  });

  it('uses wildlife hide for metal plate straps', () => {
    const recipe = resolvingWorldPlazaCraftModeRecipeDefinition(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.COPPER_PLATE_BREASTPLATE
    );

    expect(recipe?.title).toBe('Copper Breastplate');
    expect(recipe?.ingredients).toEqual(
      expect.arrayContaining([
        { itemTypeId: 'world-plaza-wildlife-hide', quantity: 1 },
      ])
    );
  });
});
