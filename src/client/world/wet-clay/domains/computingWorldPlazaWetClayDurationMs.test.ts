import { computingWorldPlazaWetClayDurationMs } from '@/components/world/wet-clay/domains/computingWorldPlazaWetClayDurationMs';
import {
  DEFINING_WORLD_PLAZA_WET_CLAY_DURATION_MAX_MS,
  DEFINING_WORLD_PLAZA_WET_CLAY_DURATION_MIN_MS,
} from '@/components/world/wet-clay/domains/definingWorldPlazaWetClayConstants';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaWetClayDurationMs', () => {
  it('maps unit roll to the 1–3s band', () => {
    expect(computingWorldPlazaWetClayDurationMs(0)).toBe(
      DEFINING_WORLD_PLAZA_WET_CLAY_DURATION_MIN_MS
    );
    expect(computingWorldPlazaWetClayDurationMs(1)).toBe(
      DEFINING_WORLD_PLAZA_WET_CLAY_DURATION_MAX_MS
    );
    expect(computingWorldPlazaWetClayDurationMs(0.5)).toBe(2000);
  });
});
