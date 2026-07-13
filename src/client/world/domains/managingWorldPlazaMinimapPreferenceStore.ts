/**
 * Module-level store for the plaza minimap visibility preference.
 *
 * Unset preference: off on mobile and desktop until the player opens the map
 * from the layer orb or Settings.
 * Explicit true/false: applies on every viewport when the tier allows it.
 *
 * @module components/world/domains/managingWorldPlazaMinimapPreferenceStore
 */

import {
  DEFINING_WORLD_PLAZA_MINIMAP_DEFAULT_ENABLED_ON_DESKTOP,
  DEFINING_WORLD_PLAZA_MINIMAP_DEFAULT_ENABLED_ON_MOBILE,
  DEFINING_WORLD_PLAZA_MINIMAP_PREFERENCE_STORAGE_KEY,
} from '@/components/world/domains/definingWorldPlazaMinimapPreferenceConstants';

/** Explicit preference, or null when the player has not chosen yet. */
type ManagingWorldPlazaMinimapPreference = boolean | null;

/** Mutable minimap preference shared across plaza components. */
const managingWorldPlazaMinimapPreferenceState: {
  preference: ManagingWorldPlazaMinimapPreference;
} = {
  preference: null,
};

/** React subscribers notified when the preference changes. */
const managingWorldPlazaMinimapPreferenceSubscribers = new Set<() => void>();

function readingWorldPlazaMinimapPreferenceFromStorage(): ManagingWorldPlazaMinimapPreference {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedValue = window.localStorage.getItem(
    DEFINING_WORLD_PLAZA_MINIMAP_PREFERENCE_STORAGE_KEY
  );

  if (storedValue === null) {
    return null;
  }

  return storedValue === 'true';
}

function writingWorldPlazaMinimapPreferenceToStorage(isEnabled: boolean): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    DEFINING_WORLD_PLAZA_MINIMAP_PREFERENCE_STORAGE_KEY,
    String(isEnabled)
  );
}

/**
 * Resolves whether the minimap should render for the current viewport.
 *
 * @param isMobileViewport - True when the HUD viewport profile is mobile.
 */
export function resolvingWorldPlazaMinimapEnabledForViewport(
  isMobileViewport: boolean
): boolean {
  const { preference } = managingWorldPlazaMinimapPreferenceState;

  if (preference !== null) {
    return preference;
  }

  return isMobileViewport
    ? DEFINING_WORLD_PLAZA_MINIMAP_DEFAULT_ENABLED_ON_MOBILE
    : DEFINING_WORLD_PLAZA_MINIMAP_DEFAULT_ENABLED_ON_DESKTOP;
}

/** Hydrates minimap preference from localStorage once on the client. */
export function initializingWorldPlazaMinimapPreferenceStoreFromStorage(): void {
  const storedPreference = readingWorldPlazaMinimapPreferenceFromStorage();

  if (
    managingWorldPlazaMinimapPreferenceState.preference === storedPreference
  ) {
    return;
  }

  managingWorldPlazaMinimapPreferenceState.preference = storedPreference;
  notifyingWorldPlazaMinimapPreferenceSubscribers();
}

/** Returns the explicit preference, or null when unset. */
export function gettingWorldPlazaMinimapPreference(): boolean | null {
  return managingWorldPlazaMinimapPreferenceState.preference;
}

/** Enables or disables the minimap and notifies subscribers. */
export function settingWorldPlazaMinimapEnabled(isEnabled: boolean): void {
  if (managingWorldPlazaMinimapPreferenceState.preference === isEnabled) {
    return;
  }

  managingWorldPlazaMinimapPreferenceState.preference = isEnabled;
  writingWorldPlazaMinimapPreferenceToStorage(isEnabled);
  notifyingWorldPlazaMinimapPreferenceSubscribers();
}

/** Subscribes to minimap preference changes. */
export function subscribingWorldPlazaMinimapEnabled(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaMinimapPreferenceSubscribers.add(onStoreChange);

  return () => {
    managingWorldPlazaMinimapPreferenceSubscribers.delete(onStoreChange);
  };
}

function notifyingWorldPlazaMinimapPreferenceSubscribers(): void {
  for (const onStoreChange of managingWorldPlazaMinimapPreferenceSubscribers) {
    onStoreChange();
  }
}
