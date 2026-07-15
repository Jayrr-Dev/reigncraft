import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DEFINING_PLAZA_CODEX_STUDY_FULL_COUNT } from '@/components/home/domains/definingPlazaCodexStudyTier';
import {
  applyingWorldPlazaAvatarTransform,
  applyingWorldPlazaAvatarTransformDeathReset,
} from '@/components/world/domains/applyingWorldPlazaAvatarTransform';
import { DEFINING_WORLD_PLAZA_AVATAR_SKIN } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import { DEFINING_WORLD_PLAZA_AVATAR_TRANSFORM_COOLDOWN_MS } from '@/components/world/domains/definingWorldPlazaAvatarTransformConstants';
import {
  gettingWorldPlazaSelectedAvatarSkinId,
  initializingWorldPlazaAvatarSkinSelectionStore,
  resettingWorldPlazaAvatarSkinSelectionStoreForTests,
  settingWorldPlazaSelectedAvatarSkin,
} from '@/components/world/domains/managingWorldPlazaAvatarSkinSelectionStore';
import {
  checkingWorldPlazaAvatarTransformIsOnCooldown,
  initializingWorldPlazaAvatarTransformCooldownStore,
  resettingWorldPlazaAvatarTransformCooldownStoreForTests,
} from '@/components/world/domains/managingWorldPlazaAvatarTransformCooldownStore';
import {
  initializingWorldPlazaBestiaryDiscoveryStore,
  recordingWorldPlazaBestiarySpeciesStudied,
  resettingWorldPlazaBestiaryDiscoveryStoreForTests,
} from '@/components/world/domains/managingWorldPlazaBestiaryDiscoveryStore';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

vi.mock('@/components/ui/domains/showingReigncraftToast', () => ({
  showingReigncraftToast: vi.fn(),
}));

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

function unlockingPlayableAnimalForms(
  ...speciesIds: readonly DefiningWildlifeSpeciesId[]
): void {
  for (const speciesId of speciesIds) {
    recordingWorldPlazaBestiarySpeciesStudied(
      speciesId,
      DEFINING_PLAZA_CODEX_STUDY_FULL_COUNT
    );
  }
}

describe('applyingWorldPlazaAvatarTransform', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', creatingTestLocalStorage());
    vi.stubGlobal('window', globalThis);
    resettingWorldPlazaAvatarSkinSelectionStoreForTests();
    resettingWorldPlazaAvatarTransformCooldownStoreForTests();
    resettingWorldPlazaBestiaryDiscoveryStoreForTests();
    initializingWorldPlazaAvatarSkinSelectionStore('transform-owner');
    initializingWorldPlazaAvatarTransformCooldownStore('transform-owner');
    initializingWorldPlazaBestiaryDiscoveryStore('transform-owner');
  });

  it('applies a new form and starts the 1-day cooldown', () => {
    const nowMs = 1_000_000;
    unlockingPlayableAnimalForms('husky');

    expect(
      applyingWorldPlazaAvatarTransform(
        DEFINING_WORLD_PLAZA_AVATAR_SKIN.HUSKY,
        nowMs
      )
    ).toBe('applied');
    expect(gettingWorldPlazaSelectedAvatarSkinId()).toBe(
      DEFINING_WORLD_PLAZA_AVATAR_SKIN.HUSKY
    );
    expect(checkingWorldPlazaAvatarTransformIsOnCooldown(nowMs)).toBe(true);
    expect(
      checkingWorldPlazaAvatarTransformIsOnCooldown(
        nowMs + DEFINING_WORLD_PLAZA_AVATAR_TRANSFORM_COOLDOWN_MS
      )
    ).toBe(false);
  });

  it('blocks another transform while cooldown is active', () => {
    const nowMs = 2_000_000;
    unlockingPlayableAnimalForms('husky', 'grizzly');

    expect(
      applyingWorldPlazaAvatarTransform(
        DEFINING_WORLD_PLAZA_AVATAR_SKIN.HUSKY,
        nowMs
      )
    ).toBe('applied');
    expect(
      applyingWorldPlazaAvatarTransform(
        DEFINING_WORLD_PLAZA_AVATAR_SKIN.GRIZZLY,
        nowMs + 1
      )
    ).toBe('cooldown');
    expect(gettingWorldPlazaSelectedAvatarSkinId()).toBe(
      DEFINING_WORLD_PLAZA_AVATAR_SKIN.HUSKY
    );
  });

  it('blocks animal forms until bestiary mastery', () => {
    expect(
      applyingWorldPlazaAvatarTransform(
        DEFINING_WORLD_PLAZA_AVATAR_SKIN.HUSKY,
        2_500_000
      )
    ).toBe('study-locked');
    expect(gettingWorldPlazaSelectedAvatarSkinId()).toBe(
      DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE
    );
    expect(checkingWorldPlazaAvatarTransformIsOnCooldown(2_500_000)).toBe(
      false
    );
  });

  it('treats selecting the active form as unchanged', () => {
    expect(
      applyingWorldPlazaAvatarTransform(
        DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE,
        3_000_000
      )
    ).toBe('unchanged');
    expect(checkingWorldPlazaAvatarTransformIsOnCooldown(3_000_000)).toBe(
      false
    );
  });

  it('resets to Girl on death without clearing transform cooldown', () => {
    const nowMs = 4_000_000;
    unlockingPlayableAnimalForms('husky');

    expect(
      applyingWorldPlazaAvatarTransform(
        DEFINING_WORLD_PLAZA_AVATAR_SKIN.HUSKY,
        nowMs
      )
    ).toBe('applied');
    expect(applyingWorldPlazaAvatarTransformDeathReset()).toBe(true);
    expect(gettingWorldPlazaSelectedAvatarSkinId()).toBe(
      DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE
    );
    expect(checkingWorldPlazaAvatarTransformIsOnCooldown(nowMs + 1)).toBe(true);
    expect(applyingWorldPlazaAvatarTransformDeathReset()).toBe(false);

    settingWorldPlazaSelectedAvatarSkin(DEFINING_WORLD_PLAZA_AVATAR_SKIN.HUSKY);
    expect(applyingWorldPlazaAvatarTransformDeathReset()).toBe(true);
    expect(gettingWorldPlazaSelectedAvatarSkinId()).toBe(
      DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE
    );
  });
});
