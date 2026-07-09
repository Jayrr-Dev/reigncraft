import { resolvingWorldPlazaDiscoveredBiomeRegionsStorageKey } from '@/components/world/domains/definingWorldPlazaDiscoveredBiomeRegionsConstants';

/**
 * Persists discovered biome region keys to localStorage.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 * @param discoveredRegionKeys - Region keys the player has entered.
 */
export function writingWorldPlazaDiscoveredBiomeRegionsToStorage(
  storageOwnerId: string | null,
  discoveredRegionKeys: ReadonlySet<string>
): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(
    resolvingWorldPlazaDiscoveredBiomeRegionsStorageKey(storageOwnerId),
    JSON.stringify([...discoveredRegionKeys])
  );
}
