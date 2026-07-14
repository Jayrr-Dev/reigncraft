/**
 * Rolls wet-clay channel duration between the configured min and max.
 *
 * @module components/world/wet-clay/domains/computingWorldPlazaWetClayDurationMs
 */

import {
  DEFINING_WORLD_PLAZA_WET_CLAY_DURATION_MAX_MS,
  DEFINING_WORLD_PLAZA_WET_CLAY_DURATION_MIN_MS,
} from '@/components/world/wet-clay/domains/definingWorldPlazaWetClayConstants';

/**
 * Maps a unit roll `[0, 1]` onto the wet-clay duration range (1–3s).
 */
export function computingWorldPlazaWetClayDurationMs(
  unitRoll: number = Math.random()
): number {
  const clampedRoll = Math.min(1, Math.max(0, unitRoll));
  const spanMs =
    DEFINING_WORLD_PLAZA_WET_CLAY_DURATION_MAX_MS -
    DEFINING_WORLD_PLAZA_WET_CLAY_DURATION_MIN_MS;

  return Math.round(
    DEFINING_WORLD_PLAZA_WET_CLAY_DURATION_MIN_MS + clampedRoll * spanMs
  );
}
