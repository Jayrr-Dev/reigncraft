import {
  checkingWorldPebblePickEligibility,
  computingWorldPebblePickMutation,
  formattingWorldPebblePickTileKey,
  parsingWorldPebblePickTileState,
  type CheckingWorldPebblePickEligibilityResult,
  type WorldPebblePickTileState,
} from '../../../../shared/worldPebblePick';
import { DEFINING_WORLD_PLAZA_PICKED_PEBBLES_LOCAL_STORAGE_KEY_PREFIX } from '@/components/world/harvest/domains/definingWorldPlazaPebblePickConstants';

/**
 * Per-tile pick persistence for floor pebbles.
 *
 * @module components/world/harvest/domains/managingWorldPlazaLocalPickedPebbles
 */

export type DefiningWorldPlazaPickedPebbleTileState = WorldPebblePickTileState;

type ManagingWorldPlazaLocalPickedPebblesState = {
  readonly byTileKey: Map<string, DefiningWorldPlazaPickedPebbleTileState>;
};

const managingWorldPlazaLocalPickedPebblesByOwner = new Map<
  string,
  ManagingWorldPlazaLocalPickedPebblesState
>();

/**
 * Builds a stable tile key for pick state maps.
 */
export function formattingWorldPlazaPickedPebbleTileKey(
  tileX: number,
  tileY: number
): string {
  return formattingWorldPebblePickTileKey(tileX, tileY);
}

/**
 * Resolves the localStorage key for one persistence owner's picked pebbles.
 */
export function resolvingWorldPlazaPickedPebblesLocalStorageKey(
  persistenceOwnerId: string
): string {
  return `${DEFINING_WORLD_PLAZA_PICKED_PEBBLES_LOCAL_STORAGE_KEY_PREFIX}:${persistenceOwnerId}`;
}

function loadingWorldPlazaLocalPickedPebblesState(
  persistenceOwnerId: string
): ManagingWorldPlazaLocalPickedPebblesState {
  const cached =
    managingWorldPlazaLocalPickedPebblesByOwner.get(persistenceOwnerId);

  if (cached) {
    return cached;
  }

  const emptyState: ManagingWorldPlazaLocalPickedPebblesState = {
    byTileKey: new Map(),
  };

  if (typeof window === 'undefined') {
    managingWorldPlazaLocalPickedPebblesByOwner.set(
      persistenceOwnerId,
      emptyState
    );
    return emptyState;
  }

  try {
    const raw = window.localStorage.getItem(
      resolvingWorldPlazaPickedPebblesLocalStorageKey(persistenceOwnerId)
    );

    if (!raw) {
      managingWorldPlazaLocalPickedPebblesByOwner.set(
        persistenceOwnerId,
        emptyState
      );
      return emptyState;
    }

    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const byTileKey = new Map<string, DefiningWorldPlazaPickedPebbleTileState>();

    for (const [tileKey, state] of Object.entries(parsed)) {
      if (state && typeof state === 'object') {
        const tileState = parsingWorldPebblePickTileState(JSON.stringify(state));

        if (tileState) {
          byTileKey.set(tileKey, tileState);
        }
      }
    }

    const loadedState: ManagingWorldPlazaLocalPickedPebblesState = {
      byTileKey,
    };
    managingWorldPlazaLocalPickedPebblesByOwner.set(
      persistenceOwnerId,
      loadedState
    );
    return loadedState;
  } catch {
    managingWorldPlazaLocalPickedPebblesByOwner.set(
      persistenceOwnerId,
      emptyState
    );
    return emptyState;
  }
}

function persistingWorldPlazaLocalPickedPebblesState(
  persistenceOwnerId: string,
  state: ManagingWorldPlazaLocalPickedPebblesState
): void {
  managingWorldPlazaLocalPickedPebblesByOwner.set(persistenceOwnerId, state);

  if (typeof window === 'undefined') {
    return;
  }

  const serialized: Record<string, DefiningWorldPlazaPickedPebbleTileState> = {};

  for (const [tileKey, tileState] of state.byTileKey) {
    serialized[tileKey] = tileState;
  }

  window.localStorage.setItem(
    resolvingWorldPlazaPickedPebblesLocalStorageKey(persistenceOwnerId),
    JSON.stringify(serialized)
  );
}

