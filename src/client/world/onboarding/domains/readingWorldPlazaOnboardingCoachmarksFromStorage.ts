import {
  resolvingWorldPlazaOnboardingCoachmarksStorageKey,
  type WorldPlazaOnboardingCoachmarkStepId,
} from '@/components/world/onboarding/domains/definingWorldPlazaOnboardingCoachmarkConstants';
import { DEFINING_WORLD_PLAZA_ONBOARDING_COACHMARK_REGISTRY } from '@/components/world/onboarding/domains/definingWorldPlazaOnboardingCoachmarkRegistry';

const READING_WORLD_PLAZA_ONBOARDING_COACHMARK_VALID_STEP_IDS =
  new Set<WorldPlazaOnboardingCoachmarkStepId>(
    DEFINING_WORLD_PLAZA_ONBOARDING_COACHMARK_REGISTRY.map(
      (definition) => definition.id
    )
  );

/**
 * Reads completed onboarding coachmark step ids from localStorage.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 */
export function readingWorldPlazaOnboardingCoachmarksFromStorage(
  storageOwnerId: string | null
): ReadonlySet<WorldPlazaOnboardingCoachmarkStepId> {
  if (typeof window === 'undefined') {
    return new Set();
  }

  try {
    const rawValue = localStorage.getItem(
      resolvingWorldPlazaOnboardingCoachmarksStorageKey(storageOwnerId)
    );

    if (!rawValue) {
      return new Set();
    }

    const parsedValue = JSON.parse(rawValue);

    if (!Array.isArray(parsedValue)) {
      return new Set();
    }

    const stepIds = parsedValue.filter(
      (value): value is WorldPlazaOnboardingCoachmarkStepId =>
        typeof value === 'string' &&
        READING_WORLD_PLAZA_ONBOARDING_COACHMARK_VALID_STEP_IDS.has(
          value as WorldPlazaOnboardingCoachmarkStepId
        )
    );

    return new Set(stepIds);
  } catch {
    return new Set();
  }
}
