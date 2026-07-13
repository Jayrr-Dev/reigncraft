import {
  checkingWorldTreeChopLayerEligibility,
  computingWorldTreeChopLayerMutation,
  formattingWorldTreeChopTileKey,
  parsingWorldTreeChopTileState,
  type CheckingWorldTreeChopLayerEligibilityResult,
  type WorldTreeChopTileState,
} from '../../../../shared/worldTreeChop';
import {
  DEFINING_WORLD_PLAZA_CHOPPED_TREES_LOCAL_STORAGE_KEY_PREFIX,
} from '@/components/world/harvest/domains/definingWorldPlazaTreeChopConstants';

/**
 * Per-tile chop persistence for procedural and placed trees.
 *
 * @module components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees
 */

export type DefiningWorldPlazaChoppedTreeTileState = WorldTreeChopTileState;

type ManagingWorldPlazaLocalChoppedTreesState = {
  readonly byTileKey: Map<string, DefiningWorldPlazaChoppedTreeTileState>;
};

const managingWorldPlazaLocalChoppedTreesByOwner = new Map<
  string,
  ManagingWorldPlazaLocalChoppedTreesState
>();

/**
 * Builds a stable tile key for chop state maps.
 */
export function formattingWorldPlazaChoppedTreeTileKey(
  tileX: number,
  tileY: number
): string {
  return formattingWorldTreeChopTileKey(tileX, tileY);
}

/**
 * Resolves the localStorage key for one persistence owner's chopped trees.
 */
export function resolvingWorldPlazaChoppedTreesLocalStorageKey(
  persistenceOwnerId: string
): string {
  return `${DEFINING_WORLD_PLAZA_CHOPPED_TREES_LOCAL_STORAGE_KEY_PREFIX}:${persistenceOwnerId}`;
}

function loadingWorldPlazaLocalChoppedTreesState(
  persistenceOwnerId: string
): ManagingWorldPlazaLocalChoppedTreesState {
  const cached =
    managingWorldPlazaLocalChoppedTreesByOwner.get(persistenceOwnerId);

  if (cached) {
    return cached;
  }

  const emptyState: ManagingWorldPlazaLocalChoppedTreesState = {
    byTileKey: new Map(),
  };

  if (typeof window === 'undefined') {
    managingWorldPlazaLocalChoppedTreesByOwner.set(
      persistenceOwnerId,
      emptyState
    );
    return emptyState;
  }

  try {
    const raw = window.localStorage.getItem(
      resolvingWorldPlazaChoppedTreesLocalStorageKey(persistenceOwnerId)
    );

    if (!raw) {
      managingWorldPlazaLocalChoppedTreesByOwner.set(
        persistenceOwnerId,
        emptyState
      );
      return emptyState;
    }

    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const byTileKey = new Map<string, DefiningWorldPlazaChoppedTreeTileState>();

    for (const [tileKey, state] of Object.entries(parsed)) {
      if (typeof state === 'number' && Number.isFinite(state)) {
        const tileState = parsingWorldTreeChopTileState(JSON.stringify(state));

        if (tileState) {
          byTileKey.set(tileKey, tileState);
        }

        continue;
      }

      if (state && typeof state === 'object') {
        const tileState = parsingWorldTreeChopTileState(JSON.stringify(state));

        if (tileState) {
          byTileKey.set(tileKey, tileState);
        }
      }
    }

    const loadedState: ManagingWorldPlazaLocalChoppedTreesState = {
      byTileKey,
    };
    managingWorldPlazaLocalChoppedTreesByOwner.set(
      persistenceOwnerId,
      loadedState
    );
    return loadedState;
  } catch {
    managingWorldPlazaLocalChoppedTreesByOwner.set(
      persistenceOwnerId,
      emptyState
    );
    return emptyState;
  }
}

function persistingWorldPlazaLocalChoppedTreesState(
  persistenceOwnerId: string,
  state: ManagingWorldPlazaLocalChoppedTreesState
): void {
  managingWorldPlazaLocalChoppedTreesByOwner.set(persistenceOwnerId, state);

  if (typeof window === 'undefined') {
    return;
  }

  const serialized: Record<string, DefiningWorldPlazaChoppedTreeTileState> = {};

  for (const [tileKey, tileState] of state.byTileKey) {
    serialized[tileKey] = tileState;
  }

  window.localStorage.setItem(
    resolvingWorldPlazaChoppedTreesLocalStorageKey(persistenceOwnerId),
    JSON.stringify(serialized)
  );
}

export type ListingWorldPlazaLocalChoppedTreesResult = {
  readonly choppedTreeStateByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaChoppedTreeTileState
  >;
};

/**
 * Lists all chopped-tree state for one owner.
 */
export function listingWorldPlazaLocalChoppedTrees(
  persistenceOwnerId: string
): ListingWorldPlazaLocalChoppedTreesResult {
  const state = loadingWorldPlazaLocalChoppedTreesState(persistenceOwnerId);
  const choppedTreeStateByTileKey = new Map<
    string,
    DefiningWorldPlazaChoppedTreeTileState
  >();

  for (const [tileKey, tileState] of state.byTileKey) {
    choppedTreeStateByTileKey.set(tileKey, tileState);
  }

  return { choppedTreeStateByTileKey };
}

