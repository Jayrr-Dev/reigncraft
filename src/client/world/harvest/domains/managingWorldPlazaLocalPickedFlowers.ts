import { DEFINING_WORLD_PLAZA_PICKED_FLOWERS_LOCAL_STORAGE_KEY_PREFIX } from '@/components/world/harvest/domains/definingWorldPlazaFlowerPickConstants';
import {
  checkingWorldFlowerPickEligibility,
  computingWorldFlowerPickMutation,
  formattingWorldFlowerPickTileKey,
  parsingWorldFlowerPickTileState,
  type CheckingWorldFlowerPickEligibilityResult,
  type WorldFlowerPickTileState,
} from '../../../../shared/worldFlowerPick';
import type { WorldFlowerSpeciesId } from '../../../../shared/worldFlowerRarity';
import { resolvingWorldFlowerSpeciesAtTileIndex } from '../../../../shared/worldFlowerRarity';

/**
 * Per-tile pick persistence for biome flowers.
 *
 * @module components/world/harvest/domains/managingWorldPlazaLocalPickedFlowers
 */

export type DefiningWorldPlazaPickedFlowerTileState = WorldFlowerPickTileState;

type ManagingWorldPlazaLocalPickedFlowersState = {
  readonly byTileKey: Map<string, DefiningWorldPlazaPickedFlowerTileState>;
};

const managingWorldPlazaLocalPickedFlowersByOwner = new Map<
  string,
  ManagingWorldPlazaLocalPickedFlowersState
>();

export function formattingWorldPlazaPickedFlowerTileKey(
  tileX: number,
  tileY: number
): string {
  return formattingWorldFlowerPickTileKey(tileX, tileY);
}

export function resolvingWorldPlazaPickedFlowersLocalStorageKey(
  persistenceOwnerId: string
): string {
  return `${DEFINING_WORLD_PLAZA_PICKED_FLOWERS_LOCAL_STORAGE_KEY_PREFIX}:${persistenceOwnerId}`;
}

function loadingWorldPlazaLocalPickedFlowersState(
  persistenceOwnerId: string
): ManagingWorldPlazaLocalPickedFlowersState {
  const cached =
    managingWorldPlazaLocalPickedFlowersByOwner.get(persistenceOwnerId);

  if (cached) {
    return cached;
  }

  const emptyState: ManagingWorldPlazaLocalPickedFlowersState = {
    byTileKey: new Map(),
  };

  if (typeof window === 'undefined') {
    managingWorldPlazaLocalPickedFlowersByOwner.set(
      persistenceOwnerId,
      emptyState
    );
    return emptyState;
  }

  try {
    const raw = window.localStorage.getItem(
      resolvingWorldPlazaPickedFlowersLocalStorageKey(persistenceOwnerId)
    );

    if (!raw) {
      managingWorldPlazaLocalPickedFlowersByOwner.set(
        persistenceOwnerId,
        emptyState
      );
      return emptyState;
    }

    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const byTileKey = new Map<
      string,
      DefiningWorldPlazaPickedFlowerTileState
    >();

    for (const [tileKey, state] of Object.entries(parsed)) {
      if (state && typeof state === 'object') {
        const tileState = parsingWorldFlowerPickTileState(
          JSON.stringify(state)
        );

        if (tileState) {
          byTileKey.set(tileKey, tileState);
        }
      }
    }

    const loadedState: ManagingWorldPlazaLocalPickedFlowersState = {
      byTileKey,
    };
    managingWorldPlazaLocalPickedFlowersByOwner.set(
      persistenceOwnerId,
      loadedState
    );
    return loadedState;
  } catch {
    managingWorldPlazaLocalPickedFlowersByOwner.set(
      persistenceOwnerId,
      emptyState
    );
    return emptyState;
  }
}

function persistingWorldPlazaLocalPickedFlowersState(
  persistenceOwnerId: string,
  state: ManagingWorldPlazaLocalPickedFlowersState
): void {
  managingWorldPlazaLocalPickedFlowersByOwner.set(persistenceOwnerId, state);

  if (typeof window === 'undefined') {
    return;
  }

  const serialized: Record<string, DefiningWorldPlazaPickedFlowerTileState> =
    {};

  for (const [tileKey, tileState] of state.byTileKey.entries()) {
    serialized[tileKey] = tileState;
  }

  window.localStorage.setItem(
    resolvingWorldPlazaPickedFlowersLocalStorageKey(persistenceOwnerId),
    JSON.stringify(serialized)
  );
}

