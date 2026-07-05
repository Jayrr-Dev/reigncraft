import { applyingWorldPlazaEntityHealthPotentialDamage } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthPotentialDamage';
import { detonatingWorldPlazaEntityHealthPotentialDamage } from '@/components/world/health/domains/detonatingWorldPlazaEntityHealthPotentialDamage';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

describe('detonatingWorldPlazaEntityHealthPotentialDamage', () => {
  it('applies pending damage when the fuse elapses', () => {
    const nowMs = 0;
    const armedState = applyingWorldPlazaEntityHealthPotentialDamage({
      state: creatingWorldPlazaEntityHealthInitialState(),
      pendingDamage: 25,
      fuseDurationMs: 5_000,
      nowMs,
    });

    const detonatedState = detonatingWorldPlazaEntityHealthPotentialDamage(
      armedState,
      5_000
    );

    expect(detonatedState.potentialDamageEffects).toHaveLength(0);
    expect(detonatedState.currentHealth).toBe(75);
    expect(detonatedState.lastDamageKind).toBe('potential_damage');
  });

  it('does not detonate before the fuse expires', () => {
    const nowMs = 0;
    const armedState = applyingWorldPlazaEntityHealthPotentialDamage({
      state: creatingWorldPlazaEntityHealthInitialState(),
      pendingDamage: 25,
      fuseDurationMs: 5_000,
      nowMs,
    });

    const unchangedState = detonatingWorldPlazaEntityHealthPotentialDamage(
      armedState,
      4_999
    );

    expect(unchangedState.potentialDamageEffects).toHaveLength(1);
    expect(unchangedState.currentHealth).toBe(100);
  });

  it('detonates multiple due effects in order', () => {
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
      pendingDamage: 15,
      fuseDurationMs: 2_000,
      nowMs: nowMs + 1,
    });

    const detonatedState = detonatingWorldPlazaEntityHealthPotentialDamage(
      state,
      2_000
    );

    expect(detonatedState.potentialDamageEffects).toHaveLength(0);
    expect(detonatedState.currentHealth).toBe(75);
  });
});
