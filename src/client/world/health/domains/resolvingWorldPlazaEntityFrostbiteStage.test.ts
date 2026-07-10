import { describe, expect, it } from 'vitest';
import { computingWorldPlazaFrostbiteStacksGainedFromColdDeficit } from '@/components/world/health/domains/computingWorldPlazaFrostbiteColdSeverityStackGainMultiplier';
import { computingWorldPlazaFrostbiteColdTickDamage } from '@/components/world/health/domains/computingWorldPlazaFrostbiteColdTickDamage';
import { computingWorldPlazaFrostbitePercentMaxHealthDamage } from '@/components/world/health/domains/computingWorldPlazaFrostbitePercentMaxHealthDamage';
import { computingWorldPlazaFrostbiteStacksLostFromWarmSurplus } from '@/components/world/health/domains/computingWorldPlazaFrostbiteStacksLostFromWarmSurplus';
import { computingWorldPlazaFrostbiteWarmDecayStacksPerSecond } from '@/components/world/health/domains/computingWorldPlazaFrostbiteWarmDecayStacksPerSecond';
import { DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_FROST_DAMAGE_TAKEN_MULTIPLIER } from '@/components/world/health/domains/definingWorldPlazaEntityFrostbiteConstants';
import { resolvingWorldPlazaEntityFrostbiteStage } from '@/components/world/health/domains/resolvingWorldPlazaEntityFrostbiteStage';

describe('resolvingWorldPlazaEntityFrostbiteStage', () => {
  it('returns null below chilled', () => {
    expect(resolvingWorldPlazaEntityFrostbiteStage(0)).toBeNull();
    expect(resolvingWorldPlazaEntityFrostbiteStage(49)).toBeNull();
  });

  it('resolves each stage at its threshold', () => {
    expect(resolvingWorldPlazaEntityFrostbiteStage(50)?.id).toBe('chilled');
    expect(resolvingWorldPlazaEntityFrostbiteStage(100)?.id).toBe('numb');
    expect(resolvingWorldPlazaEntityFrostbiteStage(200)?.id).toBe('frostnip');
    expect(resolvingWorldPlazaEntityFrostbiteStage(500)?.id).toBe('hypothermia');
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
  it('adds percent damage at frostnip and doubles at frostbite', () => {
    const frostnip = computingWorldPlazaFrostbiteColdTickDamage({
      ambientTickDamage: 10,
      frostbite: {
        stackCount: 200,
        activeStageId: 'frostnip',
        lastGainAtMs: null,
        lastDecayAtMs: null,
        lastSleepSpellAtStacks: null,
      },
      effectiveMaxHealth: 1000,
    });

    expect(frostnip.ambientDamage).toBe(10);
    expect(frostnip.percentMaxHealthDamage).toBe(20);
    expect(frostnip.totalDamage).toBe(30);

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
