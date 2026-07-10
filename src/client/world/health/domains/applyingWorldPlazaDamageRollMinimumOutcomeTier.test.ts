import { applyingWorldPlazaDamageRollMinimumOutcomeTier } from '@/components/world/health/domains/applyingWorldPlazaDamageRollMinimumOutcomeTier';
import { rollingWorldPlazaDamageEngine } from '@/components/world/health/domains/rollingWorldPlazaDamageEngine';
import { describe, expect, it } from 'vitest';

describe('applyingWorldPlazaDamageRollMinimumOutcomeTier', () => {
  it('floors dodged rolls up to normal at expected damage', () => {
    const dodged = rollingWorldPlazaDamageEngine({
      expectedDamage: 100,
      standardDeviation: 20,
      forcedDeviationScore: -3.5,
    });

    expect(dodged.tier).toBe('dodged');

    const floored = applyingWorldPlazaDamageRollMinimumOutcomeTier(
      dodged,
      'normal'
    );

    expect(floored.tier).toBe('normal');
    expect(floored.rolledDamage).toBe(100);
    expect(floored.deviationScore).toBe(0);
  });

  it('leaves critical and higher tiers unchanged', () => {
    const critical = rollingWorldPlazaDamageEngine({
      expectedDamage: 100,
      standardDeviation: 20,
      forcedDeviationScore: 1.25,
    });

    expect(
      applyingWorldPlazaDamageRollMinimumOutcomeTier(critical, 'normal')
    ).toEqual(critical);
  });

  it('leaves softened below normal when floor is blocked', () => {
    const softened = rollingWorldPlazaDamageEngine({
      expectedDamage: 100,
      standardDeviation: 20,
      forcedDeviationScore: -1.25,
    });

    expect(
      applyingWorldPlazaDamageRollMinimumOutcomeTier(softened, 'blocked').tier
    ).toBe('softened');
  });
});
