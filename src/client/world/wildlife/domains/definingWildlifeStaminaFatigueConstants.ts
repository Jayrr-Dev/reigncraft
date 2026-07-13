/**
 * Wildlife stamina fatigue tiers. Each full bar depletion advances the tier;
 * reaching a full bar resets back to fresh.
 *
 * Default for all animals: 66% → 33% → full 100% heal.
 *
 * @module components/world/wildlife/domains/definingWildlifeStaminaFatigueConstants
 */

/** Fatigue tier after repeated full stamina depletions. */
export type DefiningWildlifeStaminaFatigueTier =
  | 'fresh'
  | 'winded'
  | 'drained'
  | 'spent';

/** Ordered progression when the stamina bar fully empties. */
export const DEFINING_WILDLIFE_STAMINA_FATIGUE_TIER_ORDER: readonly DefiningWildlifeStaminaFatigueTier[] =
  ['fresh', 'winded', 'drained', 'spent'];

export type DefiningWildlifeStaminaFatigueTierConfig = {
  /**
   * Fraction of max stamina required after a full empty before the animal
   * may run again (1 = full bar heal).
   */
  useUnlockRatio: number;
};

/** Per-tier run unlock gates for wildlife. */
export const DEFINING_WILDLIFE_STAMINA_FATIGUE_TIER_CONFIG: Record<
  DefiningWildlifeStaminaFatigueTier,
  DefiningWildlifeStaminaFatigueTierConfig
> = {
  fresh: {
    useUnlockRatio: 0,
  },
  winded: {
    useUnlockRatio: 0.66,
  },
  drained: {
    useUnlockRatio: 0.33,
  },
  spent: {
    useUnlockRatio: 1,
  },
};

/** Starting fatigue tier for a full stamina bar. */
export const DEFINING_WILDLIFE_STAMINA_FATIGUE_INITIAL_TIER: DefiningWildlifeStaminaFatigueTier =
  'fresh';
