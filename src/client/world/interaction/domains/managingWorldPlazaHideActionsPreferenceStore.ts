/**
 * Module-level store for the hide-actions (click-only labels) preference.
 *
 * @module components/world/interaction/domains/managingWorldPlazaHideActionsPreferenceStore
 */

import {
  DEFINING_WORLD_PLAZA_HIDE_ACTIONS_DEFAULT_ENABLED,
  DEFINING_WORLD_PLAZA_HIDE_ACTIONS_STORAGE_KEY,
} from '@/components/world/interaction/domains/definingWorldPlazaHideActionsPreferenceConstants';

/** Mutable hide-actions preference shared across plaza components. */
const managingWorldPlazaHideActionsState: {
  isEnabled: boolean;
} = {
  isEnabled: DEFINING_WORLD_PLAZA_HIDE_ACTIONS_DEFAULT_ENABLED,
};

/** React subscribers notified when the preference changes. */
const managingWorldPlazaHideActionsSubscribers = new Set<() => void>();

/**
 * Reads the persisted hide-actions preference from localStorage.
 */
function readingWorldPlazaHideActionsEnabledFromStorage(): boolean {
  if (typeof window === 'undefined') {
    return DEFINING_WORLD_PLAZA_HIDE_ACTIONS_DEFAULT_ENABLED;
  }

  const storedValue = window.localStorage.getItem(
    DEFINING_WORLD_PLAZA_HIDE_ACTIONS_STORAGE_KEY
  );

  if (storedValue === null) {
    return DEFINING_WORLD_PLAZA_HIDE_ACTIONS_DEFAULT_ENABLED;
  }

  return storedValue === 'true';
}

/**
 * Persists the hide-actions preference to localStorage.
 *
 * @param isEnabled - Whether proximity action labels are hidden.
 */
function writingWorldPlazaHideActionsEnabledToStorage(
  isEnabled: boolean
): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    DEFINING_WORLD_PLAZA_HIDE_ACTIONS_STORAGE_KEY,
    String(isEnabled)
  );
}

/**
 * Hydrates hide-actions from localStorage once on the client.
 */
export function initializingWorldPlazaHideActionsStoreFromStorage(): void {
  const storedEnabled = readingWorldPlazaHideActionsEnabledFromStorage();

  if (managingWorldPlazaHideActionsState.isEnabled === storedEnabled) {
    return;
  }

  managingWorldPlazaHideActionsState.isEnabled = storedEnabled;
  notifyingWorldPlazaHideActionsSubscribers();
}

/**
 * Returns true when proximity action labels are hidden (click-only).
 */
export function checkingWorldPlazaHideActionsEnabled(): boolean {
  return managingWorldPlazaHideActionsState.isEnabled;
}

/**
 * Enables or disables hide-actions and notifies subscribers.
 *
 * @param isEnabled - Whether proximity labels should stay hidden.
 */
export function settingWorldPlazaHideActionsEnabled(isEnabled: boolean): void {
  if (managingWorldPlazaHideActionsState.isEnabled === isEnabled) {
    return;
  }

  managingWorldPlazaHideActionsState.isEnabled = isEnabled;
  writingWorldPlazaHideActionsEnabledToStorage(isEnabled);
  notifyingWorldPlazaHideActionsSubscribers();
}

/**
 * Subscribes to hide-actions preference changes.
 *
 * @param onStoreChange - Callback invoked when the preference changes.
 */
export function subscribingWorldPlazaHideActionsEnabled(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaHideActionsSubscribers.add(onStoreChange);

  return () => {
    managingWorldPlazaHideActionsSubscribers.delete(onStoreChange);
  };
}

/**
 * Notifies React subscribers that the preference changed.
 */
function notifyingWorldPlazaHideActionsSubscribers(): void {
  for (const onStoreChange of managingWorldPlazaHideActionsSubscribers) {
    onStoreChange();
  }
}
