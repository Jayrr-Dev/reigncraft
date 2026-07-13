/**
 * Lists craft recipes registered to one cookbook.
 *
 * @module components/world/crafting/domains/listingWorldPlazaCraftRecipesForCookbook
 */

import type { DefiningWorldPlazaCraftModeCookbookId } from '@/components/world/building/domains/definingWorldPlazaCraftModeCookbookRegistry';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_REGISTRY } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeRegistry';
import type { DefiningWorldPlazaCraftModeRecipeDefinition } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';

/**
 * Returns recipes bound to one cookbook in registry order.
 *
 * @param cookbookId - Cookbook id
 */
export function listingWorldPlazaCraftRecipesForCookbook(
  cookbookId: DefiningWorldPlazaCraftModeCookbookId
): readonly DefiningWorldPlazaCraftModeRecipeDefinition[] {
  return DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_REGISTRY.filter(
    (recipeDefinition) => recipeDefinition.cookbookId === cookbookId
  );
}
