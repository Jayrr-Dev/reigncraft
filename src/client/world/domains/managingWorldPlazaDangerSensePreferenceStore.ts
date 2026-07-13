/**
 * Module-level store for the danger-sense HUD visibility preference.
 *
 * @module components/world/domains/managingWorldPlazaDangerSensePreferenceStore
 */

import {
  DEFINING_WORLD_PLAZA_DANGER_SENSE_DEFAULT_ENABLED,
  DEFINING_WORLD_PLAZA_DANGER_SENSE_PREFERENCE_STORAGE_KEY,
} from '@/components/world/domains/definingWorldPlazaDangerSenseHudConstants';

/** Mutable danger-sense preference shared across plaza components. */
const managingWorldPlazaDangerSenseState: {
  isEnabled: boolean;
} = {
  isEnabled: DEFINING_WORLD_PLAZA_DANGER_SENSE_DEFAULT_ENABLED,
};

/** React subscribers notified when the preference changes. */
const managingWorldPlazaDangerSenseSubscribers = new Set<() => void>();

/**
 * Reads the persisted danger-sense preference from localStorage.
 */
function readingWorldPlazaDangerSenseEnabledFromStorage(): boolean {
  if (typeof window === 'undefined') {
    return DEFINING_WORLD_PLAZA_DANGER_SENSE_DEFAULT_ENABLED;
  }

  const storedValue = window.localStorage.getItem(
    DEFINING_WORLD_PLAZA_DANGER_SENSE_PREFERENCE_STORAGE_KEY
  );

  if (storedValue === null) {
    return DEFINING_WORLD_PLAZA_DANGER_SENSE_DEFAULT_ENABLED;
  }

  return storedValue === 'true';
}

/**
 * Persists the danger-sense preference to localStorage.
 *
 * @param isEnabled - Whether the rim vignette should show.
 */
function writingWorldPlazaDangerSenseEnabledToStorage(isEnabled: boolean): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    DEFINING_WORLD_PLAZA_DANGER_SENSE_PREFERENCE_STORAGE_KEY,
    String(isEnabled)
  );
}

/**
 * Hydrates danger-sense from localStorage once on the client.
 */
export function initializingWorldPlazaDangerSenseStoreFromStorage(): void {
  const storedEnabled = readingWorldPlazaDangerSenseEnabledFromStorage();

  if (managingWorldPlazaDangerSenseState.isEnabled === storedEnabled) {
    return;
  }

  managingWorldPlazaDangerSenseState.isEnabled = storedEnabled;
  notifyingWorldPlazaDangerSenseSubscribers();
}

/**
 * Returns true when the danger-sense rim vignette is enabled.
 */
export function checkingWorldPlazaDangerSenseEnabled(): boolean {
  return managingWorldPlazaDangerSenseState.isEnabled;
}

/**
 * Enables or disables danger-sense and notifies subscribers.
 *
 * @param isEnabled - Whether the rim vignette should show.
 */
export function settingWorldPlazaDangerSenseEnabled(isEnabled: boolean): void {
  if (managingWorldPlazaDangerSenseState.isEnabled === isEnabled) {
    return;
  }

  managingWorldPlazaDangerSenseState.isEnabled = isEnabled;
  writingWorldPlazaDangerSenseEnabledToStorage(isEnabled);
  notifyingWorldPlazaDangerSenseSubscribers();
}

/**
 * Subscribes to danger-sense preference changes.
 *
 * @param onStoreChange - Callback invoked when the preference changes.
 */
export function subscribingWorldPlazaDangerSenseEnabled(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaDangerSenseSubscribers.add(onStoreChange);

  return () => {
    managingWorldPlazaDangerSenseSubscribers.delete(onStoreChange);
  };
}

/**
 * Notifies React subscribers that the preference changed.
 */
function notifyingWorldPlazaDangerSenseSubscribers(): void {
  for (const onStoreChange of managingWorldPlazaDangerSenseSubscribers) {
    onStoreChange();
  }
}
