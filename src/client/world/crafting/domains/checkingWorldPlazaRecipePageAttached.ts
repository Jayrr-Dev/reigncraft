/**
 * Pure predicate: whether a recipe page is already attached.
 *
 * @module components/world/crafting/domains/checkingWorldPlazaRecipePageAttached
 */

import type { DefiningWorldPlazaCraftModeRecipeId } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';

/**
 * Returns true when the recipe id is in the attached set.
 *
 * @param attachedRecipeIds - Attached recipe page ids
 * @param recipeId - Recipe to check
 */
export function checkingWorldPlazaRecipePageAttached(
  attachedRecipeIds: ReadonlySet<DefiningWorldPlazaCraftModeRecipeId>,
  recipeId: DefiningWorldPlazaCraftModeRecipeId
): boolean {
  return attachedRecipeIds.has(recipeId);
}
