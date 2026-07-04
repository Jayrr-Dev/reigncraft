import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_PRESETS } from '@/components/world/health/domains/definingWorldPlazaEntityHealthDamageRollPresets';
import {
  creatingWorldPlazaEntityHealthInitialState,
  togglingWorldPlazaEntityHealthDamageRollPreset,
} from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { resolvingWorldPlazaEntityHealthDamageRollParams } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthDamageRollParams';
import {
  classifyingWorldPlazaDamageOutcomeTier,
  rollingWorldPlazaDamageEngine,
} from '@/components/world/health/domains/rollingWorldPlazaDamageEngine';
import { describe, expect, it } from 'vitest';

function creatingSeededRandom(values: readonly number[]): () => number {
  let index = 0;

  return () => {
    const value = values[index] ?? 0.5;
    index += 1;
    return value;
  };
}

describe('classifyingWorldPlazaDamageOutcomeTier', () => {
  it('maps deviation scores to the documented tiers for expected 100 and sd 20', () => {
    expect(classifyingWorldPlazaDamageOutcomeTier(3)).toBe('fatal');
    expect(classifyingWorldPlazaDamageOutcomeTier(2.5)).toBe('lethal');
    expect(classifyingWorldPlazaDamageOutcomeTier(1.5)).toBe('critical');
    expect(classifyingWorldPlazaDamageOutcomeTier(0)).toBe('normal');
    expect(classifyingWorldPlazaDamageOutcomeTier(-1.5)).toBe('softened');
    expect(classifyingWorldPlazaDamageOutcomeTier(-2.5)).toBe('blocked');
    expect(classifyingWorldPlazaDamageOutcomeTier(-3.5)).toBe('dodged');
  });
});

