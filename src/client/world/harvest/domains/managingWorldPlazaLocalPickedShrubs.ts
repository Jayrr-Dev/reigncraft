import { DEFINING_WORLD_PLAZA_PICKED_SHRUBS_LOCAL_STORAGE_KEY_PREFIX } from '@/components/world/harvest/domains/definingWorldPlazaShrubPickConstants';
import {
  checkingWorldShrubPickEligibility,
  computingWorldShrubPickMutation,
  formattingWorldShrubPickTileKey,
  parsingWorldShrubPickTileState,
  type CheckingWorldShrubPickEligibilityResult,
  type WorldShrubPickTileState,
} from '../../../../shared/worldShrubPick';

/**
 * Per-tile pick persistence for berry shrubs (player pick + wildlife eat).
 *
 * @module components/world/harvest/domains/managingWorldPlazaLocalPickedShrubs
 */

export type DefiningWorldPlazaPickedShrubTileState = WorldShrubPickTileState;

type ManagingWorldPlazaLocalPickedShrubsState = {
  readonly byTileKey: Map<string, DefiningWorldPlazaPickedShrubTileState>;
};

const managingWorldPlazaLocalPickedShrubsByOwner = new Map<
  string,
  ManagingWorldPlazaLocalPickedShrubsState
>();

/** Bumps when any shrub pick mutates local state so terrain can resync same frame. */
let managingWorldPlazaLocalPickedShrubsRevision = 0;

export function formattingWorldPlazaPickedShrubTileKey(
  tileX: number,
  tileY: number
): string {
  return formattingWorldShrubPickTileKey(tileX, tileY);
}

/** Revision for shrub-decoration invalidation after local picks. */
export function gettingWorldPlazaLocalPickedShrubsRevision(): number {
  return managingWorldPlazaLocalPickedShrubsRevision;
}

export function resolvingWorldPlazaPickedShrubsLocalStorageKey(
  persistenceOwnerId: string
): string {
  return `${DEFINING_WORLD_PLAZA_PICKED_SHRUBS_LOCAL_STORAGE_KEY_PREFIX}:${persistenceOwnerId}`;
}

function checkingWorldPlazaLocalPickedShrubsRecord(
  value: unknown
): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

function loadingWorldPlazaLocalPickedShrubsState(
  persistenceOwnerId: string
): ManagingWorldPlazaLocalPickedShrubsState {
  const cached =
    managingWorldPlazaLocalPickedShrubsByOwner.get(persistenceOwnerId);

  if (cached) {
    return cached;
  }

  const emptyState: ManagingWorldPlazaLocalPickedShrubsState = {
    byTileKey: new Map(),
  };

  if (typeof window === 'undefined') {
    managingWorldPlazaLocalPickedShrubsByOwner.set(
      persistenceOwnerId,
      emptyState
    );
    return emptyState;
  }

  try {
    const raw = window.localStorage.getItem(
      resolvingWorldPlazaPickedShrubsLocalStorageKey(persistenceOwnerId)
    );

    if (!raw) {
      managingWorldPlazaLocalPickedShrubsByOwner.set(
        persistenceOwnerId,
        emptyState
      );
      return emptyState;
    }

    const parsed: unknown = JSON.parse(raw);

    if (!checkingWorldPlazaLocalPickedShrubsRecord(parsed)) {
      managingWorldPlazaLocalPickedShrubsByOwner.set(
        persistenceOwnerId,
        emptyState
      );
      return emptyState;
    }

    const byTileKey = new Map<string, DefiningWorldPlazaPickedShrubTileState>();

    for (const [tileKey, state] of Object.entries(parsed)) {
      if (state && typeof state === 'object') {
        const tileState = parsingWorldShrubPickTileState(JSON.stringify(state));

        if (tileState) {
          byTileKey.set(tileKey, tileState);
        }
      }
    }

    const loadedState: ManagingWorldPlazaLocalPickedShrubsState = {
      byTileKey,
    };
    managingWorldPlazaLocalPickedShrubsByOwner.set(
      persistenceOwnerId,
      loadedState
    );
    return loadedState;
  } catch {
    managingWorldPlazaLocalPickedShrubsByOwner.set(
      persistenceOwnerId,
      emptyState
    );
    return emptyState;
  }
}

