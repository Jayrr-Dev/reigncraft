/**
 * Auto-attaches every Survival cookbook recipe on session start.
 *
 * Used for online / non–single-player sessions only. Single-player boot skips
 * this so the cookbook stays empty until recipe pages are attached.
 *
 * @module components/world/domains/ensuringWorldPlazaSurvivalCookbookRecipesAttached
 */

import { DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID } from '@/components/world/building/domains/definingWorldPlazaCraftModeCookbookRegistry';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_REGISTRY } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeRegistry';
import { attachingWorldPlazaRecipePage } from '@/components/world/domains/managingWorldPlazaRecipeDiscoveryStore';

/**
 * Idempotently attaches all Survival cookbook recipes for the active session.
 */
export function ensuringWorldPlazaSurvivalCookbookRecipesAttached(): void {
  for (const recipeDefinition of DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_REGISTRY) {
    if (
      recipeDefinition.cookbookId !==
      DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.SURVIVAL
    ) {
      continue;
    }

    attachingWorldPlazaRecipePage(recipeDefinition.id);
  }
}
