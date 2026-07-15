import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/** Clears every pending fated (potential) damage mark. */
export function clearingWorldPlazaEntityPotentialDamageEffects(
  state: DefiningWorldPlazaEntityHealthState
): DefiningWorldPlazaEntityHealthState {
  if (state.potentialDamageEffects.length === 0) {
    return state;
  }

  return {
    ...state,
    potentialDamageEffects: [],
  };
}