describe('rollingWorldPlazaDamageEngine', () => {
  it('labels fatal rolls at 3+ standard deviations above expected', () => {
    const fatal = rollingWorldPlazaDamageEngine({
      expectedDamage: 100,
      standardDeviation: 20,
      random: creatingSeededRandom([0.01, 0.01]),
    });

    expect(fatal.rolledDamage).toBeGreaterThanOrEqual(160);
    expect(fatal.tier).toBe('fatal');
  });

  it('labels low-tier rolls when luck skews left', () => {
    const lowLuckSamples = Array.from({ length: 200 }, (_, index) =>
      rollingWorldPlazaDamageEngine({
        expectedDamage: 100,
        standardDeviation: 20,
        luck: -0.95,
        random: creatingSeededRandom([
          ((index * 13) % 997) / 997,
          ((index * 29) % 991) / 991,
        ]),
      })
    );

    const lowTierCount = lowLuckSamples.filter(
      (sample) =>
        sample.tier === 'softened' ||
        sample.tier === 'blocked' ||
        sample.tier === 'dodged'
    ).length;

    expect(lowTierCount).toBeGreaterThan(0);
    expect(lowLuckSamples.some((sample) => sample.rolledDamage <= 59)).toBe(
      true
    );
  });

  it('preserves the advertised expected damage on average without luck skew', () => {
    const samples = Array.from({ length: 2_000 }, (_, index) =>
      rollingWorldPlazaDamageEngine({
        expectedDamage: 100,
        standardDeviation: 20,
        random: creatingSeededRandom([
          ((index * 17) % 997) / 997,
          ((index * 31) % 991) / 991,
        ]),
      })
    );
    const average =
      samples.reduce((sum, sample) => sum + sample.rolledDamage, 0) /
      samples.length;

    expect(average).toBeGreaterThan(94);
    expect(average).toBeLessThan(106);
  });

  it('skews high-luck rolls toward critical-or-better tiers', () => {
    const highLuckSamples = Array.from({ length: 500 }, (_, index) =>
      rollingWorldPlazaDamageEngine({
        expectedDamage: 100,
        standardDeviation: 20,
        luck: 0.75,
        random: creatingSeededRandom([
          ((index * 19) % 997) / 997,
          ((index * 37) % 991) / 991,
        ]),
      })
    );
    const lowLuckSamples = Array.from({ length: 500 }, (_, index) =>
      rollingWorldPlazaDamageEngine({
        expectedDamage: 100,
        standardDeviation: 20,
        luck: -0.75,
        random: creatingSeededRandom([
          ((index * 19) % 997) / 997,
          ((index * 37) % 991) / 991,
        ]),
      })
    );

    const highLuckCriticalRate =
      highLuckSamples.filter(
        (sample) =>
          sample.tier === 'critical' ||
          sample.tier === 'lethal' ||
          sample.tier === 'fatal'
      ).length / highLuckSamples.length;
    const lowLuckCriticalRate =
      lowLuckSamples.filter(
        (sample) =>
          sample.tier === 'critical' ||
          sample.tier === 'lethal' ||
          sample.tier === 'fatal'
      ).length / lowLuckSamples.length;
    const highLuckLowTierRate =
      highLuckSamples.filter(
        (sample) =>
          sample.tier === 'softened' ||
          sample.tier === 'blocked' ||
          sample.tier === 'dodged'
      ).length / highLuckSamples.length;
    const lowLuckLowTierRate =
      lowLuckSamples.filter(
        (sample) =>
          sample.tier === 'softened' ||
          sample.tier === 'blocked' ||
          sample.tier === 'dodged'
      ).length / lowLuckSamples.length;

    expect(highLuckCriticalRate).toBeGreaterThan(lowLuckCriticalRate);
    expect(lowLuckLowTierRate).toBeGreaterThan(highLuckLowTierRate);
  });

  it('shifts rolls toward blocked outcomes when deviation bias is negative', () => {
    const baselineSamples = Array.from({ length: 300 }, (_, index) =>
      rollingWorldPlazaDamageEngine({
        expectedDamage: 100,
        standardDeviation: 20,
        random: creatingSeededRandom([
          ((index * 11) % 997) / 997,
          ((index * 23) % 991) / 991,
        ]),
      })
    );
    const guardedSamples = Array.from({ length: 300 }, (_, index) =>
      rollingWorldPlazaDamageEngine({
        expectedDamage: 100,
        standardDeviation: 20,
        deviationBiasShift: -1,
        random: creatingSeededRandom([
          ((index * 11) % 997) / 997,
          ((index * 23) % 991) / 991,
        ]),
      })
    );

    const baselineBlockedRate =
      baselineSamples.filter(
        (sample) => sample.tier === 'blocked' || sample.tier === 'dodged'
      ).length / baselineSamples.length;
    const guardedBlockedRate =
      guardedSamples.filter(
        (sample) => sample.tier === 'blocked' || sample.tier === 'dodged'
      ).length / guardedSamples.length;

    expect(guardedBlockedRate).toBeGreaterThan(baselineBlockedRate);
  });

  it('reduces expected damage when heavy armour preset modifiers are active', () => {
    const heavyArmorPreset =
      DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_PRESETS.find(
        (preset) => preset.id === 'heavy-armor'
      );

    if (!heavyArmorPreset) {
      throw new Error('heavy-armor preset missing');
    }

    const armoredState = togglingWorldPlazaEntityHealthDamageRollPreset(
      creatingWorldPlazaEntityHealthInitialState(),
      heavyArmorPreset
    );
    const resolved = resolvingWorldPlazaEntityHealthDamageRollParams({
      baseExpectedDamage: 100,
      defenderModifiers: armoredState.damageRollModifiers,
      attackerModifiers: [],
      nowMs: 1_000,
    });

    expect(resolved.expectedDamage).toBe(70);
    expect(resolved.standardDeviation).toBe(14);
  });

  it('returns exact expected damage for lock-in rolls', () => {
    const lockIn = rollingWorldPlazaDamageEngine({
      expectedDamage: 100,
      standardDeviation: 20,
      rollMode: 'lock_in',
    });

    expect(lockIn.rolledDamage).toBe(100);
    expect(lockIn.tier).toBe('true_strike');
    expect(lockIn.deviationScore).toBe(0);
  });

  it('favours extreme tiers over normal under chaotic rolls', () => {
    const normalSamples = Array.from({ length: 400 }, (_, index) =>
      rollingWorldPlazaDamageEngine({
        expectedDamage: 100,
        standardDeviation: 20,
        random: creatingSeededRandom([
          ((index * 11) % 997) / 997,
          ((index * 23) % 991) / 991,
        ]),
      })
    );
    const chaoticSamples = Array.from({ length: 400 }, (_, index) =>
      rollingWorldPlazaDamageEngine({
        expectedDamage: 100,
        standardDeviation: 20,
        rollMode: 'chaotic',
        random: creatingSeededRandom([
          ((index * 11) % 997) / 997,
          ((index * 23) % 991) / 991,
          ((index * 37) % 991) / 991,
        ]),
      })
    );

    const normalRate =
      normalSamples.filter((sample) => sample.tier === 'normal').length /
      normalSamples.length;
    const chaoticNormalRate =
      chaoticSamples.filter((sample) => sample.tier === 'normal').length /
      chaoticSamples.length;
    const chaoticExtremeRate =
      chaoticSamples.filter(
        (sample) =>
          sample.tier === 'fatal' ||
          sample.tier === 'lethal' ||
          sample.tier === 'critical' ||
          sample.tier === 'softened' ||
          sample.tier === 'blocked' ||
          sample.tier === 'dodged'
      ).length / chaoticSamples.length;
    const normalExtremeRate =
      normalSamples.filter(
        (sample) =>
          sample.tier === 'fatal' ||
          sample.tier === 'lethal' ||
          sample.tier === 'critical' ||
          sample.tier === 'softened' ||
          sample.tier === 'blocked' ||
          sample.tier === 'dodged'
      ).length / normalSamples.length;

    expect(chaoticNormalRate).toBeLessThan(normalRate);
    expect(chaoticExtremeRate).toBeGreaterThan(normalExtremeRate);
  });

  it('clamps rolled damage at zero but allows unbounded high tail outcomes', () => {
    const lowRoll = rollingWorldPlazaDamageEngine({
      expectedDamage: 100,
      standardDeviation: 20,
      random: creatingSeededRandom([0.999, 0.999, 0.999, 0.999]),
    });
    const extremeHighRoll = rollingWorldPlazaDamageEngine({
      expectedDamage: 100,
      standardDeviation: 20,
      random: creatingSeededRandom([1e-10, 1e-10]),
    });

    expect(lowRoll.rolledDamage).toBeGreaterThanOrEqual(0);
    expect(extremeHighRoll.rolledDamage).toBeGreaterThan(180);
    expect(extremeHighRoll.deviationScore).toBeGreaterThan(4);
  });
});
