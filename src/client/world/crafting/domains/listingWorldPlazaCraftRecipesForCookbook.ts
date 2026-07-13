/**
 * Lists craft recipes registered to one cookbook.
 *
 * @module components/world/crafting/domains/listingWorldPlazaCraftRecipesForCookbook
 */

import type { DefiningWorldPlazaCraftModeCookbookId } from '@/components/world/building/domains/definingWorldPlazaCraftModeCookbookRegistry';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_REGISTRY } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeRegistry';
import type {
  DefiningWorldPlazaCraftModeRecipeDefinition,
  DefiningWorldPlazaCraftModeRecipeId,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';

export type ListingWorldPlazaCraftRecipesForCookbookOptions = {
  /**
   * When set, only recipes whose pages are in this set are returned.
   * Omit to list every registered recipe for the cookbook (catalog / tests).
   */
  readonly attachedRecipeIds?: ReadonlySet<DefiningWorldPlazaCraftModeRecipeId>;
};

/**
 * Returns recipes bound to one cookbook in registry order.
 *
 * @param cookbookId - Cookbook id
 * @param options - Optional attach filter for in-world cookbook UI
 */
export function listingWorldPlazaCraftRecipesForCookbook(
  cookbookId: DefiningWorldPlazaCraftModeCookbookId,
  options?: ListingWorldPlazaCraftRecipesForCookbookOptions
): readonly DefiningWorldPlazaCraftModeRecipeDefinition[] {
  const attachedRecipeIds = options?.attachedRecipeIds;

  return DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_REGISTRY.filter(
    (recipeDefinition) => {
      if (recipeDefinition.cookbookId !== cookbookId) {
        return false;
      }

      if (attachedRecipeIds === undefined) {
        return true;
      }

      return attachedRecipeIds.has(recipeDefinition.id);
    }
  );
}
