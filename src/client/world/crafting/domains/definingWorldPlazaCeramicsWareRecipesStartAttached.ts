/**
 * Ceramics ware craft recipes that start attached in every cookbook.
 *
 * Kiln / stove stay gated behind found recipe pages. Cups, teapots, and bottles
 * are always writable once wet clay exists.
 *
 * @module components/world/crafting/domains/definingWorldPlazaCeramicsWareRecipesStartAttached
 */

import {
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID,
  type DefiningWorldPlazaCraftModeRecipeId,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';

/** Ceramics ware recipes auto-attached on recipe-discovery hydrate. */
export const DEFINING_WORLD_PLAZA_CERAMICS_WARE_RECIPES_START_ATTACHED = [
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.WET_CLAY_CUP,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.WET_CLAY_TEAPOT,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.WET_CLAY_BOTTLE,
] as const satisfies readonly DefiningWorldPlazaCraftModeRecipeId[];
