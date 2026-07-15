import { computingWorldPlazaEntityHealthFallDamage } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { resolvingWorldPlazaEntityHealthDamageRollBaseExpectedDamage } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthDamageRollBaseExpectedDamage';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaEntityHealthFallDamage', () => {
  it('deals no EV within the safe layer delta', () => {
    expect(computingWorldPlazaEntityHealthFallDamage(0)).toBe(0);
    expect(computingWorldPlazaEntityHealthFallDamage(5)).toBe(0);
  });

  it('returns max-health-fraction EV for short damaging drops', () => {
    expect(computingWorldPlazaEntityHealthFallDamage(6)).toBeCloseTo(0.0175);
    expect(computingWorldPlazaEntityHealthFallDamage(8)).toBeCloseTo(0.0978125);
    expect(computingWorldPlazaEntityHealthFallDamage(10)).toBeCloseTo(0.330133);
  });

  it('converts through max_health_percent_ev into flat EV', () => {
    const fallFractionEv = computingWorldPlazaEntityHealthFallDamage(10);
    const flatEv = resolvingWorldPlazaEntityHealthDamageRollBaseExpectedDamage({
      kind: 'fall',
      rawAmount: fallFractionEv,
      effectiveMaxHealth: 2000,
    });

    expect(flatEv).toBeCloseTo(fallFractionEv * 2000);
  });

  it('reaches lethal EV at 12 layers', () => {
    expect(computingWorldPlazaEntityHealthFallDamage(11)).toBeLessThan(1);
    expect(
      computingWorldPlazaEntityHealthFallDamage(12)
    ).toBeGreaterThanOrEqual(1);
    expect(computingWorldPlazaEntityHealthFallDamage(13)).toBeGreaterThan(1.5);
  });
});
