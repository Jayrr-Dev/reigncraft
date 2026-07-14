import { resolvingWorldPlazaPathologyDiscoveryStorageKey } from '@/components/world/domains/definingWorldPlazaPathologyDiscoveryConstants';
import {
  DEFINING_WORLD_PLAZA_ENTITY_DISEASE_REGISTRY,
  type DefiningWorldPlazaEntityDiseaseId,
} from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';

const DEFINING_WORLD_PLAZA_PATHOLOGY_DISEASE_ID_SET = new Set<string>(
  Object.keys(DEFINING_WORLD_PLAZA_ENTITY_DISEASE_REGISTRY)
);

export type WorldPlazaPathologyDiscoverySnapshot = {
  obtainedDiseaseIds: ReadonlySet<DefiningWorldPlazaEntityDiseaseId>;
  linkedCreatureStudiesByDiseaseId: ReadonlyMap<
    DefiningWorldPlazaEntityDiseaseId,
    number
  >;
  infectionStudyPointsByDiseaseId: ReadonlyMap<
    DefiningWorldPlazaEntityDiseaseId,
    number
  >;
};

function checkingWorldPlazaPathologyDiseaseId(
  value: unknown
): value is DefiningWorldPlazaEntityDiseaseId {
  return (
    typeof value === 'string' &&
    DEFINING_WORLD_PLAZA_PATHOLOGY_DISEASE_ID_SET.has(value)
  );
}

function readingWorldPlazaPathologyDiseaseIdSet(
  value: unknown
): ReadonlySet<DefiningWorldPlazaEntityDiseaseId> {
  if (!Array.isArray(value)) {
    return new Set();
  }

  return new Set(value.filter(checkingWorldPlazaPathologyDiseaseId));
}

function readingWorldPlazaPathologyCountRecord(
  value: unknown
): Map<DefiningWorldPlazaEntityDiseaseId, number> {
  if (!value || typeof value !== 'object') {
    return new Map();
  }

  const counts = new Map<DefiningWorldPlazaEntityDiseaseId, number>();

  for (const [rawId, rawCount] of Object.entries(value)) {
    if (!checkingWorldPlazaPathologyDiseaseId(rawId)) {
      continue;
    }

    const parsedCount =
      typeof rawCount === 'number' && Number.isFinite(rawCount)
        ? Math.max(0, Math.floor(rawCount))
        : 0;

    if (parsedCount > 0) {
      counts.set(rawId, parsedCount);
    }
  }

  return counts;
}

const WORLD_PLAZA_PATHOLOGY_DISCOVERY_EMPTY_SNAPSHOT: WorldPlazaPathologyDiscoverySnapshot =
  {
    obtainedDiseaseIds: new Set(),
    linkedCreatureStudiesByDiseaseId: new Map(),
    infectionStudyPointsByDiseaseId: new Map(),
  };

/**
 * Reads Pathology discovery from localStorage.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 */
export function readingWorldPlazaPathologyDiscoveryFromStorage(
  storageOwnerId: string | null
): WorldPlazaPathologyDiscoverySnapshot {
  if (typeof window === 'undefined') {
    return WORLD_PLAZA_PATHOLOGY_DISCOVERY_EMPTY_SNAPSHOT;
  }

  try {
    const rawValue = localStorage.getItem(
      resolvingWorldPlazaPathologyDiscoveryStorageKey(storageOwnerId)
    );

    if (!rawValue) {
      return WORLD_PLAZA_PATHOLOGY_DISCOVERY_EMPTY_SNAPSHOT;
    }

    const parsedValue = JSON.parse(rawValue);

    if (!parsedValue || typeof parsedValue !== 'object') {
      return WORLD_PLAZA_PATHOLOGY_DISCOVERY_EMPTY_SNAPSHOT;
    }

    return {
      obtainedDiseaseIds: readingWorldPlazaPathologyDiseaseIdSet(
        Reflect.get(parsedValue, 'obtainedDiseases')
      ),
      linkedCreatureStudiesByDiseaseId: readingWorldPlazaPathologyCountRecord(
        Reflect.get(parsedValue, 'linkedCreatureStudies')
      ),
      infectionStudyPointsByDiseaseId: readingWorldPlazaPathologyCountRecord(
        Reflect.get(parsedValue, 'infectionStudyPoints')
      ),
    };
  } catch {
    return WORLD_PLAZA_PATHOLOGY_DISCOVERY_EMPTY_SNAPSHOT;
  }
}
