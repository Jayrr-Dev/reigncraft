import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX } from '@/components/world/health/domains/definingWorldPlazaEntityHealthConstants';
import { resolvingWorldPlazaEntityHealthDamageRollBaseExpectedDamage } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthDamageRollBaseExpectedDamage';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaEntityHealthDamageRollBaseExpectedDamage', () => {
  it('returns flat EV for physical damage', () => {
    expect(
      resolvingWorldPlazaEntityHealthDamageRollBaseExpectedDamage({
        kind: 'physical',
        rawAmount: 25,
        effectiveMaxHealth: DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX,
      })
    ).toBe(25);
  });

  it('converts soulbreak percent into max-health EV', () => {
    expect(
      resolvingWorldPlazaEntityHealthDamageRollBaseExpectedDamage({
        kind: 'soulbreak',
        rawAmount: 0.15,
        effectiveMaxHealth: 200,
      })
    ).toBe(30);
  });

  it('converts fall percent into max-health EV', () => {
    expect(
      resolvingWorldPlazaEntityHealthDamageRollBaseExpectedDamage({
        kind: 'fall',
        rawAmount: 0.2,
        effectiveMaxHealth: 1000,
      })
    ).toBe(200);
  });

  it('clamps negative soulbreak percent to zero EV', () => {
    expect(
      resolvingWorldPlazaEntityHealthDamageRollBaseExpectedDamage({
        kind: 'soulbreak',
        rawAmount: -0.1,
        effectiveMaxHealth: 200,
      })
    ).toBe(0);
  });
});
