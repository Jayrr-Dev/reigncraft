import {
  clampingWorldPlazaPowerLawSample,
  computingWorldPlazaPowerLawMean,
  computingWorldPlazaPowerLawQuantile,
  samplingWorldPlazaPowerLawValue,
} from '@/components/world/domains/computingWorldPlazaPowerLawSample';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaPowerLawSample', () => {
  it('yields xmin when uniform approaches 1', () => {
    expect(
      computingWorldPlazaPowerLawQuantile({
        xmin: 3,
        alpha: 2.5,
        p: 1,
      })
    ).toBe(3);
  });

  it('matches closed-form xmin * u^(-1/α) for a fixed uniform', () => {
    const xmin = 2;
    const alpha = 3;
    const uniform = 0.25;
    const expected = xmin * uniform ** (-1 / alpha);

    expect(
      samplingWorldPlazaPowerLawValue({
        xmin,
        alpha,
        uniform,
      })
    ).toBe(expected);
  });

  it('returns finite mean only when alpha > 1', () => {
    expect(
      computingWorldPlazaPowerLawMean({
        xmin: 1,
        alpha: 0.8,
      })
    ).toBeNull();

    expect(
      computingWorldPlazaPowerLawMean({
        xmin: 4,
        alpha: 3,
      })
    ).toBe(6);
  });

  it('clamps samples to maxX', () => {
    expect(clampingWorldPlazaPowerLawSample(120, 2, 50)).toBe(50);
    expect(clampingWorldPlazaPowerLawSample(0.5, 2, 50)).toBe(2);
  });

  it('keeps samples >= xmin and finite for sane uniforms', () => {
    const xmin = 1.5;
    const alpha = 2.5;

    for (const uniform of [0.001, 0.1, 0.5, 0.99, 1]) {
      const sample = samplingWorldPlazaPowerLawValue({
        xmin,
        alpha,
        uniform,
      });

      expect(Number.isFinite(sample)).toBe(true);
      expect(sample).toBeGreaterThanOrEqual(xmin);
    }
  });

  it('rejects invalid xmin or alpha', () => {
    expect(() =>
      samplingWorldPlazaPowerLawValue({
        xmin: 0,
        alpha: 2,
        uniform: 0.5,
      })
    ).toThrow(RangeError);

    expect(() =>
      samplingWorldPlazaPowerLawValue({
        xmin: 1,
        alpha: 0,
        uniform: 0.5,
      })
    ).toThrow(RangeError);
  });
});
