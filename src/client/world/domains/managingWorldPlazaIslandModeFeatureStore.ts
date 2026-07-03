/**
 * Module-level store for the plaza island world feature toggle.
 *
 * @module components/world/domains/managingWorldPlazaIslandModeFeatureStore
 */

import {
  DEFINING_WORLD_PLAZA_ISLAND_MODE_FEATURE_DEFAULT_ENABLED,
  DEFINING_WORLD_PLAZA_ISLAND_MODE_FEATURE_STORAGE_KEY,
} from "@/components/world/domains/definingWorldPlazaIslandModeConstants";

/** Mutable island mode state shared across plaza components. */
const managingWorldPlazaIslandModeFeatureState: {
  isEnabled: boolean;
  revision: number;
} = {
  isEnabled: DEFINING_WORLD_PLAZA_ISLAND_MODE_FEATURE_DEFAULT_ENABLED,
  revision: 0,
};

/** React subscribers notified when island mode changes. */
const managingWorldPlazaIslandModeFeatureSubscribers = new Set<() => void>();

/**
 * Clears procedural terrain caches without creating a module load cycle.
 *
 * The invalidation barrel imports biome resolution, which imports island mode,
 * which would otherwise import invalidation back during module initialization.
 */
function invalidatingWorldPlazaProceduralGenerationCachesDeferred(): void {
  void import(
    "@/components/world/domains/invalidatingWorldPlazaProceduralGenerationCaches"
  ).then((invalidatingModule) => {
    invalidatingModule.invalidatingWorldPlazaProceduralGenerationCaches();
  });
}

/**
 * Reads the persisted island mode preference from localStorage.
 */
function readingWorldPlazaIslandModeFeatureEnabledFromStorage(): boolean {
  if (typeof window === "undefined") {
    return DEFINING_WORLD_PLAZA_ISLAND_MODE_FEATURE_DEFAULT_ENABLED;
  }

  const storedValue = window.localStorage.getItem(
    DEFINING_WORLD_PLAZA_ISLAND_MODE_FEATURE_STORAGE_KEY,
  );

  if (storedValue === null) {
    return DEFINING_WORLD_PLAZA_ISLAND_MODE_FEATURE_DEFAULT_ENABLED;
  }

  return storedValue === "true";
}

/**
 * Persists the island mode preference to localStorage.
 *
 * @param isEnabled - Whether island mode is active.
 */
function writingWorldPlazaIslandModeFeatureEnabledToStorage(
  isEnabled: boolean,
): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    DEFINING_WORLD_PLAZA_ISLAND_MODE_FEATURE_STORAGE_KEY,
    String(isEnabled),
  );
}

/**
 * Hydrates island mode from localStorage once on the client.
 */
export function initializingWorldPlazaIslandModeFeatureStoreFromStorage(): void {
  const storedEnabled = readingWorldPlazaIslandModeFeatureEnabledFromStorage();

  if (managingWorldPlazaIslandModeFeatureState.isEnabled === storedEnabled) {
    return;
  }

  managingWorldPlazaIslandModeFeatureState.isEnabled = storedEnabled;
  managingWorldPlazaIslandModeFeatureState.revision += 1;
  invalidatingWorldPlazaProceduralGenerationCachesDeferred();
  notifyingWorldPlazaIslandModeFeatureSubscribers();
}

/**
 * Returns true when the island world layout override is active.
 */
export function checkingWorldPlazaIslandModeFeatureEnabled(): boolean {
  return managingWorldPlazaIslandModeFeatureState.isEnabled;
}

/**
 * Returns a monotonic revision bumped whenever island mode toggles.
 */
export function gettingWorldPlazaIslandModeFeatureRevision(): number {
  return managingWorldPlazaIslandModeFeatureState.revision;
}

/**
 * Enables or disables island mode and notifies subscribers.
 *
 * @param isEnabled - Whether island mode should be active.
 */
export function settingWorldPlazaIslandModeFeatureEnabled(
  isEnabled: boolean,
): void {
  if (managingWorldPlazaIslandModeFeatureState.isEnabled === isEnabled) {
    return;
  }

  managingWorldPlazaIslandModeFeatureState.isEnabled = isEnabled;
  managingWorldPlazaIslandModeFeatureState.revision += 1;
  writingWorldPlazaIslandModeFeatureEnabledToStorage(isEnabled);
  invalidatingWorldPlazaProceduralGenerationCachesDeferred();
  notifyingWorldPlazaIslandModeFeatureSubscribers();
}

/**
 * Flips island mode and notifies subscribers.
 */
export function togglingWorldPlazaIslandModeFeatureEnabled(): void {
  settingWorldPlazaIslandModeFeatureEnabled(
    !managingWorldPlazaIslandModeFeatureState.isEnabled,
  );
}

/**
 * Subscribes to island mode changes.
 *
 * @param onStoreChange - Callback invoked when island mode changes.
 */
export function subscribingWorldPlazaIslandModeFeatureEnabled(
  onStoreChange: () => void,
): () => void {
  managingWorldPlazaIslandModeFeatureSubscribers.add(onStoreChange);

  return () => {
    managingWorldPlazaIslandModeFeatureSubscribers.delete(onStoreChange);
  };
}

/**
 * Notifies React subscribers that island mode changed.
 */
function notifyingWorldPlazaIslandModeFeatureSubscribers(): void {
  for (const onStoreChange of managingWorldPlazaIslandModeFeatureSubscribers) {
    onStoreChange();
  }
}
