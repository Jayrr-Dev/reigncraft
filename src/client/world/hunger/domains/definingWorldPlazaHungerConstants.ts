/**
 * Hunger system tuning for the plaza avatar.
 *
 * Hunger is tracked as a 0..1 ratio (1 = full, 0 = starving) so the HUD bar
 * maps directly to width, mirroring the run-stamina ratio pattern.
 *
 * @module components/world/hunger/domains/definingWorldPlazaHungerConstants
 */

import { DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS } from '@/components/world/domains/definingWorldPlazaDayNightCycleConstants';

/** Real-time duration to drain a full hunger bar while idle (60 real minutes = 1.5 in-game days). */
export const DEFINING_WORLD_PLAZA_HUNGER_IDLE_DRAIN_DURATION_MS =
  DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS * 1.5;

/** Baseline hunger drained per second while idle (ratio units). */
export const DEFINING_WORLD_PLAZA_HUNGER_IDLE_DRAIN_PER_SECOND =
  1 / (DEFINING_WORLD_PLAZA_HUNGER_IDLE_DRAIN_DURATION_MS / 1000);

/** Hunger drain multiplier while walking. */
export const DEFINING_WORLD_PLAZA_HUNGER_WALK_DRAIN_MULTIPLIER = 1.15;

/** Hunger drain multiplier while sprinting. */
export const DEFINING_WORLD_PLAZA_HUNGER_SPRINT_DRAIN_MULTIPLIER = 2.0;

/** Hunger consumed by a standing/walk jump (ratio units), mirrors jump stamina cost scale. */
export const DEFINING_WORLD_PLAZA_HUNGER_JUMP_COST_RATIO = 0.004;

/** Hunger consumed by a run jump (ratio units). */
export const DEFINING_WORLD_PLAZA_HUNGER_RUN_JUMP_COST_RATIO = 0.006;

/** Hunger ratio above which passive health regen is allowed. */
export const DEFINING_WORLD_PLAZA_HUNGER_HEALTH_REGEN_MIN_RATIO = 0.3;

/** How often starvation damage ticks (ms). */
export const DEFINING_WORLD_PLAZA_HUNGER_STARVATION_TICK_INTERVAL_MS = 2000;

/** Real-time duration for starvation to kill from full effective health (80 real minutes = 2 in-game days). */
export const DEFINING_WORLD_PLAZA_HUNGER_STARVATION_TIME_TO_DEATH_MS =
  DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS * 2;

/** Starvation damage per tick, as a fraction of effective max health. */
export const DEFINING_WORLD_PLAZA_HUNGER_STARVATION_MAX_HEALTH_PERCENT_PER_TICK =
  (DEFINING_WORLD_PLAZA_HUNGER_STARVATION_TICK_INTERVAL_MS /
    DEFINING_WORLD_PLAZA_HUNGER_STARVATION_TIME_TO_DEATH_MS) *
  100;

/** Minimum per-tick starvation damage variance multiplier. */
export const DEFINING_WORLD_PLAZA_HUNGER_STARVATION_VARIANCE_MIN = 0.7;

/** Maximum per-tick starvation damage variance multiplier. */
export const DEFINING_WORLD_PLAZA_HUNGER_STARVATION_VARIANCE_MAX = 1.4;

/** Hunger tier thresholds (ratio, inclusive lower bound). */
export const DEFINING_WORLD_PLAZA_HUNGER_TIER_THRESHOLD = {
  WELL_FED: 0.75,
  CONTENT: 0.4,
  PECKISH: 0.2,
  HUNGRY: 0.05,
  STARVING: 0,
} as const;

/** Named hunger tiers, ordered from best to worst. */
export type DefiningWorldPlazaHungerTier =
  | 'well_fed'
  | 'content'
  | 'peckish'
  | 'hungry'
  | 'starving';

/** Bonus stamina regen multiplier while well fed (>=75%). */
export const DEFINING_WORLD_PLAZA_HUNGER_WELL_FED_STAMINA_REGEN_MULTIPLIER = 1.1;

/** Stamina drain multiplier while peckish (20-40%). */
export const DEFINING_WORLD_PLAZA_HUNGER_PECKISH_STAMINA_DRAIN_MULTIPLIER = 1.25;

/** Jump cost multiplier while peckish (20-40%). */
export const DEFINING_WORLD_PLAZA_HUNGER_PECKISH_JUMP_COST_MULTIPLIER = 1.25;

/** Jump cost multiplier while hungry (5-20%). */
export const DEFINING_WORLD_PLAZA_HUNGER_HUNGRY_JUMP_COST_MULTIPLIER = 1.5;

/** Walk speed multiplier while hungry (5-20%). */
export const DEFINING_WORLD_PLAZA_HUNGER_HUNGRY_SPEED_MULTIPLIER = 0.9;

/** Walk speed multiplier while starving (0-5%). */
export const DEFINING_WORLD_PLAZA_HUNGER_STARVING_SPEED_MULTIPLIER = 0.8;

/** Hunger HUD push interval for React state (ms), mirrors stamina HUD cadence. */
export const DEFINING_WORLD_PLAZA_HUNGER_HUD_PUSH_INTERVAL_MS = 200;

/** Smallest hunger-ratio change worth a HUD re-render. */
export const DEFINING_WORLD_PLAZA_HUNGER_HUD_EPSILON = 0.005;

/** Largest frame delta applied to hunger to survive tab stalls (seconds). */
export const DEFINING_WORLD_PLAZA_HUNGER_MAX_FRAME_DELTA_SECONDS = 0.05;

/** Hunger ratio restored by eating berries. */
export const DEFINING_WORLD_PLAZA_HUNGER_RESTORE_BERRIES = 0.15;

/** Hunger ratio restored by eating an apple. */
export const DEFINING_WORLD_PLAZA_HUNGER_RESTORE_APPLE = 0.25;

/** Hunger ratio restored by eating cooked meat. */
export const DEFINING_WORLD_PLAZA_HUNGER_RESTORE_COOKED_MEAT = 0.6;

/** Hunger ratio restored by eating raw fish. */
export const DEFINING_WORLD_PLAZA_HUNGER_RESTORE_FISH = 0.2;

/** Hunger ratio restored by eating harvested wheat. */
export const DEFINING_WORLD_PLAZA_HUNGER_RESTORE_WHEAT = 0.18;

/** Default per-character hunger drain multiplier when a skin has no override. */
export const DEFINING_WORLD_PLAZA_HUNGER_DEFAULT_METABOLISM_MULTIPLIER = 1;

/** Hunger starts full. */
export const DEFINING_WORLD_PLAZA_HUNGER_INITIAL_RATIO = 1;

/**
 * Resolves the named tier for a hunger ratio.
 *
 * @param hungerRatio - Current hunger as a 0..1 ratio.
 */
export function resolvingWorldPlazaHungerTier(
  hungerRatio: number
): DefiningWorldPlazaHungerTier {
  if (hungerRatio >= DEFINING_WORLD_PLAZA_HUNGER_TIER_THRESHOLD.WELL_FED) {
    return 'well_fed';
  }

  if (hungerRatio >= DEFINING_WORLD_PLAZA_HUNGER_TIER_THRESHOLD.CONTENT) {
    return 'content';
  }

  if (hungerRatio >= DEFINING_WORLD_PLAZA_HUNGER_TIER_THRESHOLD.PECKISH) {
    return 'peckish';
  }

  if (hungerRatio >= DEFINING_WORLD_PLAZA_HUNGER_TIER_THRESHOLD.HUNGRY) {
    return 'hungry';
  }

  return 'starving';
}
