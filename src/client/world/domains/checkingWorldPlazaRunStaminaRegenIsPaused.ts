import type { DefiningWorldPlazaRunStaminaState } from '@/components/world/domains/definingWorldPlazaRunStaminaConstants';

/**
 * True while post-action regen pause is still active.
 */
export function checkingWorldPlazaRunStaminaRegenIsPaused(
  state: DefiningWorldPlazaRunStaminaState,
  nowMs: number
): boolean {
  return state.regenPausedUntilMs !== null && nowMs < state.regenPausedUntilMs;
}
