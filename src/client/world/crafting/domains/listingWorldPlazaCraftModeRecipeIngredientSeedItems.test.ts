import { DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_REGISTRY } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeRegistry';
import { listingWorldPlazaCraftModeRecipeIngredientSeedItems } from '@/components/world/crafting/domains/listingWorldPlazaCraftModeRecipeIngredientSeedItems';
import { DEFINING_WORLD_PLAZA_DEV_QA_CRAFT_INGREDIENT_SEED_QUANTITY } from '@/components/world/domains/definingWorldPlazaDevQaLoadConstants';
import { describe, expect, it } from 'vitest';

describe('listingWorldPlazaCraftModeRecipeIngredientSeedItems', () => {
  it('returns one unique row per craft ingredient at the Dev QA seed quantity', () => {
    const seedItems = listingWorldPlazaCraftModeRecipeIngredientSeedItems();
    const expectedItemTypeIds = new Set(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_REGISTRY.flatMap((recipe) =>
        recipe.ingredients.map((ingredient) => ingredient.itemTypeId)
      )
    );

    expect(seedItems).toHaveLength(expectedItemTypeIds.size);
    expect(new Set(seedItems.map((item) => item.itemTypeId))).toEqual(
      expectedItemTypeIds
    );
    expect(
      seedItems.every(
        (item) =>
          item.quantity === DEFINING_WORLD_PLAZA_DEV_QA_CRAFT_INGREDIENT_SEED_QUANTITY
      )
    ).toBe(true);
  });
});
