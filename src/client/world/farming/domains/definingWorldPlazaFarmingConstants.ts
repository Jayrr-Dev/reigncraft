/**
 * Farming balance and interaction constants.
 *
 * @module components/world/farming/domains/definingWorldPlazaFarmingConstants
 */

/** Max Chebyshev distance from player to farmland tile actions. */
export const DEFINING_WORLD_PLAZA_FARMING_PLAYER_RANGE_TILES = 2;

/** Base till channel duration (ms). */
export const DEFINING_WORLD_PLAZA_FARMING_TILL_BASE_DURATION_MS = 1400;

/** Base plant channel duration (ms). */
export const DEFINING_WORLD_PLAZA_FARMING_PLANT_BASE_DURATION_MS = 900;

/** Base scythe harvest channel duration (ms). */
export const DEFINING_WORLD_PLAZA_FARMING_HARVEST_BASE_DURATION_MS = 1200;

/** localStorage key prefix for farmland tile state. */
export const DEFINING_WORLD_PLAZA_FARMLAND_LOCAL_STORAGE_KEY_PREFIX =
  'world-plaza-farmland' as const;

export const DEFINING_WORLD_PLAZA_FARMING_TILL_PROGRESS_ICON =
  'game-icons:farm-tractor' as const;
export const DEFINING_WORLD_PLAZA_FARMING_PLANT_PROGRESS_ICON =
  'mdi:sprout' as const;
export const DEFINING_WORLD_PLAZA_FARMING_HARVEST_PROGRESS_ICON =
  'game-icons:scythe' as const;
