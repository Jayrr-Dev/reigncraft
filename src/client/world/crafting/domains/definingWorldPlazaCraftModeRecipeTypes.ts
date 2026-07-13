/**
 * Declarative craft recipe types.
 *
 * Authoring shape (add rows in the recipe registry):
 * - `recipeType: 'entity'` → place a world block/entity (e.g. campfire)
 * - `recipeType: 'item'` → add stack(s) to inventory
 *
 * Recipes stay locked in cookbooks until the matching recipe page is attached.
 *
 * @module components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes
 */

import type { DefiningWorldBuildingBlockDefinitionId } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import type { DefiningWorldPlazaCraftModeCookbookId } from '@/components/world/building/domains/definingWorldPlazaCraftModeCookbookRegistry';

/** Stable ids for craft-mode recipes. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID = {
  CAMPFIRE: 'recipe-campfire',
} as const;

/** One craft-mode recipe id. */
export type DefiningWorldPlazaCraftModeRecipeId =
  (typeof DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID)[keyof typeof DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID];

/** Craft output family: world entity vs inventory item. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_TYPE = {
  ENTITY: 'entity',
  ITEM: 'item',
} as const;

export type DefiningWorldPlazaCraftModeRecipeType =
  (typeof DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_TYPE)[keyof typeof DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_TYPE];

/** One ingredient row in a recipe. */
export type DefiningWorldPlazaCraftModeRecipeIngredient = {
  readonly itemTypeId: string;
  readonly quantity: number;
};

/** Placeable world outcome (block / entity on claimed ground). */
export type DefiningWorldPlazaCraftModeRecipeEntityOutcome = {
  readonly kind: 'entity';
  readonly blockDefinitionId: DefiningWorldBuildingBlockDefinitionId;
  readonly blockHeight: number;
};

/** Inventory stack outcome. */
export type DefiningWorldPlazaCraftModeRecipeItemOutcome = {
  readonly kind: 'item';
  readonly itemTypeId: string;
  readonly quantity: number;
};

/** Discriminated craft outcome (`kind` matches `recipeType`). */
export type DefiningWorldPlazaCraftModeRecipeOutcome =
  | DefiningWorldPlazaCraftModeRecipeEntityOutcome
  | DefiningWorldPlazaCraftModeRecipeItemOutcome;

/** Left-page art for one recipe spread. */
export type DefiningWorldPlazaCraftModeRecipeVisual =
  | {
      readonly visualKind: 'iconify';
      readonly recipeEmblemIconifyIcon: string;
    }
  | {
      readonly visualKind: 'world-plaza-campfire';
    };

/** Shared display fields for every recipe. */
type DefiningWorldPlazaCraftModeRecipeDefinitionBase = {
  readonly id: DefiningWorldPlazaCraftModeRecipeId;
  readonly cookbookId: DefiningWorldPlazaCraftModeCookbookId;
  readonly title: string;
  readonly description: string;
  readonly recipeVisual: DefiningWorldPlazaCraftModeRecipeVisual;
  readonly ingredients: readonly DefiningWorldPlazaCraftModeRecipeIngredient[];
};

/** Entity-output recipe (arms build placement). */
export type DefiningWorldPlazaCraftModeEntityRecipeDefinition =
  DefiningWorldPlazaCraftModeRecipeDefinitionBase & {
    readonly recipeType: 'entity';
    readonly outcome: DefiningWorldPlazaCraftModeRecipeEntityOutcome;
  };

/** Item-output recipe (adds to inventory immediately). */
export type DefiningWorldPlazaCraftModeItemRecipeDefinition =
  DefiningWorldPlazaCraftModeRecipeDefinitionBase & {
    readonly recipeType: 'item';
    readonly outcome: DefiningWorldPlazaCraftModeRecipeItemOutcome;
  };

/** Display + rules metadata for one recipe. */
export type DefiningWorldPlazaCraftModeRecipeDefinition =
  | DefiningWorldPlazaCraftModeEntityRecipeDefinition
  | DefiningWorldPlazaCraftModeItemRecipeDefinition;

/** One ingredient row with live owned/required counts for the cookbook UI. */
export type DefiningWorldPlazaCraftModeRecipeIngredientRow = {
  readonly itemTypeId: string;
  readonly displayName: string;
  readonly ownedQuantity: number;
  readonly requiredQuantity: number;
  readonly isShort: boolean;
};

/**
 * Inventory item type id for the loose recipe page that attaches this recipe.
 *
 * @param recipeId - Craft recipe id
 */
export function resolvingWorldPlazaCraftRecipePageItemTypeId(
  recipeId: DefiningWorldPlazaCraftModeRecipeId
): string {
  return `world-plaza-recipe-page:${recipeId}`;
}
