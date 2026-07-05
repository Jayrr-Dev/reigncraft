import { applyingWorldPlazaEntityHealthPoisonStack } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthPoisonStack';
import { resolvingWorldPlazaEntityPoisonPotencyDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityPoisonPotencyRegistry';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

describe('applyingWorldPlazaEntityHealthPoisonStack', () => {
  it('stacks poison damage and increments stack count on the same potency', () => {
    const nowMs = 0;
    let state = creatingWorldPlazaEntityHealthInitialState();

    state = applyingWorldPlazaEntityHealthPoisonStack(
      state,
      'toxic',
      25,
      nowMs
    );
    state = applyingWorldPlazaEntityHealthPoisonStack(
      state,
      'toxic',
      15,
      nowMs + 1
    );

    expect(state.poisonEffects).toHaveLength(1);
    expect(state.poisonEffects[0]?.potency).toBe('toxic');
    expect(state.poisonEffects[0]?.stackCount).toBe(2);
    expect(state.poisonEffects[0]?.remainingPoisonDamage).toBe(40);
    expect(state.lastDamageKind).toBe('toxic');
  });

  it('keeps stacking on the same potency without escalating', () => {
    const nowMs = 0;
    let state = creatingWorldPlazaEntityHealthInitialState();

    for (let stackIndex = 0; stackIndex < 10; stackIndex += 1) {
      state = applyingWorldPlazaEntityHealthPoisonStack(
        state,
        'toxic',
        10,
        nowMs + stackIndex
      );
    }

    expect(state.poisonEffects).toHaveLength(1);
    expect(state.poisonEffects[0]?.potency).toBe('toxic');
    expect(state.poisonEffects[0]?.stackCount).toBe(10);
    expect(state.poisonEffects[0]?.remainingPoisonDamage).toBe(100);
  });

  it('tracks separate additive pools per potency tier', () => {
    const nowMs = 0;
    let state = creatingWorldPlazaEntityHealthInitialState();

    state = applyingWorldPlazaEntityHealthPoisonStack(
      state,
      'toxic',
      20,
      nowMs
    );
    state = applyingWorldPlazaEntityHealthPoisonStack(
      state,
      'venomous',
      30,
      nowMs + 1
    );

    expect(state.poisonEffects).toHaveLength(2);
    expect(state.poisonEffects.map((effect) => effect.potency).sort()).toEqual([
      'toxic',
      'venomous',
    ]);
  });

  it('applies a minimum of 1 damage when stacking poison', () => {
    const nowMs = 0;
    let state = creatingWorldPlazaEntityHealthInitialState();

    state = applyingWorldPlazaEntityHealthPoisonStack(
      state,
      'toxic',
      0.2,
      nowMs
    );

    expect(state.poisonEffects[0]?.remainingPoisonDamage).toBe(1);
    expect(state.poisonEffects[0]?.totalPoisonDamage).toBe(1);
  });

  it('refreshes duration when stacking poison', () => {
    const nowMs = 0;
    let state = creatingWorldPlazaEntityHealthInitialState();
    const toxicDurationMs =
      resolvingWorldPlazaEntityPoisonPotencyDescriptor('toxic').durationMs;

    state = applyingWorldPlazaEntityHealthPoisonStack(
      state,
      'toxic',
      20,
      nowMs
    );
    state = applyingWorldPlazaEntityHealthPoisonStack(
      state,
      'toxic',
      10,
      nowMs + toxicDurationMs - 1_000
    );

    expect(state.poisonEffects[0]?.expiresAtMs).toBe(
      nowMs + toxicDurationMs - 1_000 + toxicDurationMs
    );
  });
});
