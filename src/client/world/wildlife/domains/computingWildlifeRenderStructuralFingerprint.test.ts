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
});
