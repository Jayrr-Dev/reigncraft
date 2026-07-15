/**
 * First world loot-chest open grants the Storage Chest craft recipe page.
 *
 * @module components/world/chest/domains/definingWorldPlazaFirstWorldChestRecipeRewardConstants
 */

import { DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';

/** Recipe unlocked by opening any world loot chest for the first time. */
export const DEFINING_WORLD_PLAZA_FIRST_WORLD_CHEST_RECIPE_ID =
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.STORAGE_CHEST;

/** Toast when the Storage Chest recipe page is first added. */
export const LABELING_WORLD_PLAZA_FIRST_WORLD_CHEST_RECIPE_REWARD_TOAST =
  'First chest: Storage Chest recipe page. Attach it from your inventory.' as const;
