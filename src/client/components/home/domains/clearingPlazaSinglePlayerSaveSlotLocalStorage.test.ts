import { clearingPlazaSinglePlayerSaveSlotLocalStorage } from '@/components/home/domains/clearingPlazaSinglePlayerSaveSlotLocalStorage';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import {
  attachingWorldPlazaRecipePage,
  gettingWorldPlazaRecipeAttachedSnapshot,
  initializingWorldPlazaRecipeDiscoveryStore,
  resettingWorldPlazaRecipeDiscoveryStoreForTests,
} from '@/components/world/domains/managingWorldPlazaRecipeDiscoveryStore';
import {
  clearingWorldPlazaLocalFarmlandMemoryForOwner,
  resolvingWorldPlazaFarmlandLocalStorageKey,
  writingWorldPlazaLocalFarmlandTileState,
} from '@/components/world/farming/domains/managingWorldPlazaLocalFarmland';
import { resolvingWorldPlazaChoppedTreesLocalStorageKey } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import { resolvingWorldPlazaMinedRocksLocalStorageKey } from '@/components/world/harvest/domains/managingWorldPlazaLocalMinedRocks';
import { resolvingWorldPlazaPickedFlowersLocalStorageKey } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedFlowers';
import { resolvingWorldPlazaPickedPebblesLocalStorageKey } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedPebbles';
import { resolvingWorldPlazaInventoryStorageKey } from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock(
  '@/components/home/repositories/callingPlazaSinglePlayerSavesDevvitApi',
  () => ({
    savingPlazaSinglePlayerSaveSlotData: vi.fn(async () => undefined),
  })
);

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

describe('clearingPlazaSinglePlayerSaveSlotLocalStorage', () => {
  const persistenceOwnerId = 'single-player:slot-1';
  let testLocalStorage: Storage;

  beforeEach(() => {
    testLocalStorage = creatingTestLocalStorage();
    vi.stubGlobal('localStorage', testLocalStorage);
    vi.stubGlobal('window', { localStorage: testLocalStorage });
  });

  afterEach(() => {
    clearingWorldPlazaLocalFarmlandMemoryForOwner(persistenceOwnerId);
    resettingWorldPlazaRecipeDiscoveryStoreForTests();
    vi.unstubAllGlobals();
  });

  it('removes farmland, mined rocks, picked pebbles, and picked flowers keys with the rest', () => {
    const keys = [
      resolvingWorldPlazaInventoryStorageKey(persistenceOwnerId),
      resolvingWorldPlazaFarmlandLocalStorageKey(persistenceOwnerId),
      resolvingWorldPlazaMinedRocksLocalStorageKey(persistenceOwnerId),
      resolvingWorldPlazaPickedPebblesLocalStorageKey(persistenceOwnerId),
      resolvingWorldPlazaPickedFlowersLocalStorageKey(persistenceOwnerId),
      resolvingWorldPlazaChoppedTreesLocalStorageKey(persistenceOwnerId),
    ];

    for (const key of keys) {
      testLocalStorage.setItem(key, '{"seed":true}');
    }

    clearingPlazaSinglePlayerSaveSlotLocalStorage(persistenceOwnerId);

    for (const key of keys) {
      expect(testLocalStorage.getItem(key)).toBeNull();
    }
  });

  it('drops farmland memory so later reads do not revive wiped tiles', () => {
    writingWorldPlazaLocalFarmlandTileState(persistenceOwnerId, 1, 2, {
      phase: 'tilled',
      cropId: '',
      phaseStartedAtMs: 0,
    });

    expect(
      testLocalStorage.getItem(
        resolvingWorldPlazaFarmlandLocalStorageKey(persistenceOwnerId)
      )
    ).not.toBeNull();

    clearingPlazaSinglePlayerSaveSlotLocalStorage(persistenceOwnerId);

    expect(
      testLocalStorage.getItem(
        resolvingWorldPlazaFarmlandLocalStorageKey(persistenceOwnerId)
      )
    ).toBeNull();
  });

  it('drops recipe discovery memory so same-slot re-enter does not keep attaches', () => {
    resettingWorldPlazaRecipeDiscoveryStoreForTests();
    initializingWorldPlazaRecipeDiscoveryStore(persistenceOwnerId);
    attachingWorldPlazaRecipePage(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CAMPFIRE
    );

    clearingPlazaSinglePlayerSaveSlotLocalStorage(persistenceOwnerId);
    initializingWorldPlazaRecipeDiscoveryStore(persistenceOwnerId);

    expect(gettingWorldPlazaRecipeAttachedSnapshot()).toEqual([]);
  });
});
