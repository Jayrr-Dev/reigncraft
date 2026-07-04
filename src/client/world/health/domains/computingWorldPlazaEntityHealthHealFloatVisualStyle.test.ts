import { computingWorldPlazaEntityHealthHealFloatVisualStyle } from '@/components/world/health/domains/computingWorldPlazaEntityHealthHealFloatVisualStyle';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaEntityHealthHealFloatVisualStyle', () => {
  it('uses a bright green with black outline and grows lighter with |σ|', () => {
    const normal = computingWorldPlazaEntityHealthHealFloatVisualStyle({
      deviationScore: 0,
    });
    const strong = computingWorldPlazaEntityHealthHealFloatVisualStyle({
      deviationScore: 4,
    });

    expect(normal.WebkitTextStroke).toContain('rgba(0, 0, 0');
    expect(normal.color).toBe('#4ade80');
    expect(strong.fontSizePx).toBeGreaterThan(normal.fontSizePx);
    expect(strong.color).not.toBe(normal.color);
  });
});
