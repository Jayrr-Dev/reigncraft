/**
 * Per-owner localStorage for craftable storage chest contents.
 *
 * @module components/world/storage-chest/domains/managingWorldPlazaLocalStorageChestContents
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningInventoryItemRegistry } from '@/components/inventory/domains/definingInventoryItemRegistry';
import {
  DEFINING_WORLD_PLAZA_STORAGE_CHEST_CAPACITY,
  DEFINING_WORLD_PLAZA_STORAGE_CHEST_LOCAL_STORAGE_KEY_PREFIX,
} from '@/components/world/storage-chest/domains/definingWorldPlazaStorageChestConstants';
import {
  creatingWorldPlazaStorageChestEmptyContents,
  resolvingWorldPlazaStorageChestContentsFromPersistedSlots,
  serializingWorldPlazaStorageChestContents,
} from '@/components/world/storage-chest/domains/resolvingWorldPlazaStorageChestContents';

type ManagingWorldPlazaLocalStorageChestContentsState = {
  readonly contentsByBlockId: Map<string, DefiningInventoryState>;
};

const managingWorldPlazaLocalStorageChestContentsByOwner = new Map<
  string,
  ManagingWorldPlazaLocalStorageChestContentsState
>();

export function resolvingWorldPlazaStorageChestLocalStorageKey(
  persistenceOwnerId: string
): string {
  return `${DEFINING_WORLD_PLAZA_STORAGE_CHEST_LOCAL_STORAGE_KEY_PREFIX}:${persistenceOwnerId}`;
}

function checkingWorldPlazaLocalStorageChestRecord(
  value: unknown
): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

function persistingWorldPlazaLocalStorageChestContentsState(
  persistenceOwnerId: string,
  state: ManagingWorldPlazaLocalStorageChestContentsState
): void {
  if (typeof window === 'undefined') {
    return;
  }

  const payload: Record<string, unknown> = {};

  for (const [blockId, contents] of state.contentsByBlockId) {
    payload[blockId] = serializingWorldPlazaStorageChestContents(contents);
  }

  try {
    window.localStorage.setItem(
      resolvingWorldPlazaStorageChestLocalStorageKey(persistenceOwnerId),
      JSON.stringify(payload)
    );
  } catch {
    // Quota / private mode: keep in-memory only.
  }
}

function loadingWorldPlazaLocalStorageChestContentsState(
  persistenceOwnerId: string,
  registry: DefiningInventoryItemRegistry
): ManagingWorldPlazaLocalStorageChestContentsState {
  const cached =
    managingWorldPlazaLocalStorageChestContentsByOwner.get(persistenceOwnerId);

  if (cached) {
    return cached;
  }

  const emptyState: ManagingWorldPlazaLocalStorageChestContentsState = {
    contentsByBlockId: new Map(),
  };

  if (typeof window === 'undefined') {
    managingWorldPlazaLocalStorageChestContentsByOwner.set(
      persistenceOwnerId,
      emptyState
    );
    return emptyState;
  }

  try {
    const raw = window.localStorage.getItem(
      resolvingWorldPlazaStorageChestLocalStorageKey(persistenceOwnerId)
    );

    if (!raw) {
      managingWorldPlazaLocalStorageChestContentsByOwner.set(
        persistenceOwnerId,
        emptyState
      );
      return emptyState;
    }

    const parsed: unknown = JSON.parse(raw);

    if (!checkingWorldPlazaLocalStorageChestRecord(parsed)) {
      managingWorldPlazaLocalStorageChestContentsByOwner.set(
        persistenceOwnerId,
        emptyState
      );
      return emptyState;
    }

    const contentsByBlockId = new Map<string, DefiningInventoryState>();

    for (const [blockId, rawSlots] of Object.entries(parsed)) {
      if (typeof blockId !== 'string' || blockId.length === 0) {
        continue;
      }

      contentsByBlockId.set(
        blockId,
        resolvingWorldPlazaStorageChestContentsFromPersistedSlots(
          rawSlots,
          registry,
          DEFINING_WORLD_PLAZA_STORAGE_CHEST_CAPACITY
        )
      );
    }

    const loadedState: ManagingWorldPlazaLocalStorageChestContentsState = {
      contentsByBlockId,
    };
    managingWorldPlazaLocalStorageChestContentsByOwner.set(
      persistenceOwnerId,
      loadedState
    );
    return loadedState;
  } catch {
    managingWorldPlazaLocalStorageChestContentsByOwner.set(
      persistenceOwnerId,
      emptyState
    );
    return emptyState;
  }
}

/**
 * Reads chest contents for one placed block (creates empty if missing).
 */
export function readingWorldPlazaLocalStorageChestContents(
  persistenceOwnerId: string,
  blockId: string,
  registry: DefiningInventoryItemRegistry
): DefiningInventoryState {
  const state = loadingWorldPlazaLocalStorageChestContentsState(
    persistenceOwnerId,
    registry
  );
  const existing = state.contentsByBlockId.get(blockId);

  if (existing) {
    return existing;
  }

  const empty = creatingWorldPlazaStorageChestEmptyContents();
  state.contentsByBlockId.set(blockId, empty);
  return empty;
}

/**
 * Writes chest contents and persists to localStorage.
 */
export function writingWorldPlazaLocalStorageChestContents(
  persistenceOwnerId: string,
  blockId: string,
  contents: DefiningInventoryState,
  registry: DefiningInventoryItemRegistry
): void {
  const state = loadingWorldPlazaLocalStorageChestContentsState(
    persistenceOwnerId,
    registry
  );
  state.contentsByBlockId.set(blockId, contents);
  persistingWorldPlazaLocalStorageChestContentsState(persistenceOwnerId, state);
}

/**
 * Test helper: clear in-memory + localStorage cache for one owner.
 */
export function clearingWorldPlazaLocalStorageChestContentsForTests(
  persistenceOwnerId: string
): void {
  managingWorldPlazaLocalStorageChestContentsByOwner.delete(persistenceOwnerId);

  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(
      resolvingWorldPlazaStorageChestLocalStorageKey(persistenceOwnerId)
    );
  } catch {
    // ignore
  }
}
