/**
 * Settings preference: show or hide onboarding tutorial coachmarks.
 *
 * @module components/world/onboarding/domains/definingWorldPlazaOnboardingTutorialPreferenceConstants
 */

/** localStorage key for the onboarding tutorial visibility preference. */
export const DEFINING_WORLD_PLAZA_ONBOARDING_TUTORIAL_PREFERENCE_STORAGE_KEY =
  'world-plaza-onboarding-tutorial-enabled' as const;

/**
 * Default: on. Soft first-spawn tips stay available until the player turns
 * them off in Settings.
 */
export const DEFINING_WORLD_PLAZA_ONBOARDING_TUTORIAL_DEFAULT_ENABLED = true;

/** Settings row label in the action-bar mixer panel. */
export const LABELING_WORLD_PLAZA_ONBOARDING_TUTORIAL_TOGGLE =
  'Tutorial' as const;