export type ListingWorldPlazaLocalPickedPebblesResult = {
  readonly pickedPebbleStateByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaPickedPebbleTileState
  >;
};

/**
 * Lists all picked-pebble state for one owner.
 */
export function listingWorldPlazaLocalPickedPebbles(
  persistenceOwnerId: string
): ListingWorldPlazaLocalPickedPebblesResult {
  const state = loadingWorldPlazaLocalPickedPebblesState(persistenceOwnerId);
  const pickedPebbleStateByTileKey = new Map<
    string,
    DefiningWorldPlazaPickedPebbleTileState
  >();

  for (const [tileKey, tileState] of state.byTileKey) {
    pickedPebbleStateByTileKey.set(tileKey, tileState);
  }

  return { pickedPebbleStateByTileKey };
}

/**
 * Reads persisted pick state for one pebble tile.
 */
export function readingWorldPlazaPickedPebbleState(
  persistenceOwnerId: string | null,
  tileX: number,
  tileY: number
): DefiningWorldPlazaPickedPebbleTileState | undefined {
  if (!persistenceOwnerId) {
    return undefined;
  }

  const state = loadingWorldPlazaLocalPickedPebblesState(persistenceOwnerId);

  return state.byTileKey.get(
    formattingWorldPlazaPickedPebbleTileKey(tileX, tileY)
  );
}

export type PickingWorldPlazaLocalPebbleRequest = {
  readonly tileX: number;
  readonly tileY: number;
  readonly playerX: number;
  readonly playerY: number;
};

export type CheckingWorldPlazaPebblePickEligibilityRequest =
  PickingWorldPlazaLocalPebbleRequest & {
    readonly persistenceOwnerId: string;
    readonly existingTileState?: DefiningWorldPlazaPickedPebbleTileState;
  };

export type CheckingWorldPlazaPebblePickEligibilityResult =
  CheckingWorldPebblePickEligibilityResult;

/**
 * Validates whether a pebble can be picked without mutating state.
 */
export function checkingWorldPlazaPebblePickEligibility(
  request: CheckingWorldPlazaPebblePickEligibilityRequest
): CheckingWorldPlazaPebblePickEligibilityResult {
  const existingTileState =
    request.existingTileState ??
    loadingWorldPlazaLocalPickedPebblesState(request.persistenceOwnerId).byTileKey.get(
      formattingWorldPlazaPickedPebbleTileKey(request.tileX, request.tileY)
    );

  return checkingWorldPebblePickEligibility({
    tileX: request.tileX,
    tileY: request.tileY,
    playerX: request.playerX,
    playerY: request.playerY,
    existingTileState,
  });
}

export type PickingWorldPlazaLocalPebbleResult =
  | {
      readonly outcome: 'picked';
      readonly stoneQuantity: number;
    }
  | { readonly outcome: 'out-of-range' }
  | { readonly outcome: 'already-picked' };

/**
 * Marks a floor pebble as picked and persists the result.
 */
export function pickingWorldPlazaLocalPebble(
  persistenceOwnerId: string,
  request: PickingWorldPlazaLocalPebbleRequest
): PickingWorldPlazaLocalPebbleResult {
  const tileKey = formattingWorldPlazaPickedPebbleTileKey(
    request.tileX,
    request.tileY
  );
  const state = loadingWorldPlazaLocalPickedPebblesState(persistenceOwnerId);
  const existingTileState = state.byTileKey.get(tileKey);
  const mutation = computingWorldPebblePickMutation({
    ...request,
    existingTileState,
  });

  if (mutation.outcome !== 'picked') {
    return { outcome: mutation.outcome };
  }

  const nextByTileKey = new Map(state.byTileKey);
  nextByTileKey.set(tileKey, mutation.nextTileState);

  persistingWorldPlazaLocalPickedPebblesState(persistenceOwnerId, {
    byTileKey: nextByTileKey,
  });

  return {
    outcome: 'picked',
    stoneQuantity: mutation.stoneQuantity,
  };
}

/**
 * Drops in-memory picked-pebble cache for one persistence owner (save-slot wipe).
 *
 * @param persistenceOwnerId - Scoped localStorage owner id for the slot.
 */
export function clearingWorldPlazaLocalPickedPebblesMemoryForOwner(
  persistenceOwnerId: string
): void {
  managingWorldPlazaLocalPickedPebblesByOwner.delete(persistenceOwnerId);
}
