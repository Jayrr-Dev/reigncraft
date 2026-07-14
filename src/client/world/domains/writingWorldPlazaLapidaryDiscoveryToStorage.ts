import { resolvingWorldPlazaLapidaryDiscoveryStorageKey } from '@/components/world/domains/definingWorldPlazaLapidaryDiscoveryConstants';
import type { WorldOreSpeciesId } from '../../../shared/worldOreRarity';

function formattingWorldPlazaLapidaryStudyCountsRecord(
  studyCountsById: ReadonlyMap<WorldOreSpeciesId, number>
): Record<string, number> {
  return Object.fromEntries(
    [...studyCountsById.entries()]
      .filter(([, count]) => count > 0)
      .sort(([leftId], [rightId]) => leftId.localeCompare(rightId))
  );
}

/**
 * Persists lapidary discovery to localStorage.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 */
export function writingWorldPlazaLapidaryDiscoveryToStorage(
  storageOwnerId: string | null,
  sightedOreSpeciesIds: ReadonlySet<WorldOreSpeciesId>,
  oreStudyCountsBySpeciesId: ReadonlyMap<WorldOreSpeciesId, number>
): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(
    resolvingWorldPlazaLapidaryDiscoveryStorageKey(storageOwnerId),
    JSON.stringify({
      sightedOres: [...sightedOreSpeciesIds].sort(),
      oreStudyCounts: formattingWorldPlazaLapidaryStudyCountsRecord(
        oreStudyCountsBySpeciesId
      ),
    })
  );
}
