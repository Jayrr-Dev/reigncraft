import { resolvingWorldPlazaBestiaryDiscoveryStorageKey } from '@/components/world/domains/definingWorldPlazaBestiaryDiscoveryConstants';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/**
 * Persists bestiary discovery to localStorage.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 * @param sightedSpeciesIds - Species the player has sighted.
 * @param killCountsBySpeciesId - Per-species kill totals.
 */
export function writingWorldPlazaBestiaryDiscoveryToStorage(
  storageOwnerId: string | null,
  sightedSpeciesIds: ReadonlySet<DefiningWildlifeSpeciesId>,
  killCountsBySpeciesId: ReadonlyMap<DefiningWildlifeSpeciesId, number>
): void {
  if (typeof window === 'undefined') {
    return;
  }

  const killCounts = Object.fromEntries(
    [...killCountsBySpeciesId.entries()]
      .filter(([, count]) => count > 0)
      .sort(([leftSpeciesId], [rightSpeciesId]) =>
        leftSpeciesId.localeCompare(rightSpeciesId)
      )
  );

  localStorage.setItem(
    resolvingWorldPlazaBestiaryDiscoveryStorageKey(storageOwnerId),
    JSON.stringify({
      sighted: [...sightedSpeciesIds].sort(),
      killCounts,
    })
  );
}
