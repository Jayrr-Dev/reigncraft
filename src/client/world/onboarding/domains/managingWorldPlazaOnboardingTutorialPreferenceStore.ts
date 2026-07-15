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

/** True after the first client read from localStorage (or SSR skip). */
let managingWorldPlazaOnboardingTutorialHasHydratedFromStorage = false;

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
 * Loads localStorage into module state once, without notifying subscribers.
 *
 * Safe to call from `getSnapshot` so the first paint matches the saved choice.
 */
function ensuringWorldPlazaOnboardingTutorialStoreHydratedFromStorage(): void {
  if (managingWorldPlazaOnboardingTutorialHasHydratedFromStorage) {
    return;
  }

  managingWorldPlazaOnboardingTutorialHasHydratedFromStorage = true;

  if (typeof window === 'undefined') {
    return;
  }

  managingWorldPlazaOnboardingTutorialState.isEnabled =
    readingWorldPlazaOnboardingTutorialEnabledFromStorage();
}

/**
 * Hydrates tutorial preference from localStorage once on the client.
 */
export function initializingWorldPlazaOnboardingTutorialStoreFromStorage(): void {
  if (typeof window === 'undefined') {
    return;
  }

  const storedEnabled = readingWorldPlazaOnboardingTutorialEnabledFromStorage();
  managingWorldPlazaOnboardingTutorialHasHydratedFromStorage = true;

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
  ensuringWorldPlazaOnboardingTutorialStoreHydratedFromStorage();
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
  ensuringWorldPlazaOnboardingTutorialStoreHydratedFromStorage();

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
