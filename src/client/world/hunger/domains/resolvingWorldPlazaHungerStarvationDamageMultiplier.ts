/**
 * Resolves starvation damage scale from continuous time without food while
 * the player is at zero hunger. Damage doubles each in-game hour (fractional).
 *
 * @module components/world/hunger/domains/resolvingWorldPlazaHungerStarvationDamageMultiplier
 */

import { COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS } from '@/components/world/domains/computingWorldPlazaInGameDurationMs';
import { DEFINING_WORLD_PLAZA_HUNGER_STARVATION_DAMAGE_ESCALATION_BASE } from '@/components/world/hunger/domains/definingWorldPlazaHungerConstants';

export type ResolvingWorldPlazaHungerStarvationDamageMultiplierParams = {
  /** Wall-clock ms when continuous starvation began; null when not starving. */
  starvingSinceMs: number | null;
  /** Wall-clock ms for the current starvation tick. */
  nowMs: number;
};

/**
 * Fractional in-game hours of continuous starvation (not eating while at 0 hunger).
 *
 * @param starvingSinceMs - When starvation began.
 * @param nowMs - Current wall-clock time.
 */
export function resolvingWorldPlazaHungerStarvationElapsedInGameHours(
  starvingSinceMs: number | null,
  nowMs: number
): number {
  if (starvingSinceMs === null || nowMs <= starvingSinceMs) {
    return 0;
  }

  return (nowMs - starvingSinceMs) / COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS;
}

/**
 * Damage multiplier for a starvation tick. Base is 1; each in-game hour without
 * eating while starving multiplies by
 * {@link DEFINING_WORLD_PLAZA_HUNGER_STARVATION_DAMAGE_ESCALATION_BASE}
 * (fractional hours, so the ramp is continuous).
 *
 * @param params - Starvation start time and current time.
 */
export function resolvingWorldPlazaHungerStarvationDamageMultiplier({
  starvingSinceMs,
  nowMs,
}: ResolvingWorldPlazaHungerStarvationDamageMultiplierParams): number {
  const elapsedInGameHours =
    resolvingWorldPlazaHungerStarvationElapsedInGameHours(
      starvingSinceMs,
      nowMs
    );

  return Math.pow(
    DEFINING_WORLD_PLAZA_HUNGER_STARVATION_DAMAGE_ESCALATION_BASE,
    elapsedInGameHours
  );
}
