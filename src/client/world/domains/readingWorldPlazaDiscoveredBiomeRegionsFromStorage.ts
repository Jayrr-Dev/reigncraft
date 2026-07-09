import { resolvingWorldPlazaDiscoveredBiomeRegionsStorageKey } from '@/components/world/domains/definingWorldPlazaDiscoveredBiomeRegionsConstants';

/**
 * Reads discovered biome region keys from localStorage.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 */
export function readingWorldPlazaDiscoveredBiomeRegionsFromStorage(
  storageOwnerId: string | null
): ReadonlySet<string> {
  if (typeof window === 'undefined') {
    return new Set();
  }

  try {
    const rawValue = localStorage.getItem(
      resolvingWorldPlazaDiscoveredBiomeRegionsStorageKey(storageOwnerId)
    );

    if (!rawValue) {
      return new Set();
    }

    const parsedValue = JSON.parse(rawValue);

    if (!Array.isArray(parsedValue)) {
      return new Set();
    }

    const regionKeys = parsedValue.filter(
      (value): value is string =>
        typeof value === 'string' && value.includes(':')
    );

    return new Set(regionKeys);
  } catch {
    return new Set();
  }
}
