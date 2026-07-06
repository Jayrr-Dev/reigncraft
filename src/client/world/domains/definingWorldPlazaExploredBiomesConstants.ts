/**
 * Persisted biome discovery progress for the plaza codex.
 *
 * @module components/world/domains/definingWorldPlazaExploredBiomesConstants
 */

/** localStorage key prefix for explored biome kinds. */
export const DEFINING_WORLD_PLAZA_EXPLORED_BIOMES_STORAGE_KEY_PREFIX =
  'world-plaza-explored-biomes' as const;

/** Poll cadence for recording newly entered biomes (ms). */
export const DEFINING_WORLD_PLAZA_EXPLORED_BIOMES_POLL_INTERVAL_MS = 1_500;

/**
 * Resolves the localStorage key for explored biomes.
 *
 * @param storageOwnerId - Session owner id, or null for the legacy global key.
 */
export function resolvingWorldPlazaExploredBiomesStorageKey(
  storageOwnerId: string | null
): string {
  if (storageOwnerId) {
    return `${DEFINING_WORLD_PLAZA_EXPLORED_BIOMES_STORAGE_KEY_PREFIX}:${storageOwnerId}`;
  }

  return DEFINING_WORLD_PLAZA_EXPLORED_BIOMES_STORAGE_KEY_PREFIX;
}
