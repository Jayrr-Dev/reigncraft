import { beforeEach, describe, expect, it, vi } from 'vitest';

import { filteringPlazaRecipesGuideDisplayEntriesByCookbook } from '@/components/home/domains/filteringPlazaRecipesGuideDisplayEntriesByCookbook';
import { resolvingPlazaRecipesGuideDisplayEntries } from '@/components/home/domains/resolvingPlazaRecipesGuideDisplayEntries';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID } from '@/components/world/building/domains/definingWorldPlazaCraftModeCookbookRegistry';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import {
  attachingWorldPlazaRecipePage,
  gettingWorldPlazaRecipeAttachedSnapshot,
  initializingWorldPlazaRecipeDiscoveryStore,
  recordingWorldPlazaRecipePageAttached,
  resettingWorldPlazaRecipeDiscoveryStoreForTests,
} from '@/components/world/domains/managingWorldPlazaRecipeDiscoveryStore';
import { readingWorldPlazaRecipeDiscoveryFromStorage } from '@/components/world/domains/readingWorldPlazaRecipeDiscoveryFromStorage';

vi.mock(
  '@/components/home/repositories/callingPlazaSinglePlayerSavesDevvitApi',
  () => ({
    savingPlazaSinglePlayerSaveSlotData: vi.fn(async () => undefined),
  })
);

import { savingPlazaSinglePlayerSaveSlotData } from '@/components/home/repositories/callingPlazaSinglePlayerSavesDevvitApi';

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

describe('managingWorldPlazaRecipeDiscoveryStore', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', creatingTestLocalStorage());
    vi.stubGlobal('window', globalThis);
    resettingWorldPlazaRecipeDiscoveryStoreForTests();
    vi.mocked(savingPlazaSinglePlayerSaveSlotData).mockClear();
  });

  it('records attached recipe pages once and persists them', () => {
    initializingWorldPlazaRecipeDiscoveryStore('test-recipes-attach');
    expect(
      attachingWorldPlazaRecipePage(
        DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CAMPFIRE
      )
    ).toBe('attached');
    expect(
      attachingWorldPlazaRecipePage(
        DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CAMPFIRE
      )
    ).toBe('already-attached');

    expect(gettingWorldPlazaRecipeAttachedSnapshot()).toEqual([
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CAMPFIRE,
    ]);

    const persisted = readingWorldPlazaRecipeDiscoveryFromStorage(
      'test-recipes-attach'
    );
    expect([...persisted.attachedRecipeIds]).toEqual([
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CAMPFIRE,
    ]);
    expect(savingPlazaSinglePlayerSaveSlotData).not.toHaveBeenCalled();
  });

  it('mirrors attaches to the Redis save slot when cloud context is set', () => {
    initializingWorldPlazaRecipeDiscoveryStore('test-recipes-cloud', {
      cloudSaveSlotIndex: 1,
    });
    recordingWorldPlazaRecipePageAttached(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CAMPFIRE
    );

    expect(savingPlazaSinglePlayerSaveSlotData).toHaveBeenCalledWith(1, {
      attachedRecipeIds: [DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CAMPFIRE],
    });
  });

  it('shows mystery names until attached, then filters by cookbook', () => {
    const lockedEntries = resolvingPlazaRecipesGuideDisplayEntries(new Set());
    expect(lockedEntries[0]?.isAttached).toBe(false);
    expect(lockedEntries[0]?.displayName).toBe('???');

    const attachedEntries = resolvingPlazaRecipesGuideDisplayEntries(
      new Set([DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CAMPFIRE])
    );
    expect(attachedEntries[0]?.isAttached).toBe(true);
    expect(attachedEntries[0]?.displayName).toBe('Campfire');

    const survivalOnly = filteringPlazaRecipesGuideDisplayEntriesByCookbook(
      attachedEntries,
      DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.SURVIVAL
    );
    const blacksmithOnly = filteringPlazaRecipesGuideDisplayEntriesByCookbook(
      attachedEntries,
      DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.BLACKSMITH
    );

    expect(survivalOnly).toHaveLength(1);
    expect(blacksmithOnly).toHaveLength(3);
    expect(blacksmithOnly.every((entry) => entry.isAttached === false)).toBe(
      true
    );
  });
});
