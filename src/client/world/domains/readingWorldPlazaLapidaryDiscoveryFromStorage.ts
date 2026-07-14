import { resolvingWorldPlazaLapidaryDiscoveryStorageKey } from '@/components/world/domains/definingWorldPlazaLapidaryDiscoveryConstants';
import {
  WORLD_ORE_SPECIES_RARITY_REGISTRY,
  type WorldOreSpeciesId,
} from '../../../shared/worldOreRarity';

const DEFINING_WORLD_PLAZA_LAPIDARY_ORE_SPECIES_ID_SET = new Set<string>(
  WORLD_ORE_SPECIES_RARITY_REGISTRY.map((entry) => entry.speciesId)
);

export type WorldPlazaLapidaryDiscoverySnapshot = {
  sightedOreSpeciesIds: ReadonlySet<WorldOreSpeciesId>;
  oreStudyCountsBySpeciesId: ReadonlyMap<WorldOreSpeciesId, number>;
};

function checkingWorldPlazaLapidaryOreSpeciesId(
  value: unknown
): value is WorldOreSpeciesId {
  return (
    typeof value === 'string' &&
    DEFINING_WORLD_PLAZA_LAPIDARY_ORE_SPECIES_ID_SET.has(value)
  );
}

function readingWorldPlazaLapidaryIdSet(
  value: unknown
): ReadonlySet<WorldOreSpeciesId> {
  if (!Array.isArray(value)) {
    return new Set();
  }

  return new Set(value.filter(checkingWorldPlazaLapidaryOreSpeciesId));
}

function readingWorldPlazaLapidaryStudyCounts(
  value: unknown
): Map<WorldOreSpeciesId, number> {
  if (!value || typeof value !== 'object') {
    return new Map();
  }

  const studyCounts = new Map<WorldOreSpeciesId, number>();

  for (const [rawId, rawCount] of Object.entries(value)) {
    if (!checkingWorldPlazaLapidaryOreSpeciesId(rawId)) {
      continue;
    }

    const parsedCount =
      typeof rawCount === 'number' && Number.isFinite(rawCount)
        ? Math.max(0, Math.floor(rawCount))
        : 0;

    if (parsedCount > 0) {
      studyCounts.set(rawId, parsedCount);
    }
  }

  return studyCounts;
}

const WORLD_PLAZA_LAPIDARY_DISCOVERY_EMPTY_SNAPSHOT: WorldPlazaLapidaryDiscoverySnapshot =
  {
    sightedOreSpeciesIds: new Set(),
    oreStudyCountsBySpeciesId: new Map(),
  };

/**
 * Reads lapidary discovery from localStorage.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 */
export function readingWorldPlazaLapidaryDiscoveryFromStorage(
  storageOwnerId: string | null
): WorldPlazaLapidaryDiscoverySnapshot {
  if (typeof window === 'undefined') {
    return WORLD_PLAZA_LAPIDARY_DISCOVERY_EMPTY_SNAPSHOT;
  }

  try {
    const rawValue = localStorage.getItem(
      resolvingWorldPlazaLapidaryDiscoveryStorageKey(storageOwnerId)
    );

    if (!rawValue) {
      return WORLD_PLAZA_LAPIDARY_DISCOVERY_EMPTY_SNAPSHOT;
    }

    const parsedValue = JSON.parse(rawValue);

    if (!parsedValue || typeof parsedValue !== 'object') {
      return WORLD_PLAZA_LAPIDARY_DISCOVERY_EMPTY_SNAPSHOT;
    }

    return {
      sightedOreSpeciesIds: readingWorldPlazaLapidaryIdSet(
        Reflect.get(parsedValue, 'sightedOres')
      ),
      oreStudyCountsBySpeciesId: readingWorldPlazaLapidaryStudyCounts(
        Reflect.get(parsedValue, 'oreStudyCounts')
      ),
    };
  } catch {
    return WORLD_PLAZA_LAPIDARY_DISCOVERY_EMPTY_SNAPSHOT;
  }
}
