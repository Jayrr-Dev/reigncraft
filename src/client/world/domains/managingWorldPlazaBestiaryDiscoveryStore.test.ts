import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DEFINING_WORLD_PLAZA_DEV_MODE_BESTIARY_FULL_UNLOCK_KILL_COUNT } from '@/components/world/domains/definingWorldPlazaDevModeBestiaryUnlockConstants';
import {
  gettingWorldPlazaBestiaryKillCountsSnapshot,
  gettingWorldPlazaBestiaryKilledSpeciesSnapshot,
  gettingWorldPlazaBestiarySightedSpeciesSnapshot,
  initializingWorldPlazaBestiaryDiscoveryStore,
  lockingWorldPlazaBestiaryDiscoveryAllForDev,
  recordingWorldPlazaBestiarySpeciesSighted,
  recordingWorldPlazaBestiarySpeciesStudied,
  resettingWorldPlazaBestiaryDiscoveryStoreForTests,
  settingWorldPlazaBestiarySpeciesKillCountForDev,
  settingWorldPlazaBestiarySpeciesSightedForDev,
  unlockingWorldPlazaBestiaryDiscoveryAllForDev,
} from '@/components/world/domains/managingWorldPlazaBestiaryDiscoveryStore';
import { readingWorldPlazaBestiaryDiscoveryFromStorage } from '@/components/world/domains/readingWorldPlazaBestiaryDiscoveryFromStorage';

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

