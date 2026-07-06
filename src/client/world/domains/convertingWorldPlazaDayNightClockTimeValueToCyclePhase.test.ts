import { convertingWorldPlazaDayNightClockTimeValueToCyclePhase } from '@/components/world/domains/convertingWorldPlazaDayNightClockTimeValueToCyclePhase';
import { DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS } from '@/components/world/domains/definingWorldPlazaDayNightCycleConstants';
import { formattingWorldPlazaDayNightClockTimeValue } from '@/components/world/domains/formattingWorldPlazaDayNightClockTimeValue';
import { describe, expect, it } from 'vitest';

describe('convertingWorldPlazaDayNightClockTimeValueToCyclePhase', () => {
  it('maps midnight to phase 0', () => {
    expect(
      convertingWorldPlazaDayNightClockTimeValueToCyclePhase('00:00')
    ).toBe(0);
  });

  it('maps noon to phase 0.5', () => {
    expect(
      convertingWorldPlazaDayNightClockTimeValueToCyclePhase('12:00')
    ).toBe(0.5);
  });
});

describe('formattingWorldPlazaDayNightClockTimeValue', () => {
  it('round-trips with the cycle phase converter', () => {
    const cyclePhase = 0.375;
    const epochMs =
      cyclePhase * DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS;
    const timeValue = formattingWorldPlazaDayNightClockTimeValue(epochMs);

    expect(
      convertingWorldPlazaDayNightClockTimeValueToCyclePhase(timeValue)
    ).toBeCloseTo(cyclePhase, 5);
  });
});
