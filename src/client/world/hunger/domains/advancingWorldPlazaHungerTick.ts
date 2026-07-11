/**
 * Pure hunger advancement: drains hunger by activity, and rolls starvation
 * damage ticks once hunger bottoms out.
 *
 * @module components/world/hunger/domains/advancingWorldPlazaHungerTick
 */

import {
  DEFINING_WORLD_PLAZA_HUNGER_DRAIN_STEP_RATIO,
  DEFINING_WORLD_PLAZA_HUNGER_IDLE_DRAIN_PER_SECOND,
  DEFINING_WORLD_PLAZA_HUNGER_SPRINT_DRAIN_MULTIPLIER,
  DEFINING_WORLD_PLAZA_HUNGER_STARVATION_MAX_HEALTH_PERCENT_PER_TICK,
  DEFINING_WORLD_PLAZA_HUNGER_STARVATION_TICK_INTERVAL_MS,
  DEFINING_WORLD_PLAZA_HUNGER_STARVATION_VARIANCE_MAX,
  DEFINING_WORLD_PLAZA_HUNGER_STARVATION_VARIANCE_MIN,
  DEFINING_WORLD_PLAZA_HUNGER_WALK_DRAIN_MULTIPLIER,
} from '@/components/world/hunger/domains/definingWorldPlazaHungerConstants';
import type { DefiningWorldPlazaHungerState } from '@/components/world/hunger/domains/definingWorldPlazaHungerTypes';

export type AdvancingWorldPlazaHungerTickParams = {
  /** Hunger state from the previous frame. */
  state: DefiningWorldPlazaHungerState;
  /** Elapsed time since the previous frame (seconds). */
  deltaSeconds: number;
  /** Wall-clock ms for starvation tick gating. */
  nowMs: number;
  /** True while the avatar is moving (walking or running). */
  isWalking: boolean;
  /** True while the avatar is actively sprinting/running. */
  isSprinting: boolean;
  /** Per-character metabolism multiplier from the avatar definition (1 = baseline). */
  metabolismMultiplier?: number;
  /** Randomness source for starvation tick variance; overridable for tests. */
  rollingVariance?: () => number;
};

export type AdvancingWorldPlazaHungerTickResult = {
  /** Next hunger state. */
  state: DefiningWorldPlazaHungerState;
  /**
   * Starvation damage rolled this frame, expressed as a percentage of
   * effective max health (0 when no starvation tick landed this frame).
   */
  starvationDamagePercentOfMaxHealth: number;
};

function clampingHungerRatio(ratio: number): number {
  if (ratio < 0) {
    return 0;
  }

  if (ratio > 1) {
    return 1;
  }

  return ratio;
}

/**
 * Resolves the activity drain multiplier for the current frame's movement state.
 *
 * @param isWalking - True while moving.
 * @param isSprinting - True while sprinting.
 */
function resolvingActivityDrainMultiplier(
  isWalking: boolean,
  isSprinting: boolean
): number {
  if (isSprinting) {
    return DEFINING_WORLD_PLAZA_HUNGER_SPRINT_DRAIN_MULTIPLIER;
  }

  if (isWalking) {
    return DEFINING_WORLD_PLAZA_HUNGER_WALK_DRAIN_MULTIPLIER;
  }

  return 1;
}

/**
 * Advances hunger by one frame: accrues activity/metabolism drain, applies
 * discrete step drops when enough has accrued, then rolls a starvation damage
 * tick once hunger hits zero.
 *
 * @param params - Previous state, frame delta, and activity/metabolism inputs.
 */
export function advancingWorldPlazaHungerTick({
  state,
  deltaSeconds,
  nowMs,
  isWalking,
  isSprinting,
  metabolismMultiplier = 1,
  rollingVariance = Math.random,
}: AdvancingWorldPlazaHungerTickParams): AdvancingWorldPlazaHungerTickResult {
  const activityMultiplier = resolvingActivityDrainMultiplier(
    isWalking,
    isSprinting
  );
  const accruedDrain =
    state.pendingDrainRatio +
    DEFINING_WORLD_PLAZA_HUNGER_IDLE_DRAIN_PER_SECOND *
      activityMultiplier *
      metabolismMultiplier *
      deltaSeconds;
  const stepCount = Math.floor(
    accruedDrain / DEFINING_WORLD_PLAZA_HUNGER_DRAIN_STEP_RATIO
  );
  const pendingDrainRatio =
    accruedDrain - stepCount * DEFINING_WORLD_PLAZA_HUNGER_DRAIN_STEP_RATIO;
  const nextRatio = clampingHungerRatio(
    state.hungerRatio - stepCount * DEFINING_WORLD_PLAZA_HUNGER_DRAIN_STEP_RATIO
  );

  const isStarving = nextRatio <= 0;

  if (!isStarving) {
    return {
      state: {
        hungerRatio: nextRatio,
        pendingDrainRatio,
        lastStarvationTickAtMs: null,
      },
      starvationDamagePercentOfMaxHealth: 0,
    };
  }

  const lastTickAtMs = state.lastStarvationTickAtMs;

  if (
    lastTickAtMs !== null &&
    nowMs - lastTickAtMs <
      DEFINING_WORLD_PLAZA_HUNGER_STARVATION_TICK_INTERVAL_MS
  ) {
    return {
      state: {
        hungerRatio: 0,
        pendingDrainRatio: 0,
        lastStarvationTickAtMs: lastTickAtMs,
      },
      starvationDamagePercentOfMaxHealth: 0,
    };
  }

  const varianceRoll = Math.min(1, Math.max(0, rollingVariance()));
  const varianceMultiplier =
    DEFINING_WORLD_PLAZA_HUNGER_STARVATION_VARIANCE_MIN +
    varianceRoll *
      (DEFINING_WORLD_PLAZA_HUNGER_STARVATION_VARIANCE_MAX -
        DEFINING_WORLD_PLAZA_HUNGER_STARVATION_VARIANCE_MIN);

  return {
    state: {
      hungerRatio: 0,
      pendingDrainRatio: 0,
      lastStarvationTickAtMs: nowMs,
    },
    starvationDamagePercentOfMaxHealth:
      DEFINING_WORLD_PLAZA_HUNGER_STARVATION_MAX_HEALTH_PERCENT_PER_TICK *
      varianceMultiplier,
  };
}
