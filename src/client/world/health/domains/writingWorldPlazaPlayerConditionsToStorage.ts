import { resolvingWorldPlazaPlayerConditionsStorageKey } from '@/components/world/health/domains/definingWorldPlazaPlayerConditionsConstants';
import { parsingWorldPlazaPlayerConditions } from '@/components/world/health/domains/serializingWorldPlazaPlayerConditions';
import type { PlazaSinglePlayerSavePlayerConditions } from '../../../../shared/plazaSinglePlayerSavesDevvit';

/** Reads persisted illness state from localStorage. */
export function readingWorldPlazaPlayerConditionsFromStorage(
  persistenceOwnerId: string,
  worldEpochMs = Date.now()
) {
  return parsingWorldPlazaPlayerConditions(
    readingWorldPlazaPlayerConditionsPayloadFromStorage(persistenceOwnerId),
    worldEpochMs
  );
}

/** Reads the raw persisted player-conditions payload from localStorage. */
export function readingWorldPlazaPlayerConditionsPayloadFromStorage(
  persistenceOwnerId: string
): PlazaSinglePlayerSavePlayerConditions | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawValue = window.localStorage.getItem(
    resolvingWorldPlazaPlayerConditionsStorageKey(persistenceOwnerId)
  );

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as PlazaSinglePlayerSavePlayerConditions;
  } catch {
    return null;
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

  if (
    !playerConditions ||
    (playerConditions.diseaseEffects.length === 0 &&
      (playerConditions.immuneSystemFactor ?? 0) <= 0 &&
      (playerConditions.diseaseImmunityIds?.length ?? 0) === 0)
  ) {
    window.localStorage.removeItem(storageKey);
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(playerConditions));
}
