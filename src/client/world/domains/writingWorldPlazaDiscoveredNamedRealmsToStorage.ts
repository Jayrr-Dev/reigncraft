import { resolvingWorldPlazaDiscoveredNamedRealmsStorageKey } from '@/components/world/domains/definingWorldPlazaNamedRealmConstants';

/**
 * Persists discovered named realm ids to localStorage.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 * @param discoveredRealmIds - Realm ids the player has entered.
 */
export function writingWorldPlazaDiscoveredNamedRealmsToStorage(
  storageOwnerId: string | null,
  discoveredRealmIds: ReadonlySet<string>
): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(
    resolvingWorldPlazaDiscoveredNamedRealmsStorageKey(storageOwnerId),
    JSON.stringify([...discoveredRealmIds])
  );
}
