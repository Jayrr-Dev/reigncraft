/**
 * Computes fixed pebble pick duration (no layer scaling).
 *
 * @module components/world/harvest/domains/computingWorldPlazaPebblePickDurationMs
 */

import { DEFINING_WORLD_PLAZA_PEBBLE_PICK_DURATION_MS } from '@/components/world/harvest/domains/definingWorldPlazaPebblePickConstants';

/**
 * Returns the pebble pick timed-interaction duration in milliseconds.
 */
export function computingWorldPlazaPebblePickDurationMs(): number {
  return DEFINING_WORLD_PLAZA_PEBBLE_PICK_DURATION_MS;
}
