import {
  resolvingPlazaMechanicsImmuneSystemGuideDescription,
  resolvingPlazaMechanicsImmuneSystemGuideStats,
} from '@/components/home/domains/resolvingPlazaMechanicsImmuneSystemGuide';
import { describe, expect, it } from 'vitest';

describe('resolvingPlazaMechanicsImmuneSystemGuide', () => {
  it('describes immune-system benefits using live tuning constants', () => {
    const stats = resolvingPlazaMechanicsImmuneSystemGuideStats();
    const description = resolvingPlazaMechanicsImmuneSystemGuideDescription();

    expect(description).toContain(stats.factorRangeLabel);
    expect(description).toContain(`${stats.maxContractionReductionPercent}%`);
    expect(description).toContain(`${stats.maxDurationReductionPercent}%`);
    expect(description).toContain(`${stats.maxSymptomReductionPercent}%`);
    expect(description).toContain(`${stats.minImmunityChancePercent}%`);
    expect(description).toContain(`${stats.maxImmunityChancePercent}%`);
    expect(description).not.toMatch(/[—–]/);
  });
});
