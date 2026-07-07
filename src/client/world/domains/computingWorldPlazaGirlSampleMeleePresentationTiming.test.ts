import { computingWorldPlazaGirlSampleMeleePresentationTiming } from '@/components/world/domains/computingWorldPlazaGirlSampleMeleePresentationTiming';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaGirlSampleMeleePresentationTiming', () => {
  it('uses baseline strip length at attack speed 1', () => {
    const timing = computingWorldPlazaGirlSampleMeleePresentationTiming(1);

    expect(timing.animationFps).toBe(14);
    expect(timing.durationMs).toBeCloseTo((9 / 14) * 1000, 5);
  });

  it('shortens swing duration as attack speed increases', () => {
    const baseline = computingWorldPlazaGirlSampleMeleePresentationTiming(1);
    const faster = computingWorldPlazaGirlSampleMeleePresentationTiming(2);

    expect(faster.animationFps).toBe(28);
    expect(faster.durationMs).toBeCloseTo(baseline.durationMs / 2, 5);
  });
});
