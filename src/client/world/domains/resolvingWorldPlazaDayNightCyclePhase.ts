import { DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS } from '@/components/world/domains/definingWorldPlazaDayNightCycleConstants';
import { resolvingWorldPlazaDayNightSampleEpochMs } from '@/components/world/domains/resolvingWorldPlazaDayNightSampleEpochMs';

/**
 * Resolves the precise day/night cycle phase for one UTC epoch sample.
 *
 * Phase 0 is midnight and 0.5 is noon. Derived from epoch modulo cycle
 * duration, never from local timezone APIs.
 *
 * @param epochMs - UTC epoch milliseconds (defaults to `Date.now()`).
 */
export function resolvingWorldPlazaDayNightCyclePhase(
  epochMs = Date.now()
): number {
  const sampleEpochMs = resolvingWorldPlazaDayNightSampleEpochMs(epochMs);
  const cycleElapsedMs =
    ((sampleEpochMs % DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS) +
      DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS) %
    DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS;

  return cycleElapsedMs / DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS;
}
