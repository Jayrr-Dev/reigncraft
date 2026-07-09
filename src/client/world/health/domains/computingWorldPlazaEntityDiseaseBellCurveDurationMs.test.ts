import { computingWorldPlazaInGameDaysToRealMs } from '@/components/world/domains/computingWorldPlazaInGameDurationMs';
import {
  resolvingWorldPlazaEntityDiseaseBellCurveDurationRangeMs,
  rollingWorldPlazaEntityDiseaseBellCurveDurationMs,
  samplingWorldPlazaEntityDiseaseStandardNormal,
} from '@/components/world/health/domains/computingWorldPlazaEntityDiseaseBellCurveDurationMs';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaEntityDiseaseBellCurveDurationMs', () => {
  it('centers rolls on the mean at z=0', () => {
    const meanMs = computingWorldPlazaInGameDaysToRealMs(3);

    expect(
      rollingWorldPlazaEntityDiseaseBellCurveDurationMs({
        meanMs,
        kind: 'incubation',
        standardNormalSample: 0,
      })
    ).toBe(meanMs);
  });

  it('widens incubation and illness ranges around the mean', () => {
    const meanMs = computingWorldPlazaInGameDaysToRealMs(4);
    const incubationRange =
      resolvingWorldPlazaEntityDiseaseBellCurveDurationRangeMs({
        meanMs,
        kind: 'incubation',
      });
    const illnessRange =
      resolvingWorldPlazaEntityDiseaseBellCurveDurationRangeMs({
        meanMs,
        kind: 'illness',
      });

    expect(incubationRange.minMs).toBeLessThan(meanMs);
    expect(incubationRange.maxMs).toBeGreaterThan(meanMs);
    expect(illnessRange.minMs).toBeLessThan(meanMs);
    expect(illnessRange.maxMs).toBeGreaterThan(meanMs);
  });

  it('samples finite standard-normal values', () => {
    const sample = samplingWorldPlazaEntityDiseaseStandardNormal(() => 0.42);

    expect(Number.isFinite(sample)).toBe(true);
  });
});
