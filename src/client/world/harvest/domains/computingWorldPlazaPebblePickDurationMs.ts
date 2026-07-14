/**
 * Rolls pebble pick channel duration between the configured min and max.
 *
 * @module components/world/harvest/domains/computingWorldPlazaPebblePickDurationMs
 */

import {
  DEFINING_WORLD_PLAZA_PEBBLE_PICK_DURATION_MAX_MS,
  DEFINING_WORLD_PLAZA_PEBBLE_PICK_DURATION_MIN_MS,
} from '@/components/world/harvest/domains/definingWorldPlazaPebblePickConstants';

/**
 * Maps a unit roll `[0, 1]` onto the pebble pick duration range.
 */
export function computingWorldPlazaPebblePickDurationMs(
  unitRoll: number = Math.random()
): number {
  const clampedRoll = Math.min(1, Math.max(0, unitRoll));
  const spanMs =
    DEFINING_WORLD_PLAZA_PEBBLE_PICK_DURATION_MAX_MS -
    DEFINING_WORLD_PLAZA_PEBBLE_PICK_DURATION_MIN_MS;

  return Math.round(
    DEFINING_WORLD_PLAZA_PEBBLE_PICK_DURATION_MIN_MS + clampedRoll * spanMs
  );
}
