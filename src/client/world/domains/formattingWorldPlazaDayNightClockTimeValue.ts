import { DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS } from '@/components/world/domains/definingWorldPlazaDayNightCycleConstants';
import { resolvingWorldPlazaDayNightSampleEpochMs } from '@/components/world/domains/resolvingWorldPlazaDayNightSampleEpochMs';

/**
 * Formats the shared day/night cycle as a 24-hour `HH:MM` string for inputs.
 *
 * @module components/world/domains/formattingWorldPlazaDayNightClockTimeValue
 */

/**
 * Returns the current cycle time as `HH:MM` for HTML time inputs.
 *
 * @param epochMs - Wall-clock sample time (defaults to `Date.now()`).
 */
export function formattingWorldPlazaDayNightClockTimeValue(
  epochMs = Date.now()
): string {
  const sampleEpochMs = resolvingWorldPlazaDayNightSampleEpochMs(epochMs);
  const cycleElapsedMs =
    ((sampleEpochMs % DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS) +
      DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS) %
    DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS;
  const cyclePhase =
    cycleElapsedMs / DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS;
  const totalMinutes = Math.floor(cyclePhase * 24 * 60);
  const hours24 = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;

  return `${String(hours24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
