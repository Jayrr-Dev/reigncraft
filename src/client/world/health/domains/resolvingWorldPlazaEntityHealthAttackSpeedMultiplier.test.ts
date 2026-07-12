import { applyingWorldPlazaEntityBuff } from '@/components/world/health/domains/applyingWorldPlazaEntityBuff';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { resolvingWorldPlazaEntityHealthAttackSpeedMultiplier } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthAttackSpeedMultiplier';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaEntityHealthAttackSpeedMultiplier', () => {
  it('returns 1 with no attack-speed modifiers', () => {
    const state = creatingWorldPlazaEntityHealthInitialState();

    expect(resolvingWorldPlazaEntityHealthAttackSpeedMultiplier(state, 0)).toBe(
      1
    );
  });

  it('stacks active attack-speed buffs', () => {
    const nowMs = 1_000;
    let state = creatingWorldPlazaEntityHealthInitialState();
    state = applyingWorldPlazaEntityBuff(state, 'quick-strikes-buff', nowMs);
    state = applyingWorldPlazaEntityBuff(state, 'bloodlust-buff', nowMs);

    expect(
      resolvingWorldPlazaEntityHealthAttackSpeedMultiplier(state, nowMs)
    ).toBeCloseTo(1.25 * 1.5, 5);
  });

  it('ignores expired attack-speed modifiers', () => {
    const appliedAtMs = 1_000;
    let state = creatingWorldPlazaEntityHealthInitialState();
    state = applyingWorldPlazaEntityBuff(
      state,
      'quick-strikes-buff',
      appliedAtMs
    );

    expect(
      resolvingWorldPlazaEntityHealthAttackSpeedMultiplier(state, appliedAtMs)
    ).toBeCloseTo(1.25, 5);
    expect(
      resolvingWorldPlazaEntityHealthAttackSpeedMultiplier(
        state,
        appliedAtMs + 60_001
      )
    ).toBe(1);
  });
});
