import {
  COMPUTING_WORLD_PLAZA_IN_GAME_SECOND_MS,
} from '@/components/world/domains/computingWorldPlazaInGameDurationMs';

/**
 * Formats remaining real craft time as in-game hours and seconds.
 *
 * Examples: `42s`, `1h 612s`
 */
export function formattingWorldPlazaCraftModeInGameRemainingLabel(
  remainingMs: number
): string {
  const totalInGameSeconds = Math.max(
    0,
    Math.ceil(remainingMs / COMPUTING_WORLD_PLAZA_IN_GAME_SECOND_MS)
  );
  const hours = Math.floor(totalInGameSeconds / 3600);
  const seconds = totalInGameSeconds % 3600;

  if (hours <= 0) {
    return `${seconds}s`;
  }

  return `${hours}h ${seconds}s`;
}
