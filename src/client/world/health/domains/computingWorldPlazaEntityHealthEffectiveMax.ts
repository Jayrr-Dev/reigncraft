import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/**
 * Computes effective max health from base, scale, and active temporary bonuses.
 *
 * @param state - Current health state.
 * @param nowMs - Wall-clock timestamp for bonus expiry.
 */
export function computingWorldPlazaEntityHealthEffectiveMax(
  state: DefiningWorldPlazaEntityHealthState,
  nowMs: number
): number {
  const activeTemporaryBonus = state.temporaryMaxHealthBonuses
    .filter((bonus) => bonus.expiresAtMs > nowMs)
    .reduce((total, bonus) => total + bonus.amount, 0);

  return Math.max(
    1,
    state.baseMaxHealth * state.maxHealthScale + activeTemporaryBonus
  );
}
