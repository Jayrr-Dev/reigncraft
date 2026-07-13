import {
  checkingWorldRockMineLayerEligibility,
  computingWorldRockMineLayerMutation,
  formattingWorldRockMineTileKey,
  parsingWorldRockMineTileState,
  type CheckingWorldRockMineLayerEligibilityResult,
  type WorldRockMineTileState,
} from '../../../../shared/worldRockMine';
import {
  DEFINING_WORLD_PLAZA_MINED_ROCKS_LOCAL_STORAGE_KEY_PREFIX,
} from '@/components/world/harvest/domains/definingWorldPlazaRockMineConstants';

/**
 * Per-tile mine persistence for column rocks.
 *
 * @module components/world/harvest/domains/managingWorldPlazaLocalMinedRocks
 */

export type DefiningWorldPlazaMinedRockTileState = WorldRockMineTileState;

type ManagingWorldPlazaLocalMinedRocksState = {
  readonly byTileKey: Map<string, DefiningWorldPlazaMinedRockTileState>;
};

const managingWorldPlazaLocalMinedRocksByOwner = new Map<
  string,
  ManagingWorldPlazaLocalMinedRocksState
>();

/**
 * Builds a stable tile key for mine state maps.
 */
export function formattingWorldPlazaMinedRockTileKey(
  tileX: number,
  tileY: number
): string {
  return formattingWorldRockMineTileKey(tileX, tileY);
}

/**
 * Resolves the localStorage key for one persistence owner's mined rocks.
 */
export function resolvingWorldPlazaMinedRocksLocalStorageKey(
  persistenceOwnerId: string
): string {
  return `${DEFINING_WORLD_PLAZA_MINED_ROCKS_LOCAL_STORAGE_KEY_PREFIX}:${persistenceOwnerId}`;
}

function loadingWorldPlazaLocalMinedRocksState(
  persistenceOwnerId: string
): ManagingWorldPlazaLocalMinedRocksState {
  const cached =
    managingWorldPlazaLocalMinedRocksByOwner.get(persistenceOwnerId);

  if (cached) {
    return cached;
  }

  const emptyState: ManagingWorldPlazaLocalMinedRocksState = {
    byTileKey: new Map(),
  };

  if (typeof window === 'undefined') {
    managingWorldPlazaLocalMinedRocksByOwner.set(
      persistenceOwnerId,
      emptyState
    );
    return emptyState;
  }

  try {
    const raw = window.localStorage.getItem(
      resolvingWorldPlazaMinedRocksLocalStorageKey(persistenceOwnerId)
    );

    if (!raw) {
      managingWorldPlazaLocalMinedRocksByOwner.set(
        persistenceOwnerId,
        emptyState
      );
      return emptyState;
    }

    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const byTileKey = new Map<string, DefiningWorldPlazaMinedRockTileState>();

    for (const [tileKey, state] of Object.entries(parsed)) {
      if (typeof state === 'number' && Number.isFinite(state)) {
        const tileState = parsingWorldRockMineTileState(JSON.stringify(state));

        if (tileState) {
          byTileKey.set(tileKey, tileState);
        }

        continue;
      }

      if (state && typeof state === 'object') {
        const tileState = parsingWorldRockMineTileState(JSON.stringify(state));

        if (tileState) {
          byTileKey.set(tileKey, tileState);
        }
      }
    }

    const loadedState: ManagingWorldPlazaLocalMinedRocksState = {
      byTileKey,
    };
    managingWorldPlazaLocalMinedRocksByOwner.set(
      persistenceOwnerId,
      loadedState
    );
    return loadedState;
  } catch {
    managingWorldPlazaLocalMinedRocksByOwner.set(
      persistenceOwnerId,
      emptyState
    );
    return emptyState;
  }
}

function persistingWorldPlazaLocalMinedRocksState(
  persistenceOwnerId: string,
  state: ManagingWorldPlazaLocalMinedRocksState
): void {
  managingWorldPlazaLocalMinedRocksByOwner.set(persistenceOwnerId, state);

  if (typeof window === 'undefined') {
    return;
  }

  const serialized: Record<string, DefiningWorldPlazaMinedRockTileState> = {};

  for (const [tileKey, tileState] of state.byTileKey) {
    serialized[tileKey] = tileState;
  }

  window.localStorage.setItem(
    resolvingWorldPlazaMinedRocksLocalStorageKey(persistenceOwnerId),
    JSON.stringify(serialized)
  );
}

export type ListingWorldPlazaLocalMinedRocksResult = {
  readonly minedRockStateByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaMinedRockTileState
  >;
};

/**
 * Lists all mined-rock state for one owner.
 */
export function listingWorldPlazaLocalMinedRocks(
  persistenceOwnerId: string
): ListingWorldPlazaLocalMinedRocksResult {
  const state = loadingWorldPlazaLocalMinedRocksState(persistenceOwnerId);
  const minedRockStateByTileKey = new Map<
    string,
    DefiningWorldPlazaMinedRockTileState
  >();

  for (const [tileKey, tileState] of state.byTileKey) {
    minedRockStateByTileKey.set(tileKey, tileState);
  }

  return { minedRockStateByTileKey };
}

