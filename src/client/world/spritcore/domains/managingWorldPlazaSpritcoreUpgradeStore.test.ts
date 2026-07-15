import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DEFINING_WORLD_PLAZA_AVATAR_SKIN } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import { resolvingWorldPlazaSpritcoreUpgradeStorageKey } from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreLevelingConstants';
import {
  applyingWorldPlazaSpritcoreDeathCommittedPenalty,
  applyingWorldPlazaSpritcoreUpgradePurchase,
  gettingWorldPlazaSpritcoreUpgradeSnapshot,
  initializingWorldPlazaSpritcoreUpgradeStore,
  resettingWorldPlazaSpritcoreUpgradeStoreForTests,
  type ApplyingWorldPlazaSpritcoreUpgradePurchaseContext,
} from '@/components/world/spritcore/domains/managingWorldPlazaSpritcoreUpgradeStore';
import { readingWorldPlazaSpritcoreUpgradeFromStorage } from '@/components/world/spritcore/domains/readingWorldPlazaSpritcoreUpgradeFromStorage';

const TEST_SPRITCORE_PURCHASE_CONTEXT: ApplyingWorldPlazaSpritcoreUpgradePurchaseContext =
  {
    nominalAttackSpeed: 1,
    naturalDefense: 5,
    naturalRunSpeed: 3,
  };

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

  it('persists purchased bonuses for one owner form', () => {
    initializingWorldPlazaSpritcoreUpgradeStore(
      'spritcore-owner',
      DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE
    );

    expect(
      applyingWorldPlazaSpritcoreUpgradePurchase(
        'health',
        120,
        TEST_SPRITCORE_PURCHASE_CONTEXT
      )
    ).toBe('applied');
    expect(gettingWorldPlazaSpritcoreUpgradeSnapshot().bonusMaxHealth).toBe(
      100
    );
    expect(
      gettingWorldPlazaSpritcoreUpgradeSnapshot().totalSpritcoreInvested
    ).toBe(120);

    initializingWorldPlazaSpritcoreUpgradeStore(
      'other-owner',
      DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE
    );
    expect(gettingWorldPlazaSpritcoreUpgradeSnapshot().bonusMaxHealth).toBe(0);

    initializingWorldPlazaSpritcoreUpgradeStore(
      'spritcore-owner',
      DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE
    );
    expect(gettingWorldPlazaSpritcoreUpgradeSnapshot().bonusMaxHealth).toBe(
      100
    );
    expect(
      readingWorldPlazaSpritcoreUpgradeFromStorage(
        'spritcore-owner',
        DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE
      ).bonusMaxHealth
    ).toBe(100);
    expect(
      localStorage.getItem(
        resolvingWorldPlazaSpritcoreUpgradeStorageKey(
          'spritcore-owner',
          DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE
        )
      )
    ).toContain('"bonusMaxHealth":100');
  });

  it('keeps Spiritcore spend separate per avatar form', () => {
    initializingWorldPlazaSpritcoreUpgradeStore(
      'spritcore-owner',
      DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE
    );
    expect(
      applyingWorldPlazaSpritcoreUpgradePurchase(
        'health',
        120,
        TEST_SPRITCORE_PURCHASE_CONTEXT
      )
    ).toBe('applied');

    initializingWorldPlazaSpritcoreUpgradeStore(
      'spritcore-owner',
      DEFINING_WORLD_PLAZA_AVATAR_SKIN.HUSKY
    );
    expect(gettingWorldPlazaSpritcoreUpgradeSnapshot().bonusMaxHealth).toBe(0);
    expect(
      applyingWorldPlazaSpritcoreUpgradePurchase(
        'damage',
        50,
        TEST_SPRITCORE_PURCHASE_CONTEXT
      )
    ).toBe('applied');
    expect(gettingWorldPlazaSpritcoreUpgradeSnapshot().bonusAttackPower).toBe(
      10
    );

    initializingWorldPlazaSpritcoreUpgradeStore(
      'spritcore-owner',
      DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE
    );
    expect(gettingWorldPlazaSpritcoreUpgradeSnapshot().bonusMaxHealth).toBe(
      100
    );
    expect(gettingWorldPlazaSpritcoreUpgradeSnapshot().bonusAttackPower).toBe(
      0
    );
  });

  it('applies death committed penalty and persists weakened bonuses', () => {
    localStorage.setItem(
      resolvingWorldPlazaSpritcoreUpgradeStorageKey(
        'spritcore-owner',
        DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE
      ),
      JSON.stringify({
        bonusMaxHealth: 1000,
        bonusAttackPower: 100,
        bonusAttackSpeed: 0.5,
        totalSpritcoreInvested: 10_000,
      })
    );
    initializingWorldPlazaSpritcoreUpgradeStore(
      'spritcore-owner',
      DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE
    );

    expect(applyingWorldPlazaSpritcoreDeathCommittedPenalty()).toBe(800);
    expect(gettingWorldPlazaSpritcoreUpgradeSnapshot()).toEqual({
      bonusMaxHealth: 920,
      bonusAttackPower: 92,
      bonusAttackSpeed: 0.46,
      bonusDefense: 0,
      bonusMoveSpeed: 0,
      totalSpritcoreInvested: 9200,
    });
    expect(
      readingWorldPlazaSpritcoreUpgradeFromStorage(
        'spritcore-owner',
        DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE
      )
    ).toEqual({
      bonusMaxHealth: 920,
      bonusAttackPower: 92,
      bonusAttackSpeed: 0.46,
      bonusDefense: 0,
      bonusMoveSpeed: 0,
      totalSpritcoreInvested: 9200,
    });
  });

  it('migrates legacy owner-only saves onto the default Girl form', () => {
    localStorage.setItem(
      resolvingWorldPlazaSpritcoreUpgradeStorageKey('legacy-owner'),
      JSON.stringify({ bonusMaxHealth: 200, totalSpritcoreInvested: 240 })
    );

    initializingWorldPlazaSpritcoreUpgradeStore(
      'legacy-owner',
      DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE
    );
    expect(gettingWorldPlazaSpritcoreUpgradeSnapshot().bonusMaxHealth).toBe(
      200
    );
    expect(
      localStorage.getItem(
        resolvingWorldPlazaSpritcoreUpgradeStorageKey(
          'legacy-owner',
          DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE
        )
      )
    ).toContain('"bonusMaxHealth":200');
  });
});
