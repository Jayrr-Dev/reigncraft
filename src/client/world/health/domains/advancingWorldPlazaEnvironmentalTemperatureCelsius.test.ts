import { advancingWorldPlazaEnvironmentalTemperatureCelsius } from '@/components/world/health/domains/advancingWorldPlazaEnvironmentalTemperatureCelsius';
import { describe, expect, it } from 'vitest';

describe('advancingWorldPlazaEnvironmentalTemperatureCelsius', () => {
  it('eases toward the target instead of snapping', () => {
    const next = advancingWorldPlazaEnvironmentalTemperatureCelsius({
      currentCelsius: 10,
      targetCelsius: 30,
      deltaMs: 1_000,
      smoothingRatePerSecond: 3,
    });

    expect(next).toBeGreaterThan(10);
    expect(next).toBeLessThan(30);
  });

  it('eases toward extreme targets such as lava', () => {
    const next = advancingWorldPlazaEnvironmentalTemperatureCelsius({
      currentCelsius: 20,
      targetCelsius: 920,
      deltaMs: 16,
      smoothingRatePerSecond: 3,
    });

    expect(next).toBeGreaterThan(20);
    expect(next).toBeLessThan(920);
  });
});
