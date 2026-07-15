/**
 * Lapidary discovery milestones that grant craft recipe pages into inventory.
 *
 * @module components/world/domains/definingWorldPlazaLapidaryOreStudyRecipeRewardRegistry
 */

import {
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID,
  type DefiningWorldPlazaCraftModeRecipeId,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';

/** Lapidary progress metric used by a recipe reward row. */
export const DEFINING_WORLD_PLAZA_LAPIDARY_RECIPE_REWARD_METRIC = {
  ORE_SIGHTED: 'ore-sighted',
  ORE_STUDIED: 'ore-studied',
} as const;

export type DefiningWorldPlazaLapidaryRecipeRewardMetric =
  (typeof DEFINING_WORLD_PLAZA_LAPIDARY_RECIPE_REWARD_METRIC)[keyof typeof DEFINING_WORLD_PLAZA_LAPIDARY_RECIPE_REWARD_METRIC];

/** One Lapidary milestone that awards a loose recipe page. */
export type DefiningWorldPlazaLapidaryOreStudyRecipeReward = {
  readonly recipeId: DefiningWorldPlazaCraftModeRecipeId;
  readonly metric: DefiningWorldPlazaLapidaryRecipeRewardMetric;
  /** Distinct sighted ore species, or total Study points across species. */
  readonly threshold: number;
  /** Toast when the page is first added to inventory. */
  readonly rewardToast: string;
};

/**
 * Ordered Lapidary recipe rewards.
 * Anvil at 5 sighted · Bloomery at 50 · Clay Kiln at 200 · Bessemer at 500 studied.
 */
export const DEFINING_WORLD_PLAZA_LAPIDARY_ORE_STUDY_RECIPE_REWARD_REGISTRY: readonly DefiningWorldPlazaLapidaryOreStudyRecipeReward[] =
  [
    {
      recipeId: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.ANVIL,
      metric: DEFINING_WORLD_PLAZA_LAPIDARY_RECIPE_REWARD_METRIC.ORE_SIGHTED,
      threshold: 5,
      rewardToast:
        'Lapidary reward: Anvil recipe page. Attach it from your inventory.',
    },
    {
      recipeId: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.BLOOMERY,
      metric: DEFINING_WORLD_PLAZA_LAPIDARY_RECIPE_REWARD_METRIC.ORE_STUDIED,
      threshold: 50,
      rewardToast:
        'Lapidary reward: Bloomery recipe page. Attach it from your inventory.',
    },
    {
      recipeId: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CLAY_KILN,
      metric: DEFINING_WORLD_PLAZA_LAPIDARY_RECIPE_REWARD_METRIC.ORE_STUDIED,
      threshold: 200,
      rewardToast:
        'Lapidary reward: Clay Kiln recipe page. Attach it from your inventory.',
    },
    {
      recipeId: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.BESSEMER_FORGE,
      metric: DEFINING_WORLD_PLAZA_LAPIDARY_RECIPE_REWARD_METRIC.ORE_STUDIED,
      threshold: 500,
      rewardToast:
        'Lapidary reward: Bessemer Forge recipe page. Attach it from your inventory.',
    },
  ];

/** Anvil unlock: distinct sighted ore species. */
export const DEFINING_WORLD_PLAZA_LAPIDARY_ANVIL_RECIPE_REWARD_ORE_SIGHTED_TOTAL =
  DEFINING_WORLD_PLAZA_LAPIDARY_ORE_STUDY_RECIPE_REWARD_REGISTRY[0].threshold;

/** @deprecated Prefer registry `threshold` for Bloomery. */
export const DEFINING_WORLD_PLAZA_LAPIDARY_BLOOMERY_RECIPE_REWARD_ORE_STUDY_TOTAL =
  DEFINING_WORLD_PLAZA_LAPIDARY_ORE_STUDY_RECIPE_REWARD_REGISTRY[1].threshold;

/** @deprecated Prefer registry `rewardToast` for Bloomery. */
export const LABELING_WORLD_PLAZA_LAPIDARY_BLOOMERY_RECIPE_REWARD_TOAST =
  DEFINING_WORLD_PLAZA_LAPIDARY_ORE_STUDY_RECIPE_REWARD_REGISTRY[1].rewardToast;

/** Clay Kiln unlock Study total. */
export const DEFINING_WORLD_PLAZA_LAPIDARY_CLAY_KILN_RECIPE_REWARD_ORE_STUDY_TOTAL =
  DEFINING_WORLD_PLAZA_LAPIDARY_ORE_STUDY_RECIPE_REWARD_REGISTRY[2].threshold;

/** Toast when the Clay Kiln recipe page is first added. */
export const LABELING_WORLD_PLAZA_LAPIDARY_CLAY_KILN_RECIPE_REWARD_TOAST =
  DEFINING_WORLD_PLAZA_LAPIDARY_ORE_STUDY_RECIPE_REWARD_REGISTRY[2].rewardToast;

/** Bessemer Forge unlock Study total. */
export const DEFINING_WORLD_PLAZA_LAPIDARY_BESSEMER_FORGE_RECIPE_REWARD_ORE_STUDY_TOTAL =
  DEFINING_WORLD_PLAZA_LAPIDARY_ORE_STUDY_RECIPE_REWARD_REGISTRY[3].threshold;
