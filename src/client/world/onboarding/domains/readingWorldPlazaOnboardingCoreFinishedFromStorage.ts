import { resolvingWorldPlazaOnboardingCoreFinishedStorageKey } from '@/components/world/onboarding/domains/definingWorldPlazaOnboardingCoachmarkConstants';

/**
 * Returns true when the player finished core onboarding tips for this owner.
 *
 * @param storageOwnerId - Session owner id, or null for the legacy global key.
 */
export function readingWorldPlazaOnboardingCoreFinishedFromStorage(
  storageOwnerId: string | null
): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return (
      localStorage.getItem(
        resolvingWorldPlazaOnboardingCoreFinishedStorageKey(storageOwnerId)
      ) === 'true'
    );
  } catch {
    return false;
  }
}
