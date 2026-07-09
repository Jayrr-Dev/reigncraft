import {
  computingWorldPlazaInGameDaysToRealMs,
  computingWorldPlazaInGameHoursToRealMs,
} from '@/components/world/domains/computingWorldPlazaInGameDurationMs';
import {
  computingWorldPlazaInGameDaysToDiseaseRealMs,
  computingWorldPlazaInGameHoursToDiseaseRealMs,
} from '@/components/world/health/domains/computingWorldPlazaEntityDiseaseDurationMs';
import { DEFINING_WORLD_PLAZA_ENTITY_DISEASE_TIME_SCALE } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseTimeConstants';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaEntityDiseaseDurationMs', () => {
  it('scales in-game disease timings by one third', () => {
    expect(computingWorldPlazaInGameDaysToDiseaseRealMs(3)).toBe(
      Math.round(
        computingWorldPlazaInGameDaysToRealMs(3) *
          DEFINING_WORLD_PLAZA_ENTITY_DISEASE_TIME_SCALE
      )
    );
    expect(computingWorldPlazaInGameHoursToDiseaseRealMs(8)).toBe(
      Math.round(
        computingWorldPlazaInGameHoursToRealMs(8) *
          DEFINING_WORLD_PLAZA_ENTITY_DISEASE_TIME_SCALE
      )
    );
  });
});
