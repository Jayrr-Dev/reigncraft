/**
 * Meal-theft aggro and contested pickup channel tuning.
 *
 * @module components/world/wildlife/domains/definingWildlifeMealTheftConstants
 */

/**
 * Player revenge lock duration after stealing a meal mid-chew.
 * Cleared on player death via area clear; otherwise stays until the animal dies.
 */
export const DEFINING_WILDLIFE_MEAL_THEFT_PLAYER_AGGRO_MS =
  Number.MAX_SAFE_INTEGER;

/** Contested ground-food pickup channel minimum (player racing an eater). */
export const DEFINING_WILDLIFE_CONTESTED_GROUND_FOOD_PICKUP_DURATION_MIN_MS =
  2_000;

/** Contested ground-food pickup channel maximum (player racing an eater). */
export const DEFINING_WILDLIFE_CONTESTED_GROUND_FOOD_PICKUP_DURATION_MAX_MS =
  10_000;
