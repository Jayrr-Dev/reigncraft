import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  gettingWorldPlazaExploredBiomesSnapshot,
  initializingWorldPlazaExploredBiomesStore,
  recordingWorldPlazaExploredBiomeKind,
  resettingWorldPlazaExploredBiomesStoreForTests,
} from '@/components/world/domains/managingWorldPlazaExploredBiomesStore';

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

describe('managingWorldPlazaExploredBiomesStore', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', creatingTestLocalStorage());
    vi.stubGlobal('window', globalThis);
    resettingWorldPlazaExploredBiomesStoreForTests();
    vi.mocked(savingPlazaSinglePlayerSaveSlotData).mockClear();
  });

  it('records explored biomes once and skips cloud without save slot', () => {
    initializingWorldPlazaExploredBiomesStore('test-biomes');
    recordingWorldPlazaExploredBiomeKind('plains');
    recordingWorldPlazaExploredBiomeKind('plains');

    expect(gettingWorldPlazaExploredBiomesSnapshot()).toEqual(['plains']);
    expect(savingPlazaSinglePlayerSaveSlotData).not.toHaveBeenCalled();
  });

  it('mirrors explored biomes to the Redis save slot when cloud context is set', () => {
    initializingWorldPlazaExploredBiomesStore('test-biomes-cloud', {
      cloudSaveSlotIndex: 1,
    });
    recordingWorldPlazaExploredBiomeKind('forest');

    expect(savingPlazaSinglePlayerSaveSlotData).toHaveBeenCalledWith(1, {
      exploredBiomeKinds: ['forest'],
    });
  });
});
