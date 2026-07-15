import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/**
 * Pushes fated mark resolve times out and cuts pending EV.
 * Marks that already resolved are left alone by the caller filter.
 */
export function postponingWorldPlazaEntityPotentialDamageEffects(
  state: DefiningWorldPlazaEntityHealthState,
  {
    extraDelayMs,
    pendingDamageFactor,
    nowMs,
  }: {
    readonly extraDelayMs: number;
    readonly pendingDamageFactor: number;
    readonly nowMs: number;
  }
): DefiningWorldPlazaEntityHealthState {
  if (state.potentialDamageEffects.length === 0) {
    return state;
  }

  const clampedFactor = Math.max(0, Math.min(1, pendingDamageFactor));
  const delayMs = Math.max(0, extraDelayMs);

  return {
    ...state,
    potentialDamageEffects: state.potentialDamageEffects.map((effect) => {
      if (effect.resolvesAtMs <= nowMs) {
        return effect;
      }

      return {
        ...effect,
        pendingExpectedDamage: effect.pendingExpectedDamage * clampedFactor,
        resolvesAtMs: effect.resolvesAtMs + delayMs,
      };
    }),
  };
}
