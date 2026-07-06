/**
 * Whether ground items persist in localStorage instead of Devvit.
 *
 * @module components/world/inventory/domains/checkingWorldPlazaGroundItemsUseLocalPersistence
 */

/**
 * Returns true when ground items should persist locally instead of via Devvit.
 */
export function checkingWorldPlazaGroundItemsUseLocalPersistence(
  localPersistenceOwnerId: string | null | undefined,
  redditUserId: string | null | undefined
): boolean {
  return (
    typeof localPersistenceOwnerId === 'string' &&
    localPersistenceOwnerId.length > 0 &&
    (redditUserId === null || redditUserId.length === 0)
  );
}
