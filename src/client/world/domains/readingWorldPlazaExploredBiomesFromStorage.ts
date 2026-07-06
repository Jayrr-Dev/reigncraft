import { DEFINING_WORLD_PLAZA_BIOME_CATALOG } from '@/components/world/domains/definingWorldPlazaBiomeConstants';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import { resolvingWorldPlazaExploredBiomesStorageKey } from '@/components/world/domains/definingWorldPlazaExploredBiomesConstants';

const DEFINING_WORLD_PLAZA_BIOME_KIND_SET = new Set<string>(
  Object.keys(DEFINING_WORLD_PLAZA_BIOME_CATALOG)
);

function checkingWorldPlazaExploredBiomeKind(
  value: unknown
): value is DefiningWorldPlazaBiomeKind {
  return (
    typeof value === 'string' && DEFINING_WORLD_PLAZA_BIOME_KIND_SET.has(value)
  );
}

/**
 * Reads explored biome kinds from localStorage.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 */
export function readingWorldPlazaExploredBiomesFromStorage(
  storageOwnerId: string | null
): ReadonlySet<DefiningWorldPlazaBiomeKind> {
  if (typeof window === 'undefined') {
    return new Set();
  }

  try {
    const rawValue = localStorage.getItem(
      resolvingWorldPlazaExploredBiomesStorageKey(storageOwnerId)
    );

    if (!rawValue) {
      return new Set();
    }

    const parsedValue = JSON.parse(rawValue);

    if (!Array.isArray(parsedValue)) {
      return new Set();
    }

    const exploredKinds = parsedValue.filter(
      checkingWorldPlazaExploredBiomeKind
    );

    return new Set(exploredKinds);
  } catch {
    return new Set();
  }
}
