import { resolvingWorldPlazaEntityDiseaseWorldEpochMs } from '@/components/world/health/domains/resolvingWorldPlazaEntityDiseaseWorldEpochMs';

/**
 * Picks the clock that matches how an effect expiry was stamped.
 *
 * Combat / simulation effects use `performance.now()`. Disease-persisted
 * wall-clock stamps use `Date.now()` (~1e12). Mixing them produces multi-year
 * HUD countdowns like `35·1783577779s`.
 *
 * @module components/world/health/domains/resolvingWorldPlazaEntityEffectCountdownNowMs
 */

/** Timestamps at or above this are treated as wall-clock (`Date.now()`). */
export const DEFINING_WORLD_PLAZA_ENTITY_WALL_CLOCK_TIMESTAMP_MIN_MS = 1_000_000_000_000;

/**
 * Returns true when a timestamp looks like Unix epoch millis (wall clock).
 */
export function checkingWorldPlazaEntityTimestampLooksLikeWallClock(
  timestampMs: number
): boolean {
  return timestampMs >= DEFINING_WORLD_PLAZA_ENTITY_WALL_CLOCK_TIMESTAMP_MIN_MS;
}

/**
 * Resolves `now` for comparing against an effect expiry / resolve timestamp.
 *
 * @param expiresAtMs - Effect expiry or resolve time.
 * @param simulationNowMs - Frame clock from the health tick / HUD (`performance.now()`).
 */
export function resolvingWorldPlazaEntityEffectCountdownNowMs(
  expiresAtMs: number,
  simulationNowMs: number
): number {
  if (checkingWorldPlazaEntityTimestampLooksLikeWallClock(expiresAtMs)) {
    return resolvingWorldPlazaEntityDiseaseWorldEpochMs();
  }

  return simulationNowMs;
}

/**
 * Whole seconds remaining until expiry, using the matching clock.
 */
export function computingWorldPlazaEntityEffectRemainingSeconds(
  expiresAtMs: number,
  simulationNowMs: number
): number {
  const countdownNowMs = resolvingWorldPlazaEntityEffectCountdownNowMs(
    expiresAtMs,
    simulationNowMs
  );

  return Math.max(0, Math.ceil((expiresAtMs - countdownNowMs) / 1000));
}
