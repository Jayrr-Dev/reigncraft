/**
 * Module-level store for the onboarding tutorial visibility preference.
 *
 * @module components/world/onboarding/domains/managingWorldPlazaOnboardingTutorialPreferenceStore
 */

import {
  DEFINING_WORLD_PLAZA_ONBOARDING_TUTORIAL_DEFAULT_ENABLED,
  DEFINING_WORLD_PLAZA_ONBOARDING_TUTORIAL_PREFERENCE_STORAGE_KEY,
} from '@/components/world/onboarding/domains/definingWorldPlazaOnboardingTutorialPreferenceConstants';

/** Mutable tutorial preference shared across plaza components. */
const managingWorldPlazaOnboardingTutorialState: {
  isEnabled: boolean;
} = {
  isEnabled: DEFINING_WORLD_PLAZA_ONBOARDING_TUTORIAL_DEFAULT_ENABLED,
};

/** React subscribers notified when the preference changes. */
const managingWorldPlazaOnboardingTutorialSubscribers = new Set<() => void>();

/**
 * Reads the persisted tutorial preference from localStorage.
 */
function readingWorldPlazaOnboardingTutorialEnabledFromStorage(): boolean {
  if (typeof window === 'undefined') {
    return DEFINING_WORLD_PLAZA_ONBOARDING_TUTORIAL_DEFAULT_ENABLED;
  }

  const storedValue = window.localStorage.getItem(
    DEFINING_WORLD_PLAZA_ONBOARDING_TUTORIAL_PREFERENCE_STORAGE_KEY
  );

  if (storedValue === null) {
    return DEFINING_WORLD_PLAZA_ONBOARDING_TUTORIAL_DEFAULT_ENABLED;
  }

  return storedValue === 'true';
}

/**
 * Persists the tutorial preference to localStorage.
 *
 * @param isEnabled - Whether onboarding coachmarks should show.
 */
function writingWorldPlazaOnboardingTutorialEnabledToStorage(
  isEnabled: boolean
): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    DEFINING_WORLD_PLAZA_ONBOARDING_TUTORIAL_PREFERENCE_STORAGE_KEY,
    String(isEnabled)
  );
}

/**
 * Hydrates tutorial preference from localStorage once on the client.
 */
export function initializingWorldPlazaOnboardingTutorialStoreFromStorage(): void {
  const storedEnabled = readingWorldPlazaOnboardingTutorialEnabledFromStorage();

  if (managingWorldPlazaOnboardingTutorialState.isEnabled === storedEnabled) {
    return;
  }

  managingWorldPlazaOnboardingTutorialState.isEnabled = storedEnabled;
  notifyingWorldPlazaOnboardingTutorialSubscribers();
}

/**
 * Returns true when onboarding tutorial coachmarks are enabled.
 */
export function checkingWorldPlazaOnboardingTutorialEnabled(): boolean {
  return managingWorldPlazaOnboardingTutorialState.isEnabled;
}

/**
 * Enables or disables onboarding tutorial tips and notifies subscribers.
 *
 * @param isEnabled - Whether onboarding coachmarks should show.
 */
export function settingWorldPlazaOnboardingTutorialEnabled(
  isEnabled: boolean
): void {
  if (managingWorldPlazaOnboardingTutorialState.isEnabled === isEnabled) {
    return;
  }

  managingWorldPlazaOnboardingTutorialState.isEnabled = isEnabled;
  writingWorldPlazaOnboardingTutorialEnabledToStorage(isEnabled);
  notifyingWorldPlazaOnboardingTutorialSubscribers();
}

/**
 * Subscribes to tutorial preference changes.
 *
 * @param onStoreChange - Callback invoked when the preference changes.
 */
export function subscribingWorldPlazaOnboardingTutorialEnabled(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaOnboardingTutorialSubscribers.add(onStoreChange);

  return () => {
    managingWorldPlazaOnboardingTutorialSubscribers.delete(onStoreChange);
  };
}

/**
 * Notifies React subscribers that the preference changed.
 */
function notifyingWorldPlazaOnboardingTutorialSubscribers(): void {
  for (const onStoreChange of managingWorldPlazaOnboardingTutorialSubscribers) {
    onStoreChange();
  }
}
