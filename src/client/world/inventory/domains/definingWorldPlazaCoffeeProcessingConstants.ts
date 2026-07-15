/**
 * Coffee cherry → beans → campfire roast → teapot brew tuning.
 *
 * @module components/world/inventory/domains/definingWorldPlazaCoffeeProcessingConstants
 */

/** Campfire channel to roast dried beans for a stronger teapot steep. */
export const DEFINING_WORLD_PLAZA_COFFEE_BEANS_CAMPFIRE_ROAST_DURATION_MS =
  3_000 as const;

/** Teapot cup effect duration when brewing plain coffee beans. */
export const DEFINING_WORLD_PLAZA_COFFEE_BEANS_TEA_BREW_BASE_DURATION_MS =
  120_000 as const;

/** Campfire-roasted beans double teapot cup trait duration. */
export const DEFINING_WORLD_PLAZA_ROASTED_COFFEE_BEANS_TEA_BREW_DURATION_MS =
  DEFINING_WORLD_PLAZA_COFFEE_BEANS_TEA_BREW_BASE_DURATION_MS * 2;
