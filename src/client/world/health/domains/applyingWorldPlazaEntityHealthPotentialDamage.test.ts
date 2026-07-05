import { applyingWorldPlazaEntityHealthPotentialDamage } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthPotentialDamage';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

describe('applyingWorldPlazaEntityHealthPotentialDamage', () => {
  it('arms delayed damage with a fuse timer', () => {
    const nowMs = 1_000;
    const state = creatingWorldPlazaEntityHealthInitialState();

    const nextState = applyingWorldPlazaEntityHealthPotentialDamage({
      state,
      pendingDamage: 25,
      fuseDurationMs: 5_000,
      nowMs,
    });

    expect(nextState.potentialDamageEffects).toHaveLength(1);
    expect(nextState.potentialDamageEffects[0]?.pendingDamage).toBe(25);
    expect(nextState.potentialDamageEffects[0]?.appliedAtMs).toBe(nowMs);
    expect(nextState.potentialDamageEffects[0]?.detonatesAtMs).toBe(6_000);
    expect(nextState.lastDamageKind).toBe('potential_damage');
  });

  it('stacks multiple armed effects independently', () => {
    const nowMs = 0;
    let state = creatingWorldPlazaEntityHealthInitialState();

    state = applyingWorldPlazaEntityHealthPotentialDamage({
      state,
      pendingDamage: 10,
      fuseDurationMs: 2_000,
      nowMs,
    });
    state = applyingWorldPlazaEntityHealthPotentialDamage({
      state,
      pendingDamage: 30,
      fuseDurationMs: 4_000,
      nowMs: nowMs + 1,
    });

    expect(state.potentialDamageEffects).toHaveLength(2);
  });

  it('ignores zero damage or zero fuse', () => {
    const state = creatingWorldPlazaEntityHealthInitialState();

    expect(
      applyingWorldPlazaEntityHealthPotentialDamage({
        state,
        pendingDamage: 0,
        fuseDurationMs: 5_000,
        nowMs: 0,
      }).potentialDamageEffects
    ).toHaveLength(0);

    expect(
      applyingWorldPlazaEntityHealthPotentialDamage({
        state,
        pendingDamage: 25,
        fuseDurationMs: 0,
        nowMs: 0,
      }).potentialDamageEffects
    ).toHaveLength(0);
  });
});
