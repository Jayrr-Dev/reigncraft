/**
 * Persisted Pathology discovery progress for the plaza codex.
 *
 * @module components/world/domains/definingWorldPlazaPathologyDiscoveryConstants
 */

/** localStorage key prefix for Pathology obtained diseases and linked studies. */
export const DEFINING_WORLD_PLAZA_PATHOLOGY_DISCOVERY_STORAGE_KEY_PREFIX =
  'world-plaza-pathology-discovery' as const;

/**
 * Resolves the localStorage key for Pathology discovery.
 *
 * @param storageOwnerId - Session owner id, or null for the legacy global key.
 */
export function resolvingWorldPlazaPathologyDiscoveryStorageKey(
  storageOwnerId: string | null
): string {
  if (storageOwnerId) {
    return `${DEFINING_WORLD_PLAZA_PATHOLOGY_DISCOVERY_STORAGE_KEY_PREFIX}:${storageOwnerId}`;
  }

  return DEFINING_WORLD_PLAZA_PATHOLOGY_DISCOVERY_STORAGE_KEY_PREFIX;
}
