import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  gettingWorldPlazaBestiaryKilledSpeciesSnapshot,
  gettingWorldPlazaBestiarySightedSpeciesSnapshot,
  initializingWorldPlazaBestiaryDiscoveryStore,
  recordingWorldPlazaBestiarySpeciesKilled,
  recordingWorldPlazaBestiarySpeciesSighted,
} from '@/components/world/domains/managingWorldPlazaBestiaryDiscoveryStore';

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
  });

  it('records kill as both sighted and killed', () => {
    initializingWorldPlazaBestiaryDiscoveryStore('test-kill');
    recordingWorldPlazaBestiarySpeciesKilled('boar');

    expect(gettingWorldPlazaBestiarySightedSpeciesSnapshot()).toEqual(['boar']);
    expect(gettingWorldPlazaBestiaryKilledSpeciesSnapshot()).toEqual(['boar']);
  });

  it('persists discovery to localStorage', () => {
    initializingWorldPlazaBestiaryDiscoveryStore('test-persist');
    recordingWorldPlazaBestiarySpeciesSighted('deer');
    recordingWorldPlazaBestiarySpeciesKilled('boar');

    initializingWorldPlazaBestiaryDiscoveryStore('other-owner');
    expect(gettingWorldPlazaBestiarySightedSpeciesSnapshot()).toEqual([]);

    initializingWorldPlazaBestiaryDiscoveryStore('test-persist');
    expect(gettingWorldPlazaBestiarySightedSpeciesSnapshot()).toEqual([
      'boar',
      'deer',
    ]);
    expect(gettingWorldPlazaBestiaryKilledSpeciesSnapshot()).toEqual(['boar']);
  });
});
