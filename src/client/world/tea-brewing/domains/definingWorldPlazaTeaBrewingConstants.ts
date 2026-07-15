/**
 * Tunables for teapot water fill, campfire brew, and cup pour.
 *
 * @module components/world/tea-brewing/domains/definingWorldPlazaTeaBrewingConstants
 */

/** Bump when potency / naming / trait math changes. Old brews keep stored metadata. */
export const DEFINING_WORLD_PLAZA_TEA_BREWING_FORMULA_VERSION = 1 as const;

/** Chebyshev tiles from player to liquid water for Add Water. */
export const DEFINING_WORLD_PLAZA_TEA_BREWING_WATER_RANGE_TILES = 2 as const;

/** Ingredient slots in a watered teapot. */
export const DEFINING_WORLD_PLAZA_TEA_BREWING_SLOT_COUNT = 4 as const;

/** Cups one brewed teapot can fill before it returns to empty. */
export const DEFINING_WORLD_PLAZA_TEA_BREWING_POURS_PER_POT = 4 as const;

/** Campfire brew channel duration. */
export const DEFINING_WORLD_PLAZA_TEA_BREWING_CAMPFIRE_DURATION_MS = 6_000 as const;

/** Superlinear concentration: sum × (1 + k × (count - 1)^2). */
export const DEFINING_WORLD_PLAZA_TEA_BREWING_CONCENTRATION_POTENCY_COEFFICIENT =
  0.25 as const;

/** Duration scale: base × (1 + k × (uniqueTraits - 1)). */
export const DEFINING_WORLD_PLAZA_TEA_BREWING_DIVERSITY_DURATION_COEFFICIENT =
  0.25 as const;

/** Matching trait contributions needed for a category companion bonus. */
export const DEFINING_WORLD_PLAZA_TEA_BREWING_CONCENTRATION_BONUS_THRESHOLD =
  3 as const;

/** Companion bonus magnitude (e.g. stamina_max × 1.25). */
export const DEFINING_WORLD_PLAZA_TEA_BREWING_CONCENTRATION_BONUS_MULTIPLIER =
  1.25 as const;

export const DEFINING_WORLD_PLAZA_TEA_BREWING_METADATA_KEY =
  'teaBrew' as const;

export const DEFINING_WORLD_PLAZA_TEA_POT_SLOTS_METADATA_KEY =
  'teaPotSlots' as const;

export const DEFINING_WORLD_PLAZA_TEA_POT_REMAINING_POURS_METADATA_KEY =
  'teaPotRemainingPours' as const;

export const LABELING_WORLD_PLAZA_TEA_BREWING_ADD_WATER = 'Add Water' as const;
export const LABELING_WORLD_PLAZA_TEA_BREWING_BREW = 'Brew Tea' as const;
export const LABELING_WORLD_PLAZA_TEA_BREWING_OPEN = 'Open' as const;
export const LABELING_WORLD_PLAZA_TEA_BREWING_POUR = 'Pour Tea' as const;
