/**
 * Pure shared stamina drain / regen / run-lock latch.
 *
 * Host wrappers (player fatigue, wildlife species multipliers) resolve rates
 * and exit thresholds, then call this when opt-in is enabled.
 *
 * @module components/world/stamina/domains/advancingStaminaCoreTick
 */

import type {
  AdvancingStaminaCoreTickResult,
  DefiningStaminaCoreState,
  DefiningStaminaCoreTickConfig,
} from '@/components/world/stamina/domains/definingStaminaCoreTypes';

function clampingStaminaCoreRatio(
  ratio: number,
  maxStaminaRatio: number
): number {
  if (ratio < 0) {
    return 0;
  }

  if (ratio > maxStaminaRatio) {
    return maxStaminaRatio;
  }

  return ratio;
}

export type AdvancingStaminaCoreTickParams = {
  state: DefiningStaminaCoreState;
  wantsToRun: boolean;
  deltaSeconds: number;
  config: DefiningStaminaCoreTickConfig;
};

/**
 * Advances one stamina frame: drain while running, regen otherwise, latch
 * run-lock at zero until ratio reaches `runLockedExitRatio`.
 */
export function advancingStaminaCoreTick({
  state,
  wantsToRun,
  deltaSeconds,
  config,
}: AdvancingStaminaCoreTickParams): AdvancingStaminaCoreTickResult {
  const isRunning =
    wantsToRun && !state.isRunLocked && state.staminaRatio > 0;
  const nextRatio = clampingStaminaCoreRatio(
    state.staminaRatio +
      (isRunning ? -config.drainPerSecond : config.regenPerSecond) *
        deltaSeconds,
    config.maxStaminaRatio
  );
  const nextRunLocked = state.isRunLocked
    ? nextRatio < config.runLockedExitRatio
    : nextRatio <= 0;

  return {
    state: {
      staminaRatio: nextRatio,
      isRunLocked: nextRunLocked,
    },
    isRunning,
  };
}
