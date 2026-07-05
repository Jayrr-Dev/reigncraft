import { computingWorldPlazaEntityPoisonRampCumulativeDamageFraction } from '@/components/world/health/domains/definingWorldPlazaEntityPoisonRampConstants';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaEntityPoisonRampCumulativeDamageFraction', () => {
  it('allocates 15/35/50 damage across 50/35/15 time segments', () => {
    expect(
      computingWorldPlazaEntityPoisonRampCumulativeDamageFraction(0)
    ).toBe(0);
    expect(
      computingWorldPlazaEntityPoisonRampCumulativeDamageFraction(0.25)
    ).toBeCloseTo(0.075, 5);
    expect(
      computingWorldPlazaEntityPoisonRampCumulativeDamageFraction(0.5)
    ).toBeCloseTo(0.15, 5);
    expect(
      computingWorldPlazaEntityPoisonRampCumulativeDamageFraction(0.675)
    ).toBeCloseTo(0.325, 5);
    expect(
      computingWorldPlazaEntityPoisonRampCumulativeDamageFraction(0.85)
    ).toBeCloseTo(0.5, 5);
    expect(
      computingWorldPlazaEntityPoisonRampCumulativeDamageFraction(0.925)
    ).toBeCloseTo(0.75, 5);
    expect(
      computingWorldPlazaEntityPoisonRampCumulativeDamageFraction(1)
    ).toBe(1);
  });
});
