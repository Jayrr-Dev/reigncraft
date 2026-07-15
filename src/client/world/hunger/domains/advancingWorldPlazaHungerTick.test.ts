import { COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS } from '@/components/world/domains/computingWorldPlazaInGameDurationMs';
import { advancingWorldPlazaHungerTick } from '@/components/world/hunger/domains/advancingWorldPlazaHungerTick';
import {
  DEFINING_WORLD_PLAZA_HUNGER_DRAIN_STEP_RATIO,
  DEFINING_WORLD_PLAZA_HUNGER_IDLE_DRAIN_PER_SECOND,
  DEFINING_WORLD_PLAZA_HUNGER_STARVATION_MAX_HEALTH_PERCENT_PER_TICK,
  DEFINING_WORLD_PLAZA_HUNGER_STARVATION_VARIANCE_MIN,
} from '@/components/world/hunger/domains/definingWorldPlazaHungerConstants';
import { DEFINING_WORLD_PLAZA_HUNGER_INITIAL_STATE } from '@/components/world/hunger/domains/definingWorldPlazaHungerTypes';
import { describe, expect, it } from 'vitest';

/** Idle seconds needed to accrue one discrete hunger step. */
const IDLE_SECONDS_PER_STEP =
  DEFINING_WORLD_PLAZA_HUNGER_DRAIN_STEP_RATIO /
  DEFINING_WORLD_PLAZA_HUNGER_IDLE_DRAIN_PER_SECOND;

