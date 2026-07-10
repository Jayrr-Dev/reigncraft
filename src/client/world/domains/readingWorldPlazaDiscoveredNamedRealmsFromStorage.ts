import { resolvingWorldPlazaDiscoveredNamedRealmsStorageKey } from '@/components/world/domains/definingWorldPlazaNamedRealmConstants';

/**
 * Reads discovered named realm ids from localStorage.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 */
export function readingWorldPlazaDiscoveredNamedRealmsFromStorage(
  storageOwnerId: string | null
): ReadonlySet<string> {
  if (typeof window === 'undefined') {
    return new Set();
  }

  try {
    const rawValue = localStorage.getItem(
      resolvingWorldPlazaDiscoveredNamedRealmsStorageKey(storageOwnerId)
    );

    if (!rawValue) {
      return new Set();
    }

    const parsedValue = JSON.parse(rawValue);

    if (!Array.isArray(parsedValue)) {
      return new Set();
    }

    const realmIds = parsedValue.filter(
      (value): value is string =>
        typeof value === 'string' && value.includes(':')
    );

    return new Set(realmIds);
  } catch {
    return new Set();
  }
}
