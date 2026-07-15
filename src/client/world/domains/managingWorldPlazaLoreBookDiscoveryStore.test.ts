import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DEFINING_PLAZA_LORE_BOOKS } from '@/components/home/domains/definingPlazaLoreBookConstants';
import {
  checkingWorldPlazaLoreBookUnlocked,
  gettingWorldPlazaLoreBookDiscoverySnapshot,
  initializingWorldPlazaLoreBookDiscoveryStore,
  recordingWorldPlazaLoreBookUnlockEvent,
  resettingWorldPlazaLoreBookDiscoveryStoreForTests,
  unlockingWorldPlazaLoreBookDiscoveryAllForDev,
} from '@/components/world/domains/managingWorldPlazaLoreBookDiscoveryStore';

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

describe('managingWorldPlazaLoreBookDiscoveryStore', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', creatingTestLocalStorage());
    vi.stubGlobal('window', globalThis);
    resettingWorldPlazaLoreBookDiscoveryStoreForTests();
  });

  it('unlocks Book I on session start and keeps others locked', () => {
    initializingWorldPlazaLoreBookDiscoveryStore('lore-owner');

    expect(checkingWorldPlazaLoreBookUnlocked('book-i-lands')).toBe(true);
    expect(checkingWorldPlazaLoreBookUnlocked('book-ii-founder')).toBe(false);
    expect(gettingWorldPlazaLoreBookDiscoverySnapshot()).toEqual([
      'book-i-lands',
    ]);
  });

  it('unlocks volumes from discovery events idempotently', () => {
    initializingWorldPlazaLoreBookDiscoveryStore('lore-events');

    recordingWorldPlazaLoreBookUnlockEvent('player-first-death');
    recordingWorldPlazaLoreBookUnlockEvent('player-first-death');
    recordingWorldPlazaLoreBookUnlockEvent('first-wildlife-sighted');

    expect(checkingWorldPlazaLoreBookUnlocked('book-ii-founder')).toBe(true);
    expect(checkingWorldPlazaLoreBookUnlocked('book-iv-road')).toBe(true);
    expect(gettingWorldPlazaLoreBookDiscoverySnapshot()).toEqual([
      'book-i-lands',
      'book-ii-founder',
      'book-iv-road',
    ]);
  });

  it('persists unlocks across re-init for the same owner', () => {
    initializingWorldPlazaLoreBookDiscoveryStore('lore-persist');
    recordingWorldPlazaLoreBookUnlockEvent('legendary-biome-entered');

    resettingWorldPlazaLoreBookDiscoveryStoreForTests();
    initializingWorldPlazaLoreBookDiscoveryStore('lore-persist');

    expect(checkingWorldPlazaLoreBookUnlocked('book-vi-edges')).toBe(true);
  });

  it('unlocks every volume for Dev QA', () => {
    initializingWorldPlazaLoreBookDiscoveryStore('lore-dev');
    unlockingWorldPlazaLoreBookDiscoveryAllForDev(
      DEFINING_PLAZA_LORE_BOOKS.map((book) => book.id)
    );

    for (const book of DEFINING_PLAZA_LORE_BOOKS) {
      expect(checkingWorldPlazaLoreBookUnlocked(book.id)).toBe(true);
    }
  });
});
