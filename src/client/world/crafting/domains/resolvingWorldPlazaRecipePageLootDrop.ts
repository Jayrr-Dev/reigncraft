/**
 * Rolls a leftover craft recipe page from the world loot pool.
 *
 * @module components/world/crafting/domains/resolvingWorldPlazaRecipePageLootDrop
 */

import { checkingWorldPlazaCraftModeRecipeId } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeRegistry';
import type { DefiningWorldPlazaCraftModeRecipeId } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { resolvingWorldPlazaCraftRecipePageItemTypeId } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import {
  DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_POOL_BY_CATEGORY,
  DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_POOL_RECIPE_IDS,
  DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_SOURCE_CONFIG,
  type DefiningWorldPlazaRecipePageLootPoolCategory,
  type DefiningWorldPlazaRecipePageLootSource,
} from '@/components/world/crafting/domains/definingWorldPlazaRecipePageLootPoolConstants';
import { checkingWorldPlazaRecipePageAttachedInStore } from '@/components/world/domains/managingWorldPlazaRecipeDiscoveryStore';

export type ResolvingWorldPlazaRecipePageLootDropResult = {
  readonly recipeId: DefiningWorldPlazaCraftModeRecipeId;
  readonly itemTypeId: string;
  readonly quantity: 1;
};

export type ResolvingWorldPlazaRecipePageLootDropOptions = {
  readonly source: DefiningWorldPlazaRecipePageLootSource;
  /** Recipes already attached (and optionally already held) — skipped. */
  readonly excludedRecipeIds?: ReadonlySet<string>;
  readonly randomUnitInterval?: () => number;
};

/**
 * Pool recipe ids already attached in the live discovery store.
 */
export function resolvingWorldPlazaRecipePageLootExcludedAttachedRecipeIds(): Set<string> {
  const excluded = new Set<string>();

  for (const recipeId of DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_POOL_RECIPE_IDS) {
    if (checkingWorldPlazaRecipePageAttachedInStore(recipeId)) {
      excluded.add(recipeId);
    }
  }

  return excluded;
}

function listingWorldPlazaRecipePageLootPoolForCategories(
  categories: readonly DefiningWorldPlazaRecipePageLootPoolCategory[]
): readonly DefiningWorldPlazaCraftModeRecipeId[] {
  const seen = new Set<DefiningWorldPlazaCraftModeRecipeId>();
  const recipeIds: DefiningWorldPlazaCraftModeRecipeId[] = [];

  for (const category of categories) {
    for (const recipeId of DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_POOL_BY_CATEGORY[
      category
    ]) {
      if (seen.has(recipeId)) {
        continue;
      }
      seen.add(recipeId);
      recipeIds.push(recipeId);
    }
  }

  return recipeIds;
}

function filteringWorldPlazaRecipePageLootPoolEligible(
  recipeIds: readonly DefiningWorldPlazaCraftModeRecipeId[],
  excludedRecipeIds: ReadonlySet<string>
): readonly DefiningWorldPlazaCraftModeRecipeId[] {
  return recipeIds.filter(
    (recipeId) =>
      checkingWorldPlazaCraftModeRecipeId(recipeId) &&
      !excludedRecipeIds.has(recipeId)
  );
}

/**
 * Small-chance roll: on success picks one eligible leftover recipe page.
 * Prefer source categories; if those are exhausted, fall back to full pool.
 */
export function resolvingWorldPlazaRecipePageLootDrop(
  options: ResolvingWorldPlazaRecipePageLootDropOptions
): ResolvingWorldPlazaRecipePageLootDropResult | null {
  const config =
    DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_SOURCE_CONFIG[options.source];
  const randomUnitInterval = options.randomUnitInterval ?? Math.random;
  const excludedRecipeIds = options.excludedRecipeIds ?? new Set<string>();

  if (config.chance <= 0 || randomUnitInterval() >= config.chance) {
    return null;
  }

  const themedPool = filteringWorldPlazaRecipePageLootPoolEligible(
    listingWorldPlazaRecipePageLootPoolForCategories(config.categories),
    excludedRecipeIds
  );
  const eligiblePool =
    themedPool.length > 0
      ? themedPool
      : filteringWorldPlazaRecipePageLootPoolEligible(
          DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_POOL_RECIPE_IDS,
          excludedRecipeIds
        );

  if (eligiblePool.length === 0) {
    return null;
  }

  const pickIndex = Math.min(
    eligiblePool.length - 1,
    Math.floor(randomUnitInterval() * eligiblePool.length)
  );
  const recipeId = eligiblePool[pickIndex];

  if (!recipeId) {
    return null;
  }

  return {
    recipeId,
    itemTypeId: resolvingWorldPlazaCraftRecipePageItemTypeId(recipeId),
    quantity: 1,
  };
}
