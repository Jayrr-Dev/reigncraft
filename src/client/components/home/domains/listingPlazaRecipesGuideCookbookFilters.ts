/**
 * Cookbook filter chips for the Recipes guide panel.
 *
 * @module components/home/domains/listingPlazaRecipesGuideCookbookFilters
 */

import type { DefiningWorldPlazaCraftModeCookbookId } from '@/components/world/building/domains/definingWorldPlazaCraftModeCookbookRegistry';
import {
  DEFINING_PLAZA_RECIPES_GUIDE_COOKBOOK_FILTER_IDS,
  DEFINING_PLAZA_RECIPES_GUIDE_COOKBOOK_FILTER_LABELS,
} from '@/components/home/domains/definingPlazaRecipesGuideConstants';

/** Recipes guide filter: all cookbooks or one cookbook. */
export type DefiningPlazaRecipesGuideCookbookFilterId =
  | 'all'
  | DefiningWorldPlazaCraftModeCookbookId;

export type DefiningPlazaRecipesGuideCookbookFilter = {
  readonly id: DefiningPlazaRecipesGuideCookbookFilterId;
  readonly label: string;
};

/**
 * Lists Recipes guide filter chips (All + each cookbook).
 */
export function listingPlazaRecipesGuideCookbookFilters(): readonly DefiningPlazaRecipesGuideCookbookFilter[] {
  return [
    { id: 'all', label: 'All' },
    ...DEFINING_PLAZA_RECIPES_GUIDE_COOKBOOK_FILTER_IDS.map((cookbookId) => ({
      id: cookbookId,
      label: DEFINING_PLAZA_RECIPES_GUIDE_COOKBOOK_FILTER_LABELS[cookbookId],
    })),
  ];
}
