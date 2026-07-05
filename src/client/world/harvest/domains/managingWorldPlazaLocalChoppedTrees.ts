import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import {
  DEFINING_WORLD_PLAZA_CHOPPED_TREES_LOCAL_STORAGE_KEY_PREFIX,
  DEFINING_WORLD_PLAZA_TREE_CHOP_LAYERS_PER_SWING,
  DEFINING_WORLD_PLAZA_TREE_CHOP_PLAYER_RANGE_TILES,
  DEFINING_WORLD_PLAZA_TREE_CHOP_WOOD_PER_LAYER,
} from '@/components/world/harvest/domains/definingWorldPlazaTreeChopConstants';

/**
 * Per-tile chop persistence for procedural and placed trees.
 *
 * @module components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees
 */

export type DefiningWorldPlazaChoppedTreeTileState = {
  readonly remainingVisualLayer: number;
  readonly isStump: boolean;
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
      if (typeof state === 'number' && Number.isFinite(state)) {
        byTileKey.set(tileKey, {
          remainingVisualLayer: Math.round(state),
          isStump: false,
        });
        continue;
      }

      if (
        state &&
        typeof state === 'object' &&
        typeof state.remainingVisualLayer === 'number' &&
        Number.isFinite(state.remainingVisualLayer)
      ) {
        byTileKey.set(tileKey, {
          remainingVisualLayer: Math.round(state.remainingVisualLayer),
          isStump: state.isStump === true,
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
  };

export type CheckingWorldPlazaTreeChopLayerEligibilityResult =
  | { readonly outcome: 'eligible' }
  | { readonly outcome: 'out-of-range' }
  | { readonly outcome: 'already-felled' };

/**
 * Validates whether a tree layer can be chopped without mutating state.
 */
export function checkingWorldPlazaTreeChopLayerEligibility(
  request: CheckingWorldPlazaTreeChopLayerEligibilityRequest
): CheckingWorldPlazaTreeChopLayerEligibilityResult {
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
  const state = loadingWorldPlazaLocalChoppedTreesState(
    request.persistenceOwnerId
  );
  const existing = state.byTileKey.get(tileKey);

  if (existing?.isStump) {
    return { outcome: 'already-felled' };
  }

  const currentRemaining =
    existing?.remainingVisualLayer ?? request.currentVisualLayer;

  if (currentRemaining <= request.standingSurfaceLayer) {
    return { outcome: 'already-felled' };
  }

  return { outcome: 'eligible' };
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
  const eligibility = checkingWorldPlazaTreeChopLayerEligibility({
    ...request,
    persistenceOwnerId,
  });

  if (eligibility.outcome !== 'eligible') {
    return { outcome: eligibility.outcome };
  }

  const tileKey = formattingWorldPlazaChoppedTreeTileKey(
    request.tileX,
    request.tileY
  );
  const state = loadingWorldPlazaLocalChoppedTreesState(persistenceOwnerId);
  const existing = state.byTileKey.get(tileKey);
  const currentRemaining =
    existing?.remainingVisualLayer ?? request.currentVisualLayer;
  const choppableLayers = currentRemaining - request.standingSurfaceLayer;
  const layersRemoved = Math.min(
    DEFINING_WORLD_PLAZA_TREE_CHOP_LAYERS_PER_SWING,
    choppableLayers
  );
  const nextRemaining = currentRemaining - layersRemoved;
  const isFullyFelled = nextRemaining <= request.standingSurfaceLayer;
  const nextByTileKey = new Map(state.byTileKey);

  if (isFullyFelled) {
    nextByTileKey.set(tileKey, {
      remainingVisualLayer: request.standingSurfaceLayer,
      isStump: true,
    });
  } else {
    nextByTileKey.set(tileKey, {
      remainingVisualLayer: nextRemaining,
      isStump: false,
    });
  }

  persistingWorldPlazaLocalChoppedTreesState(persistenceOwnerId, {
    byTileKey: nextByTileKey,
  });

  return {
    outcome: 'chopped',
    remainingVisualLayer: isFullyFelled
      ? request.standingSurfaceLayer
      : nextRemaining,
    layersRemoved,
    woodQuantity: layersRemoved * DEFINING_WORLD_PLAZA_TREE_CHOP_WOOD_PER_LAYER,
    isFullyFelled,
  };
}
