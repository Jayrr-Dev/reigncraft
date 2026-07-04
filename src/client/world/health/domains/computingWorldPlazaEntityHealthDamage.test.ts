import { advancingWorldPlazaEntityHealthTick } from '@/components/world/health/domains/advancingWorldPlazaEntityHealthTick';
import { computingWorldPlazaEntityHealthDamage } from '@/components/world/health/domains/computingWorldPlazaEntityHealthDamage';
import {
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_INITIAL_STATE,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_INVINCIBILITY_FRAME_MS,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthConstants';
import {
  addingWorldPlazaEntityHealthIncomingDamageModifier,
  addingWorldPlazaEntityHealthShield,
  creatingWorldPlazaEntityHealthInitialState,
  healingWorldPlazaEntityHealth,
  takingWorldPlazaEntityHealthDamage,
} from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaEntityHealthDamage', () => {
  it('blocks damage during invincibility frames', () => {
    const nowMs = 10_000;
    const state = {
      ...creatingWorldPlazaEntityHealthInitialState(),
      invincibilityFrameUntilMs: nowMs + 100,
    };

    const result = computingWorldPlazaEntityHealthDamage({
      state,
      rawAmount: 20,
      kind: 'physical',
      nowMs,
    });

    expect(result.appliedDamage.wasBlocked).toBe(true);
    expect(result.state.currentHealth).toBe(
      DEFINING_WORLD_PLAZA_ENTITY_HEALTH_INITIAL_STATE.currentHealth
    );
  });

  it('absorbs damage with shield before health', () => {
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
    });

    expect(result.appliedDamage.absorbedByShield).toBe(15);
    expect(result.appliedDamage.healthDamage).toBe(5);
    expect(result.state.shieldPoints).toBe(0);
    expect(result.state.currentHealth).toBe(95);
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
    });

    expect(result.appliedDamage.afterModifiers).toBe(7.5);
    expect(result.state.currentHealth).toBe(32.5);
  });

  it('grants invincibility frames after a direct hit', () => {
    const nowMs = 3_000;
    const result = computingWorldPlazaEntityHealthDamage({
      state: creatingWorldPlazaEntityHealthInitialState(),
      rawAmount: 5,
      kind: 'physical',
      nowMs,
    });

    expect(result.state.invincibilityFrameUntilMs).toBe(
      nowMs + DEFINING_WORLD_PLAZA_ENTITY_HEALTH_INVINCIBILITY_FRAME_MS
    );
  });
});

describe('advancingWorldPlazaEntityHealthTick', () => {
  it('delays regen until the configured window passes', () => {
    const nowMs = 5_000;
    const damagedState = takingWorldPlazaEntityHealthDamage(
      creatingWorldPlazaEntityHealthInitialState(),
      30,
      'physical',
      nowMs
    );

    const tooSoon = advancingWorldPlazaEntityHealthTick({
      state: damagedState,
      nowMs: nowMs + 1_000,
      deltaMs: 1_000,
    });
    expect(tooSoon.currentHealth).toBe(70);

    const afterDelay = advancingWorldPlazaEntityHealthTick({
      state: damagedState,
      nowMs: nowMs + 6_000,
      deltaMs: 1_000,
    });
    expect(afterDelay.currentHealth).toBeGreaterThan(70);
  });

  it('heals directly when using heal action', () => {
    const nowMs = 1_000;
    const damaged = takingWorldPlazaEntityHealthDamage(
      creatingWorldPlazaEntityHealthInitialState(),
      25,
      'physical',
      nowMs
    );
    const healed = healingWorldPlazaEntityHealth(damaged, 10, nowMs);

    expect(healed.currentHealth).toBe(85);
  });
});
