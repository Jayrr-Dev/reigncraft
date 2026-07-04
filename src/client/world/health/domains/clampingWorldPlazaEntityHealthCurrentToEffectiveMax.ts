import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/**
 * Clamps current health when max health shrinks from debuffs or expiring bonuses.
 */
export function clampingWorldPlazaEntityHealthCurrentToEffectiveMax(
  state: DefiningWorldPlazaEntityHealthState,
  effectiveMaxHealth: number
): DefiningWorldPlazaEntityHealthState {
  return {
    ...state,
    currentHealth: Math.min(state.currentHealth, effectiveMaxHealth),
    isDead: state.currentHealth <= 0,
  };
}
