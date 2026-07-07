import { DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS } from '@/components/world/domains/definingWorldPlazaDayNightCycleConstants';
import { resolvingWorldPlazaDayNightCycleSample } from '@/components/world/domains/resolvingWorldPlazaDayNightCycleSample';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaDayNightCycleSample', () => {
  it('returns identical samples for the same UTC epoch on every client', () => {
    const sharedEpochMs = 0.4 * DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS;

    const firstClient = resolvingWorldPlazaDayNightCycleSample(sharedEpochMs);
    const secondClient = resolvingWorldPlazaDayNightCycleSample(sharedEpochMs);

    expect(firstClient).toEqual(secondClient);
    expect(firstClient.isDaytime).toBe(true);
    expect(firstClient.cyclePhase).toBeCloseTo(0.4, 5);
  });

  it('marks night from cycle phase, not local timezone APIs', () => {
    const midnightEpochMs = 0.05 * DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS;
    const sample = resolvingWorldPlazaDayNightCycleSample(midnightEpochMs);

    expect(sample.isDaytime).toBe(false);
    expect(sample.cyclePhase).toBeCloseTo(0.05, 5);
  });
});
