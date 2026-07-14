import { applyingWorldPlazaEntityBuff } from '@/components/world/health/domains/applyingWorldPlazaEntityBuff';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { expiringWorldPlazaEntityHealthTimedEffects } from '@/components/world/health/domains/expiringWorldPlazaEntityHealthTimedEffects';
import { describe, expect, it } from 'vitest';

describe('expiringWorldPlazaEntityHealthTimedEffects coffee crash', () => {
  it('applies coffee crash when coffee buzz expires', () => {
    const nowMs = 1_000;
    const withBuzz = applyingWorldPlazaEntityBuff(
      creatingWorldPlazaEntityHealthInitialState(),
      'coffee-buzz-buff',
      nowMs
    );

    expect(
      withBuzz.movementModifiers.some(
        (modifier) => modifier.id === 'coffee-buzz-buff'
      )
    ).toBe(true);

    const afterExpire = expiringWorldPlazaEntityHealthTimedEffects(
      withBuzz,
      nowMs + 120_000
    );

    expect(
      afterExpire.movementModifiers.some(
        (modifier) => modifier.id === 'coffee-buzz-buff'
      )
    ).toBe(false);
    expect(
      afterExpire.movementModifiers.some(
        (modifier) =>
          modifier.id === 'coffee-crash-debuff' &&
          modifier.multiplier === 0.75 &&
          modifier.expiresAtMs === nowMs + 120_000 + 60_000
      )
    ).toBe(true);
  });

  it('applies cherry crash when cherry buzz expires', () => {
    const nowMs = 500;
    const withBuzz = applyingWorldPlazaEntityBuff(
      creatingWorldPlazaEntityHealthInitialState(),
      'coffee-cherry-buzz-buff',
      nowMs
    );

    const afterExpire = expiringWorldPlazaEntityHealthTimedEffects(
      withBuzz,
      nowMs + 45_000
    );

    expect(
      afterExpire.movementModifiers.some(
        (modifier) =>
          modifier.id === 'coffee-cherry-crash-debuff' &&
          modifier.multiplier === 0.9
      )
    ).toBe(true);
  });

  it('does not crash when buzz is refreshed before expiry', () => {
    const nowMs = 1_000;
    const withBuzz = applyingWorldPlazaEntityBuff(
      creatingWorldPlazaEntityHealthInitialState(),
      'coffee-buzz-buff',
      nowMs
    );
    const refreshed = applyingWorldPlazaEntityBuff(
      withBuzz,
      'coffee-buzz-buff',
      nowMs + 60_000
    );

    expect(
      refreshed.movementModifiers.some(
        (modifier) => modifier.id === 'coffee-crash-debuff'
      )
    ).toBe(false);
    expect(
      refreshed.movementModifiers.some(
        (modifier) =>
          modifier.id === 'coffee-buzz-buff' &&
          modifier.expiresAtMs === nowMs + 60_000 + 120_000
      )
    ).toBe(true);
  });
});
