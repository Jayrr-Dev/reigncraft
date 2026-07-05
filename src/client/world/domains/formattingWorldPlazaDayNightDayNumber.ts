import {
  DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_DISPLAY_DAY_WRAP,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_EPOCH_ANCHOR_MS,
} from '@/components/world/domains/definingWorldPlazaDayNightCycleConstants';
import { resolvingWorldPlazaDayNightSampleEpochMs } from '@/components/world/domains/resolvingWorldPlazaDayNightSampleEpochMs';

/**
 * Returns the 1-based in-game day index for the shared day/night cycle.
 *
 * Counts 40-minute in-game days since the plaza anchor and wraps for HUD display.
 */
export function formattingWorldPlazaDayNightDayNumber(
  epochMs = Date.now()
): number {
  const sampleEpochMs = resolvingWorldPlazaDayNightSampleEpochMs(epochMs);
  const elapsedMs = Math.max(
    0,
    sampleEpochMs - DEFINING_WORLD_PLAZA_DAY_NIGHT_EPOCH_ANCHOR_MS
  );
  const cycleIndex = Math.floor(
    elapsedMs / DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS
  );

  return (cycleIndex % DEFINING_WORLD_PLAZA_DAY_NIGHT_DISPLAY_DAY_WRAP) + 1;
}
