/**
 * Module-level store for discovered named biome region cells.
 *
 * @module components/world/domains/managingWorldPlazaDiscoveredBiomeRegionsStore
 */

import { readingWorldPlazaDiscoveredBiomeRegionsFromStorage } from '@/components/world/domains/readingWorldPlazaDiscoveredBiomeRegionsFromStorage';
import { writingWorldPlazaDiscoveredBiomeRegionsToStorage } from '@/components/world/domains/writingWorldPlazaDiscoveredBiomeRegionsToStorage';

const managingWorldPlazaDiscoveredBiomeRegionsSubscribers = new Set<
  () => void
>();

const MANAGING_WORLD_PLAZA_DISCOVERED_BIOME_REGIONS_EMPTY_SNAPSHOT: readonly string[] =
  [];

let managingWorldPlazaDiscoveredBiomeRegionsStorageOwnerId: string | null =
  null;
let managingWorldPlazaDiscoveredBiomeRegionsKeys = new Set<string>();
let managingWorldPlazaDiscoveredBiomeRegionsSnapshotCache: readonly string[] =
  MANAGING_WORLD_PLAZA_DISCOVERED_BIOME_REGIONS_EMPTY_SNAPSHOT;

function refreshingWorldPlazaDiscoveredBiomeRegionsSnapshotCache(): void {
  if (managingWorldPlazaDiscoveredBiomeRegionsKeys.size === 0) {
    managingWorldPlazaDiscoveredBiomeRegionsSnapshotCache =
      MANAGING_WORLD_PLAZA_DISCOVERED_BIOME_REGIONS_EMPTY_SNAPSHOT;
    return;
  }

  managingWorldPlazaDiscoveredBiomeRegionsSnapshotCache = [
    ...managingWorldPlazaDiscoveredBiomeRegionsKeys,
  ].sort();
}

function notifyingWorldPlazaDiscoveredBiomeRegionsSubscribers(): void {
  for (const onStoreChange of managingWorldPlazaDiscoveredBiomeRegionsSubscribers) {
    onStoreChange();
  }
}

/**
 * Hydrates discovered biome regions from localStorage for one session owner.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 */
export function initializingWorldPlazaDiscoveredBiomeRegionsStore(
  storageOwnerId: string | null
): void {
  if (managingWorldPlazaDiscoveredBiomeRegionsStorageOwnerId === storageOwnerId) {
    return;
  }

  managingWorldPlazaDiscoveredBiomeRegionsStorageOwnerId = storageOwnerId;
  managingWorldPlazaDiscoveredBiomeRegionsKeys = new Set(
    readingWorldPlazaDiscoveredBiomeRegionsFromStorage(storageOwnerId)
  );
  refreshingWorldPlazaDiscoveredBiomeRegionsSnapshotCache();
  notifyingWorldPlazaDiscoveredBiomeRegionsSubscribers();
}

/**
 * Returns a stable snapshot of discovered region keys for React subscriptions.
 */
export function gettingWorldPlazaDiscoveredBiomeRegionsSnapshot(): readonly string[] {
  return managingWorldPlazaDiscoveredBiomeRegionsSnapshotCache;
}

/**
 * True when this region cell was already discovered for the current owner.
 *
 * @param regionKey - Formatted region key (`regionX:regionY`).
 */
export function checkingWorldPlazaBiomeRegionIsDiscovered(
  regionKey: string
): boolean {
  return managingWorldPlazaDiscoveredBiomeRegionsKeys.has(regionKey);
}

/**
 * Records one biome region if the player has not entered it yet.
 *
 * @param regionKey - Formatted region key (`regionX:regionY`).
 * @returns True when this call recorded a first discovery.
 */
export function recordingWorldPlazaDiscoveredBiomeRegion(
  regionKey: string
): boolean {
  if (managingWorldPlazaDiscoveredBiomeRegionsKeys.has(regionKey)) {
    return false;
  }

  managingWorldPlazaDiscoveredBiomeRegionsKeys = new Set([
    ...managingWorldPlazaDiscoveredBiomeRegionsKeys,
    regionKey,
  ]);
  writingWorldPlazaDiscoveredBiomeRegionsToStorage(
    managingWorldPlazaDiscoveredBiomeRegionsStorageOwnerId,
    managingWorldPlazaDiscoveredBiomeRegionsKeys
  );
  refreshingWorldPlazaDiscoveredBiomeRegionsSnapshotCache();
  notifyingWorldPlazaDiscoveredBiomeRegionsSubscribers();

  return true;
}

/**
 * Subscribes to discovered biome region changes.
 *
 * @param onStoreChange - Callback invoked when discovered regions change.
 */
export function subscribingWorldPlazaDiscoveredBiomeRegions(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaDiscoveredBiomeRegionsSubscribers.add(onStoreChange);

  return () => {
    managingWorldPlazaDiscoveredBiomeRegionsSubscribers.delete(onStoreChange);
  };
}
