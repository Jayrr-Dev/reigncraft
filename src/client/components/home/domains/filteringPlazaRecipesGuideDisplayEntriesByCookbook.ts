/**
 * Filters Recipes guide display entries by cookbook chip.
 *
 * @module components/home/domains/filteringPlazaRecipesGuideDisplayEntriesByCookbook
 */

import type { DefiningPlazaRecipesGuideCookbookFilterId } from '@/components/home/domains/listingPlazaRecipesGuideCookbookFilters';
import type { PlazaRecipesGuideDisplayEntry } from '@/components/home/domains/resolvingPlazaRecipesGuideDisplayEntries';

/**
 * Returns entries for the active cookbook filter.
 *
 * @param entries - Full display entry list
 * @param cookbookFilterId - All or one cookbook id
 */
export function filteringPlazaRecipesGuideDisplayEntriesByCookbook(
  entries: readonly PlazaRecipesGuideDisplayEntry[],
  cookbookFilterId: DefiningPlazaRecipesGuideCookbookFilterId
): readonly PlazaRecipesGuideDisplayEntry[] {
  if (cookbookFilterId === 'all') {
    return entries;
  }

  return entries.filter((entry) => entry.cookbookId === cookbookFilterId);
}
