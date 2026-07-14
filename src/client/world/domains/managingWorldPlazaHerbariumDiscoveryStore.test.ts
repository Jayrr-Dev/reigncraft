import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  ensuringWorldPlazaHerbariumBerryStudyAtLeast,
  gettingWorldPlazaHerbariumBerryStudyCountsSnapshot,
  gettingWorldPlazaHerbariumSightedBerryLootKindsSnapshot,
  initializingWorldPlazaHerbariumDiscoveryStore,
  recordingWorldPlazaHerbariumBerrySighted,
  recordingWorldPlazaHerbariumBerryStudied,
  resettingWorldPlazaHerbariumDiscoveryStoreForTests,
} from '@/components/world/domains/managingWorldPlazaHerbariumDiscoveryStore';

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

describe('managingWorldPlazaHerbariumDiscoveryStore berry study', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', creatingTestLocalStorage());
    vi.stubGlobal('window', globalThis);
    resettingWorldPlazaHerbariumDiscoveryStoreForTests();
  });

  it('records a berry sighting once', () => {
    initializingWorldPlazaHerbariumDiscoveryStore('test-berry-sighted');
    recordingWorldPlazaHerbariumBerrySighted('red_berry');
    recordingWorldPlazaHerbariumBerrySighted('red_berry');

    expect(gettingWorldPlazaHerbariumSightedBerryLootKindsSnapshot()).toEqual([
      'red_berry',
    ]);
    expect(gettingWorldPlazaHerbariumBerryStudyCountsSnapshot()).toEqual({});
  });

  it('increments per-loot-kind study counts and sights the kind', () => {
    initializingWorldPlazaHerbariumDiscoveryStore('test-berry-study');
    recordingWorldPlazaHerbariumBerryStudied('tea_leaves');
    recordingWorldPlazaHerbariumBerryStudied('tea_leaves');

    expect(gettingWorldPlazaHerbariumBerryStudyCountsSnapshot()).toEqual({
      tea_leaves: 2,
    });
    expect(gettingWorldPlazaHerbariumSightedBerryLootKindsSnapshot()).toEqual([
      'tea_leaves',
    ]);
  });

  it('raises study to a floor without lowering existing progress', () => {
    initializingWorldPlazaHerbariumDiscoveryStore('test-berry-ensure');
    recordingWorldPlazaHerbariumBerryStudied('golden_berry', 10);

    ensuringWorldPlazaHerbariumBerryStudyAtLeast('golden_berry', 5);
    expect(gettingWorldPlazaHerbariumBerryStudyCountsSnapshot()).toEqual({
      golden_berry: 10,
    });

    ensuringWorldPlazaHerbariumBerryStudyAtLeast('golden_berry', 20);
    expect(gettingWorldPlazaHerbariumBerryStudyCountsSnapshot()).toEqual({
      golden_berry: 20,
    });
  });

  it('persists berry study across store reinitialization for the same owner', () => {
    initializingWorldPlazaHerbariumDiscoveryStore('test-berry-persist');
    recordingWorldPlazaHerbariumBerryStudied('blue_berry', 3);

    initializingWorldPlazaHerbariumDiscoveryStore('other-owner');
    expect(gettingWorldPlazaHerbariumBerryStudyCountsSnapshot()).toEqual({});

    initializingWorldPlazaHerbariumDiscoveryStore('test-berry-persist');
    expect(gettingWorldPlazaHerbariumBerryStudyCountsSnapshot()).toEqual({
      blue_berry: 3,
    });
    expect(gettingWorldPlazaHerbariumSightedBerryLootKindsSnapshot()).toEqual([
      'blue_berry',
    ]);
  });
});
