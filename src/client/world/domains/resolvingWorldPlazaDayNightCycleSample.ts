import { computingWorldPlazaDayNightSunState } from '@/components/world/domains/computingWorldPlazaDayNightSunState';
import { resolvingWorldPlazaDayNightCyclePhase } from '@/components/world/domains/resolvingWorldPlazaDayNightCyclePhase';
import { resolvingWorldPlazaDayNightSampleEpochMs } from '@/components/world/domains/resolvingWorldPlazaDayNightSampleEpochMs';

/**
 * Shared day/night sample for one UTC epoch instant.
 *
 * Every plaza client derives lighting, clocks, and wildlife sleep from the same
 * epoch milliseconds (`Date.now()`), which is timezone-independent. Two players
 * in different regions sampling the same `epochMs` always get identical results
 * without server time sync.
 */
export type ResolvingWorldPlazaDayNightCycleSample = {
  /** UTC epoch milliseconds sampled for this frame. */
  readonly sharedEpochMs: number;
  /** Precise cycle phase (0 = midnight, 0.5 = noon). */
  readonly cyclePhase: number;
  /** True between sunrise and sunset. */
  readonly isDaytime: boolean;
};

/**
 * Resolves one synchronized day/night sample from UTC epoch time.
 *
 * @param epochMs - UTC epoch milliseconds (defaults to `Date.now()`).
 */
export function resolvingWorldPlazaDayNightCycleSample(
  epochMs = Date.now()
): ResolvingWorldPlazaDayNightCycleSample {
  const sharedEpochMs = resolvingWorldPlazaDayNightSampleEpochMs(epochMs);
  const sunState = computingWorldPlazaDayNightSunState(epochMs);

  return {
    sharedEpochMs,
    cyclePhase: resolvingWorldPlazaDayNightCyclePhase(epochMs),
    isDaytime: sunState.isDaytime,
  };
}
