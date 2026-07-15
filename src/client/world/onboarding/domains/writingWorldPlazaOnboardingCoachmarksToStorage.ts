import {
  resolvingWorldPlazaOnboardingCoachmarksStorageKey,
  type WorldPlazaOnboardingCoachmarkStepId,
} from '@/components/world/onboarding/domains/definingWorldPlazaOnboardingCoachmarkConstants';

/**
 * Persists completed onboarding coachmark step ids to localStorage.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 * @param completedStepIds - Coachmark steps the player finished or dismissed.
 */
export function writingWorldPlazaOnboardingCoachmarksToStorage(
  storageOwnerId: string | null,
  completedStepIds: ReadonlySet<WorldPlazaOnboardingCoachmarkStepId>
): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(
    resolvingWorldPlazaOnboardingCoachmarksStorageKey(storageOwnerId),
    JSON.stringify([...completedStepIds])
  );
}
