import { computingWorldPlazaEntityHealthDamage } from '@/components/world/health/domains/computingWorldPlazaEntityHealthDamage';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/**
 * Detonates all potential damage effects whose fuse has elapsed.
 */
export function detonatingWorldPlazaEntityHealthPotentialDamage(
  state: DefiningWorldPlazaEntityHealthState,
  nowMs: number
): DefiningWorldPlazaEntityHealthState {
  const dueEffects = state.potentialDamageEffects.filter(
    (effect) => effect.detonatesAtMs <= nowMs
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
      rawAmount: effect.pendingDamage,
      kind: 'potential_damage',
      nowMs,
      options: {
        bypassInvincibilityFrames: false,
        grantInvincibilityFrames: true,
        skipDamageRoll: true,
      },
    });

    nextState = damageResult.state;

    if (nextState.isDead) {
      return nextState;
    }
  }

  return nextState;
}
