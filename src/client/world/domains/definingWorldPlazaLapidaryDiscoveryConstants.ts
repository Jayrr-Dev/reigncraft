/**
 * Persisted lapidary discovery progress for the plaza codex.
 *
 * @module components/world/domains/definingWorldPlazaLapidaryDiscoveryConstants
 */

/** localStorage key prefix for lapidary sighted and studied ore ids. */
export const DEFINING_WORLD_PLAZA_LAPIDARY_DISCOVERY_STORAGE_KEY_PREFIX =
  'world-plaza-lapidary-discovery' as const;

/** Poll cadence for recording newly sighted ore veins (ms). */
export const DEFINING_WORLD_PLAZA_LAPIDARY_DISCOVERY_POLL_INTERVAL_MS = 1_500;

/** Grid radius at which an ore vein counts as sighted for the lapidary. */
export const DEFINING_WORLD_PLAZA_LAPIDARY_SIGHT_RADIUS_GRID = 12;

/**
 * Resolves the localStorage key for lapidary discovery.
 *
 * @param storageOwnerId - Session owner id, or null for the legacy global key.
 */
export function resolvingWorldPlazaLapidaryDiscoveryStorageKey(
  storageOwnerId: string | null
): string {
  if (storageOwnerId) {
    return `${DEFINING_WORLD_PLAZA_LAPIDARY_DISCOVERY_STORAGE_KEY_PREFIX}:${storageOwnerId}`;
  }

  return DEFINING_WORLD_PLAZA_LAPIDARY_DISCOVERY_STORAGE_KEY_PREFIX;
}
