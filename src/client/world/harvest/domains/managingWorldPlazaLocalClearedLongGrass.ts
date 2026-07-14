import { DEFINING_WORLD_PLAZA_CLEARED_LONG_GRASS_LOCAL_STORAGE_KEY_PREFIX } from '@/components/world/harvest/domains/definingWorldPlazaLongGrassSearchConstants';
import {
  checkingWorldLongGrassSearchEligibility,
  computingWorldLongGrassEatMutation,
  computingWorldLongGrassSearchMutation,
  formattingWorldLongGrassClearTileKey,
  parsingWorldLongGrassTileState,
  type CheckingWorldLongGrassSearchEligibilityResult,
  type WorldLongGrassTileState,
} from '../../../../shared/worldLongGrassClear';

/**
 * Per-tile clear persistence for long-grass clumps (search + wildlife eat).
 *
 * @module components/world/harvest/domains/managingWorldPlazaLocalClearedLongGrass
 */

export type DefiningWorldPlazaClearedLongGrassTileState =
  WorldLongGrassTileState;

type ManagingWorldPlazaLocalClearedLongGrassState = {
  readonly byTileKey: Map<string, DefiningWorldPlazaClearedLongGrassTileState>;
};

const managingWorldPlazaLocalClearedLongGrassByOwner = new Map<
  string,
  ManagingWorldPlazaLocalClearedLongGrassState
>();

export function formattingWorldPlazaClearedLongGrassTileKey(
  tileX: number,
  tileY: number
): string {
  return formattingWorldLongGrassClearTileKey(tileX, tileY);
}

export function resolvingWorldPlazaClearedLongGrassLocalStorageKey(
  persistenceOwnerId: string
): string {
  return `${DEFINING_WORLD_PLAZA_CLEARED_LONG_GRASS_LOCAL_STORAGE_KEY_PREFIX}:${persistenceOwnerId}`;
}

function loadingWorldPlazaLocalClearedLongGrassState(
  persistenceOwnerId: string
): ManagingWorldPlazaLocalClearedLongGrassState {
  const cached =
    managingWorldPlazaLocalClearedLongGrassByOwner.get(persistenceOwnerId);

  if (cached) {
    return cached;
  }

  const emptyState: ManagingWorldPlazaLocalClearedLongGrassState = {
    byTileKey: new Map(),
  };

  if (typeof window === 'undefined') {
    managingWorldPlazaLocalClearedLongGrassByOwner.set(
      persistenceOwnerId,
      emptyState
    );
    return emptyState;
  }

  try {
    const raw = window.localStorage.getItem(
      resolvingWorldPlazaClearedLongGrassLocalStorageKey(persistenceOwnerId)
    );

    if (!raw) {
      managingWorldPlazaLocalClearedLongGrassByOwner.set(
        persistenceOwnerId,
        emptyState
      );
      return emptyState;
    }

    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const byTileKey = new Map<
      string,
      DefiningWorldPlazaClearedLongGrassTileState
    >();

    for (const [tileKey, state] of Object.entries(parsed)) {
      if (state && typeof state === 'object') {
        const tileState = parsingWorldLongGrassTileState(JSON.stringify(state));

        if (tileState) {
          byTileKey.set(tileKey, tileState);
        }
      }
    }

    const loadedState: ManagingWorldPlazaLocalClearedLongGrassState = {
      byTileKey,
    };
    managingWorldPlazaLocalClearedLongGrassByOwner.set(
      persistenceOwnerId,
      loadedState
    );
    return loadedState;
  } catch {
    managingWorldPlazaLocalClearedLongGrassByOwner.set(
      persistenceOwnerId,
      emptyState
    );
    return emptyState;
  }
}

function persistingWorldPlazaLocalClearedLongGrassState(
  persistenceOwnerId: string,
  state: ManagingWorldPlazaLocalClearedLongGrassState
): void {
  managingWorldPlazaLocalClearedLongGrassByOwner.set(persistenceOwnerId, state);

  if (typeof window === 'undefined') {
    return;
  }

  const serialized = Object.fromEntries(state.byTileKey.entries());
  window.localStorage.setItem(
    resolvingWorldPlazaClearedLongGrassLocalStorageKey(persistenceOwnerId),
    JSON.stringify(serialized)
  );
}

