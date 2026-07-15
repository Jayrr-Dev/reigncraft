import { beforeEach, describe, expect, it, vi } from 'vitest';

import { resolvingWorldPlazaSpritcoreUpgradeStorageKey } from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreLevelingConstants';
import {
  applyingWorldPlazaSpritcoreUpgradePurchase,
  gettingWorldPlazaSpritcoreUpgradeSnapshot,
  initializingWorldPlazaSpritcoreUpgradeStore,
  resettingWorldPlazaSpritcoreUpgradeStoreForTests,
} from '@/components/world/spritcore/domains/managingWorldPlazaSpritcoreUpgradeStore';
import { readingWorldPlazaSpritcoreUpgradeFromStorage } from '@/components/world/spritcore/domains/readingWorldPlazaSpritcoreUpgradeFromStorage';

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

describe('managingWorldPlazaSpritcoreUpgradeStore', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', creatingTestLocalStorage());
    vi.stubGlobal('window', globalThis);
    resettingWorldPlazaSpritcoreUpgradeStoreForTests();
  });

  it('persists purchased bonuses for one owner', () => {
    initializingWorldPlazaSpritcoreUpgradeStore('spritcore-owner');

    expect(applyingWorldPlazaSpritcoreUpgradePurchase('health', 120, 1)).toBe(
      'applied'
    );
    expect(gettingWorldPlazaSpritcoreUpgradeSnapshot().bonusMaxHealth).toBe(
      100
    );
    expect(
      gettingWorldPlazaSpritcoreUpgradeSnapshot().totalSpritcoreInvested
    ).toBe(120);

    initializingWorldPlazaSpritcoreUpgradeStore('other-owner');
    expect(gettingWorldPlazaSpritcoreUpgradeSnapshot().bonusMaxHealth).toBe(0);

    initializingWorldPlazaSpritcoreUpgradeStore('spritcore-owner');
    expect(gettingWorldPlazaSpritcoreUpgradeSnapshot().bonusMaxHealth).toBe(
      100
    );
    expect(
      readingWorldPlazaSpritcoreUpgradeFromStorage('spritcore-owner')
        .bonusMaxHealth
    ).toBe(100);
    expect(
      localStorage.getItem(
        resolvingWorldPlazaSpritcoreUpgradeStorageKey('spritcore-owner')
      )
    ).toContain('"bonusMaxHealth":100');
  });
});
