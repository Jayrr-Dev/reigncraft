import { applyingWorldPlazaDamageRollDodgedAsZeroDamage } from '@/components/world/health/domains/applyingWorldPlazaDamageRollDodgedAsZeroDamage';
import type { RollingWorldPlazaDamageEngineResult } from '@/components/world/health/domains/rollingWorldPlazaDamageEngine';
import { describe, expect, it } from 'vitest';

const DODGED_ROLL: RollingWorldPlazaDamageEngineResult = {
  rolledDamage: 12,
  deviationScore: -3.5,
  tier: 'dodged',
  expectedDamage: 100,
  standardDeviation: 20,
  rollMode: 'normal',
};

const NORMAL_ROLL: RollingWorldPlazaDamageEngineResult = {
  rolledDamage: 100,
  deviationScore: 0,
  tier: 'normal',
  expectedDamage: 100,
  standardDeviation: 20,
  rollMode: 'normal',
};

describe('applyingWorldPlazaDamageRollDodgedAsZeroDamage', () => {
  it('zeros rolled damage for dodged tiers when enabled', () => {
    const result = applyingWorldPlazaDamageRollDodgedAsZeroDamage(
      DODGED_ROLL,
      true
    );

    expect(result.rolledDamage).toBe(0);
    expect(result.tier).toBe('dodged');
    expect(result.deviationScore).toBe(-3.5);
  });

  it('leaves dodged rolls unchanged when disabled', () => {
    expect(
      applyingWorldPlazaDamageRollDodgedAsZeroDamage(DODGED_ROLL, false)
    ).toEqual(DODGED_ROLL);
  });

  it('leaves non-dodged rolls unchanged when enabled', () => {
    expect(
      applyingWorldPlazaDamageRollDodgedAsZeroDamage(NORMAL_ROLL, true)
    ).toEqual(NORMAL_ROLL);
  });
});
