/**
 * Rolls a specimen Study channel duration between instant and one second.
 *
 * @module components/world/inventory/domains/computingWorldPlazaInventorySpecimenStudyDurationMs
 */

import {
  DEFINING_WORLD_PLAZA_INVENTORY_SPECIMEN_STUDY_DURATION_MAX_MS,
  DEFINING_WORLD_PLAZA_INVENTORY_SPECIMEN_STUDY_DURATION_MIN_MS,
} from '@/components/world/inventory/domains/definingWorldPlazaInventorySpecimenStudyConstants';

/**
 * Maps a unit roll `[0, 1]` onto the specimen Study duration range.
 */
export function computingWorldPlazaInventorySpecimenStudyDurationMs(
  unitRoll: number = Math.random()
): number {
  const clampedRoll = Math.min(1, Math.max(0, unitRoll));
  const spanMs =
    DEFINING_WORLD_PLAZA_INVENTORY_SPECIMEN_STUDY_DURATION_MAX_MS -
    DEFINING_WORLD_PLAZA_INVENTORY_SPECIMEN_STUDY_DURATION_MIN_MS;

  return Math.round(
    DEFINING_WORLD_PLAZA_INVENTORY_SPECIMEN_STUDY_DURATION_MIN_MS +
      clampedRoll * spanMs
  );
}
