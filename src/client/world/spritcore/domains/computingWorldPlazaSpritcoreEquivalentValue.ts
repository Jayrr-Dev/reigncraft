/**
 * Spiritcore diminishing-return curve helpers.
 *
 * @module components/world/spritcore/domains/computingWorldPlazaSpritcoreEquivalentValue
 */

import { DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_K } from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreLevelingConstants';

/**
 * Maps a stat value to its equivalent Spiritcore investment.
 *
 * SC(X) = K * (X - X0) / (Xmax - X)
 */
export function computingWorldPlazaSpritcoreEquivalentValue(
  value: number,
  baseValue: number,
  maximumValue: number,
  k: number = DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_K
): number {
  if (value <= baseValue) {
    return 0;
  }

  if (value >= maximumValue) {
    return Number.POSITIVE_INFINITY;
  }

  return (k * (value - baseValue)) / (maximumValue - value);
}

/**
 * Inverse of {@link computingWorldPlazaSpritcoreEquivalentValue}.
 *
 * X(S) = X0 + (Xmax - X0) * S / (S + K)
 */
export function computingWorldPlazaSpritcoreStatFromEquivalentValue(
  spiritcoreValue: number,
  baseValue: number,
  maximumValue: number,
  k: number = DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_K
): number {
  if (spiritcoreValue <= 0) {
    return baseValue;
  }

  if (!Number.isFinite(spiritcoreValue)) {
    return maximumValue;
  }

  return (
    baseValue +
    (maximumValue - baseValue) * (spiritcoreValue / (spiritcoreValue + k))
  );
}
