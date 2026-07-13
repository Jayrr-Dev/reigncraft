/**
 * Module-level store for cookbook recipe pages the player has attached.
 *
 * LocalStorage is the hot cache. Signed-in single-player also mirrors
 * attaches into the Devvit Redis save slot.
 *
 * @module components/world/domains/managingWorldPlazaRecipeDiscoveryStore
 */

import { savingPlazaSinglePlayerSaveSlotData } from '@/components/home/repositories/callingPlazaSinglePlayerSavesDevvitApi';
import type { DefiningWorldPlazaCraftModeRecipeId } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { readingWorldPlazaRecipeDiscoveryFromStorage } from '@/components/world/domains/readingWorldPlazaRecipeDiscoveryFromStorage';
import { writingWorldPlazaRecipeDiscoveryToStorage } from '@/components/world/domains/writingWorldPlazaRecipeDiscoveryToStorage';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';

const managingWorldPlazaRecipeDiscoverySubscribers = new Set<() => void>();

const MANAGING_WORLD_PLAZA_RECIPE_DISCOVERY_EMPTY_SNAPSHOT: readonly DefiningWorldPlazaCraftModeRecipeId[] =
  [];

let managingWorldPlazaRecipeDiscoveryStorageOwnerId: string | null = null;
let managingWorldPlazaRecipeDiscoveryCloudSaveSlotIndex: PlazaSaveSlotIndex | null =
  null;
let managingWorldPlazaRecipeDiscoveryAttachedRecipeIds =
  new Set<DefiningWorldPlazaCraftModeRecipeId>();
let managingWorldPlazaRecipeDiscoveryAttachedSnapshotCache: readonly DefiningWorldPlazaCraftModeRecipeId[] =
  MANAGING_WORLD_PLAZA_RECIPE_DISCOVERY_EMPTY_SNAPSHOT;

function refreshingWorldPlazaRecipeDiscoverySnapshotCaches(): void {
  managingWorldPlazaRecipeDiscoveryAttachedSnapshotCache =
    managingWorldPlazaRecipeDiscoveryAttachedRecipeIds.size === 0
      ? MANAGING_WORLD_PLAZA_RECIPE_DISCOVERY_EMPTY_SNAPSHOT
      : [...managingWorldPlazaRecipeDiscoveryAttachedRecipeIds].sort();
}

function notifyingWorldPlazaRecipeDiscoverySubscribers(): void {
  for (const onStoreChange of managingWorldPlazaRecipeDiscoverySubscribers) {
    onStoreChange();
  }
}

function mirroringWorldPlazaRecipeDiscoveryToCloudSave(): void {
  if (managingWorldPlazaRecipeDiscoveryCloudSaveSlotIndex === null) {
    return;
  }

  const attachedRecipeIds =
    managingWorldPlazaRecipeDiscoveryAttachedSnapshotCache;

  void savingPlazaSinglePlayerSaveSlotData(
    managingWorldPlazaRecipeDiscoveryCloudSaveSlotIndex,
    {
      attachedRecipeIds:
        attachedRecipeIds.length > 0 ? attachedRecipeIds : null,
    }
  ).catch(() => {
    // Cloud mirror is best-effort; localStorage remains source for the session.
  });
}

function persistingWorldPlazaRecipeDiscovery(): void {
  writingWorldPlazaRecipeDiscoveryToStorage(
    managingWorldPlazaRecipeDiscoveryStorageOwnerId,
    managingWorldPlazaRecipeDiscoveryAttachedRecipeIds
  );
  mirroringWorldPlazaRecipeDiscoveryToCloudSave();
}

export type InitializingWorldPlazaRecipeDiscoveryStoreOptions = {
  /** When set, attaches mirror into this Redis save slot. */
  cloudSaveSlotIndex?: PlazaSaveSlotIndex | null;
};

/**
 * Hydrates recipe page attaches from localStorage for one session owner.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 * @param options - Optional Redis save-slot mirror context.
 */
export function initializingWorldPlazaRecipeDiscoveryStore(
  storageOwnerId: string | null,
  options?: InitializingWorldPlazaRecipeDiscoveryStoreOptions
): void {
  const cloudSaveSlotIndex = options?.cloudSaveSlotIndex ?? null;

  if (managingWorldPlazaRecipeDiscoveryStorageOwnerId === storageOwnerId) {
    managingWorldPlazaRecipeDiscoveryCloudSaveSlotIndex = cloudSaveSlotIndex;
    return;
  }

  managingWorldPlazaRecipeDiscoveryStorageOwnerId = storageOwnerId;
  managingWorldPlazaRecipeDiscoveryCloudSaveSlotIndex = cloudSaveSlotIndex;
  const snapshot = readingWorldPlazaRecipeDiscoveryFromStorage(storageOwnerId);
  managingWorldPlazaRecipeDiscoveryAttachedRecipeIds = new Set(
    snapshot.attachedRecipeIds
  );
  refreshingWorldPlazaRecipeDiscoverySnapshotCaches();
  notifyingWorldPlazaRecipeDiscoverySubscribers();
}

/**
 * Records that a recipe page was attached to the player's cookbook.
 * No-op when already attached.
 *
 * @param recipeId - Craft recipe id that was attached
 */
export function recordingWorldPlazaRecipePageAttached(
  recipeId: DefiningWorldPlazaCraftModeRecipeId
): void {
  if (managingWorldPlazaRecipeDiscoveryAttachedRecipeIds.has(recipeId)) {
    return;
  }

  managingWorldPlazaRecipeDiscoveryAttachedRecipeIds = new Set(
    managingWorldPlazaRecipeDiscoveryAttachedRecipeIds
  );
  managingWorldPlazaRecipeDiscoveryAttachedRecipeIds.add(recipeId);
  refreshingWorldPlazaRecipeDiscoverySnapshotCaches();
  persistingWorldPlazaRecipeDiscovery();
  notifyingWorldPlazaRecipeDiscoverySubscribers();
}

export function subscribingWorldPlazaRecipeDiscovery(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaRecipeDiscoverySubscribers.add(onStoreChange);

  return () => {
    managingWorldPlazaRecipeDiscoverySubscribers.delete(onStoreChange);
  };
}

export function gettingWorldPlazaRecipeAttachedSnapshot(): readonly DefiningWorldPlazaCraftModeRecipeId[] {
  return managingWorldPlazaRecipeDiscoveryAttachedSnapshotCache;
}

/** Test helper: clears in-memory state between unit tests. */
export function resettingWorldPlazaRecipeDiscoveryStoreForTests(): void {
  managingWorldPlazaRecipeDiscoveryStorageOwnerId = null;
  managingWorldPlazaRecipeDiscoveryCloudSaveSlotIndex = null;
  managingWorldPlazaRecipeDiscoveryAttachedRecipeIds = new Set();
  refreshingWorldPlazaRecipeDiscoverySnapshotCaches();
  managingWorldPlazaRecipeDiscoverySubscribers.clear();
}
