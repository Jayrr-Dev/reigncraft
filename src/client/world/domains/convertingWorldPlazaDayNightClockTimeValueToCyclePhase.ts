/**
 * Converts a 24-hour clock string into a day/night cycle phase.
 *
 * @module components/world/domains/convertingWorldPlazaDayNightClockTimeValueToCyclePhase
 */

/**
 * Maps an `HH:MM` clock value to cycle phase (0 = midnight, 0.5 = noon).
 *
 * @param timeValue - 24-hour clock string from an HTML time input.
 */
export function convertingWorldPlazaDayNightClockTimeValueToCyclePhase(
  timeValue: string
): number {
  const [hoursPart, minutesPart] = timeValue.split(':');
  const hours = Number.parseInt(hoursPart ?? '0', 10);
  const minutes = Number.parseInt(minutesPart ?? '0', 10);
  const totalMinutes = hours * 60 + minutes;

  return totalMinutes / (24 * 60);
}
