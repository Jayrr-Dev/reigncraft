import { advancingWorldPlazaEntityHealthTick } from '@/components/world/health/domains/advancingWorldPlazaEntityHealthTick';
import { computingWorldPlazaEntityHealthDamage } from '@/components/world/health/domains/computingWorldPlazaEntityHealthDamage';
import {
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_INITIAL_STATE,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthConstants';
import {
  addingWorldPlazaEntityHealthIncomingDamageModifier,
  addingWorldPlazaEntityHealthShield,
  creatingWorldPlazaEntityHealthInitialState,
  healingWorldPlazaEntityHealth,
  takingWorldPlazaEntityHealthDamage,
} from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

const COMPUTING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_TEST_OPTIONS = {
  skipDamageRoll: true,
} as const;

describe('computingWorldPlazaEntityHealthDamage', () => {
  it('blocks damage while the invincibility buff is active', () => {
    const nowMs = 10_000;
    const state = {
      ...creatingWorldPlazaEntityHealthInitialState(),
      invincibleUntilMs: nowMs + 100,
    };

    const result = computingWorldPlazaEntityHealthDamage({
      state,
      rawAmount: 20,
      kind: 'physical',
      nowMs,
      options: COMPUTING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_TEST_OPTIONS,
    });

    expect(result.appliedDamage.wasBlocked).toBe(true);
    expect(result.state.currentHealth).toBe(
      DEFINING_WORLD_PLAZA_ENTITY_HEALTH_INITIAL_STATE.currentHealth
    );
  });

  it('absorbs physical damage with shield before health', () => {
    const nowMs = 1_000;
    const state = addingWorldPlazaEntityHealthShield(
      creatingWorldPlazaEntityHealthInitialState(),
      15
    );

    const result = computingWorldPlazaEntityHealthDamage({
      state,
      rawAmount: 20,
      kind: 'physical',
      nowMs,
      options: COMPUTING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_TEST_OPTIONS,
    });

    expect(result.appliedDamage.absorbedByShield).toBe(15);
    expect(result.appliedDamage.healthDamage).toBe(5);
    expect(result.state.shieldPoints).toBe(0);
    expect(result.state.currentHealth).toBe(
      DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX - 5
    );
  });

  it('does not absorb non-physical damage with shield', () => {
    const nowMs = 1_000;
    const state = addingWorldPlazaEntityHealthShield(
      creatingWorldPlazaEntityHealthInitialState(),
      50
    );

    const result = computingWorldPlazaEntityHealthDamage({
      state,
      rawAmount: 20,
      kind: 'toxic',
      nowMs,
      options: COMPUTING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_TEST_OPTIONS,
    });

    expect(result.appliedDamage.absorbedByShield).toBe(0);
    expect(result.appliedDamage.healthDamage).toBe(20);
    expect(result.state.shieldPoints).toBe(50);
    expect(result.state.currentHealth).toBe(
      DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX - 20
    );
  });

  it('converts soulbreak percent to max-health EV and ignores shields', () => {
    const nowMs = 1_000;
    const state = addingWorldPlazaEntityHealthShield(
      creatingWorldPlazaEntityHealthInitialState(),
      50
    );

    const result = computingWorldPlazaEntityHealthDamage({
      state,
      rawAmount: 0.1,
      kind: 'soulbreak',
      nowMs,
      options: COMPUTING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_TEST_OPTIONS,
    });

    const expectedDamage = DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX * 0.1;

    expect(result.appliedDamage.absorbedByShield).toBe(0);
    expect(result.appliedDamage.healthDamage).toBe(expectedDamage);
    expect(result.state.shieldPoints).toBe(50);
    expect(result.state.currentHealth).toBe(
      DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX - expectedDamage
    );
  });

  it('applies stacked incoming damage modifiers and low-health reduction', () => {
    const nowMs = 2_000;
    let state = addingWorldPlazaEntityHealthIncomingDamageModifier(
      creatingWorldPlazaEntityHealthInitialState(),
      {
        id: 'half',
        multiplier: 0.5,
        expiresAtMs: null,
      }
    );
    state = {
      ...state,
      currentHealth: 40,
    };

    const result = computingWorldPlazaEntityHealthDamage({
      state,
      rawAmount: 20,
      kind: 'physical',
      nowMs,
      options: COMPUTING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_TEST_OPTIONS,
    });

    expect(result.appliedDamage.afterModifiers).toBe(7.5);
    expect(result.state.currentHealth).toBe(32.5);
  });

  it('rolls direct physical damage around the expected value', () => {
    const nowMs = 4_000;
    let randomIndex = 0;
    const randomValues = [0.5, 0.5];
    const random = (): number => {
      const value = randomValues[randomIndex] ?? 0.5;
      randomIndex += 1;
      return value;
    };

    const result = computingWorldPlazaEntityHealthDamage({
      state: creatingWorldPlazaEntityHealthInitialState(),
      rawAmount: 100,
      kind: 'physical',
      nowMs,
      options: { random },
    });

    expect(result.appliedDamage.expectedDamage).toBe(100);
    expect(result.appliedDamage.rolledDamage).not.toBeNull();
    expect(result.appliedDamage.tier).not.toBeNull();
    expect(result.appliedDamage.deviationScore).not.toBeNull();
  });
});

describe('advancingWorldPlazaEntityHealthTick', () => {
  it('delays regen until the configured window passes', () => {
    const nowMs = 5_000;
    const damagedState = takingWorldPlazaEntityHealthDamage(
      creatingWorldPlazaEntityHealthInitialState(),
      30,
      'physical',
      nowMs,
      { skipDamageRoll: true }
    );

    const tooSoon = advancingWorldPlazaEntityHealthTick({
      state: damagedState,
      nowMs: nowMs + 1_000,
      deltaMs: 1_000,
    });
    expect(tooSoon.currentHealth).toBe(
      DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX - 30
    );

    const afterDelay = advancingWorldPlazaEntityHealthTick({
      state: damagedState,
      nowMs: nowMs + 6_000,
      deltaMs: 1_000,
    });
    expect(afterDelay.currentHealth).toBeGreaterThan(
      DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX - 30
    );
  });

  it('heals directly when using heal action', () => {
    const nowMs = 1_000;
    const damaged = takingWorldPlazaEntityHealthDamage(
      creatingWorldPlazaEntityHealthInitialState(),
      25,
      'physical',
      nowMs,
      { skipDamageRoll: true }
    );
    const healed = healingWorldPlazaEntityHealth(damaged, 10, nowMs);

    expect(healed.currentHealth).toBe(
      DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX - 15
    );
  });
});
