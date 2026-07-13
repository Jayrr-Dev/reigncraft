/**
 * Module-level store for discovered named realms.
 *
 * LocalStorage is the hot cache. Signed-in single-player also mirrors
 * discovered realms into the Devvit Redis save slot.
 *
 * @module components/world/domains/managingWorldPlazaDiscoveredNamedRealmsStore
 */

import { savingPlazaSinglePlayerSaveSlotData } from '@/components/home/repositories/callingPlazaSinglePlayerSavesDevvitApi';
import { readingWorldPlazaDiscoveredNamedRealmsFromStorage } from '@/components/world/domains/readingWorldPlazaDiscoveredNamedRealmsFromStorage';
import { writingWorldPlazaDiscoveredNamedRealmsToStorage } from '@/components/world/domains/writingWorldPlazaDiscoveredNamedRealmsToStorage';
import type { PlazaSaveSlotIndex } from '../../../shared/plazaGameSession';

const managingWorldPlazaDiscoveredNamedRealmsSubscribers = new Set<
  () => void
>();

const MANAGING_WORLD_PLAZA_DISCOVERED_NAMED_REALMS_EMPTY_SNAPSHOT: readonly string[] =
  [];

let managingWorldPlazaDiscoveredNamedRealmsStorageOwnerId: string | null = null;
let managingWorldPlazaDiscoveredNamedRealmsCloudSaveSlotIndex: PlazaSaveSlotIndex | null =
  null;
let managingWorldPlazaDiscoveredNamedRealmsIds = new Set<string>();
let managingWorldPlazaDiscoveredNamedRealmsSnapshotCache: readonly string[] =
  MANAGING_WORLD_PLAZA_DISCOVERED_NAMED_REALMS_EMPTY_SNAPSHOT;

function refreshingWorldPlazaDiscoveredNamedRealmsSnapshotCache(): void {
  if (managingWorldPlazaDiscoveredNamedRealmsIds.size === 0) {
    managingWorldPlazaDiscoveredNamedRealmsSnapshotCache =
      MANAGING_WORLD_PLAZA_DISCOVERED_NAMED_REALMS_EMPTY_SNAPSHOT;
    return;
  }

  managingWorldPlazaDiscoveredNamedRealmsSnapshotCache = [
    ...managingWorldPlazaDiscoveredNamedRealmsIds,
  ].sort();
}

function notifyingWorldPlazaDiscoveredNamedRealmsSubscribers(): void {
  for (const onStoreChange of managingWorldPlazaDiscoveredNamedRealmsSubscribers) {
    onStoreChange();
  }
}

function mirroringWorldPlazaDiscoveredNamedRealmsToCloudSave(): void {
  if (managingWorldPlazaDiscoveredNamedRealmsCloudSaveSlotIndex === null) {
    return;
  }

  const discoveredNamedRealmIds =
    managingWorldPlazaDiscoveredNamedRealmsSnapshotCache;

  void savingPlazaSinglePlayerSaveSlotData(
    managingWorldPlazaDiscoveredNamedRealmsCloudSaveSlotIndex,
    {
      discoveredNamedRealmIds:
        discoveredNamedRealmIds.length > 0 ? discoveredNamedRealmIds : null,
    }
  ).catch(() => {
    // Cloud mirror is best-effort; localStorage remains source for the session.
  });
}

function persistingWorldPlazaDiscoveredNamedRealms(): void {
  writingWorldPlazaDiscoveredNamedRealmsToStorage(
    managingWorldPlazaDiscoveredNamedRealmsStorageOwnerId,
    managingWorldPlazaDiscoveredNamedRealmsIds
  );
  mirroringWorldPlazaDiscoveredNamedRealmsToCloudSave();
}

export type InitializingWorldPlazaDiscoveredNamedRealmsStoreOptions = {
  cloudSaveSlotIndex?: PlazaSaveSlotIndex | null;
};

/**
 * Hydrates discovered named realms from localStorage for one session owner.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 * @param options - Optional Redis save-slot mirror context.
 */
export function initializingWorldPlazaDiscoveredNamedRealmsStore(
  storageOwnerId: string | null,
  options?: InitializingWorldPlazaDiscoveredNamedRealmsStoreOptions
): void {
  const cloudSaveSlotIndex = options?.cloudSaveSlotIndex ?? null;

  if (
    managingWorldPlazaDiscoveredNamedRealmsStorageOwnerId === storageOwnerId
  ) {
    managingWorldPlazaDiscoveredNamedRealmsCloudSaveSlotIndex =
      cloudSaveSlotIndex;
    return;
  }

  managingWorldPlazaDiscoveredNamedRealmsStorageOwnerId = storageOwnerId;
  managingWorldPlazaDiscoveredNamedRealmsCloudSaveSlotIndex =
    cloudSaveSlotIndex;
  managingWorldPlazaDiscoveredNamedRealmsIds = new Set(
    readingWorldPlazaDiscoveredNamedRealmsFromStorage(storageOwnerId)
  );
  refreshingWorldPlazaDiscoveredNamedRealmsSnapshotCache();
  notifyingWorldPlazaDiscoveredNamedRealmsSubscribers();
}

/**
 * Returns a stable snapshot of discovered realm ids for React subscriptions.
 */
export function gettingWorldPlazaDiscoveredNamedRealmsSnapshot(): readonly string[] {
  return managingWorldPlazaDiscoveredNamedRealmsSnapshotCache;
}

/**
 * Records one named realm if the player has not entered it yet.
 *
 * @param realmId - Stable realm id (`latticeX:latticeY`).
 * @returns True when this call recorded a first discovery.
 */
export function recordingWorldPlazaDiscoveredNamedRealm(
  realmId: string
): boolean {
  if (managingWorldPlazaDiscoveredNamedRealmsIds.has(realmId)) {
    return false;
  }

  managingWorldPlazaDiscoveredNamedRealmsIds = new Set([
    ...managingWorldPlazaDiscoveredNamedRealmsIds,
    realmId,
  ]);
  refreshingWorldPlazaDiscoveredNamedRealmsSnapshotCache();
  persistingWorldPlazaDiscoveredNamedRealms();
  notifyingWorldPlazaDiscoveredNamedRealmsSubscribers();

  return true;
}

/**
 * Subscribes to discovered named realm changes.
 *
 * @param onStoreChange - Callback invoked when discovered realms change.
 */
export function subscribingWorldPlazaDiscoveredNamedRealms(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaDiscoveredNamedRealmsSubscribers.add(onStoreChange);

  return () => {
    managingWorldPlazaDiscoveredNamedRealmsSubscribers.delete(onStoreChange);
  };
}

/** Test helper: clears in-memory state between unit tests. */
export function resettingWorldPlazaDiscoveredNamedRealmsStoreForTests(): void {
  managingWorldPlazaDiscoveredNamedRealmsStorageOwnerId = null;
  managingWorldPlazaDiscoveredNamedRealmsCloudSaveSlotIndex = null;
  managingWorldPlazaDiscoveredNamedRealmsIds = new Set();
  refreshingWorldPlazaDiscoveredNamedRealmsSnapshotCache();
  managingWorldPlazaDiscoveredNamedRealmsSubscribers.clear();
}
