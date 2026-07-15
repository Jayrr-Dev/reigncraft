/**
 * Bestiary sighted-species milestones that grant craft recipe pages.
 *
 * @module components/world/domains/definingWorldPlazaBestiarySightedRecipeRewardRegistry
 */

import {
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID,
  type DefiningWorldPlazaCraftModeRecipeId,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';

/** One Bestiary sighted milestone that awards a loose recipe page. */
export type DefiningWorldPlazaBestiarySightedRecipeReward = {
  readonly recipeId: DefiningWorldPlazaCraftModeRecipeId;
  /** Distinct sighted wildlife species required. */
  readonly sightedSpeciesTotal: number;
  /** Toast when the page is first added to inventory. */
  readonly rewardToast: string;
};

/**
 * Ordered Bestiary sighted recipe rewards.
 * Caltrops at 16 · Bear Trap at 48.
 */
export const DEFINING_WORLD_PLAZA_BESTIARY_SIGHTED_RECIPE_REWARD_REGISTRY: readonly DefiningWorldPlazaBestiarySightedRecipeReward[] =
  [
    {
      recipeId: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CALTROPS,
      sightedSpeciesTotal: 16,
      rewardToast:
        'Bestiary reward: Caltrops recipe page. Attach it from your inventory.',
    },
    {
      recipeId: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.BEAR_TRAP,
      sightedSpeciesTotal: 48,
      rewardToast:
        'Bestiary reward: Bear Trap recipe page. Attach it from your inventory.',
    },
  ];

/** Caltrops unlock: distinct sighted wildlife species. */
export const DEFINING_WORLD_PLAZA_BESTIARY_CALTROPS_RECIPE_REWARD_SIGHTED_TOTAL =
  DEFINING_WORLD_PLAZA_BESTIARY_SIGHTED_RECIPE_REWARD_REGISTRY[0]
    .sightedSpeciesTotal;

/** Bear Trap unlock: distinct sighted wildlife species. */
export const DEFINING_WORLD_PLAZA_BESTIARY_BEAR_TRAP_RECIPE_REWARD_SIGHTED_TOTAL =
  DEFINING_WORLD_PLAZA_BESTIARY_SIGHTED_RECIPE_REWARD_REGISTRY[1]
    .sightedSpeciesTotal;
