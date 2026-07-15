import { applyingWorldPlazaEntityHealthPotentialDamage } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthPotentialDamage';
import { clearingWorldPlazaEntityPotentialDamageEffects } from '@/components/world/health/domains/clearingWorldPlazaEntityPotentialDamageEffects';
import {
  DEFINING_WORLD_PLAZA_ENTITY_FATED_IMMUNITY_DAMAGE_KINDS,
  checkingWorldPlazaEntityDamageKindImmunityGroupIsActive,
} from '@/components/world/health/domains/definingWorldPlazaEntityBuffImmunityDamageKinds';
import { enablingWorldPlazaEntityFatedImmunity } from '@/components/world/health/domains/enablingWorldPlazaEntityFatedImmunity';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { postponingWorldPlazaEntityPotentialDamageEffects } from '@/components/world/health/domains/postponingWorldPlazaEntityPotentialDamageEffects';
import { describe, expect, it } from 'vitest';

describe('fated damage healer helpers', () => {
  it('clears pending fated marks', () => {
    const nowMs = 1_000;
    let state = applyingWorldPlazaEntityHealthPotentialDamage({
      state: creatingWorldPlazaEntityHealthInitialState(),
      pendingExpectedDamage: 40,
      resolveDelayMs: 5_000,
      nowMs,
    });

    expect(state.potentialDamageEffects).toHaveLength(1);
    state = clearingWorldPlazaEntityPotentialDamageEffects(state);
    expect(state.potentialDamageEffects).toHaveLength(0);
  });

  it('delays and softens pending fated marks', () => {
    const nowMs = 1_000;
    let state = applyingWorldPlazaEntityHealthPotentialDamage({
      state: creatingWorldPlazaEntityHealthInitialState(),
      pendingExpectedDamage: 80,
      resolveDelayMs: 5_000,
      nowMs,
    });

    state = postponingWorldPlazaEntityPotentialDamageEffects(state, {
      extraDelayMs: 45_000,
      pendingDamageFactor: 0.5,
      nowMs,
    });

    expect(state.potentialDamageEffects[0]?.pendingExpectedDamage).toBe(40);
    expect(state.potentialDamageEffects[0]?.resolvesAtMs).toBe(51_000);
  });

  it('enables fated immunity without toggling off', () => {
    const nowMs = 1_000;
    let state = applyingWorldPlazaEntityHealthPotentialDamage({
      state: creatingWorldPlazaEntityHealthInitialState(),
      pendingExpectedDamage: 40,
      resolveDelayMs: 5_000,
      nowMs,
    });

    state = enablingWorldPlazaEntityFatedImmunity(state);
    expect(state.potentialDamageEffects).toHaveLength(0);
    expect(
      checkingWorldPlazaEntityDamageKindImmunityGroupIsActive(
        state.damageKindImmunities,
        DEFINING_WORLD_PLAZA_ENTITY_FATED_IMMUNITY_DAMAGE_KINDS
      )
    ).toBe(true);

    const stillImmune = enablingWorldPlazaEntityFatedImmunity(state);
    expect(
      checkingWorldPlazaEntityDamageKindImmunityGroupIsActive(
        stillImmune.damageKindImmunities,
        DEFINING_WORLD_PLAZA_ENTITY_FATED_IMMUNITY_DAMAGE_KINDS
      )
    ).toBe(true);
  });
});
