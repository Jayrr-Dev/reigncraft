/**
 * Rolls mushroom pick channel duration between configured min and max.
 *
 * @module components/world/mushrooms/domains/computingWorldPlazaMushroomPickDurationMs
 */

import {
  DEFINING_WORLD_PLAZA_MUSHROOM_PICK_DURATION_MAX_MS,
  DEFINING_WORLD_PLAZA_MUSHROOM_PICK_DURATION_MIN_MS,
} from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomConstants';

export function computingWorldPlazaMushroomPickDurationMs(
  unitRoll: number = Math.random()
): number {
  const clampedRoll = Math.min(1, Math.max(0, unitRoll));
  const spanMs =
    DEFINING_WORLD_PLAZA_MUSHROOM_PICK_DURATION_MAX_MS -
    DEFINING_WORLD_PLAZA_MUSHROOM_PICK_DURATION_MIN_MS;

  return Math.round(
    DEFINING_WORLD_PLAZA_MUSHROOM_PICK_DURATION_MIN_MS + clampedRoll * spanMs
  );
}
