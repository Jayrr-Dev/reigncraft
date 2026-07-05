import {
  DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_DISPLAY_DAY_WRAP,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_EPOCH_ANCHOR_MS,
} from '@/components/world/domains/definingWorldPlazaDayNightCycleConstants';
import { formattingWorldPlazaDayNightDayNumber } from '@/components/world/domains/formattingWorldPlazaDayNightDayNumber';
import { describe, expect, it } from 'vitest';

describe('formattingWorldPlazaDayNightDayNumber', () => {
  it('returns a wrapped day between 1 and the display wrap', () => {
    const dayNumber = formattingWorldPlazaDayNightDayNumber(Date.now());

    expect(dayNumber).toBeGreaterThanOrEqual(1);
    expect(dayNumber).toBeLessThanOrEqual(
      DEFINING_WORLD_PLAZA_DAY_NIGHT_DISPLAY_DAY_WRAP
    );
    expect(dayNumber).toBeLessThan(1000);
  });

  it('returns day 1 at the plaza epoch anchor', () => {
    expect(
      formattingWorldPlazaDayNightDayNumber(
        DEFINING_WORLD_PLAZA_DAY_NIGHT_EPOCH_ANCHOR_MS
      )
    ).toBe(1);
  });

  it('advances after one full in-game day', () => {
    const nextDayEpochMs =
      DEFINING_WORLD_PLAZA_DAY_NIGHT_EPOCH_ANCHOR_MS +
      DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS;

    expect(formattingWorldPlazaDayNightDayNumber(nextDayEpochMs)).toBe(2);
  });
});
