/**
 * Resolves starvation damage scale from consecutive in-game hours without food
 * while the player is at zero hunger.
 *
 * @module components/world/hunger/domains/resolvingWorldPlazaHungerStarvationDamageMultiplier
 */

import { COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS } from '@/components/world/domains/computingWorldPlazaInGameDurationMs';
import { DEFINING_WORLD_PLAZA_HUNGER_STARVATION_DAMAGE_MULTIPLIER_PER_IN_GAME_HOUR } from '@/components/world/hunger/domains/definingWorldPlazaHungerConstants';

export type ResolvingWorldPlazaHungerStarvationDamageMultiplierParams = {
  /** Wall-clock ms when continuous starvation began; null when not starving. */
  starvingSinceMs: number | null;
  /** Wall-clock ms for the current starvation tick. */
  nowMs: number;
};

/**
 * Completed in-game hours of continuous starvation (not eating while at 0 hunger).
 *
 * @param starvingSinceMs - When starvation began.
 * @param nowMs - Current wall-clock time.
 */
export function resolvingWorldPlazaHungerStarvationHoursWithoutFood(
  starvingSinceMs: number | null,
  nowMs: number
): number {
  if (starvingSinceMs === null || nowMs <= starvingSinceMs) {
    return 0;
  }

  return Math.floor(
    (nowMs - starvingSinceMs) / COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS
  );
}

/**
 * Damage multiplier for a starvation tick. Base is 1; each completed in-game
 * hour without eating while starving adds
 * {@link DEFINING_WORLD_PLAZA_HUNGER_STARVATION_DAMAGE_MULTIPLIER_PER_IN_GAME_HOUR}.
 *
 * @param params - Starvation start time and current time.
 */
export function resolvingWorldPlazaHungerStarvationDamageMultiplier({
  starvingSinceMs,
  nowMs,
}: ResolvingWorldPlazaHungerStarvationDamageMultiplierParams): number {
  const hoursWithoutFood = resolvingWorldPlazaHungerStarvationHoursWithoutFood(
    starvingSinceMs,
    nowMs
  );

  return (
    1 +
    hoursWithoutFood *
      DEFINING_WORLD_PLAZA_HUNGER_STARVATION_DAMAGE_MULTIPLIER_PER_IN_GAME_HOUR
  );
}
