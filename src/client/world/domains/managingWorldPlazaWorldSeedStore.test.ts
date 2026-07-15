import { hashingWorldPlazaCoordinateToUnitFloat } from '@/components/world/domains/generatingWorldPlazaValueNoise';
import {
  initializingWorldPlazaWorldSeedStore,
  resettingWorldPlazaWorldSeedStore,
} from '@/components/world/domains/managingWorldPlazaWorldSeedStore';
import { readingWorldPlazaWorldSeedFromStorage } from '@/components/world/domains/readingWorldPlazaWorldSeedFromStorage';
import { writingWorldPlazaLastPositionToStorage } from '@/components/world/domains/writingWorldPlazaLastPositionToStorage';
import { creatingWorldPlazaLastPosition } from '@/components/world/domains/definingWorldPlazaLastPosition';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  gettingWorldGenerationSeed,
  settingWorldGenerationSeed,
} from '../../../shared/worldGenerationSeed';

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

describe('managingWorldPlazaWorldSeedStore', () => {
  const persistenceOwnerId = 'single-player:slot-1';
  let testLocalStorage: Storage;

  beforeEach(() => {
    testLocalStorage = creatingTestLocalStorage();
    vi.stubGlobal('localStorage', testLocalStorage);
    vi.stubGlobal('window', { localStorage: testLocalStorage });
    resettingWorldPlazaWorldSeedStore();
  });

  afterEach(() => {
    resettingWorldPlazaWorldSeedStore();
    vi.unstubAllGlobals();
  });

  it('mints a non-zero seed for an empty single-player slot', () => {
    initializingWorldPlazaWorldSeedStore(persistenceOwnerId, {
      cloudSaveSlotIndex: 1,
    });

    const mintedSeed = readingWorldPlazaWorldSeedFromStorage(persistenceOwnerId);

    expect(mintedSeed).not.toBeNull();
    expect(mintedSeed).not.toBe(0);
    expect(gettingWorldGenerationSeed()).toBe(mintedSeed);
  });

  it('keeps legacy seed 0 when last position already exists', () => {
    writingWorldPlazaLastPositionToStorage(
      creatingWorldPlazaLastPosition(3, 4, 1, 1_000),
      persistenceOwnerId
    );

    initializingWorldPlazaWorldSeedStore(persistenceOwnerId, {
      cloudSaveSlotIndex: 1,
    });

    expect(readingWorldPlazaWorldSeedFromStorage(persistenceOwnerId)).toBe(0);
    expect(gettingWorldGenerationSeed()).toBe(0);
  });

  it('reuses a stored seed on continue', () => {
    testLocalStorage.setItem(
      `world-plaza-world-seed:${persistenceOwnerId}`,
      '424242'
    );

    initializingWorldPlazaWorldSeedStore(persistenceOwnerId, {
      cloudSaveSlotIndex: 1,
    });

    expect(gettingWorldGenerationSeed()).toBe(424242);
  });

  it('forces seed 0 for shared / online sessions', () => {
    testLocalStorage.setItem(
      `world-plaza-world-seed:${persistenceOwnerId}`,
      '99'
    );

    initializingWorldPlazaWorldSeedStore(persistenceOwnerId, {
      cloudSaveSlotIndex: null,
      useFixedLegacySeed: true,
    });

    expect(gettingWorldGenerationSeed()).toBe(0);
  });

  it('changes noise hashes when the world seed changes', () => {
    settingWorldGenerationSeed(0);
    const legacySample = hashingWorldPlazaCoordinateToUnitFloat(10, 20, 4507);

    settingWorldGenerationSeed(123456);
    const seededSample = hashingWorldPlazaCoordinateToUnitFloat(10, 20, 4507);

    expect(seededSample).not.toBe(legacySample);
  });
});
