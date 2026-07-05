import { applyingWorldPlazaEntityHealthPotentialDamage } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthPotentialDamage';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { resolvingWorldPlazaEntityHealthPotentialDamage } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthPotentialDamage';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaEntityHealthPotentialDamage', () => {
  it('rolls and applies pending EV damage when the timer elapses', () => {
    const nowMs = 0;
    const pendingState = applyingWorldPlazaEntityHealthPotentialDamage({
      state: creatingWorldPlazaEntityHealthInitialState(),
      pendingExpectedDamage: 25,
      resolveDelayMs: 5_000,
      nowMs,
    });

    const resolvedState = resolvingWorldPlazaEntityHealthPotentialDamage(
      pendingState,
      5_000
    );

    expect(resolvedState.potentialDamageEffects).toHaveLength(0);
    expect(resolvedState.currentHealth).toBeLessThan(1000);
    expect(resolvedState.lastDamageKind).toBe('potential_damage');
  });

  it('does not resolve before the timer expires', () => {
    const nowMs = 0;
    const pendingState = applyingWorldPlazaEntityHealthPotentialDamage({
      state: creatingWorldPlazaEntityHealthInitialState(),
      pendingExpectedDamage: 25,
      resolveDelayMs: 5_000,
      nowMs,
    });

    const unchangedState = resolvingWorldPlazaEntityHealthPotentialDamage(
      pendingState,
      4_999
    );

    expect(unchangedState.potentialDamageEffects).toHaveLength(1);
    expect(unchangedState.currentHealth).toBe(1000);
  });

  it('resolves multiple due effects in order', () => {
    const nowMs = 0;
    let state = creatingWorldPlazaEntityHealthInitialState();

    state = applyingWorldPlazaEntityHealthPotentialDamage({
      state,
      pendingExpectedDamage: 10,
      resolveDelayMs: 2_000,
      nowMs,
    });
    state = applyingWorldPlazaEntityHealthPotentialDamage({
      state,
      pendingExpectedDamage: 15,
      resolveDelayMs: 2_000,
      nowMs,
    });

    const resolvedState = resolvingWorldPlazaEntityHealthPotentialDamage(
      state,
      2_000
    );

    expect(resolvedState.potentialDamageEffects).toHaveLength(0);
    expect(resolvedState.currentHealth).toBeLessThan(985);
  });
});
