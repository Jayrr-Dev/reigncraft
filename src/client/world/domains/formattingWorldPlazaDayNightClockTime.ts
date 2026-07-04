import { DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS } from "@/components/world/domains/definingWorldPlazaDayNightCycleConstants";
import { resolvingWorldPlazaDayNightSampleEpochMs } from "@/components/world/domains/resolvingWorldPlazaDayNightSampleEpochMs";

/**
 * Formats the shared in-game day/night cycle as a 12-hour clock string.
 *
 * Cycle phase 0 is midnight and 0.5 is noon, matching the sun state model.
 *
 * @param epochMs - Wall-clock sample time (defaults to `Date.now()`).
 */
export function formattingWorldPlazaDayNightClockTime(epochMs = Date.now()): string {
  const sampleEpochMs = resolvingWorldPlazaDayNightSampleEpochMs(epochMs);
  const cycleElapsedMs =
    ((sampleEpochMs % DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS) +
      DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS) %
    DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS;
  const cyclePhase = cycleElapsedMs / DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS;
  const totalMinutes = Math.floor(cyclePhase * 24 * 60);
  const hours24 = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  const period = hours24 < 12 ? "AM" : "PM";
  const hours12 = hours24 % 12 || 12;

  return `${String(hours12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
}