/**
 * Reads persisted mine state for one rock anchor tile.
 */
export function readingWorldPlazaMinedRockState(
  persistenceOwnerId: string | null,
  tileX: number,
  tileY: number
): DefiningWorldPlazaMinedRockTileState | undefined {
  if (!persistenceOwnerId) {
    return undefined;
  }

  const state = loadingWorldPlazaLocalMinedRocksState(persistenceOwnerId);

  return state.byTileKey.get(
    formattingWorldPlazaMinedRockTileKey(tileX, tileY)
  );
}

/**
 * Reads persisted remaining visual layer for one rock anchor tile.
 */
export function readingWorldPlazaMinedRockRemainingVisualLayer(
  persistenceOwnerId: string | null,
  tileX: number,
  tileY: number
): number | undefined {
  const tileState = readingWorldPlazaMinedRockState(
    persistenceOwnerId,
    tileX,
    tileY
  );

  if (!tileState || tileState.isDepleted) {
    return undefined;
  }

  return tileState.remainingVisualLayer;
}

export type MiningWorldPlazaLocalRockLayerRequest = {
  readonly tileX: number;
  readonly tileY: number;
  readonly targetCenterX: number;
  readonly targetCenterY: number;
  readonly playerX: number;
  readonly playerY: number;
  readonly currentVisualLayer: number;
  readonly standingSurfaceLayer: number;
};

export type CheckingWorldPlazaRockMineLayerEligibilityRequest =
  MiningWorldPlazaLocalRockLayerRequest & {
    readonly persistenceOwnerId: string;
    readonly existingTileState?: DefiningWorldPlazaMinedRockTileState;
  };

export type CheckingWorldPlazaRockMineLayerEligibilityResult =
  CheckingWorldRockMineLayerEligibilityResult;

/**
 * Validates whether a rock layer can be mined without mutating state.
 */
export function checkingWorldPlazaRockMineLayerEligibility(
  request: CheckingWorldPlazaRockMineLayerEligibilityRequest
): CheckingWorldPlazaRockMineLayerEligibilityResult {
  const existingTileState =
    request.existingTileState ??
    loadingWorldPlazaLocalMinedRocksState(request.persistenceOwnerId).byTileKey.get(
      formattingWorldPlazaMinedRockTileKey(request.tileX, request.tileY)
    );

  return checkingWorldRockMineLayerEligibility({
    tileX: request.tileX,
    tileY: request.tileY,
    targetCenterX: request.targetCenterX,
    targetCenterY: request.targetCenterY,
    playerX: request.playerX,
    playerY: request.playerY,
    currentVisualLayer: request.currentVisualLayer,
    standingSurfaceLayer: request.standingSurfaceLayer,
    existingTileState,
  });
}

export type MiningWorldPlazaLocalRockLayerResult =
  | {
      readonly outcome: 'mined';
      readonly remainingVisualLayer: number;
      readonly layersRemoved: number;
      readonly stoneQuantity: number;
      readonly isFullyDepleted: boolean;
    }
  | { readonly outcome: 'out-of-range' }
  | { readonly outcome: 'already-depleted' };

/**
 * Removes several visual layers from a rock anchor and persists the result.
 */
export function miningWorldPlazaLocalRockLayer(
  persistenceOwnerId: string,
  request: MiningWorldPlazaLocalRockLayerRequest
): MiningWorldPlazaLocalRockLayerResult {
  const tileKey = formattingWorldPlazaMinedRockTileKey(
    request.tileX,
    request.tileY
  );
  const state = loadingWorldPlazaLocalMinedRocksState(persistenceOwnerId);
  const existingTileState = state.byTileKey.get(tileKey);
  const mutation = computingWorldRockMineLayerMutation({
    ...request,
    existingTileState,
  });

  if (mutation.outcome !== 'mined') {
    return { outcome: mutation.outcome };
  }

  const nextByTileKey = new Map(state.byTileKey);
  nextByTileKey.set(tileKey, mutation.nextTileState);

  persistingWorldPlazaLocalMinedRocksState(persistenceOwnerId, {
    byTileKey: nextByTileKey,
  });

  return {
    outcome: 'mined',
    remainingVisualLayer: mutation.remainingVisualLayer,
    layersRemoved: mutation.layersRemoved,
    stoneQuantity: mutation.stoneQuantity,
    isFullyDepleted: mutation.isFullyDepleted,
  };
}

/**
 * Drops in-memory mined-rock cache for one persistence owner (save-slot wipe).
 *
 * @param persistenceOwnerId - Scoped localStorage owner id for the slot.
 */
export function clearingWorldPlazaLocalMinedRocksMemoryForOwner(
  persistenceOwnerId: string
): void {
  managingWorldPlazaLocalMinedRocksByOwner.delete(persistenceOwnerId);
}
