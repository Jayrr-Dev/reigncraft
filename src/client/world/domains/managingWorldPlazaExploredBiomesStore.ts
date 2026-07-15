/**
 * Module-level store for explored plaza biomes.
 *
 * LocalStorage is the hot cache. Signed-in single-player also mirrors
 * explored biomes into the Devvit Redis save slot.
 *
 * @module components/world/domains/managingWorldPlazaExploredBiomesStore
 */

import { DEFINING_PLAZA_BIOMES_LEGENDARY_KINDS } from '@/components/home/domains/definingPlazaBiomesGuideConstants';
import { savingPlazaSinglePlayerSaveSlotData } from '@/components/home/repositories/callingPlazaSinglePlayerSavesDevvitApi';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import { recordingWorldPlazaLoreBookUnlockEvent } from '@/components/world/domains/managingWorldPlazaLoreBookDiscoveryStore';
import { readingWorldPlazaExploredBiomesFromStorage } from '@/components/world/domains/readingWorldPlazaExploredBiomesFromStorage';
import { writingWorldPlazaExploredBiomesToStorage } from '@/components/world/domains/writingWorldPlazaExploredBiomesToStorage';
import type { PlazaSaveSlotIndex } from '../../../shared/plazaGameSession';

const DEFINING_PLAZA_BIOMES_LEGENDARY_KIND_SET = new Set<string>(
  DEFINING_PLAZA_BIOMES_LEGENDARY_KINDS
);

const managingWorldPlazaExploredBiomesSubscribers = new Set<() => void>();

const MANAGING_WORLD_PLAZA_EXPLORED_BIOMES_EMPTY_SNAPSHOT: readonly DefiningWorldPlazaBiomeKind[] =
  [];

let managingWorldPlazaExploredBiomesStorageOwnerId: string | null = null;
let managingWorldPlazaExploredBiomesCloudSaveSlotIndex: PlazaSaveSlotIndex | null =
  null;
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

function mirroringWorldPlazaExploredBiomesToCloudSave(): void {
  if (managingWorldPlazaExploredBiomesCloudSaveSlotIndex === null) {
    return;
  }

  const exploredBiomeKinds = managingWorldPlazaExploredBiomesSnapshotCache;

  void savingPlazaSinglePlayerSaveSlotData(
    managingWorldPlazaExploredBiomesCloudSaveSlotIndex,
    {
      exploredBiomeKinds:
        exploredBiomeKinds.length > 0 ? exploredBiomeKinds : null,
    }
  ).catch(() => {
    // Cloud mirror is best-effort; localStorage remains source for the session.
  });
}

function persistingWorldPlazaExploredBiomes(): void {
  writingWorldPlazaExploredBiomesToStorage(
    managingWorldPlazaExploredBiomesStorageOwnerId,
    managingWorldPlazaExploredBiomesKinds
  );
  mirroringWorldPlazaExploredBiomesToCloudSave();
}

export type InitializingWorldPlazaExploredBiomesStoreOptions = {
  cloudSaveSlotIndex?: PlazaSaveSlotIndex | null;
};

/**
 * Hydrates explored biomes from localStorage for one session owner.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 * @param options - Optional Redis save-slot mirror context.
 */
export function initializingWorldPlazaExploredBiomesStore(
  storageOwnerId: string | null,
  options?: InitializingWorldPlazaExploredBiomesStoreOptions
): void {
  const cloudSaveSlotIndex = options?.cloudSaveSlotIndex ?? null;

  if (managingWorldPlazaExploredBiomesStorageOwnerId === storageOwnerId) {
    managingWorldPlazaExploredBiomesCloudSaveSlotIndex = cloudSaveSlotIndex;
    return;
  }

  managingWorldPlazaExploredBiomesStorageOwnerId = storageOwnerId;
  managingWorldPlazaExploredBiomesCloudSaveSlotIndex = cloudSaveSlotIndex;
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
  refreshingWorldPlazaExploredBiomesSnapshotCache();
  persistingWorldPlazaExploredBiomes();
  notifyingWorldPlazaExploredBiomesSubscribers();

  if (DEFINING_PLAZA_BIOMES_LEGENDARY_KIND_SET.has(biomeKind)) {
    recordingWorldPlazaLoreBookUnlockEvent('legendary-biome-entered');
  }
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

/** Test helper: clears in-memory state between unit tests. */
export function resettingWorldPlazaExploredBiomesStoreForTests(): void {
  managingWorldPlazaExploredBiomesStorageOwnerId = null;
  managingWorldPlazaExploredBiomesCloudSaveSlotIndex = null;
  managingWorldPlazaExploredBiomesKinds = new Set();
  refreshingWorldPlazaExploredBiomesSnapshotCache();
  managingWorldPlazaExploredBiomesSubscribers.clear();
}
