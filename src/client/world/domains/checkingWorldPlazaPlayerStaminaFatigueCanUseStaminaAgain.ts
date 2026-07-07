import type { DefiningWorldPlazaRunStaminaState } from '@/components/world/domains/definingWorldPlazaRunStaminaConstants';
import { resolvingWorldPlazaPlayerStaminaFatigueUseUnlockRatio } from '@/components/world/domains/resolvingWorldPlazaPlayerStaminaFatigueRecoveryThreshold';

/**
 * True when a depleted bar has refilled enough to use run, jump, or roll again.
 */
export function checkingWorldPlazaPlayerStaminaFatigueCanUseStaminaAgain(
  state: DefiningWorldPlazaRunStaminaState,
  staminaRatio: number
): boolean {
  if (!state.isDepleted) {
    return false;
  }

  return (
    staminaRatio >=
    resolvingWorldPlazaPlayerStaminaFatigueUseUnlockRatio(state.fatigueTier)
  );
}
