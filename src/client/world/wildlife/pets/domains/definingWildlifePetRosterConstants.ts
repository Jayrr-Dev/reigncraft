/**
 * Persisted pet roster storage key constants.
 *
 * @module components/world/wildlife/pets/domains/definingWildlifePetRosterConstants
 */

/** localStorage key prefix for the bonded companion roster. */
export const DEFINING_WILDLIFE_PET_ROSTER_STORAGE_KEY_PREFIX =
  'world-plaza-pet-roster' as const;

/**
 * Resolves the localStorage key for the pet roster.
 *
 * @param storageOwnerId - Session owner id, or null for the legacy global key.
 */
export function resolvingWildlifePetRosterStorageKey(
  storageOwnerId: string | null
): string {
  if (storageOwnerId) {
    return `${DEFINING_WILDLIFE_PET_ROSTER_STORAGE_KEY_PREFIX}:${storageOwnerId}`;
  }

  return DEFINING_WILDLIFE_PET_ROSTER_STORAGE_KEY_PREFIX;
}
