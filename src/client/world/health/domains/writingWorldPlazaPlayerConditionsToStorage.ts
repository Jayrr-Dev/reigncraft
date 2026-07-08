import { resolvingWorldPlazaPlayerConditionsStorageKey } from '@/components/world/health/domains/definingWorldPlazaPlayerConditionsConstants';
import { parsingWorldPlazaPlayerConditionsDiseaseEffects } from '@/components/world/health/domains/serializingWorldPlazaPlayerConditions';
import type { PlazaSinglePlayerSavePlayerConditions } from '../../../../shared/plazaSinglePlayerSavesDevvit';

/** Reads persisted illness state from localStorage. */
export function readingWorldPlazaPlayerConditionsFromStorage(
  persistenceOwnerId: string,
  worldEpochMs = Date.now()
) {
  if (typeof window === 'undefined') {
    return [];
  }

  const rawValue = window.localStorage.getItem(
    resolvingWorldPlazaPlayerConditionsStorageKey(persistenceOwnerId)
  );

  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue) as PlazaSinglePlayerSavePlayerConditions;

    return parsingWorldPlazaPlayerConditionsDiseaseEffects(parsed, worldEpochMs);
  } catch {
    return [];
  }
}

/** Writes illness state to localStorage (null clears the key). */
export function writingWorldPlazaPlayerConditionsToStorage(
  persistenceOwnerId: string,
  playerConditions: PlazaSinglePlayerSavePlayerConditions | null
): void {
  if (typeof window === 'undefined') {
    return;
  }

  const storageKey =
    resolvingWorldPlazaPlayerConditionsStorageKey(persistenceOwnerId);

  if (!playerConditions || playerConditions.diseaseEffects.length === 0) {
    window.localStorage.removeItem(storageKey);
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(playerConditions));
}
