import { computingWorldPlazaFlowerPickDurationMs } from '@/components/world/harvest/domains/computingWorldPlazaFlowerPickDurationMs';
import { computingWorldPlazaPebblePickDurationMs } from '@/components/world/harvest/domains/computingWorldPlazaPebblePickDurationMs';
import { computingWorldPlazaShrubPickDurationMs } from '@/components/world/harvest/domains/computingWorldPlazaShrubPickDurationMs';
import {
  DEFINING_WORLD_PLAZA_FLOWER_PICK_DURATION_MAX_MS,
  DEFINING_WORLD_PLAZA_FLOWER_PICK_DURATION_MIN_MS,
} from '@/components/world/harvest/domains/definingWorldPlazaFlowerPickConstants';
import {
  DEFINING_WORLD_PLAZA_PEBBLE_PICK_DURATION_MAX_MS,
  DEFINING_WORLD_PLAZA_PEBBLE_PICK_DURATION_MIN_MS,
} from '@/components/world/harvest/domains/definingWorldPlazaPebblePickConstants';
import {
  DEFINING_WORLD_PLAZA_SHRUB_PICK_DURATION_MAX_MS,
  DEFINING_WORLD_PLAZA_SHRUB_PICK_DURATION_MIN_MS,
} from '@/components/world/harvest/domains/definingWorldPlazaShrubPickConstants';
import { describe, expect, it } from 'vitest';

describe('pick duration rolls', () => {
  it('maps unit roll 0 to each pick minimum', () => {
    expect(computingWorldPlazaShrubPickDurationMs(0)).toBe(
      DEFINING_WORLD_PLAZA_SHRUB_PICK_DURATION_MIN_MS
    );
    expect(computingWorldPlazaFlowerPickDurationMs(0)).toBe(
      DEFINING_WORLD_PLAZA_FLOWER_PICK_DURATION_MIN_MS
    );
    expect(computingWorldPlazaPebblePickDurationMs(0)).toBe(
      DEFINING_WORLD_PLAZA_PEBBLE_PICK_DURATION_MIN_MS
    );
  });

  it('maps unit roll 1 to each pick maximum', () => {
    expect(computingWorldPlazaShrubPickDurationMs(1)).toBe(
      DEFINING_WORLD_PLAZA_SHRUB_PICK_DURATION_MAX_MS
    );
    expect(computingWorldPlazaFlowerPickDurationMs(1)).toBe(
      DEFINING_WORLD_PLAZA_FLOWER_PICK_DURATION_MAX_MS
    );
    expect(computingWorldPlazaPebblePickDurationMs(1)).toBe(
      DEFINING_WORLD_PLAZA_PEBBLE_PICK_DURATION_MAX_MS
    );
  });
});
