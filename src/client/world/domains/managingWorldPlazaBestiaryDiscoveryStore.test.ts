import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  gettingWorldPlazaBestiaryKillCountsSnapshot,
  gettingWorldPlazaBestiaryKilledSpeciesSnapshot,
  gettingWorldPlazaBestiarySightedSpeciesSnapshot,
  initializingWorldPlazaBestiaryDiscoveryStore,
  recordingWorldPlazaBestiarySpeciesKilled,
  recordingWorldPlazaBestiarySpeciesSighted,
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
