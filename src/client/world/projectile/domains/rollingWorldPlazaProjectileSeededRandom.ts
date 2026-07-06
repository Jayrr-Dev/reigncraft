/**
 * Deterministic pseudo-random helpers for networked projectile simulation.
 *
 * @module components/world/projectile/domains/rollingWorldPlazaProjectileSeededRandom
 */

/**
 * Returns a deterministic float in [0, 1) from a seed and salt.
 */
export function rollingWorldPlazaProjectileSeededUnitFloat(
  seed: number,
  salt: number
): number {
  let state = (seed ^ salt) | 0;
  state = Math.imul(state ^ (state >>> 15), state | 1);
  state ^= state + Math.imul(state ^ (state >>> 7), state | 61);
  return ((state ^ (state >>> 14)) >>> 0) / 4294967296;
}

/**
 * Returns a deterministic integer projectile id suffix.
 */
export function creatingWorldPlazaProjectileDeterministicIdSuffix(
  seed: number,
  salt: number
): string {
  const unit = rollingWorldPlazaProjectileSeededUnitFloat(seed, salt);
  return Math.floor(unit * 1_000_000_000).toString(36);
}
