import { resolvingWorldPlazaOnboardingCoreFinishedStorageKey } from '@/components/world/onboarding/domains/definingWorldPlazaOnboardingCoachmarkConstants';

/**
 * Persists whether core onboarding tips are finished for this owner.
 *
 * @param storageOwnerId - Session owner id, or null for the legacy global key.
 * @param isFinished - True when move / hotbar / action-bar are all done.
 */
export function writingWorldPlazaOnboardingCoreFinishedToStorage(
  storageOwnerId: string | null,
  isFinished: boolean
): void {
  if (typeof window === 'undefined') {
    return;
  }

  const storageKey =
    resolvingWorldPlazaOnboardingCoreFinishedStorageKey(storageOwnerId);

  try {
    if (isFinished) {
      localStorage.setItem(storageKey, 'true');
      return;
    }

    localStorage.removeItem(storageKey);
  } catch {
    // Private mode / quota: skip; in-memory completed steps still apply.
  }
}
