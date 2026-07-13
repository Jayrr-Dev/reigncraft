/**
 * Module-level store for cookbook recipe pages the player has attached.
 *
 * @module components/world/domains/managingWorldPlazaRecipeDiscoveryStore
 */

import type { DefiningWorldPlazaCraftModeRecipeId } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { readingWorldPlazaRecipeDiscoveryFromStorage } from '@/components/world/domains/readingWorldPlazaRecipeDiscoveryFromStorage';
import { writingWorldPlazaRecipeDiscoveryToStorage } from '@/components/world/domains/writingWorldPlazaRecipeDiscoveryToStorage';

const managingWorldPlazaRecipeDiscoverySubscribers = new Set<() => void>();

const MANAGING_WORLD_PLAZA_RECIPE_DISCOVERY_EMPTY_SNAPSHOT: readonly DefiningWorldPlazaCraftModeRecipeId[] =
  [];

let managingWorldPlazaRecipeDiscoveryStorageOwnerId: string | null = null;
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

function persistingWorldPlazaRecipeDiscovery(): void {
  writingWorldPlazaRecipeDiscoveryToStorage(
    managingWorldPlazaRecipeDiscoveryStorageOwnerId,
    managingWorldPlazaRecipeDiscoveryAttachedRecipeIds
  );
}

/**
 * Hydrates recipe page attaches from localStorage for one session owner.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 */
export function initializingWorldPlazaRecipeDiscoveryStore(
  storageOwnerId: string | null
): void {
  if (managingWorldPlazaRecipeDiscoveryStorageOwnerId === storageOwnerId) {
    return;
  }

  managingWorldPlazaRecipeDiscoveryStorageOwnerId = storageOwnerId;
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
  managingWorldPlazaRecipeDiscoveryAttachedRecipeIds = new Set();
  refreshingWorldPlazaRecipeDiscoverySnapshotCaches();
  managingWorldPlazaRecipeDiscoverySubscribers.clear();
}
