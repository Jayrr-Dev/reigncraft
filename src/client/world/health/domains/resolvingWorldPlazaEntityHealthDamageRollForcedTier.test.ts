import {
  encodingWorldPlazaEntityHealthDamageRollForcedTierValue,
  resolvingWorldPlazaDamageOutcomeTierFromForcedDeviationScore,
  resolvingWorldPlazaEntityHealthDamageRollForcedDeviationScoreFromModifiers,
} from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthDamageRollForcedTier';
import { resolvingWorldPlazaEntityHealthDamageRollParams } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthDamageRollParams';
import { rollingWorldPlazaDamageEngine } from '@/components/world/health/domains/rollingWorldPlazaDamageEngine';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaEntityHealthDamageRollForcedTier', () => {
  it('round-trips forced tier deviation scores', () => {
    expect(
      resolvingWorldPlazaDamageOutcomeTierFromForcedDeviationScore(
        encodingWorldPlazaEntityHealthDamageRollForcedTierValue('critical')
      )
    ).toBe('critical');
    expect(
      resolvingWorldPlazaDamageOutcomeTierFromForcedDeviationScore(
        encodingWorldPlazaEntityHealthDamageRollForcedTierValue('dodged')
      )
    ).toBe('dodged');
  });

  it('prefers the most defensive forced tier when several are active', () => {
    const forcedScore =
      resolvingWorldPlazaEntityHealthDamageRollForcedDeviationScoreFromModifiers(
        [
          {
            id: 'exposed-debuff:0',
            kind: 'forced_tier',
            value:
              encodingWorldPlazaEntityHealthDamageRollForcedTierValue(
                'critical'
              ),
            expiresAtMs: null,
          },
          {
            id: 'braced-buff:0',
            kind: 'forced_tier',
            value:
              encodingWorldPlazaEntityHealthDamageRollForcedTierValue(
                'softened'
              ),
            expiresAtMs: null,
          },
        ]
      );

    expect(forcedScore).toBe(
      encodingWorldPlazaEntityHealthDamageRollForcedTierValue('softened')
    );
  });
});

describe('forced tier damage rolls', () => {
  it('always rolls critical when Exposed is active on the defender', () => {
    const rollParams = resolvingWorldPlazaEntityHealthDamageRollParams({
      baseExpectedDamage: 100,
      defenderModifiers: [
        {
          id: 'exposed-debuff:0',
          kind: 'forced_tier',
          value:
            encodingWorldPlazaEntityHealthDamageRollForcedTierValue('critical'),
          expiresAtMs: null,
        },
      ],
      nowMs: 0,
    });

    const roll = rollingWorldPlazaDamageEngine({
      expectedDamage: rollParams.expectedDamage,
      standardDeviation: rollParams.standardDeviation,
      luck: rollParams.luck,
      deviationBiasShift: rollParams.deviationBiasShift,
      forcedDeviationScore: rollParams.forcedDeviationScore ?? undefined,
      random: () => 0.99,
    });

    expect(roll.tier).toBe('critical');
  });

  it('always rolls dodged when Ultra Instinct is active on the defender', () => {
    const rollParams = resolvingWorldPlazaEntityHealthDamageRollParams({
      baseExpectedDamage: 100,
      defenderModifiers: [
        {
          id: 'ultra-instinct-buff:0',
          kind: 'forced_tier',
          value:
            encodingWorldPlazaEntityHealthDamageRollForcedTierValue('dodged'),
          expiresAtMs: null,
        },
      ],
      nowMs: 0,
    });

    const roll = rollingWorldPlazaDamageEngine({
      expectedDamage: rollParams.expectedDamage,
      standardDeviation: rollParams.standardDeviation,
      luck: rollParams.luck,
      deviationBiasShift: rollParams.deviationBiasShift,
      forcedDeviationScore: rollParams.forcedDeviationScore ?? undefined,
      random: () => 0.01,
    });

    expect(roll.tier).toBe('dodged');
  });
});