/**
 * Reads persisted chop state for one tree tile.
 */
export function readingWorldPlazaChoppedTreeState(
  persistenceOwnerId: string | null,
  tileX: number,
  tileY: number
): DefiningWorldPlazaChoppedTreeTileState | undefined {
  if (!persistenceOwnerId) {
    return undefined;
  }

  const state = loadingWorldPlazaLocalChoppedTreesState(persistenceOwnerId);

  return state.byTileKey.get(
    formattingWorldPlazaChoppedTreeTileKey(tileX, tileY)
  );
}

/**
 * Reads persisted remaining visual layer for one tree tile.
 */
export function readingWorldPlazaChoppedTreeRemainingVisualLayer(
  persistenceOwnerId: string | null,
  tileX: number,
  tileY: number
): number | undefined {
  const tileState = readingWorldPlazaChoppedTreeState(
    persistenceOwnerId,
    tileX,
    tileY
  );

  if (!tileState || tileState.isStump) {
    return undefined;
  }

  return tileState.remainingVisualLayer;
}

export type ChoppingWorldPlazaLocalTreeLayerRequest = {
  readonly tileX: number;
  readonly tileY: number;
  readonly playerX: number;
  readonly playerY: number;
  readonly currentVisualLayer: number;
  readonly standingSurfaceLayer: number;
};

export type CheckingWorldPlazaTreeChopLayerEligibilityRequest =
  ChoppingWorldPlazaLocalTreeLayerRequest & {
    readonly persistenceOwnerId: string;
    readonly existingTileState?: DefiningWorldPlazaChoppedTreeTileState;
  };

export type CheckingWorldPlazaTreeChopLayerEligibilityResult =
  CheckingWorldTreeChopLayerEligibilityResult;

/**
 * Validates whether a tree layer can be chopped without mutating state.
 */
export function checkingWorldPlazaTreeChopLayerEligibility(
  request: CheckingWorldPlazaTreeChopLayerEligibilityRequest
): CheckingWorldPlazaTreeChopLayerEligibilityResult {
  const existingTileState =
    request.existingTileState ??
    loadingWorldPlazaLocalChoppedTreesState(request.persistenceOwnerId).byTileKey.get(
      formattingWorldPlazaChoppedTreeTileKey(request.tileX, request.tileY)
    );

  return checkingWorldTreeChopLayerEligibility({
    tileX: request.tileX,
    tileY: request.tileY,
    playerX: request.playerX,
    playerY: request.playerY,
    currentVisualLayer: request.currentVisualLayer,
    standingSurfaceLayer: request.standingSurfaceLayer,
    existingTileState,
  });
}

export type ChoppingWorldPlazaLocalTreeLayerResult =
  | {
      readonly outcome: 'chopped';
      readonly remainingVisualLayer: number;
      readonly layersRemoved: number;
      readonly woodQuantity: number;
      readonly isFullyFelled: boolean;
    }
  | { readonly outcome: 'out-of-range' }
  | { readonly outcome: 'already-felled' };

/**
 * Removes several visual layers from a tree tile and persists the result.
 */
export function choppingWorldPlazaLocalTreeLayer(
  persistenceOwnerId: string,
  request: ChoppingWorldPlazaLocalTreeLayerRequest
): ChoppingWorldPlazaLocalTreeLayerResult {
  const tileKey = formattingWorldPlazaChoppedTreeTileKey(
    request.tileX,
    request.tileY
  );
  const state = loadingWorldPlazaLocalChoppedTreesState(persistenceOwnerId);
  const existingTileState = state.byTileKey.get(tileKey);
  const mutation = computingWorldTreeChopLayerMutation({
    ...request,
    existingTileState,
  });

  if (mutation.outcome !== 'chopped') {
    return { outcome: mutation.outcome };
  }

  const nextByTileKey = new Map(state.byTileKey);
  nextByTileKey.set(tileKey, mutation.nextTileState);

  persistingWorldPlazaLocalChoppedTreesState(persistenceOwnerId, {
    byTileKey: nextByTileKey,
  });

  return {
    outcome: 'chopped',
    remainingVisualLayer: mutation.remainingVisualLayer,
    layersRemoved: mutation.layersRemoved,
    woodQuantity: mutation.woodQuantity,
    isFullyFelled: mutation.isFullyFelled,
  };
}

/**
 * Drops in-memory chopped-tree cache for one persistence owner (save-slot wipe).
 *
 * @param persistenceOwnerId - Scoped localStorage owner id for the slot.
 */
export function clearingWorldPlazaLocalChoppedTreesMemoryForOwner(
  persistenceOwnerId: string
): void {
  managingWorldPlazaLocalChoppedTreesByOwner.delete(persistenceOwnerId);
}
