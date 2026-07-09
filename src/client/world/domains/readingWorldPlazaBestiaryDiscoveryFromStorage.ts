import { listingWildlifeSpeciesIds } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWorldPlazaBestiaryDiscoveryStorageKey } from '@/components/world/domains/definingWorldPlazaBestiaryDiscoveryConstants';

const DEFINING_WORLD_PLAZA_BESTIARY_SPECIES_ID_SET = new Set<string>(
  listingWildlifeSpeciesIds()
);

export type WorldPlazaBestiaryDiscoverySnapshot = {
  sightedSpeciesIds: ReadonlySet<DefiningWildlifeSpeciesId>;
  killedSpeciesIds: ReadonlySet<DefiningWildlifeSpeciesId>;
};

function checkingWorldPlazaBestiarySpeciesId(
  value: unknown
): value is DefiningWildlifeSpeciesId {
  return (
    typeof value === 'string' &&
    DEFINING_WORLD_PLAZA_BESTIARY_SPECIES_ID_SET.has(value)
  );
}

function readingWorldPlazaBestiarySpeciesIdSet(
  value: unknown
): ReadonlySet<DefiningWildlifeSpeciesId> {
  if (!Array.isArray(value)) {
    return new Set();
  }

  return new Set(value.filter(checkingWorldPlazaBestiarySpeciesId));
}

const WORLD_PLAZA_BESTIARY_DISCOVERY_EMPTY_SNAPSHOT: WorldPlazaBestiaryDiscoverySnapshot =
  {
    sightedSpeciesIds: new Set(),
    killedSpeciesIds: new Set(),
  };

/**
 * Reads bestiary discovery from localStorage.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 */
export function readingWorldPlazaBestiaryDiscoveryFromStorage(
  storageOwnerId: string | null
): WorldPlazaBestiaryDiscoverySnapshot {
  if (typeof window === 'undefined') {
    return WORLD_PLAZA_BESTIARY_DISCOVERY_EMPTY_SNAPSHOT;
  }

  try {
    const rawValue = localStorage.getItem(
      resolvingWorldPlazaBestiaryDiscoveryStorageKey(storageOwnerId)
    );

    if (!rawValue) {
      return WORLD_PLAZA_BESTIARY_DISCOVERY_EMPTY_SNAPSHOT;
    }

    const parsedValue = JSON.parse(rawValue);

    if (!parsedValue || typeof parsedValue !== 'object') {
      return WORLD_PLAZA_BESTIARY_DISCOVERY_EMPTY_SNAPSHOT;
    }

    return {
      sightedSpeciesIds: readingWorldPlazaBestiarySpeciesIdSet(
        Reflect.get(parsedValue, 'sighted')
      ),
      killedSpeciesIds: readingWorldPlazaBestiarySpeciesIdSet(
        Reflect.get(parsedValue, 'killed')
      ),
    };
  } catch {
    return WORLD_PLAZA_BESTIARY_DISCOVERY_EMPTY_SNAPSHOT;
  }
}
