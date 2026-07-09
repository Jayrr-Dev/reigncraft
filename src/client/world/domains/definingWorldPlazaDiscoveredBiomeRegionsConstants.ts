/**
 * Persisted first-visit discovery of named biome region cells.
 *
 * @module components/world/domains/definingWorldPlazaDiscoveredBiomeRegionsConstants
 */

/** localStorage key prefix for discovered biome region keys. */
export const DEFINING_WORLD_PLAZA_DISCOVERED_BIOME_REGIONS_STORAGE_KEY_PREFIX =
  'world-plaza-discovered-biome-regions' as const;

/** Poll cadence for recording newly entered biome regions (ms). */
export const DEFINING_WORLD_PLAZA_DISCOVERED_BIOME_REGIONS_POLL_INTERVAL_MS =
  1_000;

/**
 * Resolves the localStorage key for discovered biome regions.
 *
 * @param storageOwnerId - Session owner id, or null for the legacy global key.
 */
export function resolvingWorldPlazaDiscoveredBiomeRegionsStorageKey(
  storageOwnerId: string | null
): string {
  if (storageOwnerId) {
    return `${DEFINING_WORLD_PLAZA_DISCOVERED_BIOME_REGIONS_STORAGE_KEY_PREFIX}:${storageOwnerId}`;
  }

  return DEFINING_WORLD_PLAZA_DISCOVERED_BIOME_REGIONS_STORAGE_KEY_PREFIX;
}
