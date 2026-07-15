/**
 * Persisted unlock progress for Wanderer's Corpus library volumes.
 *
 * @module components/world/domains/definingWorldPlazaLoreBookDiscoveryConstants
 */

/** localStorage key prefix for unlocked lore book ids. */
export const DEFINING_WORLD_PLAZA_LORE_BOOK_DISCOVERY_STORAGE_KEY_PREFIX =
  'world-plaza-lore-book-discovery' as const;

/**
 * Resolves the localStorage key for unlocked lore volumes.
 *
 * @param storageOwnerId - Session owner id, or null for the legacy global key.
 */
export function resolvingWorldPlazaLoreBookDiscoveryStorageKey(
  storageOwnerId: string | null
): string {
  if (storageOwnerId) {
    return `${DEFINING_WORLD_PLAZA_LORE_BOOK_DISCOVERY_STORAGE_KEY_PREFIX}:${storageOwnerId}`;
  }

  return DEFINING_WORLD_PLAZA_LORE_BOOK_DISCOVERY_STORAGE_KEY_PREFIX;
}
