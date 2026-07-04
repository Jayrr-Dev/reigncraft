/** localStorage key prefix for offline single-player ground items. */
export const DEFINING_WORLD_PLAZA_GROUND_ITEM_LOCAL_STORAGE_KEY_PREFIX =
  'world-plaza-ground-items' as const;

/**
 * Resolves the localStorage key for one persistence owner's ground items.
 *
 * @param persistenceOwnerId - Single-player slot owner id (e.g. single-player:slot-1).
 */
export function resolvingWorldPlazaGroundItemsLocalStorageKey(
  persistenceOwnerId: string
): string {
  return `${DEFINING_WORLD_PLAZA_GROUND_ITEM_LOCAL_STORAGE_KEY_PREFIX}:${persistenceOwnerId}`;
}
