import { DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID } from '@/components/world/building/domains/definingWorldPlazaCraftModeCookbookRegistry';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_REGISTRY } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeRegistry';
import { ensuringWorldPlazaSurvivalCookbookRecipesAttached } from '@/components/world/domains/ensuringWorldPlazaSurvivalCookbookRecipesAttached';
import {
  gettingWorldPlazaRecipeAttachedSnapshot,
  resettingWorldPlazaRecipeDiscoveryStoreForTests,
} from '@/components/world/domains/managingWorldPlazaRecipeDiscoveryStore';
import { beforeEach, describe, expect, it } from 'vitest';

describe('ensuringWorldPlazaSurvivalCookbookRecipesAttached', () => {
  beforeEach(() => {
    resettingWorldPlazaRecipeDiscoveryStoreForTests();
  });

  it('attaches every survival cookbook recipe from the registry', () => {
    const expectedSurvivalRecipeIds =
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_REGISTRY.filter(
        (recipe) =>
          recipe.cookbookId ===
          DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.SURVIVAL
      ).map((recipe) => recipe.id);

    ensuringWorldPlazaSurvivalCookbookRecipesAttached();

    expect(gettingWorldPlazaRecipeAttachedSnapshot().sort()).toEqual(
      [...expectedSurvivalRecipeIds].sort()
    );
  });

  it('is idempotent when called twice', () => {
    ensuringWorldPlazaSurvivalCookbookRecipesAttached();
    const firstSnapshot = gettingWorldPlazaRecipeAttachedSnapshot();

    ensuringWorldPlazaSurvivalCookbookRecipesAttached();

    expect(gettingWorldPlazaRecipeAttachedSnapshot()).toEqual(firstSnapshot);
  });
});
