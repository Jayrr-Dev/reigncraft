import { resolvingWorldPlazaBestiaryDiscoveryStorageKey } from '@/components/world/domains/definingWorldPlazaBestiaryDiscoveryConstants';
import { listingWildlifeSpeciesIds } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

const DEFINING_WORLD_PLAZA_BESTIARY_SPECIES_ID_SET = new Set<string>(
  listingWildlifeSpeciesIds()
);

export type WorldPlazaBestiaryDiscoverySnapshot = {
  sightedSpeciesIds: ReadonlySet<DefiningWildlifeSpeciesId>;
  studyCountsBySpeciesId: ReadonlyMap<DefiningWildlifeSpeciesId, number>;
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

function readingWorldPlazaBestiaryStudyCounts(
  value: unknown
): Map<DefiningWildlifeSpeciesId, number> {
  if (!value || typeof value !== 'object') {
    return new Map();
  }

  const studyCounts = new Map<DefiningWildlifeSpeciesId, number>();

  for (const [rawSpeciesId, rawCount] of Object.entries(value)) {
    if (!checkingWorldPlazaBestiarySpeciesId(rawSpeciesId)) {
      continue;
    }

    const parsedCount =
      typeof rawCount === 'number' && Number.isFinite(rawCount)
        ? Math.max(0, Math.floor(rawCount))
        : 0;

    if (parsedCount > 0) {
      studyCounts.set(rawSpeciesId, parsedCount);
    }
  }

  return studyCounts;
}

function migratingWorldPlazaBestiaryLegacyKilledSpecies(
  studyCounts: Map<DefiningWildlifeSpeciesId, number>,
  legacyKilledSpeciesIds: ReadonlySet<DefiningWildlifeSpeciesId>
): void {
  for (const speciesId of legacyKilledSpeciesIds) {
    if (!studyCounts.has(speciesId)) {
      studyCounts.set(speciesId, 1);
    }
  }
}

const WORLD_PLAZA_BESTIARY_DISCOVERY_EMPTY_SNAPSHOT: WorldPlazaBestiaryDiscoverySnapshot =
  {
    sightedSpeciesIds: new Set(),
    studyCountsBySpeciesId: new Map(),
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

    const studyCountsFromNewKey = readingWorldPlazaBestiaryStudyCounts(
      Reflect.get(parsedValue, 'studyCounts')
    );
    const studyCounts =
      studyCountsFromNewKey.size > 0
        ? studyCountsFromNewKey
        : readingWorldPlazaBestiaryStudyCounts(
            Reflect.get(parsedValue, 'killCounts')
          );

    migratingWorldPlazaBestiaryLegacyKilledSpecies(
      studyCounts,
      readingWorldPlazaBestiarySpeciesIdSet(Reflect.get(parsedValue, 'killed'))
    );

    return {
      sightedSpeciesIds: readingWorldPlazaBestiarySpeciesIdSet(
        Reflect.get(parsedValue, 'sighted')
      ),
      studyCountsBySpeciesId: studyCounts,
    };
  } catch {
    return WORLD_PLAZA_BESTIARY_DISCOVERY_EMPTY_SNAPSHOT;
  }
}
