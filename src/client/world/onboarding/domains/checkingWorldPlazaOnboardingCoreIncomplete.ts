import type { WorldPlazaOnboardingCoachmarkStepId } from '@/components/world/onboarding/domains/definingWorldPlazaOnboardingCoachmarkConstants';
import { DEFINING_WORLD_PLAZA_ONBOARDING_COACHMARK_CORE_ORDER } from '@/components/world/onboarding/domains/definingWorldPlazaOnboardingCoachmarkRegistry';

/**
 * Returns true when any linear core onboarding step is still unfinished.
 */
export function checkingWorldPlazaOnboardingCoreIncomplete(
  completedStepIds: ReadonlySet<WorldPlazaOnboardingCoachmarkStepId>
): boolean {
  return DEFINING_WORLD_PLAZA_ONBOARDING_COACHMARK_CORE_ORDER.some(
    (stepId) => !completedStepIds.has(stepId)
  );
}
