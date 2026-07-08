import type { DefiningWorldPlazaEntityHealthStunEffect } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/**
 * Returns the active stun effect with the latest expiry, if any.
 */
export function resolvingWorldPlazaEntityHealthActiveStunEffect(
  state: { stunEffects: readonly DefiningWorldPlazaEntityHealthStunEffect[] } | null,
  nowMs: number
): DefiningWorldPlazaEntityHealthStunEffect | null {
  if (!state || state.stunEffects.length === 0) {
    return null;
  }

  let activeEffect: DefiningWorldPlazaEntityHealthStunEffect | null = null;

  for (const effect of state.stunEffects) {
    if (effect.expiresAtMs <= nowMs) {
      continue;
    }

    if (
      activeEffect === null ||
      effect.expiresAtMs > activeEffect.expiresAtMs
    ) {
      activeEffect = effect;
    }
  }

  return activeEffect;
}

/**
 * Whether the entity is currently stunned.
 */
export function checkingWorldPlazaEntityPlayerStunIsActive(
  state: { stunEffects: readonly DefiningWorldPlazaEntityHealthStunEffect[] } | null,
  nowMs: number
): boolean {
  return resolvingWorldPlazaEntityHealthActiveStunEffect(state, nowMs) !== null;
}
