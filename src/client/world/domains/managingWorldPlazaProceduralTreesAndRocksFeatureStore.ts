/**
 * Module-level store for procedural trees and rocks feature toggle.
 *
 * @module components/world/domains/managingWorldPlazaProceduralTreesAndRocksFeatureStore
 */

import {
  DEFINING_WORLD_PLAZA_PROCEDURAL_TREES_AND_ROCKS_FEATURE_DEFAULT_ENABLED,
  DEFINING_WORLD_PLAZA_PROCEDURAL_TREES_AND_ROCKS_FEATURE_STORAGE_KEY,
} from '@/components/world/domains/definingWorldPlazaProceduralTreesAndRocksFeatureConstants';

/** Mutable feature state shared across plaza components. */
const managingWorldPlazaProceduralTreesAndRocksFeatureState: {
  isEnabled: boolean;
  revision: number;
} = {
  isEnabled:
    DEFINING_WORLD_PLAZA_PROCEDURAL_TREES_AND_ROCKS_FEATURE_DEFAULT_ENABLED,
  revision: 0,
};

/** React subscribers notified when the toggle changes. */
const managingWorldPlazaProceduralTreesAndRocksFeatureSubscribers = new Set<
  () => void
>();

/**
 * Clears tree and rock placement caches without creating a module load cycle.
 *
 * Resolvers import this store for the feature check, so invalidation must stay
 * deferred. Import the invalidation barrel (not the resolvers) so Vite does not
 * warn about ineffective dynamic imports of modules already in the main chunk.
 */
function invalidatingWorldPlazaProceduralTreesAndRocksCachesDeferred(): void {
  void import('@/components/world/domains/invalidatingWorldPlazaProceduralGenerationCaches').then(
    (invalidatingModule) => {
      invalidatingModule.invalidatingWorldPlazaProceduralGenerationCaches();
    }
  );
}

/**
 * Reads the persisted preference from localStorage.
 */
function readingWorldPlazaProceduralTreesAndRocksFeatureEnabledFromStorage(): boolean {
  if (typeof window === 'undefined') {
    return DEFINING_WORLD_PLAZA_PROCEDURAL_TREES_AND_ROCKS_FEATURE_DEFAULT_ENABLED;
  }

  const storedValue = window.localStorage.getItem(
    DEFINING_WORLD_PLAZA_PROCEDURAL_TREES_AND_ROCKS_FEATURE_STORAGE_KEY
  );

  if (storedValue === null) {
    return DEFINING_WORLD_PLAZA_PROCEDURAL_TREES_AND_ROCKS_FEATURE_DEFAULT_ENABLED;
  }

  return storedValue === 'true';
}

/**
 * Persists the preference to localStorage.
 *
 * @param isEnabled - Whether procedural trees and rocks are active.
 */
function writingWorldPlazaProceduralTreesAndRocksFeatureEnabledToStorage(
  isEnabled: boolean
): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    DEFINING_WORLD_PLAZA_PROCEDURAL_TREES_AND_ROCKS_FEATURE_STORAGE_KEY,
    String(isEnabled)
  );
}

/**
 * Hydrates the toggle from localStorage once on the client.
 */
export function initializingWorldPlazaProceduralTreesAndRocksFeatureStoreFromStorage(): void {
  const storedEnabled =
    readingWorldPlazaProceduralTreesAndRocksFeatureEnabledFromStorage();

  if (
    managingWorldPlazaProceduralTreesAndRocksFeatureState.isEnabled ===
    storedEnabled
  ) {
    return;
  }

  managingWorldPlazaProceduralTreesAndRocksFeatureState.isEnabled =
    storedEnabled;
  managingWorldPlazaProceduralTreesAndRocksFeatureState.revision += 1;
  invalidatingWorldPlazaProceduralTreesAndRocksCachesDeferred();
  notifyingWorldPlazaProceduralTreesAndRocksFeatureSubscribers();
}

/**
 * Returns true when procedural trees and rocks should spawn and render.
 */
export function checkingWorldPlazaProceduralTreesAndRocksFeatureEnabled(): boolean {
  return managingWorldPlazaProceduralTreesAndRocksFeatureState.isEnabled;
}

/**
 * Returns a monotonic revision bumped whenever the toggle changes.
 */
export function gettingWorldPlazaProceduralTreesAndRocksFeatureRevision(): number {
  return managingWorldPlazaProceduralTreesAndRocksFeatureState.revision;
}

/**
 * Enables or disables procedural trees and rocks and notifies subscribers.
 *
 * @param isEnabled - Whether procedural trees and rocks should be active.
 */
export function settingWorldPlazaProceduralTreesAndRocksFeatureEnabled(
  isEnabled: boolean
): void {
  if (
    managingWorldPlazaProceduralTreesAndRocksFeatureState.isEnabled ===
    isEnabled
  ) {
    return;
  }

  managingWorldPlazaProceduralTreesAndRocksFeatureState.isEnabled = isEnabled;
  managingWorldPlazaProceduralTreesAndRocksFeatureState.revision += 1;
  writingWorldPlazaProceduralTreesAndRocksFeatureEnabledToStorage(isEnabled);
  invalidatingWorldPlazaProceduralTreesAndRocksCachesDeferred();
  notifyingWorldPlazaProceduralTreesAndRocksFeatureSubscribers();
}

/**
 * Flips the toggle and notifies subscribers.
 */
export function togglingWorldPlazaProceduralTreesAndRocksFeatureEnabled(): void {
  settingWorldPlazaProceduralTreesAndRocksFeatureEnabled(
    !managingWorldPlazaProceduralTreesAndRocksFeatureState.isEnabled
  );
}

/**
 * Subscribes to toggle changes.
 *
 * @param onStoreChange - Callback invoked when the toggle changes.
 */
export function subscribingWorldPlazaProceduralTreesAndRocksFeatureEnabled(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaProceduralTreesAndRocksFeatureSubscribers.add(
    onStoreChange
  );

  return () => {
    managingWorldPlazaProceduralTreesAndRocksFeatureSubscribers.delete(
      onStoreChange
    );
  };
}

/**
 * Notifies React subscribers that the toggle changed.
 */
function notifyingWorldPlazaProceduralTreesAndRocksFeatureSubscribers(): void {
  for (const onStoreChange of managingWorldPlazaProceduralTreesAndRocksFeatureSubscribers) {
    onStoreChange();
  }
}
