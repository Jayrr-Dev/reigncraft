/**
 * Per-owner localStorage for chests the player has already opened.
 *
 * @module components/world/chest/domains/managingWorldPlazaLocalOpenedChests
 */

import { DEFINING_WORLD_PLAZA_OPENED_CHESTS_LOCAL_STORAGE_KEY_PREFIX } from '@/components/world/chest/domains/definingWorldPlazaChestConstants';
import type { DefiningWorldPlazaChestId } from '@/components/world/chest/domains/definingWorldPlazaChestTypes';

type ManagingWorldPlazaLocalOpenedChestsState = {
  readonly openedChestIds: Set<DefiningWorldPlazaChestId>;
};

const managingWorldPlazaLocalOpenedChestsByOwner = new Map<
  string,
  ManagingWorldPlazaLocalOpenedChestsState
>();

export function resolvingWorldPlazaOpenedChestsLocalStorageKey(
  persistenceOwnerId: string
): string {
  return `${DEFINING_WORLD_PLAZA_OPENED_CHESTS_LOCAL_STORAGE_KEY_PREFIX}:${persistenceOwnerId}`;
}

function checkingWorldPlazaLocalOpenedChestsRecord(
  value: unknown
): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

function loadingWorldPlazaLocalOpenedChestsState(
  persistenceOwnerId: string
): ManagingWorldPlazaLocalOpenedChestsState {
  const cached =
    managingWorldPlazaLocalOpenedChestsByOwner.get(persistenceOwnerId);

  if (cached) {
    return cached;
  }

  const emptyState: ManagingWorldPlazaLocalOpenedChestsState = {
    openedChestIds: new Set(),
  };

  if (typeof window === 'undefined') {
    managingWorldPlazaLocalOpenedChestsByOwner.set(
      persistenceOwnerId,
      emptyState
    );
    return emptyState;
  }

  try {
    const raw = window.localStorage.getItem(
      resolvingWorldPlazaOpenedChestsLocalStorageKey(persistenceOwnerId)
    );

    if (!raw) {
      managingWorldPlazaLocalOpenedChestsByOwner.set(
        persistenceOwnerId,
        emptyState
      );
      return emptyState;
    }

    const parsed: unknown = JSON.parse(raw);

    if (!checkingWorldPlazaLocalOpenedChestsRecord(parsed)) {
      managingWorldPlazaLocalOpenedChestsByOwner.set(
        persistenceOwnerId,
        emptyState
      );
      return emptyState;
    }

    const openedIdsValue = parsed.openedChestIds;
    const openedChestIds = new Set<DefiningWorldPlazaChestId>();

    if (Array.isArray(openedIdsValue)) {
      for (const entry of openedIdsValue) {
        if (typeof entry === 'string' && entry.length > 0) {
          openedChestIds.add(entry);
        }
      }
    }

    const loadedState: ManagingWorldPlazaLocalOpenedChestsState = {
      openedChestIds,
    };
    managingWorldPlazaLocalOpenedChestsByOwner.set(
      persistenceOwnerId,
      loadedState
    );
    return loadedState;
  } catch {
    managingWorldPlazaLocalOpenedChestsByOwner.set(
      persistenceOwnerId,
      emptyState
    );
    return emptyState;
  }
}

function persistingWorldPlazaLocalOpenedChestsState(
  persistenceOwnerId: string,
  state: ManagingWorldPlazaLocalOpenedChestsState
): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(
      resolvingWorldPlazaOpenedChestsLocalStorageKey(persistenceOwnerId),
      JSON.stringify({
        openedChestIds: [...state.openedChestIds],
      })
    );
  } catch {
    // Ignore quota / private-mode failures.
  }
}

/** True when this owner already opened the chest in a prior session. */
export function checkingWorldPlazaLocalChestIsOpened(
  persistenceOwnerId: string,
  chestId: DefiningWorldPlazaChestId
): boolean {
  return loadingWorldPlazaLocalOpenedChestsState(
    persistenceOwnerId
  ).openedChestIds.has(chestId);
}

/** Lists opened chest ids for the owner. */
export function listingWorldPlazaLocalOpenedChestIds(
  persistenceOwnerId: string
): ReadonlySet<DefiningWorldPlazaChestId> {
  return loadingWorldPlazaLocalOpenedChestsState(persistenceOwnerId)
    .openedChestIds;
}

/**
 * Marks a chest opened for the owner and persists. Idempotent.
 */
export function openingWorldPlazaLocalChest(
  persistenceOwnerId: string,
  chestId: DefiningWorldPlazaChestId
): void {
  const state = loadingWorldPlazaLocalOpenedChestsState(persistenceOwnerId);

  if (state.openedChestIds.has(chestId)) {
    return;
  }

  state.openedChestIds.add(chestId);
  persistingWorldPlazaLocalOpenedChestsState(persistenceOwnerId, state);
}

/** Test helper: clears in-memory + optional localStorage for one owner. */
export function resettingWorldPlazaLocalOpenedChestsForTests(
  persistenceOwnerId: string
): void {
  managingWorldPlazaLocalOpenedChestsByOwner.delete(persistenceOwnerId);

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(
        resolvingWorldPlazaOpenedChestsLocalStorageKey(persistenceOwnerId)
      );
    } catch {
      // Ignore.
    }
  }
}
