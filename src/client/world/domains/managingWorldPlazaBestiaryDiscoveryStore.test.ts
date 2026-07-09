import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DEFINING_WORLD_PLAZA_DEV_MODE_BESTIARY_FULL_UNLOCK_KILL_COUNT } from '@/components/world/domains/definingWorldPlazaDevModeBestiaryUnlockConstants';
import {
  gettingWorldPlazaBestiaryKillCountsSnapshot,
  gettingWorldPlazaBestiaryKilledSpeciesSnapshot,
  gettingWorldPlazaBestiarySightedSpeciesSnapshot,
  initializingWorldPlazaBestiaryDiscoveryStore,
  lockingWorldPlazaBestiaryDiscoveryAllForDev,
  recordingWorldPlazaBestiarySpeciesKilled,
  recordingWorldPlazaBestiarySpeciesSighted,
  settingWorldPlazaBestiarySpeciesKillCountForDev,
  settingWorldPlazaBestiarySpeciesSightedForDev,
  unlockingWorldPlazaBestiaryDiscoveryAllForDev,
} from '@/components/world/domains/managingWorldPlazaBestiaryDiscoveryStore';
import { readingWorldPlazaBestiaryDiscoveryFromStorage } from '@/components/world/domains/readingWorldPlazaBestiaryDiscoveryFromStorage';

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
  });

  it('records sighted species once', () => {
    initializingWorldPlazaBestiaryDiscoveryStore('test-sighted');
    recordingWorldPlazaBestiarySpeciesSighted('deer');
    recordingWorldPlazaBestiarySpeciesSighted('deer');

    expect(gettingWorldPlazaBestiarySightedSpeciesSnapshot()).toEqual(['deer']);
    expect(gettingWorldPlazaBestiaryKilledSpeciesSnapshot()).toEqual([]);
    expect(gettingWorldPlazaBestiaryKillCountsSnapshot()).toEqual({});
  });

  it('increments kill counts on every kill', () => {
    initializingWorldPlazaBestiaryDiscoveryStore('test-kill-increment');
    recordingWorldPlazaBestiarySpeciesKilled('boar');
    recordingWorldPlazaBestiarySpeciesKilled('boar');

    expect(gettingWorldPlazaBestiarySightedSpeciesSnapshot()).toEqual(['boar']);
    expect(gettingWorldPlazaBestiaryKilledSpeciesSnapshot()).toEqual(['boar']);
    expect(gettingWorldPlazaBestiaryKillCountsSnapshot()).toEqual({ boar: 2 });
  });

  it('persists killCounts to localStorage', () => {
    initializingWorldPlazaBestiaryDiscoveryStore('test-persist');
    recordingWorldPlazaBestiarySpeciesSighted('deer');
    recordingWorldPlazaBestiarySpeciesKilled('boar');
    recordingWorldPlazaBestiarySpeciesKilled('boar');

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

  it('migrates legacy killed arrays into killCounts', () => {
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
    expect(snapshot.killCountsBySpeciesId.get('deer')).toBe(1);
    expect(snapshot.killCountsBySpeciesId.get('boar')).toBeUndefined();
  });
});
