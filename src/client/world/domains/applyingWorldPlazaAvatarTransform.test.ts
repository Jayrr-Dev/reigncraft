import { beforeEach, describe, expect, it, vi } from 'vitest';

import { applyingWorldPlazaAvatarTransform } from '@/components/world/domains/applyingWorldPlazaAvatarTransform';
import { DEFINING_WORLD_PLAZA_AVATAR_SKIN } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import { DEFINING_WORLD_PLAZA_AVATAR_TRANSFORM_COOLDOWN_MS } from '@/components/world/domains/definingWorldPlazaAvatarTransformConstants';
import {
  gettingWorldPlazaSelectedAvatarSkinId,
  initializingWorldPlazaAvatarSkinSelectionStore,
  resettingWorldPlazaAvatarSkinSelectionStoreForTests,
} from '@/components/world/domains/managingWorldPlazaAvatarSkinSelectionStore';
import {
  checkingWorldPlazaAvatarTransformIsOnCooldown,
  initializingWorldPlazaAvatarTransformCooldownStore,
  resettingWorldPlazaAvatarTransformCooldownStoreForTests,
} from '@/components/world/domains/managingWorldPlazaAvatarTransformCooldownStore';

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

describe('applyingWorldPlazaAvatarTransform', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', creatingTestLocalStorage());
    vi.stubGlobal('window', globalThis);
    resettingWorldPlazaAvatarSkinSelectionStoreForTests();
    resettingWorldPlazaAvatarTransformCooldownStoreForTests();
    initializingWorldPlazaAvatarSkinSelectionStore('transform-owner');
    initializingWorldPlazaAvatarTransformCooldownStore('transform-owner');
  });

  it('applies a new form and starts the 1-day cooldown', () => {
    const nowMs = 1_000_000;

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
});
