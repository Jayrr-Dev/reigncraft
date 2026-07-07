/**
 * Stamina cost for plaza roll dodge actions.
 *
 * @module components/world/domains/consumingWorldPlazaRollStamina
 */

import { applyingWorldPlazaRunStaminaAfterActionSpend } from '@/components/world/domains/applyingWorldPlazaRunStaminaAfterActionSpend';
import {
  DEFINING_WORLD_PLAZA_ROLL_STAMINA_COST_RATIO,
  DEFINING_WORLD_PLAZA_RUN_STAMINA_DEPLETION_REGEN_DELAY_MS,
  type DefiningWorldPlazaRunStaminaState,
} from '@/components/world/domains/definingWorldPlazaRunStaminaConstants';

export type ConsumingWorldPlazaRollStaminaParams = {
  /** Stamina state before the roll attempt. */
  state: DefiningWorldPlazaRunStaminaState;
  /** Wall-clock ms for depletion timestamps. */
  nowMs: number;
  /** Multiplier on roll stamina cost (1 = normal). */
  staminaRollCostMultiplier?: number;
};

export type ConsumingWorldPlazaRollStaminaResult = {
  /** Stamina state after a successful roll spend. */
  state: DefiningWorldPlazaRunStaminaState;
  /** True when the roll was allowed and stamina was deducted. */
  didConsume: boolean;
};

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
 * Attempts to spend stamina for a roll dodge. Blocked while stamina is empty
 * during the post-depletion hold, or when the bar is too low for the roll cost.
 *
 * @param params - Current stamina and timestamp.
 */
export function consumingWorldPlazaRollStamina({
  state,
  nowMs,
  staminaRollCostMultiplier = 1,
}: ConsumingWorldPlazaRollStaminaParams): ConsumingWorldPlazaRollStaminaResult {
  const staminaCost =
    DEFINING_WORLD_PLAZA_ROLL_STAMINA_COST_RATIO * staminaRollCostMultiplier;

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
    state: applyingWorldPlazaRunStaminaAfterActionSpend({
      state,
      nextStaminaRatio: nextRatio,
      nowMs,
      hitZero,
    }),
    didConsume: true,
  };
}
