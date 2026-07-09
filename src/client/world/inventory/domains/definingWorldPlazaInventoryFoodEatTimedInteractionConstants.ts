/**
 * Timed-interaction constants for the food eat channel.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryFoodEatTimedInteractionConstants
 */

/** Bundled Iconify id for the eat progress ring center icon. */
export const DEFINING_WORLD_PLAZA_FOOD_EAT_TIMED_INTERACTION_PROGRESS_ICON =
  'mdi:food-apple-outline' as const;

/** Stable target key while the local player is eating. */
export const DEFINING_WORLD_PLAZA_FOOD_EAT_PROGRESS_TARGET_KEY =
  'local-player-food-eat' as const;
