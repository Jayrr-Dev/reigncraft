/**
 * Declarative craft recipe types.
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

/** One ingredient row in a recipe. */
export type DefiningWorldPlazaCraftModeRecipeIngredient = {
  readonly itemTypeId: string;
  readonly quantity: number;
};

/** Placeable build outcome: arms validated placement, consumes on commit. */
export type DefiningWorldPlazaCraftModeRecipePlaceableOutcome = {
  readonly kind: 'placeable';
  readonly blockDefinitionId: DefiningWorldBuildingBlockDefinitionId;
  readonly blockHeight: number;
};

/** Immediate inventory outcome: consumes and adds in one transaction. */
export type DefiningWorldPlazaCraftModeRecipeInventoryOutcome = {
  readonly kind: 'inventory';
  readonly itemTypeId: string;
  readonly quantity: number;
};

/** Discriminated craft outcome. */
export type DefiningWorldPlazaCraftModeRecipeOutcome =
  | DefiningWorldPlazaCraftModeRecipePlaceableOutcome
  | DefiningWorldPlazaCraftModeRecipeInventoryOutcome;

/** Left-page art for one recipe spread. */
export type DefiningWorldPlazaCraftModeRecipeVisual =
  | {
      readonly visualKind: 'iconify';
      readonly recipeEmblemIconifyIcon: string;
    }
  | {
      readonly visualKind: 'world-plaza-campfire';
    };

/** Display + rules metadata for one recipe. */
export type DefiningWorldPlazaCraftModeRecipeDefinition = {
  readonly id: DefiningWorldPlazaCraftModeRecipeId;
  readonly cookbookId: DefiningWorldPlazaCraftModeCookbookId;
  readonly title: string;
  readonly description: string;
  readonly recipeVisual: DefiningWorldPlazaCraftModeRecipeVisual;
  readonly ingredients: readonly DefiningWorldPlazaCraftModeRecipeIngredient[];
  readonly outcome: DefiningWorldPlazaCraftModeRecipeOutcome;
};

/** One ingredient row with live owned/required counts for the cookbook UI. */
export type DefiningWorldPlazaCraftModeRecipeIngredientRow = {
  readonly itemTypeId: string;
  readonly displayName: string;
  readonly ownedQuantity: number;
  readonly requiredQuantity: number;
  readonly isShort: boolean;
};