describe('advancingWorldPlazaHungerTick', () => {
  it('accrues pending drain without changing ratio before one step', () => {
    const result = advancingWorldPlazaHungerTick({
      state: DEFINING_WORLD_PLAZA_HUNGER_INITIAL_STATE,
      deltaSeconds: 10,
      nowMs: 1_000,
      isWalking: false,
      isSprinting: false,
    });

    expect(result.state.hungerRatio).toBe(
      DEFINING_WORLD_PLAZA_HUNGER_INITIAL_STATE.hungerRatio
    );
    expect(result.state.pendingDrainRatio).toBeGreaterThan(0);
    expect(result.starvationDamagePercentOfMaxHealth).toBe(0);
  });

  it('drops hunger by one discrete step once enough idle drain accrues', () => {
    const result = advancingWorldPlazaHungerTick({
      state: DEFINING_WORLD_PLAZA_HUNGER_INITIAL_STATE,
      deltaSeconds: IDLE_SECONDS_PER_STEP,
      nowMs: 1_000,
      isWalking: false,
      isSprinting: false,
    });

    expect(result.state.hungerRatio).toBeCloseTo(
      DEFINING_WORLD_PLAZA_HUNGER_INITIAL_STATE.hungerRatio -
        DEFINING_WORLD_PLAZA_HUNGER_DRAIN_STEP_RATIO,
      10
    );
    expect(result.state.pendingDrainRatio).toBeCloseTo(0, 10);
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

    const measuringAccruedDrain = (state: (typeof idle)['state']): number =>
      DEFINING_WORLD_PLAZA_HUNGER_INITIAL_STATE.hungerRatio -
      state.hungerRatio +
      state.pendingDrainRatio;

    expect(measuringAccruedDrain(walking.state)).toBeGreaterThan(
      measuringAccruedDrain(idle.state)
    );
    expect(measuringAccruedDrain(sprinting.state)).toBeGreaterThan(
      measuringAccruedDrain(walking.state)
    );
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

    const measuringAccruedDrain = (
      state: (typeof slowMetabolism)['state']
    ): number =>
      DEFINING_WORLD_PLAZA_HUNGER_INITIAL_STATE.hungerRatio -
      state.hungerRatio +
      state.pendingDrainRatio;

    expect(measuringAccruedDrain(fastMetabolism.state)).toBeGreaterThan(
      measuringAccruedDrain(slowMetabolism.state)
    );
  });

  it('clamps hunger ratio at zero instead of going negative', () => {
    const result = advancingWorldPlazaHungerTick({
      state: {
        hungerRatio: 0.001,
        pendingDrainRatio: 0,
        lastStarvationTickAtMs: null,
        starvingSinceMs: null,
      },
      deltaSeconds: 9_999,
      nowMs: 1_000,
      isWalking: false,
      isSprinting: false,
    });

    expect(result.state.hungerRatio).toBe(0);
  });

  it('rolls a starvation damage tick once hunger bottoms out', () => {
    const result = advancingWorldPlazaHungerTick({
      state: {
        hungerRatio: 0,
        pendingDrainRatio: 0,
        lastStarvationTickAtMs: null,
        starvingSinceMs: null,
      },
      deltaSeconds: 1,
      nowMs: 5_000,
      isWalking: false,
      isSprinting: false,
      rollingVariance: () => 0.5,
    });

    expect(result.state.hungerRatio).toBe(0);
    expect(result.state.lastStarvationTickAtMs).toBe(5_000);
    expect(result.state.starvingSinceMs).toBe(5_000);
    expect(result.starvationDamagePercentOfMaxHealth).toBeGreaterThan(0);
  });

  it('does not roll another starvation tick before the interval elapses', () => {
    const result = advancingWorldPlazaHungerTick({
      state: {
        hungerRatio: 0,
        pendingDrainRatio: 0,
        lastStarvationTickAtMs: 5_000,
        starvingSinceMs: 5_000,
      },
      deltaSeconds: 1,
      nowMs: 5_100,
      isWalking: false,
      isSprinting: false,
    });

    expect(result.starvationDamagePercentOfMaxHealth).toBe(0);
    expect(result.state.lastStarvationTickAtMs).toBe(5_000);
    expect(result.state.starvingSinceMs).toBe(5_000);
  });

  it('rolls a fresh starvation tick once the interval has elapsed again', () => {
    const result = advancingWorldPlazaHungerTick({
      state: {
        hungerRatio: 0,
        pendingDrainRatio: 0,
        lastStarvationTickAtMs: 5_000,
        starvingSinceMs: 5_000,
      },
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
      state: {
        hungerRatio: 0.5,
        pendingDrainRatio: 0,
        lastStarvationTickAtMs: 5_000,
        starvingSinceMs: 5_000,
      },
      deltaSeconds: 0.0001,
      nowMs: 5_100,
      isWalking: false,
      isSprinting: false,
    });

    expect(result.state.lastStarvationTickAtMs).toBeNull();
    expect(result.state.starvingSinceMs).toBeNull();
  });

  it('doubles starvation damage after one in-game hour without eating', () => {
    const starvingSinceMs = 1_000;
    const nowMs = starvingSinceMs + COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS;
    const result = advancingWorldPlazaHungerTick({
      state: {
        hungerRatio: 0,
        pendingDrainRatio: 0,
        lastStarvationTickAtMs: null,
        starvingSinceMs,
      },
      deltaSeconds: 1,
      nowMs,
      isWalking: false,
      isSprinting: false,
      rollingVariance: () => 0,
    });

    expect(result.starvationDamagePercentOfMaxHealth).toBeCloseTo(
      DEFINING_WORLD_PLAZA_HUNGER_STARVATION_MAX_HEALTH_PERCENT_PER_TICK *
        DEFINING_WORLD_PLAZA_HUNGER_STARVATION_VARIANCE_MIN *
        2,
      10
    );
  });

  it('quadruples starvation damage after two in-game hours without eating', () => {
    const starvingSinceMs = 1_000;
    const nowMs = starvingSinceMs + COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS * 2;
    const result = advancingWorldPlazaHungerTick({
      state: {
        hungerRatio: 0,
        pendingDrainRatio: 0,
        lastStarvationTickAtMs: null,
        starvingSinceMs,
      },
      deltaSeconds: 1,
      nowMs,
      isWalking: false,
      isSprinting: false,
      rollingVariance: () => 0,
    });

    expect(result.starvationDamagePercentOfMaxHealth).toBeCloseTo(
      DEFINING_WORLD_PLAZA_HUNGER_STARVATION_MAX_HEALTH_PERCENT_PER_TICK *
        DEFINING_WORLD_PLAZA_HUNGER_STARVATION_VARIANCE_MIN *
        4,
      10
    );
  });
});
