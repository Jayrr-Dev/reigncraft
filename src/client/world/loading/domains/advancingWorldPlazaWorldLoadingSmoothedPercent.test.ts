import { advancingWorldPlazaWorldLoadingSmoothedPercent } from '@/components/world/loading/domains/advancingWorldPlazaWorldLoadingSmoothedPercent';
import { describe, expect, it } from 'vitest';

describe('advancingWorldPlazaWorldLoadingSmoothedPercent', () => {
  it('eases toward a higher target without jumping all the way', () => {
    const next = advancingWorldPlazaWorldLoadingSmoothedPercent({
      currentPercent: 10,
      targetPercent: 40,
      deltaMs: 16,
      smoothingRatePerSecond: 4.5,
    });

    expect(next).toBeGreaterThan(10);
    expect(next).toBeLessThan(40);
  });

  it('settles immediately when already at the target', () => {
    const next = advancingWorldPlazaWorldLoadingSmoothedPercent({
      currentPercent: 50,
      targetPercent: 50,
      deltaMs: 16,
    });

    expect(next).toBe(50);
  });

  it('never moves backward when the target drops', () => {
    const next = advancingWorldPlazaWorldLoadingSmoothedPercent({
      currentPercent: 50,
      targetPercent: 20,
      deltaMs: 16,
    });

    expect(next).toBe(50);
  });

  it('snaps when within the epsilon of the target', () => {
    const next = advancingWorldPlazaWorldLoadingSmoothedPercent({
      currentPercent: 39.95,
      targetPercent: 40,
      deltaMs: 16,
      snapEpsilon: 0.08,
    });

    expect(next).toBe(40);
  });
});
