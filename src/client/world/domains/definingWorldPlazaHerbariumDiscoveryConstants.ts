/**
 * Persisted herbarium discovery progress for the plaza codex.
 *
 * @module components/world/domains/definingWorldPlazaHerbariumDiscoveryConstants
 */

/** localStorage key prefix for herbarium sighted and studied flora ids. */
export const DEFINING_WORLD_PLAZA_HERBARIUM_DISCOVERY_STORAGE_KEY_PREFIX =
  'world-plaza-herbarium-discovery' as const;

/** Poll cadence for recording newly sighted flora (ms). */
export const DEFINING_WORLD_PLAZA_HERBARIUM_DISCOVERY_POLL_INTERVAL_MS = 1_500;

/** Grid radius at which a flower or tree counts as sighted for the herbarium. */
export const DEFINING_WORLD_PLAZA_HERBARIUM_SIGHT_RADIUS_GRID = 12;

/**
 * Resolves the localStorage key for herbarium discovery.
 *
 * @param storageOwnerId - Session owner id, or null for the legacy global key.
 */
export function resolvingWorldPlazaHerbariumDiscoveryStorageKey(
  storageOwnerId: string | null
): string {
  if (storageOwnerId) {
    return `${DEFINING_WORLD_PLAZA_HERBARIUM_DISCOVERY_STORAGE_KEY_PREFIX}:${storageOwnerId}`;
  }

  return DEFINING_WORLD_PLAZA_HERBARIUM_DISCOVERY_STORAGE_KEY_PREFIX;
}