export function listingWorldPlazaLocalClearedLongGrassByOwner(
  persistenceOwnerId: string
): ReadonlyMap<string, DefiningWorldPlazaClearedLongGrassTileState> {
  return loadingWorldPlazaLocalClearedLongGrassState(persistenceOwnerId)
    .byTileKey;
}

export type SearchingWorldPlazaLocalLongGrassRequest = {
  readonly tileX: number;
  readonly tileY: number;
  readonly playerX: number;
  readonly playerY: number;
};

export type SearchingWorldPlazaLocalLongGrassResult =
  | { readonly outcome: 'searched' }
  | Exclude<
      CheckingWorldLongGrassSearchEligibilityResult,
      { outcome: 'eligible' }
    >;

export function searchingWorldPlazaLocalLongGrass(
  persistenceOwnerId: string,
  request: SearchingWorldPlazaLocalLongGrassRequest
): SearchingWorldPlazaLocalLongGrassResult {
  const state = loadingWorldPlazaLocalClearedLongGrassState(persistenceOwnerId);
  const tileKey = formattingWorldPlazaClearedLongGrassTileKey(
    request.tileX,
    request.tileY
  );
  const mutation = computingWorldLongGrassSearchMutation({
    tileX: request.tileX,
    tileY: request.tileY,
    playerX: request.playerX,
    playerY: request.playerY,
    existingTileState: state.byTileKey.get(tileKey),
  });

  if (mutation.outcome !== 'searched') {
    return mutation;
  }

  const nextByTileKey = new Map(state.byTileKey);
  nextByTileKey.set(tileKey, mutation.nextTileState);
  persistingWorldPlazaLocalClearedLongGrassState(persistenceOwnerId, {
    byTileKey: nextByTileKey,
  });

  return { outcome: 'searched' };
}

export type EatingWorldPlazaLocalLongGrassRequest = {
  readonly tileX: number;
  readonly tileY: number;
};

export type EatingWorldPlazaLocalLongGrassResult =
  | { readonly outcome: 'eaten' }
  | Exclude<
      ReturnType<typeof computingWorldLongGrassEatMutation>,
      { outcome: 'eaten' }
    >;

export function eatingWorldPlazaLocalLongGrass(
  persistenceOwnerId: string,
  request: EatingWorldPlazaLocalLongGrassRequest
): EatingWorldPlazaLocalLongGrassResult {
  const state = loadingWorldPlazaLocalClearedLongGrassState(persistenceOwnerId);
  const tileKey = formattingWorldPlazaClearedLongGrassTileKey(
    request.tileX,
    request.tileY
  );
  const mutation = computingWorldLongGrassEatMutation({
    tileX: request.tileX,
    tileY: request.tileY,
    existingTileState: state.byTileKey.get(tileKey),
  });

  if (mutation.outcome !== 'eaten') {
    return mutation;
  }

  const nextByTileKey = new Map(state.byTileKey);
  nextByTileKey.set(tileKey, mutation.nextTileState);
  persistingWorldPlazaLocalClearedLongGrassState(persistenceOwnerId, {
    byTileKey: nextByTileKey,
  });

  return { outcome: 'eaten' };
}

/** @deprecated Use {@link searchingWorldPlazaLocalLongGrass}. */
export type ClearingWorldPlazaLocalLongGrassRequest =
  SearchingWorldPlazaLocalLongGrassRequest;

/** @deprecated Use {@link SearchingWorldPlazaLocalLongGrassResult}. */
export type ClearingWorldPlazaLocalLongGrassResult =
  | { readonly outcome: 'cleared' }
  | Exclude<SearchingWorldPlazaLocalLongGrassResult, { outcome: 'searched' }>
  | { readonly outcome: 'already-cleared' };

/** @deprecated Use {@link searchingWorldPlazaLocalLongGrass}. */
export function clearingWorldPlazaLocalLongGrass(
  persistenceOwnerId: string,
  request: ClearingWorldPlazaLocalLongGrassRequest
): ClearingWorldPlazaLocalLongGrassResult {
  const result = searchingWorldPlazaLocalLongGrass(persistenceOwnerId, request);

  if (result.outcome === 'searched') {
    return { outcome: 'cleared' };
  }

  if (result.outcome === 'already-searched') {
    return { outcome: 'already-cleared' };
  }

  return result;
}

export {
  checkingWorldLongGrassSearchEligibility as checkingWorldLongGrassClearEligibility,
  checkingWorldLongGrassSearchEligibility,
};