function persistingWorldPlazaLocalPickedShrubsState(
  persistenceOwnerId: string,
  state: ManagingWorldPlazaLocalPickedShrubsState
): void {
  managingWorldPlazaLocalPickedShrubsByOwner.set(persistenceOwnerId, state);

  if (typeof window === 'undefined') {
    return;
  }

  const serialized: Record<string, DefiningWorldPlazaPickedShrubTileState> = {};

  for (const [tileKey, tileState] of state.byTileKey.entries()) {
    serialized[tileKey] = tileState;
  }

  window.localStorage.setItem(
    resolvingWorldPlazaPickedShrubsLocalStorageKey(persistenceOwnerId),
    JSON.stringify(serialized)
  );
}

export function listingWorldPlazaLocalPickedShrubs(persistenceOwnerId: string): {
  readonly pickedShrubStateByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaPickedShrubTileState
  >;
} {
  const state = loadingWorldPlazaLocalPickedShrubsState(persistenceOwnerId);
  const pickedShrubStateByTileKey = new Map<
    string,
    DefiningWorldPlazaPickedShrubTileState
  >();

  for (const [tileKey, tileState] of state.byTileKey.entries()) {
    pickedShrubStateByTileKey.set(tileKey, tileState);
  }

  return { pickedShrubStateByTileKey };
}

export function readingWorldPlazaPickedShrubState(
  persistenceOwnerId: string | null,
  tileX: number,
  tileY: number
): DefiningWorldPlazaPickedShrubTileState | undefined {
  if (!persistenceOwnerId) {
    return undefined;
  }

  const state = loadingWorldPlazaLocalPickedShrubsState(persistenceOwnerId);

  return state.byTileKey.get(
    formattingWorldPlazaPickedShrubTileKey(tileX, tileY)
  );
}

export type PickingWorldPlazaLocalShrubRequest = {
  readonly tileX: number;
  readonly tileY: number;
  readonly playerX: number;
  readonly playerY: number;
};

export type CheckingWorldPlazaShrubPickEligibilityRequest =
  PickingWorldPlazaLocalShrubRequest & {
    readonly persistenceOwnerId: string;
    readonly existingTileState?: DefiningWorldPlazaPickedShrubTileState;
  };

export type CheckingWorldPlazaShrubPickEligibilityResult =
  CheckingWorldShrubPickEligibilityResult;

export function checkingWorldPlazaShrubPickEligibility(
  request: CheckingWorldPlazaShrubPickEligibilityRequest
): CheckingWorldPlazaShrubPickEligibilityResult {
  const existingTileState =
    request.existingTileState ??
    loadingWorldPlazaLocalPickedShrubsState(
      request.persistenceOwnerId
    ).byTileKey.get(
      formattingWorldPlazaPickedShrubTileKey(request.tileX, request.tileY)
    );

  return checkingWorldShrubPickEligibility({
    tileX: request.tileX,
    tileY: request.tileY,
    playerX: request.playerX,
    playerY: request.playerY,
    existingTileState,
  });
}

export type PickingWorldPlazaLocalShrubResult =
  | {
      readonly outcome: 'picked';
      readonly berryQuantity: number;
    }
  | { readonly outcome: 'out-of-range' }
  | { readonly outcome: 'already-picked' };

/**
 * Marks one shrub tile picked (player harvest or wildlife eat).
 */
export function pickingWorldPlazaLocalShrub(
  persistenceOwnerId: string,
  request: PickingWorldPlazaLocalShrubRequest
): PickingWorldPlazaLocalShrubResult {
  const tileKey = formattingWorldPlazaPickedShrubTileKey(
    request.tileX,
    request.tileY
  );
  const state = loadingWorldPlazaLocalPickedShrubsState(persistenceOwnerId);

  const mutation = computingWorldShrubPickMutation({
    ...request,
    existingTileState: state.byTileKey.get(tileKey),
  });

  if (mutation.outcome !== 'picked') {
    return { outcome: mutation.outcome };
  }

  persistingWorldPlazaLocalPickedShrubsState(persistenceOwnerId, {
    byTileKey: new Map(state.byTileKey).set(tileKey, mutation.nextTileState),
  });
  managingWorldPlazaLocalPickedShrubsRevision += 1;

  return {
    outcome: 'picked',
    berryQuantity: mutation.berryQuantity,
  };
}

export function clearingWorldPlazaLocalPickedShrubsMemoryForOwner(
  persistenceOwnerId: string
): void {
  managingWorldPlazaLocalPickedShrubsByOwner.delete(persistenceOwnerId);
}
