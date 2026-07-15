import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DEFINING_WORLD_PLAZA_ONBOARDING_TUTORIAL_PREFERENCE_STORAGE_KEY } from '@/components/world/onboarding/domains/definingWorldPlazaOnboardingTutorialPreferenceConstants';

function creatingTestLocalStorage(): Storage {
  const storage = new Map<string, string>();

  return {
    get length() {
      return storage.size;
    },
    clear() {
      storage.clear();
    },
    getItem(key: string) {
      return storage.get(key) ?? null;
    },
    key(index: number) {
      return [...storage.keys()][index] ?? null;
    },
    removeItem(key: string) {
      storage.delete(key);
    },
    setItem(key: string, value: string) {
      storage.set(key, value);
    },
  };
}

describe('managingWorldPlazaOnboardingTutorialPreferenceStore', () => {
  let testLocalStorage: Storage;

  beforeEach(() => {
    testLocalStorage = creatingTestLocalStorage();
    vi.stubGlobal('localStorage', testLocalStorage);
    vi.stubGlobal('window', { localStorage: testLocalStorage });
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reads a disabled preference from localStorage on first check', async () => {
    testLocalStorage.setItem(
      DEFINING_WORLD_PLAZA_ONBOARDING_TUTORIAL_PREFERENCE_STORAGE_KEY,
      'false'
    );

    const { checkingWorldPlazaOnboardingTutorialEnabled } =
      await import('@/components/world/onboarding/domains/managingWorldPlazaOnboardingTutorialPreferenceStore');

    expect(checkingWorldPlazaOnboardingTutorialEnabled()).toBe(false);
  });

  it('persists disable choice to localStorage', async () => {
    const {
      checkingWorldPlazaOnboardingTutorialEnabled,
      settingWorldPlazaOnboardingTutorialEnabled,
    } =
      await import('@/components/world/onboarding/domains/managingWorldPlazaOnboardingTutorialPreferenceStore');

    settingWorldPlazaOnboardingTutorialEnabled(false);

    expect(checkingWorldPlazaOnboardingTutorialEnabled()).toBe(false);
    expect(
      testLocalStorage.getItem(
        DEFINING_WORLD_PLAZA_ONBOARDING_TUTORIAL_PREFERENCE_STORAGE_KEY
      )
    ).toBe('false');
  });
});
