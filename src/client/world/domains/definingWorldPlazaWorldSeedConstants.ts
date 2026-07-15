/**
 * Persisted procedural world-generation seed for single-player save slots.
 *
 * @module components/world/domains/definingWorldPlazaWorldSeedConstants
 */

/** localStorage key prefix for the plaza world generation seed. */
export const DEFINING_WORLD_PLAZA_WORLD_SEED_STORAGE_KEY_PREFIX =
  'world-plaza-world-seed' as const;

/**
 * Resolves the localStorage key for the world generation seed.
 *
 * @param storageOwnerId - Session owner id, or null for the legacy global key.
 */
export function resolvingWorldPlazaWorldSeedStorageKey(
  storageOwnerId: string | null
): string {
  if (storageOwnerId) {
    return `${DEFINING_WORLD_PLAZA_WORLD_SEED_STORAGE_KEY_PREFIX}:${storageOwnerId}`;
  }

  return DEFINING_WORLD_PLAZA_WORLD_SEED_STORAGE_KEY_PREFIX;
}
