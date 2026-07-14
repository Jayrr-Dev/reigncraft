import { DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS } from '@/components/world/domains/definingWorldPlazaDayNightCycleConstants';

/** Real milliseconds for one full in-game day (40 real minutes). */
export const COMPUTING_WORLD_PLAZA_IN_GAME_DAY_MS =
  DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS;

/** Real milliseconds for one in-game hour. */
export const COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS =
  COMPUTING_WORLD_PLAZA_IN_GAME_DAY_MS / 24;

/** Real milliseconds for one in-game second. */
export const COMPUTING_WORLD_PLAZA_IN_GAME_SECOND_MS =
  COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS / 3600;

/** Converts in-game hours to real milliseconds. */
export function computingWorldPlazaInGameHoursToRealMs(hours: number): number {
  return Math.round(hours * COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS);
}

/** Converts real milliseconds to in-game hours (fractional). */
export function computingWorldPlazaRealMsToInGameHours(
  durationMs: number
): number {
  return durationMs / COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS;
}

/** Converts real milliseconds to in-game seconds (fractional). */
export function computingWorldPlazaRealMsToInGameSeconds(
  durationMs: number
): number {
  return durationMs / COMPUTING_WORLD_PLAZA_IN_GAME_SECOND_MS;
}

/** Converts in-game days to real milliseconds. */
export function computingWorldPlazaInGameDaysToRealMs(days: number): number {
  return Math.round(days * COMPUTING_WORLD_PLAZA_IN_GAME_DAY_MS);
}
