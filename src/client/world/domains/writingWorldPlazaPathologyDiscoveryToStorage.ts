import { resolvingWorldPlazaPathologyDiscoveryStorageKey } from '@/components/world/domains/definingWorldPlazaPathologyDiscoveryConstants';
import type { DefiningWorldPlazaEntityDiseaseId } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';

function formattingWorldPlazaPathologyLinkedStudiesRecord(
  linkedStudiesById: ReadonlyMap<DefiningWorldPlazaEntityDiseaseId, number>
): Record<string, number> {
  return Object.fromEntries(
    [...linkedStudiesById.entries()]
      .filter(([, count]) => count > 0)
      .sort(([leftId], [rightId]) => leftId.localeCompare(rightId))
  );
}

/**
 * Persists Pathology discovery to localStorage.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 */
export function writingWorldPlazaPathologyDiscoveryToStorage(
  storageOwnerId: string | null,
  obtainedDiseaseIds: ReadonlySet<DefiningWorldPlazaEntityDiseaseId>,
  linkedCreatureStudiesByDiseaseId: ReadonlyMap<
    DefiningWorldPlazaEntityDiseaseId,
    number
  >
): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(
    resolvingWorldPlazaPathologyDiscoveryStorageKey(storageOwnerId),
    JSON.stringify({
      obtainedDiseases: [...obtainedDiseaseIds].sort(),
      linkedCreatureStudies: formattingWorldPlazaPathologyLinkedStudiesRecord(
        linkedCreatureStudiesByDiseaseId
      ),
    })
  );
}
