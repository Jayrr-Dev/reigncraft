import { applyingWorldPlazaPlayerStaminaOnFullDepletion } from '@/components/world/domains/applyingWorldPlazaPlayerStaminaOnFullDepletion';
import {
  DEFINING_WORLD_PLAZA_RUN_STAMINA_ACTION_SPEND_REGEN_DELAY_MS,
  type DefiningWorldPlazaRunStaminaState,
} from '@/components/world/domains/definingWorldPlazaRunStaminaConstants';

export type ApplyingWorldPlazaRunStaminaAfterActionSpendParams = {
  /** Stamina state before the spend is applied. */
  state: DefiningWorldPlazaRunStaminaState;
  /** Stamina ratio after the action cost is deducted. */
  nextStaminaRatio: number;
  /** Wall-clock ms when the action spend happened. */
  nowMs: number;
  /** True when the spend emptied the stamina bar. */
  hitZero: boolean;
};

/**
 * Applies stamina ratio changes from jump, roll, or similar action spends and
 * starts the configurable post-action regen pause.
 */
export function applyingWorldPlazaRunStaminaAfterActionSpend({
  state,
  nextStaminaRatio,
  nowMs,
  hitZero,
}: ApplyingWorldPlazaRunStaminaAfterActionSpendParams): DefiningWorldPlazaRunStaminaState {
  const spentState = hitZero
    ? applyingWorldPlazaPlayerStaminaOnFullDepletion({
        state,
        nextStaminaRatio,
        nowMs,
      })
    : {
        ...state,
        staminaRatio: nextStaminaRatio,
      };

  return {
    ...spentState,
    regenPausedUntilMs:
      nowMs + DEFINING_WORLD_PLAZA_RUN_STAMINA_ACTION_SPEND_REGEN_DELAY_MS,
  };
}
