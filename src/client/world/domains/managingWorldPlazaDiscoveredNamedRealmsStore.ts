/**
 * Module-level store for discovered named realms.
 *
 * @module components/world/domains/managingWorldPlazaDiscoveredNamedRealmsStore
 */

import { readingWorldPlazaDiscoveredNamedRealmsFromStorage } from '@/components/world/domains/readingWorldPlazaDiscoveredNamedRealmsFromStorage';
import { writingWorldPlazaDiscoveredNamedRealmsToStorage } from '@/components/world/domains/writingWorldPlazaDiscoveredNamedRealmsToStorage';

const managingWorldPlazaDiscoveredNamedRealmsSubscribers = new Set<() => void>();

const MANAGING_WORLD_PLAZA_DISCOVERED_NAMED_REALMS_EMPTY_SNAPSHOT: readonly string[] =
  [];

let managingWorldPlazaDiscoveredNamedRealmsStorageOwnerId: string | null = null;
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

/**
 * Hydrates discovered named realms from localStorage for one session owner.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 */
export function initializingWorldPlazaDiscoveredNamedRealmsStore(
  storageOwnerId: string | null
): void {
  if (managingWorldPlazaDiscoveredNamedRealmsStorageOwnerId === storageOwnerId) {
    return;
  }

  managingWorldPlazaDiscoveredNamedRealmsStorageOwnerId = storageOwnerId;
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
  writingWorldPlazaDiscoveredNamedRealmsToStorage(
    managingWorldPlazaDiscoveredNamedRealmsStorageOwnerId,
    managingWorldPlazaDiscoveredNamedRealmsIds
  );
  refreshingWorldPlazaDiscoveredNamedRealmsSnapshotCache();
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
