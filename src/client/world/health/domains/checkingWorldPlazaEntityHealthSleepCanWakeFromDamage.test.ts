import { checkingWorldPlazaEntityHealthSleepCanWakeFromDamage } from '@/components/world/health/domains/checkingWorldPlazaEntityHealthSleepCanWakeFromDamage';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

describe('checkingWorldPlazaEntityHealthSleepCanWakeFromDamage', () => {
  const nowMs = 1_000;

  it('returns true when awake', () => {
    expect(
      checkingWorldPlazaEntityHealthSleepCanWakeFromDamage(
        creatingWorldPlazaEntityHealthInitialState(),
        nowMs
      )
    ).toBe(true);
  });

  it('returns true for normal sleep', () => {
    const state = {
      ...creatingWorldPlazaEntityHealthInitialState(),
      sleepEffects: [
        {
          id: 'sleep-debuff',
          appliedAtMs: 0,
          expiresAtMs: 10_000,
          wakeBonusDamage: 30,
        },
      ],
    };

    expect(
      checkingWorldPlazaEntityHealthSleepCanWakeFromDamage(state, nowMs)
    ).toBe(true);
  });

  it('returns false for deep sleep', () => {
    const state = {
      ...creatingWorldPlazaEntityHealthInitialState(),
      sleepEffects: [
        {
          id: 'deep-sleep-debuff',
          appliedAtMs: 0,
          expiresAtMs: 12_000,
          wakeBonusDamage: 0,
          canWakeFromDamage: false,
        },
      ],
    };

    expect(
      checkingWorldPlazaEntityHealthSleepCanWakeFromDamage(state, nowMs)
    ).toBe(false);
  });
});
