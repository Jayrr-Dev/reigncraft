import { computingWorldPlazaInventorySpecimenStudyDurationMs } from '@/components/world/inventory/domains/computingWorldPlazaInventorySpecimenStudyDurationMs';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_SPECIMEN_STUDY_DURATION_MAX_MS,
  DEFINING_WORLD_PLAZA_INVENTORY_SPECIMEN_STUDY_DURATION_MIN_MS,
} from '@/components/world/inventory/domains/definingWorldPlazaInventorySpecimenStudyConstants';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaInventorySpecimenStudyDurationMs', () => {
  it('maps unit roll 0 to the minimum duration', () => {
    expect(computingWorldPlazaInventorySpecimenStudyDurationMs(0)).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_SPECIMEN_STUDY_DURATION_MIN_MS
    );
  });

  it('maps unit roll 1 to the maximum duration', () => {
    expect(computingWorldPlazaInventorySpecimenStudyDurationMs(1)).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_SPECIMEN_STUDY_DURATION_MAX_MS
    );
  });

  it('clamps rolls outside unit range', () => {
    expect(computingWorldPlazaInventorySpecimenStudyDurationMs(-0.5)).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_SPECIMEN_STUDY_DURATION_MIN_MS
    );
    expect(computingWorldPlazaInventorySpecimenStudyDurationMs(1.5)).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_SPECIMEN_STUDY_DURATION_MAX_MS
    );
  });
});
