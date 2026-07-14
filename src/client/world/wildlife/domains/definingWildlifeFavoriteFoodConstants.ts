/**
 * Favorite-food and herbivore food-bravery tuning.
 *
 * @module components/world/wildlife/domains/definingWildlifeFavoriteFoodConstants
 */

import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_BLUE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_GOLDEN,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RED,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

/**
 * Synthetic item type for long-grass flora bites (no inventory stack).
 * Use on `favoriteFoodItemTypeIds` for grazers that rush grass clumps.
 */
export const DEFINING_WILDLIFE_GROUND_GRASS_FOOD_ITEM_TYPE_ID =
  'wildlife-flora:long-grass' as const;

/** Default berry favorites for browsing herbivores (deer, stag, antelope). */
export const DEFINING_WILDLIFE_DEFAULT_BERRY_FAVORITE_FOOD_ITEM_TYPE_IDS = [
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RED,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_BLUE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_GOLDEN,
] as const;

/** Default grass favorite for farm stock and heavy grazers. */
export const DEFINING_WILDLIFE_DEFAULT_GRASS_FAVORITE_FOOD_ITEM_TYPE_IDS = [
  DEFINING_WILDLIFE_GROUND_GRASS_FOOD_ITEM_TYPE_ID,
] as const;

/**
 * Distance scale when ranking a favorite food vs other edibles
 * (lower = more attractive). Favorites beat plain shrub bias.
 */
export const DEFINING_WILDLIFE_FAVORITE_FOOD_DISTANCE_BIAS = 0.35;

/**
 * Herbivores ignore player sprint/jump startle while edible food is in scent
 * range about half the time. Favorite food always holds. Collision startle
 * (`startledUntilMs`) still forces a flee.
 */
export const DEFINING_WILDLIFE_HERBIVORE_FOOD_BRAVERY_ENABLED = true;

/** Chance a non-favorite edible makes a herbivore ignore player startle. */
export const DEFINING_WILDLIFE_HERBIVORE_NON_FAVORITE_FOOD_BRAVERY_CHANCE = 0.5;

/** Salt for sticky per-animal+food bravery rolls. */
export const DEFINING_WILDLIFE_HERBIVORE_FOOD_BRAVERY_SEED_SALT = 47;
