import { computingWorldPlazaEntityHealthDamage } from '@/components/world/health/domains/computingWorldPlazaEntityHealthDamage';
import {
  computingWorldPlazaEntityHealthDamageToHeal,
  computingWorldPlazaEntityHealthPhysicalDamageToHealBasis,
} from '@/components/world/health/domains/computingWorldPlazaEntityHealthDamageToHeal';
import { DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_TO_HEAL_DEFAULT_RATIO } from '@/components/world/health/domains/definingWorldPlazaEntityDamageToHealConstants';
import {
  addingWorldPlazaEntityHealthIncomingDamageHealModifier,
  addingWorldPlazaEntityHealthPhysicalDamageLifestealModifier,
  creatingWorldPlazaEntityHealthInitialState,
  healingWorldPlazaEntityHealth,
} from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaEntityHealthDamageToHeal', () => {
  it('heals 25% of physical damage dealt when Siphoning is active', () => {
    const nowMs = 0;
    const state = addingWorldPlazaEntityHealthPhysicalDamageLifestealModifier(
      creatingWorldPlazaEntityHealthInitialState(),
      {
        id: 'siphoning-buff',
        ratio: DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_TO_HEAL_DEFAULT_RATIO,
        expiresAtMs: null,
      }
    );

    const damageResult = computingWorldPlazaEntityHealthDamage({
      state,
      rawAmount: 100,
      kind: 'physical',
      nowMs,
    });
    const damageBasis =
      computingWorldPlazaEntityHealthPhysicalDamageToHealBasis(
        damageResult.appliedDamage
      );
    const damageToHeal = computingWorldPlazaEntityHealthDamageToHeal({
      appliedDamage: damageResult.appliedDamage,
      physicalDamageLifestealModifiers: state.physicalDamageLifestealModifiers,
      incomingDamageHealModifiers: state.incomingDamageHealModifiers,
      nowMs,
    });

    expect(damageToHeal.siphonHealAmount).toBe(
      damageBasis * DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_TO_HEAL_DEFAULT_RATIO
    );
    expect(damageToHeal.absorbHealAmount).toBe(0);
  });

  it('heals 25% of physical damage received when Absorb is active', () => {
    const nowMs = 0;
    const state = addingWorldPlazaEntityHealthIncomingDamageHealModifier(
      creatingWorldPlazaEntityHealthInitialState(),
      {
        id: 'absorb-buff',
        ratio: DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_TO_HEAL_DEFAULT_RATIO,
        expiresAtMs: null,
      }
    );

    const damageResult = computingWorldPlazaEntityHealthDamage({
      state,
      rawAmount: 80,
      kind: 'physical',
      nowMs,
    });
    const damageToHeal = computingWorldPlazaEntityHealthDamageToHeal({
      appliedDamage: damageResult.appliedDamage,
      physicalDamageLifestealModifiers: state.physicalDamageLifestealModifiers,
      incomingDamageHealModifiers: state.incomingDamageHealModifiers,
      nowMs,
    });

    expect(damageToHeal.siphonHealAmount).toBe(0);
    expect(damageToHeal.absorbHealAmount).toBeGreaterThan(0);
  });

  it('stacks Siphoning and Absorb healing on the same physical hit', () => {
    const nowMs = 0;
    let state = addingWorldPlazaEntityHealthPhysicalDamageLifestealModifier(
      creatingWorldPlazaEntityHealthInitialState(),
      {
        id: 'siphoning-buff',
        ratio: DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_TO_HEAL_DEFAULT_RATIO,
        expiresAtMs: null,
      }
    );
    state = addingWorldPlazaEntityHealthIncomingDamageHealModifier(state, {
      id: 'absorb-buff',
      ratio: DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_TO_HEAL_DEFAULT_RATIO,
      expiresAtMs: null,
    });

    const damageResult = computingWorldPlazaEntityHealthDamage({
      state,
      rawAmount: 100,
      kind: 'physical',
      nowMs,
    });
    const damageToHeal = computingWorldPlazaEntityHealthDamageToHeal({
      appliedDamage: damageResult.appliedDamage,
      physicalDamageLifestealModifiers: state.physicalDamageLifestealModifiers,
      incomingDamageHealModifiers: state.incomingDamageHealModifiers,
      nowMs,
    });

    expect(damageToHeal.totalHealAmount).toBe(
      damageToHeal.siphonHealAmount + damageToHeal.absorbHealAmount
    );
    expect(damageToHeal.totalHealAmount).toBeGreaterThan(
      damageToHeal.siphonHealAmount
    );

    const healed = healingWorldPlazaEntityHealth(
      damageResult.state,
      damageToHeal.totalHealAmount,
      nowMs
    );

    expect(healed.currentHealth).toBeGreaterThan(
      damageResult.state.currentHealth
    );
  });
});
