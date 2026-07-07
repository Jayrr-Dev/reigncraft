import { DEFINING_WORLD_PLAZA_PLAYER_STAMINA_FATIGUE_INITIAL_TIER } from '@/components/world/domains/definingWorldPlazaPlayerStaminaFatigueConstants';
import type { DefiningWorldPlazaRunStaminaState } from '@/components/world/domains/definingWorldPlazaRunStaminaConstants';

/**
 * Resets fatigue tier and depletion lockout when the stamina bar reaches full.
 */
export function resettingWorldPlazaPlayerStaminaFatigueOnFullBar(
  state: DefiningWorldPlazaRunStaminaState
): DefiningWorldPlazaRunStaminaState {
  if (state.staminaRatio < 1) {
    return state;
  }

  return {
    ...state,
    staminaRatio: 1,
    fatigueTier: DEFINING_WORLD_PLAZA_PLAYER_STAMINA_FATIGUE_INITIAL_TIER,
    isDepleted: false,
    depletedAtMs: null,
  };
}