describe('managingWorldPlazaBestiaryDiscoveryStore', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', creatingTestLocalStorage());
    vi.stubGlobal('window', globalThis);
    resettingWorldPlazaBestiaryDiscoveryStoreForTests();
    vi.mocked(savingPlazaSinglePlayerSaveSlotData).mockClear();
  });

  it('records sighted species once', () => {
    initializingWorldPlazaBestiaryDiscoveryStore('test-sighted');
    recordingWorldPlazaBestiarySpeciesSighted('deer');
    recordingWorldPlazaBestiarySpeciesSighted('deer');

    expect(gettingWorldPlazaBestiarySightedSpeciesSnapshot()).toEqual(['deer']);
    expect(gettingWorldPlazaBestiaryKilledSpeciesSnapshot()).toEqual([]);
    expect(gettingWorldPlazaBestiaryKillCountsSnapshot()).toEqual({});
    expect(savingPlazaSinglePlayerSaveSlotData).not.toHaveBeenCalled();
  });

  it('mirrors sightings to the Redis save slot when cloud context is set', () => {
    initializingWorldPlazaBestiaryDiscoveryStore('test-bestiary-cloud', {
      cloudSaveSlotIndex: 2,
    });
    recordingWorldPlazaBestiarySpeciesSighted('deer');

    expect(savingPlazaSinglePlayerSaveSlotData).toHaveBeenCalledWith(2, {
      bestiaryDiscovery: {
        sightedSpeciesIds: ['deer'],
        studyCountsBySpeciesId: {},
      },
    });
  });

  it('increments study counts on every Study completion', () => {
    initializingWorldPlazaBestiaryDiscoveryStore('test-study-increment');
    recordingWorldPlazaBestiarySpeciesStudied('boar');
    recordingWorldPlazaBestiarySpeciesStudied('boar');

    expect(gettingWorldPlazaBestiarySightedSpeciesSnapshot()).toEqual(['boar']);
    expect(gettingWorldPlazaBestiaryKilledSpeciesSnapshot()).toEqual(['boar']);
    expect(gettingWorldPlazaBestiaryKillCountsSnapshot()).toEqual({ boar: 2 });
  });

  it('awards multiple study points from one large-animal Study', () => {
    initializingWorldPlazaBestiaryDiscoveryStore('test-study-points');
    recordingWorldPlazaBestiarySpeciesStudied('brown-bear', 3);

    expect(gettingWorldPlazaBestiaryKillCountsSnapshot()).toEqual({
      'brown-bear': 3,
    });
  });

  it('persists studyCounts to localStorage', () => {
    initializingWorldPlazaBestiaryDiscoveryStore('test-persist');
    recordingWorldPlazaBestiarySpeciesSighted('deer');
    recordingWorldPlazaBestiarySpeciesStudied('boar');
    recordingWorldPlazaBestiarySpeciesStudied('boar');

    initializingWorldPlazaBestiaryDiscoveryStore('other-owner');
    expect(gettingWorldPlazaBestiaryKillCountsSnapshot()).toEqual({});

    initializingWorldPlazaBestiaryDiscoveryStore('test-persist');
    expect(gettingWorldPlazaBestiarySightedSpeciesSnapshot()).toEqual([
      'boar',
      'deer',
    ]);
    expect(gettingWorldPlazaBestiaryKilledSpeciesSnapshot()).toEqual(['boar']);
    expect(gettingWorldPlazaBestiaryKillCountsSnapshot()).toEqual({ boar: 2 });
  });

  it('dev helpers set sight, kills, unlock all, and lock all', () => {
    initializingWorldPlazaBestiaryDiscoveryStore('test-dev-unlocks');
    settingWorldPlazaBestiarySpeciesSightedForDev('deer', true);
    settingWorldPlazaBestiarySpeciesKillCountForDev('deer', 50);

    expect(gettingWorldPlazaBestiarySightedSpeciesSnapshot()).toEqual(['deer']);
    expect(gettingWorldPlazaBestiaryKillCountsSnapshot()).toEqual({ deer: 50 });

    unlockingWorldPlazaBestiaryDiscoveryAllForDev(
      ['deer', 'boar'],
      DEFINING_WORLD_PLAZA_DEV_MODE_BESTIARY_FULL_UNLOCK_KILL_COUNT
    );

    expect(gettingWorldPlazaBestiarySightedSpeciesSnapshot()).toEqual([
      'boar',
      'deer',
    ]);
    expect(gettingWorldPlazaBestiaryKillCountsSnapshot()).toEqual({
      boar: DEFINING_WORLD_PLAZA_DEV_MODE_BESTIARY_FULL_UNLOCK_KILL_COUNT,
      deer: DEFINING_WORLD_PLAZA_DEV_MODE_BESTIARY_FULL_UNLOCK_KILL_COUNT,
    });

    settingWorldPlazaBestiarySpeciesSightedForDev('deer', false);

    expect(gettingWorldPlazaBestiarySightedSpeciesSnapshot()).toEqual(['boar']);
    expect(gettingWorldPlazaBestiaryKillCountsSnapshot()).toEqual({
      boar: DEFINING_WORLD_PLAZA_DEV_MODE_BESTIARY_FULL_UNLOCK_KILL_COUNT,
    });

    lockingWorldPlazaBestiaryDiscoveryAllForDev();

    expect(gettingWorldPlazaBestiarySightedSpeciesSnapshot()).toEqual([]);
    expect(gettingWorldPlazaBestiaryKillCountsSnapshot()).toEqual({});
  });
});

describe('readingWorldPlazaBestiaryDiscoveryFromStorage', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', creatingTestLocalStorage());
    vi.stubGlobal('window', globalThis);
  });

  it('migrates legacy killed arrays into studyCounts', () => {
    localStorage.setItem(
      'world-plaza-bestiary-discovery:test-legacy',
      JSON.stringify({
        sighted: ['deer', 'boar'],
        killed: ['deer'],
      })
    );

    const snapshot =
      readingWorldPlazaBestiaryDiscoveryFromStorage('test-legacy');

    expect([...snapshot.sightedSpeciesIds].sort()).toEqual(['boar', 'deer']);
    expect(snapshot.studyCountsBySpeciesId.get('deer')).toBe(1);
    expect(snapshot.studyCountsBySpeciesId.get('boar')).toBeUndefined();
  });
});
