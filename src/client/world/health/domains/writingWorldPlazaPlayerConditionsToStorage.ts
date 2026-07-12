import { resolvingWorldPlazaPlayerConditionsStorageKey } from '@/components/world/health/domains/definingWorldPlazaPlayerConditionsConstants';
import { parsingWorldPlazaPlayerConditions } from '@/components/world/health/domains/serializingWorldPlazaPlayerConditions';
import type { PlazaSinglePlayerSavePlayerConditions } from '../../../../shared/plazaSinglePlayerSavesDevvit';

function checkingWorldPlazaPlayerConditionsPayloadIsEmpty(
  playerConditions: PlazaSinglePlayerSavePlayerConditions | null
): boolean {
  if (!playerConditions) {
    return true;
  }

  return (
    playerConditions.diseaseEffects.length === 0 &&
    (playerConditions.immuneSystemFactor ?? 0) <= 0 &&
    (playerConditions.diseaseImmunityIds?.length ?? 0) === 0 &&
    typeof playerConditions.currentHealth !== 'number' &&
    typeof playerConditions.hungerRatio !== 'number'
  );
}

/** Reads persisted illness and vitals state from localStorage. */
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

/** Writes illness and vitals state to localStorage (null clears the key). */
export function writingWorldPlazaPlayerConditionsToStorage(
  persistenceOwnerId: string,
  playerConditions: PlazaSinglePlayerSavePlayerConditions | null
): void {
  if (typeof window === 'undefined') {
    return;
  }

  const storageKey =
    resolvingWorldPlazaPlayerConditionsStorageKey(persistenceOwnerId);

  if (checkingWorldPlazaPlayerConditionsPayloadIsEmpty(playerConditions)) {
    window.localStorage.removeItem(storageKey);
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(playerConditions));
}
