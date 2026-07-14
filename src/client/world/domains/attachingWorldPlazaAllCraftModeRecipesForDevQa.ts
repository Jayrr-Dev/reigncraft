/**
 * Attaches every registered craft recipe page while Dev QA load is active.
 *
 * @module components/world/domains/attachingWorldPlazaAllCraftModeRecipesForDevQa
 */

import { DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_REGISTRY } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeRegistry';
import { checkingWorldPlazaDevQaLoadEnabled } from '@/components/world/domains/managingWorldPlazaDevQaLoadStore';
import { attachingWorldPlazaRecipePage } from '@/components/world/domains/managingWorldPlazaRecipeDiscoveryStore';

/**
 * Idempotently attaches all craft registry recipes when Dev QA is enabled.
 * No-op outside Dev QA sessions.
 */
export function attachingWorldPlazaAllCraftModeRecipesForDevQa(): void {
  if (!checkingWorldPlazaDevQaLoadEnabled()) {
    return;
  }

  for (const recipeDefinition of DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_REGISTRY) {
    attachingWorldPlazaRecipePage(recipeDefinition.id);
  }
}
