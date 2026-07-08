import {
  checkingWorldPlazaEntityPlayerStunIsActive,
  resolvingWorldPlazaEntityHealthActiveStunEffect,
} from '@/components/world/health/domains/checkingWorldPlazaEntityPlayerStunIsActive';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

describe('checkingWorldPlazaEntityPlayerStunIsActive', () => {
  it('returns false when no stun effects are active', () => {
    const state = {
      ...creatingWorldPlazaEntityHealthInitialState(),
      stunEffects: [
        {
          id: 'stun-debuff',
          appliedAtMs: 0,
          expiresAtMs: 1000,
          phaseSeed: 0.5,
        },
      ],
    };

    expect(checkingWorldPlazaEntityPlayerStunIsActive(state, 1500)).toBe(false);
    expect(checkingWorldPlazaEntityPlayerStunIsActive(null, 500)).toBe(false);
  });

  it('returns the active effect with the latest expiry', () => {
    const state = {
      ...creatingWorldPlazaEntityHealthInitialState(),
      stunEffects: [
        {
          id: 'stun-debuff',
          appliedAtMs: 0,
          expiresAtMs: 2000,
          phaseSeed: 0.25,
        },
        {
          id: 'stun-debuff',
          appliedAtMs: 500,
          expiresAtMs: 5000,
          phaseSeed: 0.75,
        },
      ],
    };

    expect(checkingWorldPlazaEntityPlayerStunIsActive(state, 1000)).toBe(true);
    expect(
      resolvingWorldPlazaEntityHealthActiveStunEffect(state, 1000)?.phaseSeed
    ).toBe(0.75);
  });
});
