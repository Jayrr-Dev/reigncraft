/**
 * Declarative Recipes guide catalog and copy for the plaza codex.
 *
 * Entries are derived from the craft recipe registry so new recipes
 * appear here automatically once registered.
 *
 * @module components/home/domains/definingPlazaRecipesGuideConstants
 */

import {
  DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_REGISTRY,
  type DefiningWorldPlazaCraftModeCookbookId,
} from '@/components/world/building/domains/definingWorldPlazaCraftModeCookbookRegistry';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_REGISTRY } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeRegistry';
import type {
  DefiningWorldPlazaCraftModeRecipeDefinition,
  DefiningWorldPlazaCraftModeRecipeId,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';

/** One Recipes guide catalog entry (mirrors a craft recipe). */
export type DefiningPlazaRecipesGuideEntry = {
  readonly recipeId: DefiningWorldPlazaCraftModeRecipeId;
  readonly cookbookId: DefiningWorldPlazaCraftModeCookbookId;
  readonly title: string;
  readonly description: string;
  /** Iconify glyph used for locked silhouette / revealed thumbnail. */
  readonly silhouetteIconifyIcon: string;
  readonly recipeDefinition: DefiningWorldPlazaCraftModeRecipeDefinition;
};

/** Panel subtitle under the Recipes title. */
export const DEFINING_PLAZA_RECIPES_PANEL_SUBTITLE =
  'Attach a page in a cookbook to unlock its recipe here.' as const;

/** Locked card name when the recipe page is not attached yet. */
export const LABELING_PLAZA_RECIPES_UNDISCOVERED_NAME = '???' as const;

/** Progress labels. */
export const LABELING_PLAZA_RECIPES_ATTACHED_PROGRESS = 'ATTACHED' as const;

/** Empty cookbook filter copy. */
export const LABELING_PLAZA_RECIPES_EMPTY_COOKBOOK =
  'No recipes in this cookbook yet.' as const;

function resolvingPlazaRecipesGuideSilhouetteIcon(
  recipeDefinition: DefiningWorldPlazaCraftModeRecipeDefinition
): string {
  if (recipeDefinition.recipeVisual.visualKind === 'iconify') {
    return recipeDefinition.recipeVisual.recipeEmblemIconifyIcon;
  }

  if (recipeDefinition.recipeVisual.visualKind === 'sprite-sheet') {
    return 'mdi:anvil';
  }

  return 'mdi:campfire';
}

/**
 * Guide entries derived from the craft recipe registry (registry order).
 */
export const DEFINING_PLAZA_RECIPES_GUIDE_ENTRIES: readonly DefiningPlazaRecipesGuideEntry[] =
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_REGISTRY.map((recipeDefinition) => ({
    recipeId: recipeDefinition.id,
    cookbookId: recipeDefinition.cookbookId,
    title: recipeDefinition.title,
    description: recipeDefinition.description,
    silhouetteIconifyIcon:
      resolvingPlazaRecipesGuideSilhouetteIcon(recipeDefinition),
    recipeDefinition,
  }));

/** Cookbook ids that appear as Recipes guide filter chips (registry order). */
export const DEFINING_PLAZA_RECIPES_GUIDE_COOKBOOK_FILTER_IDS = [
  DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.SURVIVAL,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.BLACKSMITH,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.HEALER,
] as const satisfies readonly DefiningWorldPlazaCraftModeCookbookId[];

/** Short filter chip labels for each cookbook. */
export const DEFINING_PLAZA_RECIPES_GUIDE_COOKBOOK_FILTER_LABELS = {
  [DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.SURVIVAL]: 'Survival',
  [DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.BLACKSMITH]: 'Blacksmith',
  [DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.HEALER]: 'Healers',
} as const satisfies Record<DefiningWorldPlazaCraftModeCookbookId, string>;

/**
 * Resolves cookbook display title from the craft cookbook registry.
 *
 * @param cookbookId - Cookbook id
 */
export function resolvingPlazaRecipesGuideCookbookTitle(
  cookbookId: DefiningWorldPlazaCraftModeCookbookId
): string {
  return (
    DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_REGISTRY.find(
      (cookbook) => cookbook.id === cookbookId
    )?.title ??
    DEFINING_PLAZA_RECIPES_GUIDE_COOKBOOK_FILTER_LABELS[cookbookId]
  );
}
