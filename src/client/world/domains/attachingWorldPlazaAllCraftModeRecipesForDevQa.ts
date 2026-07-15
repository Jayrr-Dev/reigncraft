/**
 * Attaches every registered craft recipe page while plaza dev tooling is on.
 *
 * @module components/world/domains/attachingWorldPlazaAllCraftModeRecipesForDevQa
 */

import { detectingWorldPlazaDevEnvironment } from '@/components/world/building/domains/detectingWorldPlazaDevEnvironment';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_REGISTRY } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeRegistry';
import { attachingWorldPlazaRecipePage } from '@/components/world/domains/managingWorldPlazaRecipeDiscoveryStore';

/**
 * Idempotently attaches all craft registry recipes when dev mode is enabled.
 * No-op when {@link detectingWorldPlazaDevEnvironment} is false.
 */
export function attachingWorldPlazaAllCraftModeRecipesForDevQa(): void {
  if (!detectingWorldPlazaDevEnvironment()) {
    return;
  }

  for (const recipeDefinition of DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_REGISTRY) {
    attachingWorldPlazaRecipePage(recipeDefinition.id);
  }
}
