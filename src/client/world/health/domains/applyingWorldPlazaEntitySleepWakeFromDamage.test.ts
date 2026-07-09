import { applyingWorldPlazaEntitySleepWakeFromDamage } from '@/components/world/health/domains/applyingWorldPlazaEntitySleepWakeFromDamage';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

describe('applyingWorldPlazaEntitySleepWakeFromDamage', () => {
  it('adds wake bonus damage and removes sleep when damaged while asleep', () => {
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

    const result = applyingWorldPlazaEntitySleepWakeFromDamage({
      state,
      nowMs: 1000,
      rawAmount: 5,
    });

    expect(result.wasAsleep).toBe(true);
    expect(result.wakeBonusDamage).toBe(30);
    expect(result.state.sleepEffects).toHaveLength(0);
  });

  it('does nothing when the player is awake', () => {
    const state = creatingWorldPlazaEntityHealthInitialState();

    const result = applyingWorldPlazaEntitySleepWakeFromDamage({
      state,
      nowMs: 1000,
      rawAmount: 10,
    });

    expect(result.wasAsleep).toBe(false);
    expect(result.wakeBonusDamage).toBe(0);
    expect(result.state).toBe(state);
  });

  it('keeps deep sleep active and skips wake bonus when damaged', () => {
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

    const result = applyingWorldPlazaEntitySleepWakeFromDamage({
      state,
      nowMs: 1000,
      rawAmount: 25,
    });

    expect(result.wasAsleep).toBe(true);
    expect(result.wakeBonusDamage).toBe(0);
    expect(result.state.sleepEffects).toHaveLength(1);
    expect(result.state.sleepEffects[0]?.id).toBe('deep-sleep-debuff');
  });
});