export function listingWorldPlazaLocalPickedFlowers(
  persistenceOwnerId: string
): {
  readonly pickedFlowerStateByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaPickedFlowerTileState
  >;
} {
  const state = loadingWorldPlazaLocalPickedFlowersState(persistenceOwnerId);
  const pickedFlowerStateByTileKey = new Map<
    string,
    DefiningWorldPlazaPickedFlowerTileState
  >();

  for (const [tileKey, tileState] of state.byTileKey.entries()) {
    pickedFlowerStateByTileKey.set(tileKey, tileState);
  }

  return { pickedFlowerStateByTileKey };
}

export function readingWorldPlazaPickedFlowerState(
  persistenceOwnerId: string | null,
  tileX: number,
  tileY: number
): DefiningWorldPlazaPickedFlowerTileState | undefined {
  if (!persistenceOwnerId) {
    return undefined;
  }

  const state = loadingWorldPlazaLocalPickedFlowersState(persistenceOwnerId);

  return state.byTileKey.get(
    formattingWorldPlazaPickedFlowerTileKey(tileX, tileY)
  );
}

export type PickingWorldPlazaLocalFlowerRequest = {
  readonly tileX: number;
  readonly tileY: number;
  readonly playerX: number;
  readonly playerY: number;
};

export type CheckingWorldPlazaFlowerPickEligibilityRequest =
  PickingWorldPlazaLocalFlowerRequest & {
    readonly persistenceOwnerId: string;
    readonly existingTileState?: DefiningWorldPlazaPickedFlowerTileState;
  };

export type CheckingWorldPlazaFlowerPickEligibilityResult =
  CheckingWorldFlowerPickEligibilityResult;

export function checkingWorldPlazaFlowerPickEligibility(
  request: CheckingWorldPlazaFlowerPickEligibilityRequest
): CheckingWorldPlazaFlowerPickEligibilityResult {
  const existingTileState =
    request.existingTileState ??
    loadingWorldPlazaLocalPickedFlowersState(
      request.persistenceOwnerId
    ).byTileKey.get(
      formattingWorldPlazaPickedFlowerTileKey(request.tileX, request.tileY)
    );

  return checkingWorldFlowerPickEligibility({
    tileX: request.tileX,
    tileY: request.tileY,
    playerX: request.playerX,
    playerY: request.playerY,
    existingTileState,
  });
}

export type PickingWorldPlazaLocalFlowerResult =
  | {
      readonly outcome: 'picked';
      readonly speciesId: WorldFlowerSpeciesId;
      readonly flowerQuantity: number;
    }
  | { readonly outcome: 'out-of-range' }
  | { readonly outcome: 'already-picked' };

export function pickingWorldPlazaLocalFlower(
  persistenceOwnerId: string,
  request: PickingWorldPlazaLocalFlowerRequest
): PickingWorldPlazaLocalFlowerResult {
  const tileKey = formattingWorldPlazaPickedFlowerTileKey(
    request.tileX,
    request.tileY
  );
  const state = loadingWorldPlazaLocalPickedFlowersState(persistenceOwnerId);
  const speciesId = resolvingWorldFlowerSpeciesAtTileIndex(
    request.tileX,
    request.tileY
  );

  const mutation = computingWorldFlowerPickMutation({
    ...request,
    speciesId,
    existingTileState: state.byTileKey.get(tileKey),
  });

  if (mutation.outcome !== 'picked') {
    return { outcome: mutation.outcome };
  }

  persistingWorldPlazaLocalPickedFlowersState(persistenceOwnerId, {
    byTileKey: new Map(state.byTileKey).set(tileKey, mutation.nextTileState),
  });

  return {
    outcome: 'picked',
    speciesId: mutation.speciesId,
    flowerQuantity: mutation.flowerQuantity,
  };
}

export function clearingWorldPlazaLocalPickedFlowersMemoryForOwner(
  persistenceOwnerId: string
): void {
  managingWorldPlazaLocalPickedFlowersByOwner.delete(persistenceOwnerId);
}
