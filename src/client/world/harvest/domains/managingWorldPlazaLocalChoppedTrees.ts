import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import {
  DEFINING_WORLD_PLAZA_CHOPPED_TREES_LOCAL_STORAGE_KEY_PREFIX,
  DEFINING_WORLD_PLAZA_TREE_CHOP_PLAYER_RANGE_TILES,
} from '@/components/world/harvest/domains/definingWorldPlazaTreeChopConstants';

/**
 * Per-tile chop persistence for procedural and placed trees.
 *
 * @module components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees
 */

export type DefiningWorldPlazaChoppedTreeTileState = {
  readonly remainingVisualLayer: number;
};

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
  return `${tileX},${tileY}`;
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

    const parsed = JSON.parse(raw) as Record<
      string,
      DefiningWorldPlazaChoppedTreeTileState
    >;
    const byTileKey = new Map<string, DefiningWorldPlazaChoppedTreeTileState>();

    for (const [tileKey, state] of Object.entries(parsed)) {
      if (
        state &&
        typeof state.remainingVisualLayer === 'number' &&
        Number.isFinite(state.remainingVisualLayer)
      ) {
        byTileKey.set(tileKey, {
          remainingVisualLayer: Math.round(state.remainingVisualLayer),
        });
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
  readonly remainingVisualLayerByTileKey: ReadonlyMap<string, number>;
};

/**
 * Lists all chopped-tree remaining visual layers for one owner.
 */
export function listingWorldPlazaLocalChoppedTrees(
  persistenceOwnerId: string
): ListingWorldPlazaLocalChoppedTreesResult {
  const state = loadingWorldPlazaLocalChoppedTreesState(persistenceOwnerId);
  const remainingVisualLayerByTileKey = new Map<string, number>();

  for (const [tileKey, tileState] of state.byTileKey) {
    remainingVisualLayerByTileKey.set(tileKey, tileState.remainingVisualLayer);
  }

  return { remainingVisualLayerByTileKey };
}

/**
 * Reads persisted remaining visual layer for one tree tile.
 */
export function readingWorldPlazaChoppedTreeRemainingVisualLayer(
  persistenceOwnerId: string | null,
  tileX: number,
  tileY: number
): number | undefined {
  if (!persistenceOwnerId) {
    return undefined;
  }

  const state = loadingWorldPlazaLocalChoppedTreesState(persistenceOwnerId);
  const tileState = state.byTileKey.get(
    formattingWorldPlazaChoppedTreeTileKey(tileX, tileY)
  );

  return tileState?.remainingVisualLayer;
}

export type ChoppingWorldPlazaLocalTreeLayerRequest = {
  readonly tileX: number;
  readonly tileY: number;
  readonly playerX: number;
  readonly playerY: number;
  readonly currentVisualLayer: number;
  readonly standingSurfaceLayer: number;
};

export type ChoppingWorldPlazaLocalTreeLayerResult =
  | {
      readonly outcome: 'chopped';
      readonly remainingVisualLayer: number;
      readonly isFullyFelled: boolean;
    }
  | { readonly outcome: 'out-of-range' }
  | { readonly outcome: 'already-felled' };

/**
 * Removes one visual layer from a tree tile and persists the result.
 */
export function choppingWorldPlazaLocalTreeLayer(
  persistenceOwnerId: string,
  request: ChoppingWorldPlazaLocalTreeLayerRequest
): ChoppingWorldPlazaLocalTreeLayerResult {
  const playerDistance = computingWorldPlazaGridChebyshevDistance(
    request.playerX,
    request.playerY,
    request.tileX + 0.5,
    request.tileY + 0.5
  );

  if (playerDistance > DEFINING_WORLD_PLAZA_TREE_CHOP_PLAYER_RANGE_TILES) {
    return { outcome: 'out-of-range' };
  }

  const tileKey = formattingWorldPlazaChoppedTreeTileKey(
    request.tileX,
    request.tileY
  );
  const state = loadingWorldPlazaLocalChoppedTreesState(persistenceOwnerId);
  const existing = state.byTileKey.get(tileKey);
  const currentRemaining =
    existing?.remainingVisualLayer ?? request.currentVisualLayer;

  if (currentRemaining <= request.standingSurfaceLayer) {
    return { outcome: 'already-felled' };
  }

  const nextRemaining = currentRemaining - 1;
  const nextByTileKey = new Map(state.byTileKey);

  if (nextRemaining <= request.standingSurfaceLayer) {
    nextByTileKey.delete(tileKey);
  } else {
    nextByTileKey.set(tileKey, { remainingVisualLayer: nextRemaining });
  }

  persistingWorldPlazaLocalChoppedTreesState(persistenceOwnerId, {
    byTileKey: nextByTileKey,
  });

  return {
    outcome: 'chopped',
    remainingVisualLayer: nextRemaining,
    isFullyFelled: nextRemaining <= request.standingSurfaceLayer,
  };
}
