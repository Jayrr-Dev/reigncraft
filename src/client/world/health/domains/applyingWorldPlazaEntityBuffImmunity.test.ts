import { applyingWorldPlazaEntityBuff } from '@/components/world/health/domains/applyingWorldPlazaEntityBuff';
import { applyingWorldPlazaEntityHealthBleedStack } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthBleedStack';
import { applyingWorldPlazaEntityHealthPoisonStack } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthPoisonStack';
import { applyingWorldPlazaEntityHealthPotentialDamage } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthPotentialDamage';
import { checkingWorldPlazaEntityBuffIsActive } from '@/components/world/health/domains/checkingWorldPlazaEntityBuffIsActive';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

describe('immunity buffs', () => {
  it('toggles poison immunity and blocks new poison stacks', () => {
    const nowMs = 1_000;
    let state = creatingWorldPlazaEntityHealthInitialState();

    state = applyingWorldPlazaEntityBuff(state, 'poison-immunity-buff', nowMs);

    expect(
      checkingWorldPlazaEntityBuffIsActive({
        buffId: 'poison-immunity-buff',
        state,
        nowMs,
        defenderModifierIds: [],
        attackerModifierIds: [],
      })
    ).toBe(true);

    const afterPoison = applyingWorldPlazaEntityHealthPoisonStack(
      state,
      'toxic',
      50,
      nowMs
    );

    expect(afterPoison.poisonEffects).toHaveLength(0);
  });

  it('toggles bleed immunity and blocks new bleed stacks', () => {
    const nowMs = 1_000;
    let state = creatingWorldPlazaEntityHealthInitialState();

    state = applyingWorldPlazaEntityBuff(state, 'bleed-immunity-buff', nowMs);

    const afterBleed = applyingWorldPlazaEntityHealthBleedStack(
      state,
      'bleeding',
      50,
      nowMs
    );

    expect(afterBleed.bleedEffects).toHaveLength(0);
  });

  it('toggles fated immunity and blocks new fated marks', () => {
    const nowMs = 1_000;
    let state = creatingWorldPlazaEntityHealthInitialState();

    state = applyingWorldPlazaEntityBuff(state, 'fated-immunity-buff', nowMs);

    const afterFated = applyingWorldPlazaEntityHealthPotentialDamage({
      state,
      pendingExpectedDamage: 40,
      resolveDelayMs: 5_000,
      nowMs,
    });

    expect(afterFated.potentialDamageEffects).toHaveLength(0);
  });

  it('toggles death immunity and clears death state at the floor', () => {
    const nowMs = 1_000;
    let state = {
      ...creatingWorldPlazaEntityHealthInitialState(),
      currentHealth: 0,
      isDead: true,
    };

    state = applyingWorldPlazaEntityBuff(state, 'death-immunity-buff', nowMs);

    expect(state.isDeathImmune).toBe(true);
    expect(state.currentHealth).toBe(1);
    expect(state.isDead).toBe(false);
  });
});
