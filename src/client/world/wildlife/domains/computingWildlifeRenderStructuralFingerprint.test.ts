import { quantizingWildlifeRenderVitalsRatio } from '@/components/world/wildlife/domains/computingWildlifeRenderStructuralFingerprint';
import { describe, expect, it } from 'vitest';

describe('quantizingWildlifeRenderVitalsRatio', () => {
  it('groups changes smaller than one rendered stamina-bar pixel', () => {
    expect(quantizingWildlifeRenderVitalsRatio(0.501)).toBe(
      quantizingWildlifeRenderVitalsRatio(0.51)
    );
  });

  it('clamps ratios to the visible bar range', () => {
    expect(quantizingWildlifeRenderVitalsRatio(-0.5)).toBe(0);
    expect(quantizingWildlifeRenderVitalsRatio(1.5)).toBe(1);
  });

  it('normalizes apex stamina against its raised cap before bucketing', () => {
    expect(quantizingWildlifeRenderVitalsRatio(1.3, 1.3)).toBe(1);
    expect(quantizingWildlifeRenderVitalsRatio(0.65, 1.3)).toBe(0.5);
  });
});
