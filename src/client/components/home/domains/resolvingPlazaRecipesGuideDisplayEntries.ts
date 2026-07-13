/**
 * Merges Recipes guide catalog with attached-page unlock state.
 *
 * @module components/home/domains/resolvingPlazaRecipesGuideDisplayEntries
 */

import {
  DEFINING_PLAZA_RECIPES_GUIDE_ENTRIES,
  LABELING_PLAZA_RECIPES_UNDISCOVERED_NAME,
  type DefiningPlazaRecipesGuideEntry,
} from '@/components/home/domains/definingPlazaRecipesGuideConstants';
import type { DefiningWorldPlazaCraftModeCookbookId } from '@/components/world/building/domains/definingWorldPlazaCraftModeCookbookRegistry';
import type { DefiningWorldPlazaCraftModeRecipeId } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';

/** Display row for one Recipes guide card. */
export type PlazaRecipesGuideDisplayEntry = DefiningPlazaRecipesGuideEntry & {
  readonly isAttached: boolean;
  readonly displayName: string;
};

/**
 * Builds display entries from the catalog and attached recipe ids.
 *
 * @param attachedRecipeIds - Recipe pages attached to the player's cookbooks
 */
export function resolvingPlazaRecipesGuideDisplayEntries(
  attachedRecipeIds: ReadonlySet<DefiningWorldPlazaCraftModeRecipeId>
): readonly PlazaRecipesGuideDisplayEntry[] {
  return DEFINING_PLAZA_RECIPES_GUIDE_ENTRIES.map((entry) => {
    const isAttached = attachedRecipeIds.has(entry.recipeId);

    return {
      ...entry,
      isAttached,
      displayName: isAttached
        ? entry.title
        : LABELING_PLAZA_RECIPES_UNDISCOVERED_NAME,
    };
  });
}

/**
 * Formats the Guide dropdown subtitle for Recipes.
 *
 * @param attachedCount - Attached recipe pages
 * @param totalCount - Total registered recipes
 */
export function formattingPlazaRecipesCodexMenuDescription(
  attachedCount: number,
  totalCount: number
): string {
  return `${attachedCount} of ${totalCount} recipes attached`;
}

/**
 * Counts attached recipes for one cookbook.
 *
 * @param entries - Display entries
 * @param cookbookId - Cookbook to count
 */
export function countingPlazaRecipesGuideAttachedForCookbook(
  entries: readonly PlazaRecipesGuideDisplayEntry[],
  cookbookId: DefiningWorldPlazaCraftModeCookbookId
): { readonly attached: number; readonly total: number } {
  const cookbookEntries = entries.filter(
    (entry) => entry.cookbookId === cookbookId
  );

  return {
    attached: cookbookEntries.filter((entry) => entry.isAttached).length,
    total: cookbookEntries.length,
  };
}
