/**
 * Module-level store for unlocked Wanderer's Corpus library volumes.
 *
 * LocalStorage is the hot cache. Unlock events write book ids; the shelf reads
 * the snapshot for silhouette / revealed covers.
 *
 * @module components/world/domains/managingWorldPlazaLoreBookDiscoveryStore
 */

import {
  resolvingPlazaLoreBookIdForUnlockEvent,
  type PlazaLoreBookUnlockEventId,
} from '@/components/home/domains/definingPlazaLoreBookUnlockConstants';
import { readingWorldPlazaLoreBookDiscoveryFromStorage } from '@/components/world/domains/readingWorldPlazaLoreBookDiscoveryFromStorage';
import { writingWorldPlazaLoreBookDiscoveryToStorage } from '@/components/world/domains/writingWorldPlazaLoreBookDiscoveryToStorage';

const managingWorldPlazaLoreBookDiscoverySubscribers = new Set<() => void>();

const MANAGING_WORLD_PLAZA_LORE_BOOK_DISCOVERY_EMPTY_SNAPSHOT: readonly string[] =
  [];

let managingWorldPlazaLoreBookDiscoveryStorageOwnerId: string | null = null;
let managingWorldPlazaLoreBookDiscoveryUnlockedBookIds = new Set<string>();
let managingWorldPlazaLoreBookDiscoverySnapshotCache: readonly string[] =
  MANAGING_WORLD_PLAZA_LORE_BOOK_DISCOVERY_EMPTY_SNAPSHOT;

function refreshingWorldPlazaLoreBookDiscoverySnapshotCache(): void {
  if (managingWorldPlazaLoreBookDiscoveryUnlockedBookIds.size === 0) {
    managingWorldPlazaLoreBookDiscoverySnapshotCache =
      MANAGING_WORLD_PLAZA_LORE_BOOK_DISCOVERY_EMPTY_SNAPSHOT;
    return;
  }

  managingWorldPlazaLoreBookDiscoverySnapshotCache = [
    ...managingWorldPlazaLoreBookDiscoveryUnlockedBookIds,
  ].sort();
}

function notifyingWorldPlazaLoreBookDiscoverySubscribers(): void {
  for (const onStoreChange of managingWorldPlazaLoreBookDiscoverySubscribers) {
    onStoreChange();
  }
}

function persistingWorldPlazaLoreBookDiscovery(): void {
  writingWorldPlazaLoreBookDiscoveryToStorage(
    managingWorldPlazaLoreBookDiscoveryStorageOwnerId,
    managingWorldPlazaLoreBookDiscoveryUnlockedBookIds
  );
}

/**
 * Hydrates unlocked lore volumes from localStorage for one session owner.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 */
export function initializingWorldPlazaLoreBookDiscoveryStore(
  storageOwnerId: string | null
): void {
  if (managingWorldPlazaLoreBookDiscoveryStorageOwnerId === storageOwnerId) {
    return;
  }

  managingWorldPlazaLoreBookDiscoveryStorageOwnerId = storageOwnerId;
  managingWorldPlazaLoreBookDiscoveryUnlockedBookIds = new Set(
    readingWorldPlazaLoreBookDiscoveryFromStorage(storageOwnerId)
  );
  refreshingWorldPlazaLoreBookDiscoverySnapshotCache();
  notifyingWorldPlazaLoreBookDiscoverySubscribers();

  // Book I always opens with the session.
  recordingWorldPlazaLoreBookUnlockEvent('session-start');
}

/**
 * Returns a stable snapshot of unlocked lore book ids for React subscriptions.
 */
export function gettingWorldPlazaLoreBookDiscoverySnapshot(): readonly string[] {
  return managingWorldPlazaLoreBookDiscoverySnapshotCache;
}

/**
 * True when a Corpus volume is unlocked for the current session.
 *
 * @param bookId - Lore volume id.
 */
export function checkingWorldPlazaLoreBookUnlocked(bookId: string): boolean {
  return managingWorldPlazaLoreBookDiscoveryUnlockedBookIds.has(bookId);
}

/**
 * Unlocks one volume by discovery event id (idempotent).
 *
 * @param unlockEventId - Declarative unlock event from the registry.
 */
export function recordingWorldPlazaLoreBookUnlockEvent(
  unlockEventId: PlazaLoreBookUnlockEventId
): void {
  const bookId = resolvingPlazaLoreBookIdForUnlockEvent(unlockEventId);

  if (!bookId) {
    return;
  }

  recordingWorldPlazaLoreBookUnlocked(bookId);
}

/**
 * Unlocks one Corpus volume by id (idempotent).
 *
 * @param bookId - Lore volume id.
 */
export function recordingWorldPlazaLoreBookUnlocked(bookId: string): void {
  if (managingWorldPlazaLoreBookDiscoveryUnlockedBookIds.has(bookId)) {
    return;
  }

  managingWorldPlazaLoreBookDiscoveryUnlockedBookIds = new Set([
    ...managingWorldPlazaLoreBookDiscoveryUnlockedBookIds,
    bookId,
  ]);
  refreshingWorldPlazaLoreBookDiscoverySnapshotCache();
  persistingWorldPlazaLoreBookDiscovery();
  notifyingWorldPlazaLoreBookDiscoverySubscribers();
}

/**
 * Unlocks every Corpus volume (Dev QA).
 *
 * @param bookIds - Volume ids to unlock.
 */
export function unlockingWorldPlazaLoreBookDiscoveryAllForDev(
  bookIds: readonly string[]
): void {
  let didChange = false;

  for (const bookId of bookIds) {
    if (managingWorldPlazaLoreBookDiscoveryUnlockedBookIds.has(bookId)) {
      continue;
    }

    if (!didChange) {
      managingWorldPlazaLoreBookDiscoveryUnlockedBookIds = new Set(
        managingWorldPlazaLoreBookDiscoveryUnlockedBookIds
      );
      didChange = true;
    }

    managingWorldPlazaLoreBookDiscoveryUnlockedBookIds.add(bookId);
  }

  if (!didChange) {
    return;
  }

  refreshingWorldPlazaLoreBookDiscoverySnapshotCache();
  persistingWorldPlazaLoreBookDiscovery();
  notifyingWorldPlazaLoreBookDiscoverySubscribers();
}

/**
 * Subscribes to lore book unlock changes.
 *
 * @param onStoreChange - Callback invoked when unlocked volumes change.
 */
export function subscribingWorldPlazaLoreBookDiscovery(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaLoreBookDiscoverySubscribers.add(onStoreChange);

  return () => {
    managingWorldPlazaLoreBookDiscoverySubscribers.delete(onStoreChange);
  };
}

/** Test helper: clears in-memory state between unit tests. */
export function resettingWorldPlazaLoreBookDiscoveryStoreForTests(): void {
  managingWorldPlazaLoreBookDiscoveryStorageOwnerId = null;
  managingWorldPlazaLoreBookDiscoveryUnlockedBookIds = new Set();
  refreshingWorldPlazaLoreBookDiscoverySnapshotCache();
  managingWorldPlazaLoreBookDiscoverySubscribers.clear();
}
