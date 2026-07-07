import { computingWorldPlazaEntityHealthDamage } from '@/components/world/health/domains/computingWorldPlazaEntityHealthDamage';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/**
 * Applies stored damage for all potential-damage effects whose timer has elapsed.
 */
export function resolvingWorldPlazaEntityHealthPotentialDamage(
  state: DefiningWorldPlazaEntityHealthState,
  nowMs: number
): DefiningWorldPlazaEntityHealthState {
  const dueEffects = state.potentialDamageEffects.filter(
    (effect) => effect.resolvesAtMs <= nowMs
  );

  if (dueEffects.length === 0) {
    return state;
  }

  const dueEffectIds = new Set(dueEffects.map((effect) => effect.id));
  let nextState: DefiningWorldPlazaEntityHealthState = {
    ...state,
    potentialDamageEffects: state.potentialDamageEffects.filter(
      (effect) => !dueEffectIds.has(effect.id)
    ),
  };

  for (const effect of dueEffects) {
    const damageResult = computingWorldPlazaEntityHealthDamage({
      state: nextState,
      rawAmount: effect.pendingExpectedDamage,
      kind: 'potential_damage',
      nowMs,
    });

    nextState = damageResult.state;

    if (nextState.isDead) {
      return nextState;
    }
  }

  return nextState;
}
