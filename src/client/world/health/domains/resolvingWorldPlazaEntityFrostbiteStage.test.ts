import { describe, expect, it } from 'vitest';
import { computingWorldPlazaFrostbiteStacksGainedFromColdDeficit } from '@/components/world/health/domains/computingWorldPlazaFrostbiteColdSeverityStackGainMultiplier';
import { computingWorldPlazaFrostbiteColdTickDamage } from '@/components/world/health/domains/computingWorldPlazaFrostbiteColdTickDamage';
import { computingWorldPlazaFrostbitePercentMaxHealthDamage } from '@/components/world/health/domains/computingWorldPlazaFrostbitePercentMaxHealthDamage';
import { computingWorldPlazaFrostbiteStacksLostFromWarmSurplus } from '@/components/world/health/domains/computingWorldPlazaFrostbiteStacksLostFromWarmSurplus';
import { computingWorldPlazaFrostbiteWarmDecayStacksPerSecond } from '@/components/world/health/domains/computingWorldPlazaFrostbiteWarmDecayStacksPerSecond';
import { DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_FROST_DAMAGE_TAKEN_MULTIPLIER } from '@/components/world/health/domains/definingWorldPlazaEntityFrostbiteConstants';
import { resolvingWorldPlazaEntityFrostbiteStage } from '@/components/world/health/domains/resolvingWorldPlazaEntityFrostbiteStage';

describe('resolvingWorldPlazaEntityFrostbiteStage', () => {
  it('resolves chilly from zero stacks', () => {
    expect(resolvingWorldPlazaEntityFrostbiteStage(0)?.id).toBe('chilly');
    expect(resolvingWorldPlazaEntityFrostbiteStage(49)?.id).toBe('chilly');
  });

  it('resolves each stage at its threshold', () => {
    expect(resolvingWorldPlazaEntityFrostbiteStage(50)?.id).toBe('cold');
    expect(resolvingWorldPlazaEntityFrostbiteStage(100)?.id).toBe('shivering');
    expect(resolvingWorldPlazaEntityFrostbiteStage(200)?.id).toBe('freezing');
    expect(resolvingWorldPlazaEntityFrostbiteStage(500)?.id).toBe(
      'hypothermia'
    );
    expect(resolvingWorldPlazaEntityFrostbiteStage(750)?.id).toBe('frostbite');
    expect(resolvingWorldPlazaEntityFrostbiteStage(1000)?.id).toBe('necrotic');
  });
});

describe('computingWorldPlazaFrostbiteStacksGainedFromColdDeficit', () => {
  it('adds one stack per °C below comfort low', () => {
    expect(computingWorldPlazaFrostbiteStacksGainedFromColdDeficit(0)).toBe(0);
    expect(computingWorldPlazaFrostbiteStacksGainedFromColdDeficit(10)).toBe(
      10
    );
    expect(computingWorldPlazaFrostbiteStacksGainedFromColdDeficit(20)).toBe(
      20
    );
  });
});

describe('computingWorldPlazaFrostbiteStacksLostFromWarmSurplus', () => {
  it('is zero at or below comfort low and scales 1:1 with warmth', () => {
    expect(
      computingWorldPlazaFrostbiteStacksLostFromWarmSurplus({
        warmthAboveComfortCelsius: 0,
        stackCount: 500,
      })
    ).toBe(0);
    expect(
      computingWorldPlazaFrostbiteStacksLostFromWarmSurplus({
        warmthAboveComfortCelsius: 20,
        stackCount: 0,
      })
    ).toBe(0);
    expect(
      computingWorldPlazaFrostbiteStacksLostFromWarmSurplus({
        warmthAboveComfortCelsius: 20,
        stackCount: 1000,
      })
    ).toBe(20);
    expect(
      computingWorldPlazaFrostbiteStacksLostFromWarmSurplus({
        warmthAboveComfortCelsius: 69,
        stackCount: 471,
      })
    ).toBe(69);
  });

  it('recovers faster when warmer at the same stack count', () => {
    const cooler = computingWorldPlazaFrostbiteStacksLostFromWarmSurplus({
      warmthAboveComfortCelsius: 5,
      stackCount: 500,
    });
    const warmer = computingWorldPlazaFrostbiteStacksLostFromWarmSurplus({
      warmthAboveComfortCelsius: 20,
      stackCount: 500,
    });

    expect(warmer).toBeGreaterThan(cooler);
  });
});

describe('computingWorldPlazaFrostbiteWarmDecayStacksPerSecond', () => {
  it('is zero while still cold and rises when warmer', () => {
    expect(computingWorldPlazaFrostbiteWarmDecayStacksPerSecond(-5, 500)).toBe(
      0
    );
    expect(computingWorldPlazaFrostbiteWarmDecayStacksPerSecond(0, 500)).toBe(0);
    const mildWarmth = computingWorldPlazaFrostbiteWarmDecayStacksPerSecond(
      10,
      500
    );
    const strongWarmth = computingWorldPlazaFrostbiteWarmDecayStacksPerSecond(
      69,
      500
    );
    expect(mildWarmth).toBe(10);
    expect(strongWarmth).toBe(69);
  });
});

describe('computingWorldPlazaFrostbitePercentMaxHealthDamage', () => {
  it('uses base + stacks * 0.01 percent of max health', () => {
    expect(computingWorldPlazaFrostbitePercentMaxHealthDamage(200, 1000)).toBe(
      20
    );
    expect(computingWorldPlazaFrostbitePercentMaxHealthDamage(0, 1000)).toBe(0);
  });
});

describe('computingWorldPlazaFrostbiteColdTickDamage', () => {
  it('adds percent damage at freezing and triples at frostbite', () => {
    const freezing = computingWorldPlazaFrostbiteColdTickDamage({
      ambientTickDamage: 10,
      frostbite: {
        stackCount: 200,
        activeStageId: 'freezing',
        lastGainAtMs: null,
        lastDecayAtMs: null,
        lastSleepSpellAtStacks: null,
      },
      effectiveMaxHealth: 1000,
    });

    expect(freezing.ambientDamage).toBe(10);
    expect(freezing.percentMaxHealthDamage).toBe(20);
    expect(freezing.totalDamage).toBe(30);

    const frostbite = computingWorldPlazaFrostbiteColdTickDamage({
      ambientTickDamage: 10,
      frostbite: {
        stackCount: 750,
        activeStageId: 'frostbite',
        lastGainAtMs: null,
        lastDecayAtMs: null,
        lastSleepSpellAtStacks: null,
      },
      effectiveMaxHealth: 1000,
    });

    expect(frostbite.ambientDamage).toBe(
      10 * DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_FROST_DAMAGE_TAKEN_MULTIPLIER
    );
    expect(frostbite.percentMaxHealthDamage).toBe(
      75 * DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_FROST_DAMAGE_TAKEN_MULTIPLIER
    );
  });
});
