/**
 * Remaps an online projectile spawn wall-clock stamp onto the local frame clock.
 *
 * Online sync payloads use `Date.now()` so peers share a comparable absolute
 * time. Local projectile simulation / visuals use `performance.now()`, so
 * ingest must convert age onto the frame timeline.
 *
 * @module components/world/projectile/domains/resolvingWorldPlazaProjectileLocalSpawnedAtMsFromOnlineEvent
 */

/**
 * Converts a networked wall-clock `spawnedAtMs` into a local `performance.now()`
 * stamp that preserves the same age.
 */
export function resolvingWorldPlazaProjectileLocalSpawnedAtMsFromOnlineEvent(
  onlineSpawnedAtMs: number,
  simulationNowMs: number = performance.now(),
  wallNowMs: number = Date.now()
): number {
  const ageMs = Math.max(0, wallNowMs - onlineSpawnedAtMs);

  return simulationNowMs - ageMs;
}
