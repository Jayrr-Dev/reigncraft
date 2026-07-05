import { DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS } from '@/components/world/domains/definingWorldPlazaDayNightCycleConstants';
import { resolvingWorldPlazaDayNightSampleEpochMs } from '@/components/world/domains/resolvingWorldPlazaDayNightSampleEpochMs';

/**
 * Returns the 1-based in-game day index for the shared day/night cycle.
 */
export function formattingWorldPlazaDayNightDayNumber(
  epochMs = Date.now()
): number {
  const sampleEpochMs = resolvingWorldPlazaDayNightSampleEpochMs(epochMs);

  return (
    Math.floor(
      sampleEpochMs / DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS
    ) + 1
  );
}
