/**
 * Module-level store for the plaza auto-jump preference.
 *
 * Unset preference: on for mobile viewports, off for desktop.
 * Explicit true/false: applies on every viewport.
 *
 * @module components/world/domains/managingWorldPlazaMobileAutoJumpStore
 */

import {
  DEFINING_WORLD_PLAZA_MOBILE_AUTO_JUMP_DEFAULT_ENABLED_ON_MOBILE,
  DEFINING_WORLD_PLAZA_MOBILE_AUTO_JUMP_STORAGE_KEY,
} from '@/components/world/domains/definingWorldPlazaMobileAutoJumpConstants';

/** Explicit preference, or null when the player has not chosen yet. */
type ManagingWorldPlazaMobileAutoJumpPreference = boolean | null;

/** Mutable auto-jump preference shared across plaza components. */
const managingWorldPlazaMobileAutoJumpState: {
  preference: ManagingWorldPlazaMobileAutoJumpPreference;
} = {
  preference: null,
};

/** React subscribers notified when the preference changes. */
const managingWorldPlazaMobileAutoJumpSubscribers = new Set<() => void>();

/**
 * Reads the persisted auto-jump preference from localStorage.
 *
 * @returns Explicit boolean, or null when unset.
 */
function readingWorldPlazaMobileAutoJumpPreferenceFromStorage(): ManagingWorldPlazaMobileAutoJumpPreference {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedValue = window.localStorage.getItem(
    DEFINING_WORLD_PLAZA_MOBILE_AUTO_JUMP_STORAGE_KEY
  );

  if (storedValue === null) {
    return null;
  }

  return storedValue === 'true';
}

/**
 * Persists an explicit auto-jump preference to localStorage.
 *
 * @param isEnabled - Whether auto-jump is active.
 */
function writingWorldPlazaMobileAutoJumpEnabledToStorage(
  isEnabled: boolean
): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    DEFINING_WORLD_PLAZA_MOBILE_AUTO_JUMP_STORAGE_KEY,
    String(isEnabled)
  );
}

/**
 * Resolves whether auto-jump should run for the current viewport.
 *
 * @param isMobileViewport - True when the HUD viewport profile is mobile.
 */
export function resolvingWorldPlazaMobileAutoJumpEnabledForViewport(
  isMobileViewport: boolean
): boolean {
  const { preference } = managingWorldPlazaMobileAutoJumpState;

  if (preference !== null) {
    return preference;
  }

  return (
    isMobileViewport &&
    DEFINING_WORLD_PLAZA_MOBILE_AUTO_JUMP_DEFAULT_ENABLED_ON_MOBILE
  );
}

/**
 * Hydrates auto-jump from localStorage once on the client.
 */
export function initializingWorldPlazaMobileAutoJumpStoreFromStorage(): void {
  const storedPreference =
    readingWorldPlazaMobileAutoJumpPreferenceFromStorage();

  if (managingWorldPlazaMobileAutoJumpState.preference === storedPreference) {
    return;
  }

  managingWorldPlazaMobileAutoJumpState.preference = storedPreference;
  notifyingWorldPlazaMobileAutoJumpSubscribers();
}

/**
 * Returns true when auto-jump is enabled for the given viewport.
 *
 * @param isMobileViewport - True when the HUD viewport profile is mobile.
 */
export function checkingWorldPlazaMobileAutoJumpEnabled(
  isMobileViewport: boolean
): boolean {
  return resolvingWorldPlazaMobileAutoJumpEnabledForViewport(isMobileViewport);
}

/**
 * Returns the explicit preference, or null when unset (viewport default applies).
 */
export function gettingWorldPlazaMobileAutoJumpPreference(): boolean | null {
  return managingWorldPlazaMobileAutoJumpState.preference;
}

/**
 * Enables or disables auto-jump on every viewport and notifies subscribers.
 *
 * @param isEnabled - Whether auto-jump should be active.
 */
export function settingWorldPlazaMobileAutoJumpEnabled(
  isEnabled: boolean
): void {
  if (managingWorldPlazaMobileAutoJumpState.preference === isEnabled) {
    return;
  }

  managingWorldPlazaMobileAutoJumpState.preference = isEnabled;
  writingWorldPlazaMobileAutoJumpEnabledToStorage(isEnabled);
  notifyingWorldPlazaMobileAutoJumpSubscribers();
}

/**
 * Subscribes to auto-jump preference changes.
 *
 * @param onStoreChange - Callback invoked when the preference changes.
 */
export function subscribingWorldPlazaMobileAutoJumpEnabled(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaMobileAutoJumpSubscribers.add(onStoreChange);

  return () => {
    managingWorldPlazaMobileAutoJumpSubscribers.delete(onStoreChange);
  };
}

/**
 * Notifies React subscribers that the preference changed.
 */
function notifyingWorldPlazaMobileAutoJumpSubscribers(): void {
  for (const onStoreChange of managingWorldPlazaMobileAutoJumpSubscribers) {
    onStoreChange();
  }
}
