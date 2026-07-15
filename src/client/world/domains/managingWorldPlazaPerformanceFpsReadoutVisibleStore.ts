/**
 * Module-level store for the plaza corner FPS readout visibility preference.
 *
 * @module components/world/domains/managingWorldPlazaPerformanceFpsReadoutVisibleStore
 */

import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_READOUT_DEFAULT_VISIBLE,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_READOUT_VISIBLE_STORAGE_KEY,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsUiConstants';

/** Mutable FPS readout visibility shared across plaza components. */
const managingWorldPlazaPerformanceFpsReadoutVisibleState: {
  isVisible: boolean;
} = {
  isVisible:
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_READOUT_DEFAULT_VISIBLE,
};

/** React subscribers notified when visibility changes. */
const managingWorldPlazaPerformanceFpsReadoutVisibleSubscribers = new Set<
  () => void
>();

/**
 * Reads the persisted FPS readout flag from session storage.
 */
function readingWorldPlazaPerformanceFpsReadoutVisibleFromStorage(): boolean {
  if (typeof window === 'undefined') {
    return DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_READOUT_DEFAULT_VISIBLE;
  }

  const storedValue = window.sessionStorage.getItem(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_READOUT_VISIBLE_STORAGE_KEY
  );

  if (storedValue === null) {
    return DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_READOUT_DEFAULT_VISIBLE;
  }

  return storedValue === 'true';
}

/**
 * Persists the FPS readout flag to session storage.
 *
 * @param isVisible - True when the corner FPS counter should stay on.
 */
function writingWorldPlazaPerformanceFpsReadoutVisibleToStorage(
  isVisible: boolean
): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_READOUT_VISIBLE_STORAGE_KEY,
    String(isVisible)
  );
}

/**
 * Hydrates FPS readout visibility from session storage once on the client.
 */
export function initializingWorldPlazaPerformanceFpsReadoutVisibleStoreFromStorage(): void {
  const storedVisible =
    readingWorldPlazaPerformanceFpsReadoutVisibleFromStorage();

  if (
    managingWorldPlazaPerformanceFpsReadoutVisibleState.isVisible ===
    storedVisible
  ) {
    return;
  }

  managingWorldPlazaPerformanceFpsReadoutVisibleState.isVisible = storedVisible;
  notifyingWorldPlazaPerformanceFpsReadoutVisibleSubscribers();
}

/**
 * Returns true when the corner FPS counter is visible.
 */
export function checkingWorldPlazaPerformanceFpsReadoutVisible(): boolean {
  return managingWorldPlazaPerformanceFpsReadoutVisibleState.isVisible;
}

/**
 * Enables or disables the corner FPS readout and notifies subscribers.
 *
 * @param isVisible - Whether the corner FPS counter should stay on.
 */
export function settingWorldPlazaPerformanceFpsReadoutVisible(
  isVisible: boolean
): void {
  if (
    managingWorldPlazaPerformanceFpsReadoutVisibleState.isVisible === isVisible
  ) {
    return;
  }

  managingWorldPlazaPerformanceFpsReadoutVisibleState.isVisible = isVisible;
  writingWorldPlazaPerformanceFpsReadoutVisibleToStorage(isVisible);
  notifyingWorldPlazaPerformanceFpsReadoutVisibleSubscribers();
}

/**
 * Subscribes to FPS readout visibility changes.
 *
 * @param onStoreChange - Callback invoked when visibility changes.
 */
export function subscribingWorldPlazaPerformanceFpsReadoutVisible(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaPerformanceFpsReadoutVisibleSubscribers.add(onStoreChange);

  return () => {
    managingWorldPlazaPerformanceFpsReadoutVisibleSubscribers.delete(
      onStoreChange
    );
  };
}

/**
 * Notifies React subscribers that visibility changed.
 */
function notifyingWorldPlazaPerformanceFpsReadoutVisibleSubscribers(): void {
  for (const onStoreChange of managingWorldPlazaPerformanceFpsReadoutVisibleSubscribers) {
    onStoreChange();
  }
}
