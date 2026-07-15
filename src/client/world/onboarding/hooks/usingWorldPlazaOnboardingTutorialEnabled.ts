'use client';

/**
 * React subscription to the onboarding tutorial visibility preference store.
 *
 * @module components/world/onboarding/hooks/usingWorldPlazaOnboardingTutorialEnabled
 */

import { DEFINING_WORLD_PLAZA_ONBOARDING_TUTORIAL_DEFAULT_ENABLED } from '@/components/world/onboarding/domains/definingWorldPlazaOnboardingTutorialPreferenceConstants';
import { resettingWorldPlazaOnboardingCoachmarkProgress } from '@/components/world/onboarding/domains/managingWorldPlazaOnboardingCoachmarkStore';
import {
  checkingWorldPlazaOnboardingTutorialEnabled,
  initializingWorldPlazaOnboardingTutorialStoreFromStorage,
  settingWorldPlazaOnboardingTutorialEnabled,
  subscribingWorldPlazaOnboardingTutorialEnabled,
} from '@/components/world/onboarding/domains/managingWorldPlazaOnboardingTutorialPreferenceStore';
import { useCallback, useLayoutEffect, useSyncExternalStore } from 'react';

export type UsingWorldPlazaOnboardingTutorialEnabledResult = {
  /** True when soft onboarding coachmark tips should show. */
  isOnboardingTutorialEnabled: boolean;
  /** Enables or disables onboarding tutorial tips. */
  settingOnboardingTutorialEnabled: (isEnabled: boolean) => void;
};

/**
 * Subscribes to the onboarding tutorial preference store.
 *
 * Turning tips back on clears completed coachmark steps so the sequence can
 * run again when the player needs help.
 */
export function usingWorldPlazaOnboardingTutorialEnabled(): UsingWorldPlazaOnboardingTutorialEnabledResult {
  useLayoutEffect(() => {
    initializingWorldPlazaOnboardingTutorialStoreFromStorage();
  }, []);

  const isOnboardingTutorialEnabled = useSyncExternalStore(
    subscribingWorldPlazaOnboardingTutorialEnabled,
    checkingWorldPlazaOnboardingTutorialEnabled,
    () => DEFINING_WORLD_PLAZA_ONBOARDING_TUTORIAL_DEFAULT_ENABLED
  );

  const settingOnboardingTutorialEnabled = useCallback(
    (isEnabled: boolean): void => {
      const wasEnabled = checkingWorldPlazaOnboardingTutorialEnabled();
      settingWorldPlazaOnboardingTutorialEnabled(isEnabled);

      if (isEnabled && !wasEnabled) {
        resettingWorldPlazaOnboardingCoachmarkProgress();
      }
    },
    []
  );

  return {
    isOnboardingTutorialEnabled,
    settingOnboardingTutorialEnabled,
  };
}
