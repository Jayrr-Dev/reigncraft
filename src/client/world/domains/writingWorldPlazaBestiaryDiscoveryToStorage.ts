import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWorldPlazaBestiaryDiscoveryStorageKey } from '@/components/world/domains/definingWorldPlazaBestiaryDiscoveryConstants';

/**
 * Persists bestiary discovery to localStorage.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 * @param sightedSpeciesIds - Species the player has sighted.
 * @param killedSpeciesIds - Species the player has killed.
 */
export function writingWorldPlazaBestiaryDiscoveryToStorage(
  storageOwnerId: string | null,
  sightedSpeciesIds: ReadonlySet<DefiningWildlifeSpeciesId>,
  killedSpeciesIds: ReadonlySet<DefiningWildlifeSpeciesId>
): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(
    resolvingWorldPlazaBestiaryDiscoveryStorageKey(storageOwnerId),
    JSON.stringify({
      sighted: [...sightedSpeciesIds].sort(),
      killed: [...killedSpeciesIds].sort(),
    })
  );
}
