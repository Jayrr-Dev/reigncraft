import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  DEFINING_WORLD_PLAZA_ONBOARDING_COACHMARKS_STORAGE_KEY_PREFIX,
  resolvingWorldPlazaOnboardingCoachmarksStorageKey,
} from '@/components/world/onboarding/domains/definingWorldPlazaOnboardingCoachmarkConstants';
import {
  beginningWorldPlazaOnboardingCoachmarkPlaySession,
  completingWorldPlazaOnboardingCoachmarkStep,
  gettingWorldPlazaOnboardingCoachmarkSnapshot,
  initializingWorldPlazaOnboardingCoachmarkStore,
  notifyingWorldPlazaOnboardingClaimModeSelected,
  resettingWorldPlazaOnboardingCoachmarkStoreForTests,
} from '@/components/world/onboarding/domains/managingWorldPlazaOnboardingCoachmarkStore';

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

describe('managingWorldPlazaOnboardingCoachmarkStore', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', creatingTestLocalStorage());
    vi.stubGlobal('window', globalThis);
    resettingWorldPlazaOnboardingCoachmarkStoreForTests();
  });

  it('persists dismissed tips across a new play session for the same owner', () => {
    initializingWorldPlazaOnboardingCoachmarkStore('single-player:slot-0');
    completingWorldPlazaOnboardingCoachmarkStep('claim');

    resettingWorldPlazaOnboardingCoachmarkStoreForTests();
    beginningWorldPlazaOnboardingCoachmarkPlaySession('single-player:slot-0');

    expect(
      gettingWorldPlazaOnboardingCoachmarkSnapshot().completedStepIds.has(
        'claim'
      )
    ).toBe(true);
  });

  it('does not persist completions before an owner is bound', () => {
    completingWorldPlazaOnboardingCoachmarkStep('claim');

    expect(
      localStorage.getItem(
        DEFINING_WORLD_PLAZA_ONBOARDING_COACHMARKS_STORAGE_KEY_PREFIX
      )
    ).toBeNull();
    expect(
      gettingWorldPlazaOnboardingCoachmarkSnapshot().completedStepIds.has(
        'claim'
      )
    ).toBe(false);
  });

  it('migrates legacy unsuffixed progress onto the real owner key', () => {
    localStorage.setItem(
      resolvingWorldPlazaOnboardingCoachmarksStorageKey(null),
      JSON.stringify(['move', 'hotbar', 'action-bar', 'build', 'claim'])
    );

    beginningWorldPlazaOnboardingCoachmarkPlaySession('single-player:slot-0');

    expect(
      gettingWorldPlazaOnboardingCoachmarkSnapshot().completedStepIds.has(
        'claim'
      )
    ).toBe(true);
    expect(
      localStorage.getItem(
        resolvingWorldPlazaOnboardingCoachmarksStorageKey(
          'single-player:slot-0'
        )
      )
    ).toContain('claim');
    expect(
      localStorage.getItem(
        DEFINING_WORLD_PLAZA_ONBOARDING_COACHMARKS_STORAGE_KEY_PREFIX
      )
    ).toBeNull();
  });

  it('clears session signals when a play session begins again', () => {
    initializingWorldPlazaOnboardingCoachmarkStore('single-player:slot-0');
    notifyingWorldPlazaOnboardingClaimModeSelected();

    expect(
      gettingWorldPlazaOnboardingCoachmarkSnapshot().sessionSignals
        .hasClaimModeSelected
    ).toBe(true);

    beginningWorldPlazaOnboardingCoachmarkPlaySession('single-player:slot-0');

    expect(
      gettingWorldPlazaOnboardingCoachmarkSnapshot().sessionSignals
        .hasClaimModeSelected
    ).toBe(false);
  });
});
