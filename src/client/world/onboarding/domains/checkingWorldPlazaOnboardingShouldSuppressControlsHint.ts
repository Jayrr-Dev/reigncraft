import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import { checkingWorldPlazaOnboardingCoreIncomplete } from '@/components/world/onboarding/domains/checkingWorldPlazaOnboardingCoreIncomplete';
import { gettingWorldPlazaOnboardingCoachmarkSnapshot } from '@/components/world/onboarding/domains/managingWorldPlazaOnboardingCoachmarkStore';
import { checkingWorldPlazaOnboardingTutorialEnabled } from '@/components/world/onboarding/domains/managingWorldPlazaOnboardingTutorialPreferenceStore';

/**
 * Returns true when the boot controls hint should be suppressed for onboarding.
 */
export function checkingWorldPlazaOnboardingShouldSuppressControlsHint(): boolean {
  if (
    !checkingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_ONBOARDING_COACHMARKS
    ) ||
    !checkingWorldPlazaOnboardingTutorialEnabled()
  ) {
    return false;
  }

  return checkingWorldPlazaOnboardingCoreIncomplete(
    gettingWorldPlazaOnboardingCoachmarkSnapshot().completedStepIds
  );
}
