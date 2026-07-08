import type { DefiningWorldPlazaEntityHealthSleepEffect } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/**
 * Returns the active sleep effect with the latest expiry, if any.
 */
export function resolvingWorldPlazaEntityHealthActiveSleepEffect(
  state: { sleepEffects: readonly DefiningWorldPlazaEntityHealthSleepEffect[] } | null,
  nowMs: number
): DefiningWorldPlazaEntityHealthSleepEffect | null {
  if (!state || state.sleepEffects.length === 0) {
    return null;
  }

  let activeEffect: DefiningWorldPlazaEntityHealthSleepEffect | null = null;

  for (const effect of state.sleepEffects) {
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
 * Whether the entity is currently asleep.
 */
export function checkingWorldPlazaEntityPlayerSleepIsActive(
  state: { sleepEffects: readonly DefiningWorldPlazaEntityHealthSleepEffect[] } | null,
  nowMs: number
): boolean {
  return resolvingWorldPlazaEntityHealthActiveSleepEffect(state, nowMs) !== null;
}
