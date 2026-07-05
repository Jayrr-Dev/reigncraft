/**
 * Stamina cost for plaza jump actions.
 *
 * @module components/world/domains/consumingWorldPlazaJumpStamina
 */

import {
  DEFINING_WORLD_PLAZA_JUMP_STAMINA_COST_RATIO,
  DEFINING_WORLD_PLAZA_RUN_JUMP_STAMINA_COST_RATIO,
  DEFINING_WORLD_PLAZA_RUN_STAMINA_DEPLETION_REGEN_DELAY_MS,
  type DefiningWorldPlazaRunStaminaState,
} from '@/components/world/domains/definingWorldPlazaRunStaminaConstants';

export interface ConsumingWorldPlazaJumpStaminaParams {
  /** Stamina state before the jump attempt. */
  state: DefiningWorldPlazaRunStaminaState;
  /** True when the jump started from a run. */
  isRunJump: boolean;
  /** Wall-clock ms for depletion timestamps. */
  nowMs: number;
  /** Multiplier on jump stamina cost (1 = normal). */
  staminaJumpCostMultiplier?: number;
}

export interface ConsumingWorldPlazaJumpStaminaResult {
  /** Stamina state after a successful jump spend. */
  state: DefiningWorldPlazaRunStaminaState;
  /** True when the jump was allowed and stamina was deducted. */
  didConsume: boolean;
}

function clampingRunStaminaRatio(ratio: number): number {
  if (ratio < 0) {
    return 0;
  }

  if (ratio > 1) {
    return 1;
  }

  return ratio;
}

/**
 * Attempts to spend stamina for a jump. Blocked while stamina is empty during
 * the post-depletion hold, or when the bar is too low for the jump cost.
 *
 * @param params - Current stamina, jump type, and timestamp.
 */
export function consumingWorldPlazaJumpStamina({
  state,
  isRunJump,
  nowMs,
  staminaJumpCostMultiplier = 1,
}: ConsumingWorldPlazaJumpStaminaParams): ConsumingWorldPlazaJumpStaminaResult {
  const staminaCost =
    (isRunJump
      ? DEFINING_WORLD_PLAZA_RUN_JUMP_STAMINA_COST_RATIO
      : DEFINING_WORLD_PLAZA_JUMP_STAMINA_COST_RATIO) *
    staminaJumpCostMultiplier;

  if (state.staminaRatio <= 0) {
    return { state, didConsume: false };
  }

  if (
    state.isDepleted &&
    state.depletedAtMs !== null &&
    nowMs - state.depletedAtMs <
      DEFINING_WORLD_PLAZA_RUN_STAMINA_DEPLETION_REGEN_DELAY_MS
  ) {
    return { state, didConsume: false };
  }

  if (state.staminaRatio < staminaCost) {
    return { state, didConsume: false };
  }

  const nextRatio = clampingRunStaminaRatio(state.staminaRatio - staminaCost);
  const hitZero = nextRatio <= 0;

  return {
    state: {
      staminaRatio: nextRatio,
      isDepleted: hitZero ? true : state.isDepleted,
      depletedAtMs: hitZero ? nowMs : state.depletedAtMs,
    },
    didConsume: true,
  };
}
