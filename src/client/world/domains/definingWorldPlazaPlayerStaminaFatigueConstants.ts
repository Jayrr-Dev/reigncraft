/**
 * Player-only stamina fatigue tiers. Each full bar depletion (100% to 0%) advances
 * the tier; reaching a full bar resets back to fresh.
 *
 * @module components/world/domains/definingWorldPlazaPlayerStaminaFatigueConstants
 */

/** Fatigue tier after repeated full stamina depletions. */
export type DefiningWorldPlazaPlayerStaminaFatigueTier =
  | 'fresh'
  | 'winded'
  | 'fatigued'
  | 'spent'
  | 'collapsed';

/** Ordered progression when the stamina bar fully empties. */
export const DEFINING_WORLD_PLAZA_PLAYER_STAMINA_FATIGUE_TIER_ORDER: readonly DefiningWorldPlazaPlayerStaminaFatigueTier[] =
  ['fresh', 'winded', 'fatigued', 'spent', 'collapsed'];

export type DefiningWorldPlazaPlayerStaminaFatigueTierConfig = {
  /** How much the bar must refill after a full empty before run, jump, or roll work again. */
  useUnlockRatio: number;
  /** Multiplier on passive stamina regeneration while resting (all tiers regen at full speed). */
  regenMultiplier: number;
};

/** Per-tier usage gates and regen tuning for the local player. */
export const DEFINING_WORLD_PLAZA_PLAYER_STAMINA_FATIGUE_TIER_CONFIG: Record<
  DefiningWorldPlazaPlayerStaminaFatigueTier,
  DefiningWorldPlazaPlayerStaminaFatigueTierConfig
> = {
  fresh: {
    useUnlockRatio: 0,
    regenMultiplier: 1,
  },
  winded: {
    useUnlockRatio: 0.85,
    regenMultiplier: 1,
  },
  fatigued: {
    useUnlockRatio: 0.6,
    regenMultiplier: 1,
  },
  spent: {
    useUnlockRatio: 0.4,
    regenMultiplier: 1,
  },
  collapsed: {
    useUnlockRatio: 0.15,
    regenMultiplier: 1,
  },
};

/** Starting fatigue tier for a full stamina bar. */
export const DEFINING_WORLD_PLAZA_PLAYER_STAMINA_FATIGUE_INITIAL_TIER: DefiningWorldPlazaPlayerStaminaFatigueTier =
  'fresh';
