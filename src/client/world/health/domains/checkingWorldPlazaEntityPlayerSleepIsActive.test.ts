import { checkingWorldPlazaEntityPlayerSleepIsActive } from '@/components/world/health/domains/checkingWorldPlazaEntityPlayerSleepIsActive';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

describe('checkingWorldPlazaEntityPlayerSleepIsActive', () => {
  it('returns true while a sleep effect has not expired', () => {
    const state = {
      ...creatingWorldPlazaEntityHealthInitialState(),
      sleepEffects: [
        {
          id: 'sleep-debuff',
          appliedAtMs: 0,
          expiresAtMs: 5000,
          wakeBonusDamage: 30,
        },
      ],
    };

    expect(checkingWorldPlazaEntityPlayerSleepIsActive(state, 1000)).toBe(true);
    expect(checkingWorldPlazaEntityPlayerSleepIsActive(state, 5000)).toBe(false);
  });
});
