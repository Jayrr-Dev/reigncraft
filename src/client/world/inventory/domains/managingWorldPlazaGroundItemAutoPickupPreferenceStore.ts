/**
 * Module-level store for the ground-item auto-pickup preference.
 *
 * @module components/world/inventory/domains/managingWorldPlazaGroundItemAutoPickupPreferenceStore
 */

import {
  DEFINING_WORLD_PLAZA_GROUND_ITEM_AUTO_PICKUP_DEFAULT_ENABLED,
  DEFINING_WORLD_PLAZA_GROUND_ITEM_AUTO_PICKUP_STORAGE_KEY,
} from '@/components/world/inventory/domains/definingWorldPlazaGroundItemAutoPickupPreferenceConstants';

/** Mutable auto-pickup preference shared across plaza components. */
const managingWorldPlazaGroundItemAutoPickupState: {
  isEnabled: boolean;
} = {
  isEnabled: DEFINING_WORLD_PLAZA_GROUND_ITEM_AUTO_PICKUP_DEFAULT_ENABLED,
};

/** React subscribers notified when the preference changes. */
const managingWorldPlazaGroundItemAutoPickupSubscribers = new Set<() => void>();

/**
 * Reads the persisted auto-pickup preference from localStorage.
 */
function readingWorldPlazaGroundItemAutoPickupEnabledFromStorage(): boolean {
  if (typeof window === 'undefined') {
    return DEFINING_WORLD_PLAZA_GROUND_ITEM_AUTO_PICKUP_DEFAULT_ENABLED;
  }

  const storedValue = window.localStorage.getItem(
    DEFINING_WORLD_PLAZA_GROUND_ITEM_AUTO_PICKUP_STORAGE_KEY
  );

  if (storedValue === null) {
    return DEFINING_WORLD_PLAZA_GROUND_ITEM_AUTO_PICKUP_DEFAULT_ENABLED;
  }

  return storedValue === 'true';
}

/**
 * Persists the auto-pickup preference to localStorage.
 *
 * @param isEnabled - Whether walk-over auto-pickup is active.
 */
function writingWorldPlazaGroundItemAutoPickupEnabledToStorage(
  isEnabled: boolean
): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    DEFINING_WORLD_PLAZA_GROUND_ITEM_AUTO_PICKUP_STORAGE_KEY,
    String(isEnabled)
  );
}

/**
 * Hydrates auto-pickup from localStorage once on the client.
 */
export function initializingWorldPlazaGroundItemAutoPickupStoreFromStorage(): void {
  const storedEnabled =
    readingWorldPlazaGroundItemAutoPickupEnabledFromStorage();

  if (managingWorldPlazaGroundItemAutoPickupState.isEnabled === storedEnabled) {
    return;
  }

  managingWorldPlazaGroundItemAutoPickupState.isEnabled = storedEnabled;
  notifyingWorldPlazaGroundItemAutoPickupSubscribers();
}

/**
 * Returns true when walk-over auto-pickup is enabled.
 */
export function checkingWorldPlazaGroundItemAutoPickupEnabled(): boolean {
  return managingWorldPlazaGroundItemAutoPickupState.isEnabled;
}

/**
 * Enables or disables walk-over auto-pickup and notifies subscribers.
 *
 * @param isEnabled - Whether auto-pickup should be active.
 */
export function settingWorldPlazaGroundItemAutoPickupEnabled(
  isEnabled: boolean
): void {
  if (managingWorldPlazaGroundItemAutoPickupState.isEnabled === isEnabled) {
    return;
  }

  managingWorldPlazaGroundItemAutoPickupState.isEnabled = isEnabled;
  writingWorldPlazaGroundItemAutoPickupEnabledToStorage(isEnabled);
  notifyingWorldPlazaGroundItemAutoPickupSubscribers();
}

/**
 * Subscribes to auto-pickup preference changes.
 *
 * @param onStoreChange - Callback invoked when the preference changes.
 */
export function subscribingWorldPlazaGroundItemAutoPickupEnabled(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaGroundItemAutoPickupSubscribers.add(onStoreChange);

  return () => {
    managingWorldPlazaGroundItemAutoPickupSubscribers.delete(onStoreChange);
  };
}

/**
 * Notifies React subscribers that the preference changed.
 */
function notifyingWorldPlazaGroundItemAutoPickupSubscribers(): void {
  for (const onStoreChange of managingWorldPlazaGroundItemAutoPickupSubscribers) {
    onStoreChange();
  }
}
