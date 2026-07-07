import { resolvingWorldPlazaDayNightCyclePhase } from '@/components/world/domains/resolvingWorldPlazaDayNightCyclePhase';

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
  const cyclePhase = resolvingWorldPlazaDayNightCyclePhase(epochMs);
  const totalMinutes = Math.floor(cyclePhase * 24 * 60);
  const hours24 = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;

  return `${String(hours24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
