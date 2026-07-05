import type { DefiningWorldPlazaEntityHealthDamageOverTimeEffect } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/**
 * Estimates remaining damage for a linear damage-over-time effect.
 */
export function computingWorldPlazaEntityDamageOverTimeRemainingDamage(
  effect: DefiningWorldPlazaEntityHealthDamageOverTimeEffect,
  nowMs: number
): number {
  const remainingMs = Math.max(0, effect.expiresAtMs - nowMs);

  if (remainingMs <= 0 || effect.damagePerSecond <= 0) {
    return 0;
  }

  return effect.damagePerSecond * (remainingMs / 1000);
}
