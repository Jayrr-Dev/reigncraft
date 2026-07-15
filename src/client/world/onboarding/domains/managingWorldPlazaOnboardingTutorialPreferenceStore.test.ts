import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DEFINING_WORLD_PLAZA_ONBOARDING_TUTORIAL_PREFERENCE_STORAGE_KEY } from '@/components/world/onboarding/domains/definingWorldPlazaOnboardingTutorialPreferenceConstants';

describe('managingWorldPlazaOnboardingTutorialPreferenceStore', () => {
  beforeEach(() => {
    vi.resetModules();
    window.localStorage.clear();
  });

  it('reads a disabled preference from localStorage on first check', async () => {
    window.localStorage.setItem(
      DEFINING_WORLD_PLAZA_ONBOARDING_TUTORIAL_PREFERENCE_STORAGE_KEY,
      'false'
    );

    const { checkingWorldPlazaOnboardingTutorialEnabled } = await import(
      '@/components/world/onboarding/domains/managingWorldPlazaOnboardingTutorialPreferenceStore'
    );

    expect(checkingWorldPlazaOnboardingTutorialEnabled()).toBe(false);
  });

  it('persists disable choice to localStorage', async () => {
    const {
      checkingWorldPlazaOnboardingTutorialEnabled,
      settingWorldPlazaOnboardingTutorialEnabled,
    } = await import(
      '@/components/world/onboarding/domains/managingWorldPlazaOnboardingTutorialPreferenceStore'
    );

    settingWorldPlazaOnboardingTutorialEnabled(false);

    expect(checkingWorldPlazaOnboardingTutorialEnabled()).toBe(false);
    expect(
      window.localStorage.getItem(
        DEFINING_WORLD_PLAZA_ONBOARDING_TUTORIAL_PREFERENCE_STORAGE_KEY
      )
    ).toBe('false');
  });
});
