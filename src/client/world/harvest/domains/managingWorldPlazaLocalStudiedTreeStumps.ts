import { DEFINING_WORLD_PLAZA_STUDIED_TREE_STUMPS_LOCAL_STORAGE_KEY_PREFIX } from '@/components/world/harvest/domains/definingWorldPlazaTreeStumpStudyConstants';
import { formattingWorldPlazaChoppedTreeTileKey } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';

/**
 * Per-tile stump Study idempotency for the local herbarium (client-only).
 *
 * @module components/world/harvest/domains/managingWorldPlazaLocalStudiedTreeStumps
 */

type ManagingWorldPlazaLocalStudiedTreeStumpsState = {
  readonly tileKeys: Set<string>;
};

const managingWorldPlazaLocalStudiedTreeStumpsByOwner = new Map<
  string,
  ManagingWorldPlazaLocalStudiedTreeStumpsState
>();

/**
 * Resolves the localStorage key for one owner's studied stump tiles.
 */
export function resolvingWorldPlazaStudiedTreeStumpsLocalStorageKey(
  persistenceOwnerId: string
): string {
  return `${DEFINING_WORLD_PLAZA_STUDIED_TREE_STUMPS_LOCAL_STORAGE_KEY_PREFIX}:${persistenceOwnerId}`;
}

function loadingWorldPlazaLocalStudiedTreeStumpsState(
  persistenceOwnerId: string
): ManagingWorldPlazaLocalStudiedTreeStumpsState {
  const cached =
    managingWorldPlazaLocalStudiedTreeStumpsByOwner.get(persistenceOwnerId);

  if (cached) {
    return cached;
  }

  const emptyState: ManagingWorldPlazaLocalStudiedTreeStumpsState = {
    tileKeys: new Set(),
  };

  if (typeof window === 'undefined') {
    managingWorldPlazaLocalStudiedTreeStumpsByOwner.set(
      persistenceOwnerId,
      emptyState
    );
    return emptyState;
  }

  try {
    const raw = window.localStorage.getItem(
      resolvingWorldPlazaStudiedTreeStumpsLocalStorageKey(persistenceOwnerId)
    );

    if (!raw) {
      managingWorldPlazaLocalStudiedTreeStumpsByOwner.set(
        persistenceOwnerId,
        emptyState
      );
      return emptyState;
    }

    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      managingWorldPlazaLocalStudiedTreeStumpsByOwner.set(
        persistenceOwnerId,
        emptyState
      );
      return emptyState;
    }

    const tileKeys = new Set<string>();

    for (const entry of parsed) {
      if (typeof entry === 'string' && entry.length > 0) {
        tileKeys.add(entry);
      }
    }

    const loadedState: ManagingWorldPlazaLocalStudiedTreeStumpsState = {
      tileKeys,
    };
    managingWorldPlazaLocalStudiedTreeStumpsByOwner.set(
      persistenceOwnerId,
      loadedState
    );
    return loadedState;
  } catch {
    managingWorldPlazaLocalStudiedTreeStumpsByOwner.set(
      persistenceOwnerId,
      emptyState
    );
    return emptyState;
  }
}

function persistingWorldPlazaLocalStudiedTreeStumpsState(
  persistenceOwnerId: string,
  state: ManagingWorldPlazaLocalStudiedTreeStumpsState
): void {
  managingWorldPlazaLocalStudiedTreeStumpsByOwner.set(
    persistenceOwnerId,
    state
  );

  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    resolvingWorldPlazaStudiedTreeStumpsLocalStorageKey(persistenceOwnerId),
    JSON.stringify([...state.tileKeys])
  );
}

/**
 * True when the local player already completed Study on this stump tile.
 */
export function checkingWorldPlazaLocalTreeStumpStudied(
  persistenceOwnerId: string | null,
  tileX: number,
  tileY: number
): boolean {
  if (!persistenceOwnerId) {
    return false;
  }

  const state =
    loadingWorldPlazaLocalStudiedTreeStumpsState(persistenceOwnerId);
  return state.tileKeys.has(
    formattingWorldPlazaChoppedTreeTileKey(tileX, tileY)
  );
}

/**
 * Marks one stump tile as studied for the local herbarium.
 *
 * @returns false when already studied or no owner.
 */
export function markingWorldPlazaLocalTreeStumpStudied(
  persistenceOwnerId: string | null,
  tileX: number,
  tileY: number
): boolean {
  if (!persistenceOwnerId) {
    return false;
  }

  const tileKey = formattingWorldPlazaChoppedTreeTileKey(tileX, tileY);
  const state =
    loadingWorldPlazaLocalStudiedTreeStumpsState(persistenceOwnerId);

  if (state.tileKeys.has(tileKey)) {
    return false;
  }

  const nextTileKeys = new Set(state.tileKeys);
  nextTileKeys.add(tileKey);
  persistingWorldPlazaLocalStudiedTreeStumpsState(persistenceOwnerId, {
    tileKeys: nextTileKeys,
  });
  return true;
}

/**
 * Drops in-memory studied-stump cache for one owner (save-slot wipe).
 */
export function clearingWorldPlazaLocalStudiedTreeStumpsMemoryForOwner(
  persistenceOwnerId: string
): void {
  managingWorldPlazaLocalStudiedTreeStumpsByOwner.delete(persistenceOwnerId);
}
