import { advancingWorldPlazaPlayerStaminaFatigueTier } from '@/components/world/domains/advancingWorldPlazaPlayerStaminaFatigueTier';
import type { DefiningWorldPlazaRunStaminaState } from '@/components/world/domains/definingWorldPlazaRunStaminaConstants';

export type ApplyingWorldPlazaPlayerStaminaOnFullDepletionParams = {
  /** Stamina state before the bar fully emptied. */
  state: DefiningWorldPlazaRunStaminaState;
  /** Stamina ratio after the drain (expected 0). */
  nextStaminaRatio: number;
  /** Wall-clock ms when depletion happened. */
  nowMs: number;
};

/**
 * Advances fatigue tier and latches depletion when stamina hits zero.
 */
export function applyingWorldPlazaPlayerStaminaOnFullDepletion({
  state,
  nextStaminaRatio,
  nowMs,
}: ApplyingWorldPlazaPlayerStaminaOnFullDepletionParams): DefiningWorldPlazaRunStaminaState {
  return {
    ...state,
    staminaRatio: nextStaminaRatio,
    fatigueTier: advancingWorldPlazaPlayerStaminaFatigueTier(state.fatigueTier),
    isDepleted: true,
    depletedAtMs: nowMs,
  };
}
