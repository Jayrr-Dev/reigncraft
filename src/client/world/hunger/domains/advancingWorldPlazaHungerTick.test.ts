import { advancingWorldPlazaHungerTick } from '@/components/world/hunger/domains/advancingWorldPlazaHungerTick';
import { DEFINING_WORLD_PLAZA_HUNGER_INITIAL_STATE } from '@/components/world/hunger/domains/definingWorldPlazaHungerTypes';
import { describe, expect, it } from 'vitest';

describe('advancingWorldPlazaHungerTick', () => {
  it('drains hunger over time while idle', () => {
    const result = advancingWorldPlazaHungerTick({
      state: DEFINING_WORLD_PLAZA_HUNGER_INITIAL_STATE,
      deltaSeconds: 10,
      nowMs: 1_000,
      isWalking: false,
      isSprinting: false,
    });

    expect(result.state.hungerRatio).toBeLessThan(
      DEFINING_WORLD_PLAZA_HUNGER_INITIAL_STATE.hungerRatio
    );
    expect(result.starvationDamagePercentOfMaxHealth).toBe(0);
  });

  it('drains hunger faster while sprinting than walking or idle', () => {
    const idle = advancingWorldPlazaHungerTick({
      state: DEFINING_WORLD_PLAZA_HUNGER_INITIAL_STATE,
      deltaSeconds: 10,
      nowMs: 1_000,
      isWalking: false,
      isSprinting: false,
    });
    const walking = advancingWorldPlazaHungerTick({
      state: DEFINING_WORLD_PLAZA_HUNGER_INITIAL_STATE,
      deltaSeconds: 10,
      nowMs: 1_000,
      isWalking: true,
      isSprinting: false,
    });
    const sprinting = advancingWorldPlazaHungerTick({
      state: DEFINING_WORLD_PLAZA_HUNGER_INITIAL_STATE,
      deltaSeconds: 10,
      nowMs: 1_000,
      isWalking: true,
      isSprinting: true,
    });

    expect(walking.state.hungerRatio).toBeLessThan(idle.state.hungerRatio);
    expect(sprinting.state.hungerRatio).toBeLessThan(walking.state.hungerRatio);
  });

  it('applies the character metabolism multiplier to drain', () => {
    const slowMetabolism = advancingWorldPlazaHungerTick({
      state: DEFINING_WORLD_PLAZA_HUNGER_INITIAL_STATE,
      deltaSeconds: 10,
      nowMs: 1_000,
      isWalking: false,
      isSprinting: false,
      metabolismMultiplier: 0.5,
    });
    const fastMetabolism = advancingWorldPlazaHungerTick({
      state: DEFINING_WORLD_PLAZA_HUNGER_INITIAL_STATE,
      deltaSeconds: 10,
      nowMs: 1_000,
      isWalking: false,
      isSprinting: false,
      metabolismMultiplier: 1.5,
    });

    expect(fastMetabolism.state.hungerRatio).toBeLessThan(
      slowMetabolism.state.hungerRatio
    );
  });

  it('clamps hunger ratio at zero instead of going negative', () => {
    const result = advancingWorldPlazaHungerTick({
      state: { hungerRatio: 0.001, lastStarvationTickAtMs: null },
      deltaSeconds: 9_999,
      nowMs: 1_000,
      isWalking: false,
      isSprinting: false,
    });

    expect(result.state.hungerRatio).toBe(0);
  });

  it('rolls a starvation damage tick once hunger bottoms out', () => {
    const result = advancingWorldPlazaHungerTick({
      state: { hungerRatio: 0, lastStarvationTickAtMs: null },
      deltaSeconds: 1,
      nowMs: 5_000,
      isWalking: false,
      isSprinting: false,
      rollingVariance: () => 0.5,
    });

    expect(result.state.hungerRatio).toBe(0);
    expect(result.state.lastStarvationTickAtMs).toBe(5_000);
    expect(result.starvationDamagePercentOfMaxHealth).toBeGreaterThan(0);
  });

  it('does not roll another starvation tick before the interval elapses', () => {
    const result = advancingWorldPlazaHungerTick({
      state: { hungerRatio: 0, lastStarvationTickAtMs: 5_000 },
      deltaSeconds: 1,
      nowMs: 5_100,
      isWalking: false,
      isSprinting: false,
    });

    expect(result.starvationDamagePercentOfMaxHealth).toBe(0);
    expect(result.state.lastStarvationTickAtMs).toBe(5_000);
  });

  it('rolls a fresh starvation tick once the interval has elapsed again', () => {
    const result = advancingWorldPlazaHungerTick({
      state: { hungerRatio: 0, lastStarvationTickAtMs: 5_000 },
      deltaSeconds: 1,
      nowMs: 10_000,
      isWalking: false,
      isSprinting: false,
      rollingVariance: () => 0,
    });

    expect(result.starvationDamagePercentOfMaxHealth).toBeGreaterThan(0);
    expect(result.state.lastStarvationTickAtMs).toBe(10_000);
  });

  it('resets the starvation tick timer once hunger rises above zero again', () => {
    const result = advancingWorldPlazaHungerTick({
      state: { hungerRatio: 0.5, lastStarvationTickAtMs: 5_000 },
      deltaSeconds: 0.0001,
      nowMs: 5_100,
      isWalking: false,
      isSprinting: false,
    });

    expect(result.state.lastStarvationTickAtMs).toBeNull();
  });
});
