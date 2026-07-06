/**
 * Module-level store for explored plaza biomes.
 *
 * @module components/world/domains/managingWorldPlazaExploredBiomesStore
 */

import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import { readingWorldPlazaExploredBiomesFromStorage } from '@/components/world/domains/readingWorldPlazaExploredBiomesFromStorage';
import { writingWorldPlazaExploredBiomesToStorage } from '@/components/world/domains/writingWorldPlazaExploredBiomesToStorage';

const managingWorldPlazaExploredBiomesSubscribers = new Set<() => void>();

const MANAGING_WORLD_PLAZA_EXPLORED_BIOMES_EMPTY_SNAPSHOT: readonly DefiningWorldPlazaBiomeKind[] =
  [];

let managingWorldPlazaExploredBiomesStorageOwnerId: string | null = null;
let managingWorldPlazaExploredBiomesKinds =
  new Set<DefiningWorldPlazaBiomeKind>();
let managingWorldPlazaExploredBiomesSnapshotCache: readonly DefiningWorldPlazaBiomeKind[] =
  MANAGING_WORLD_PLAZA_EXPLORED_BIOMES_EMPTY_SNAPSHOT;

function refreshingWorldPlazaExploredBiomesSnapshotCache(): void {
  if (managingWorldPlazaExploredBiomesKinds.size === 0) {
    managingWorldPlazaExploredBiomesSnapshotCache =
      MANAGING_WORLD_PLAZA_EXPLORED_BIOMES_EMPTY_SNAPSHOT;
    return;
  }

  managingWorldPlazaExploredBiomesSnapshotCache = [
    ...managingWorldPlazaExploredBiomesKinds,
  ].sort();
}

function notifyingWorldPlazaExploredBiomesSubscribers(): void {
  for (const onStoreChange of managingWorldPlazaExploredBiomesSubscribers) {
    onStoreChange();
  }
}

/**
 * Hydrates explored biomes from localStorage for one session owner.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 */
export function initializingWorldPlazaExploredBiomesStore(
  storageOwnerId: string | null
): void {
  if (managingWorldPlazaExploredBiomesStorageOwnerId === storageOwnerId) {
    return;
  }

  managingWorldPlazaExploredBiomesStorageOwnerId = storageOwnerId;
  managingWorldPlazaExploredBiomesKinds = new Set(
    readingWorldPlazaExploredBiomesFromStorage(storageOwnerId)
  );
  refreshingWorldPlazaExploredBiomesSnapshotCache();
  notifyingWorldPlazaExploredBiomesSubscribers();
}

/**
 * Returns a stable snapshot of explored biome kinds for React subscriptions.
 */
export function gettingWorldPlazaExploredBiomesSnapshot(): readonly DefiningWorldPlazaBiomeKind[] {
  return managingWorldPlazaExploredBiomesSnapshotCache;
}

/**
 * Records one biome kind if the player has not entered it yet.
 *
 * @param biomeKind - Biome entered by the local player.
 */
export function recordingWorldPlazaExploredBiomeKind(
  biomeKind: DefiningWorldPlazaBiomeKind
): void {
  if (managingWorldPlazaExploredBiomesKinds.has(biomeKind)) {
    return;
  }

  managingWorldPlazaExploredBiomesKinds = new Set([
    ...managingWorldPlazaExploredBiomesKinds,
    biomeKind,
  ]);
  writingWorldPlazaExploredBiomesToStorage(
    managingWorldPlazaExploredBiomesStorageOwnerId,
    managingWorldPlazaExploredBiomesKinds
  );
  refreshingWorldPlazaExploredBiomesSnapshotCache();
  notifyingWorldPlazaExploredBiomesSubscribers();
}

/**
 * Subscribes to explored biome changes.
 *
 * @param onStoreChange - Callback invoked when explored biomes change.
 */
export function subscribingWorldPlazaExploredBiomes(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaExploredBiomesSubscribers.add(onStoreChange);

  return () => {
    managingWorldPlazaExploredBiomesSubscribers.delete(onStoreChange);
  };
}
