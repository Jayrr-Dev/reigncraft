/**
 * Declarative tuning for HP restored when eating food.
 *
 * Per-item heal numbers (`healthHeal.baseFlat` + `healthHeal.percentOfMax`) are
 * stamped on food defs at registration. Size / large-frame multipliers still
 * apply at eat time from kill metadata.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryFoodHealConstants
 */

import type { DefiningWildlifeSizeTier } from '@/components/world/wildlife/domains/definingWildlifeNameTagConstants';

/** Declarative flat + percent heal pair stamped on each food item. */
export type DefiningWorldPlazaInventoryFoodHealDeclaration = {
  readonly baseFlat: number;
  readonly percentOfMax: number;
};

/** Raw / uncooked meat restores this fraction when building stamped heal numbers. */
export const DEFINING_WORLD_PLAZA_INVENTORY_FOOD_HEAL_RAW_MULTIPLIER = 0.5;

/**
 * Flat HP contribution before value / cook scaling at registration.
 * Paired with {@link DEFINING_WORLD_PLAZA_INVENTORY_FOOD_HEAL_PERCENT_OF_MAX}.
 */
export const DEFINING_WORLD_PLAZA_INVENTORY_FOOD_HEAL_BASE_FLAT = 50;

/**
 * Fraction of effective max HP before value / cook scaling at registration.
 * At 1000 max HP this is 60, so baseline cooked mid-tier food ≈ 110 HP.
 */
export const DEFINING_WORLD_PLAZA_INVENTORY_FOOD_HEAL_PERCENT_OF_MAX = 0.06;

/**
 * Hunger restore ratio treated as 1.0× species value (mid deer / sheep band).
 * Higher catalog hunger ratios stamp larger heal declarations.
 */
export const DEFINING_WORLD_PLAZA_INVENTORY_FOOD_HEAL_REFERENCE_HUNGER_RATIO = 0.4;

/** Size σ tier multipliers: bigger kills heal more. */
export const DEFINING_WORLD_PLAZA_INVENTORY_FOOD_HEAL_SIZE_TIER_MULTIPLIER: Readonly<
  Record<DefiningWildlifeSizeTier, number>
> = {
  [-2]: 0.7,
  [-1]: 0.85,
  [0]: 1,
  [1]: 1.15,
  [2]: 1.3,
  [3]: 1.5,
  [4]: 1.75,
};

/** Extra heal when meat came from an obese large-frame kill. */
export const DEFINING_WORLD_PLAZA_INVENTORY_FOOD_HEAL_OBESE_FRAME_MULTIPLIER = 1.12;

/** Extra heal when meat came from an apex large-frame kill. */
export const DEFINING_WORLD_PLAZA_INVENTORY_FOOD_HEAL_APEX_FRAME_MULTIPLIER = 1.05;
