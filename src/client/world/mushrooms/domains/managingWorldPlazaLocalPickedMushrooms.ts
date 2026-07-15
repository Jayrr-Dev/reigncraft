/**
 * Per-tile pick persistence for world mushrooms.
 *
 * @module components/world/mushrooms/domains/managingWorldPlazaLocalPickedMushrooms
 */

import { DEFINING_WORLD_PLAZA_PICKED_MUSHROOMS_LOCAL_STORAGE_KEY_PREFIX } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomConstants';
import { resolvingWorldPlazaMushroomSpeciesIdAtTileIndex } from '@/components/world/mushrooms/domains/resolvingWorldPlazaMushroomAtTileIndex';
import type { DefiningWorldPlazaMushroomSpeciesId } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomSpeciesIds';
import {
  checkingWorldMushroomPickEligibility,
  computingWorldMushroomPickMutation,
  formattingWorldMushroomPickTileKey,
  parsingWorldMushroomPickTileState,
  type CheckingWorldMushroomPickEligibilityResult,
  type WorldMushroomPickTileState,
} from '../../../../shared/worldMushroomPick';

export type DefiningWorldPlazaPickedMushroomTileState = WorldMushroomPickTileState;

type ManagingWorldPlazaLocalPickedMushroomsState = {
  readonly byTileKey: Map<string, DefiningWorldPlazaPickedMushroomTileState>;
};

const managingWorldPlazaLocalPickedMushroomsByOwner = new Map<
  string,
  ManagingWorldPlazaLocalPickedMushroomsState
>();

export function formattingWorldPlazaPickedMushroomTileKey(
  tileX: number,
  tileY: number
): string {
  return formattingWorldMushroomPickTileKey(tileX, tileY);
}

export function resolvingWorldPlazaPickedMushroomsLocalStorageKey(
  persistenceOwnerId: string
): string {
  return `${DEFINING_WORLD_PLAZA_PICKED_MUSHROOMS_LOCAL_STORAGE_KEY_PREFIX}:${persistenceOwnerId}`;
}

function loadingWorldPlazaLocalPickedMushroomsState(
  persistenceOwnerId: string
): ManagingWorldPlazaLocalPickedMushroomsState {
  const cached =
    managingWorldPlazaLocalPickedMushroomsByOwner.get(persistenceOwnerId);

  if (cached) {
    return cached;
  }

  const emptyState: ManagingWorldPlazaLocalPickedMushroomsState = {
    byTileKey: new Map(),
  };

  if (typeof window === 'undefined') {
    managingWorldPlazaLocalPickedMushroomsByOwner.set(
      persistenceOwnerId,
      emptyState
    );
    return emptyState;
  }

  try {
    const raw = window.localStorage.getItem(
      resolvingWorldPlazaPickedMushroomsLocalStorageKey(persistenceOwnerId)
    );

    if (!raw) {
      managingWorldPlazaLocalPickedMushroomsByOwner.set(
        persistenceOwnerId,
        emptyState
      );
      return emptyState;
    }

    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const byTileKey = new Map<
      string,
      DefiningWorldPlazaPickedMushroomTileState
    >();

    for (const [tileKey, state] of Object.entries(parsed)) {
      if (state && typeof state === 'object') {
        const tileState = parsingWorldMushroomPickTileState(
          JSON.stringify(state)
        );

        if (tileState) {
          byTileKey.set(tileKey, tileState);
        }
      }
    }

    const loadedState: ManagingWorldPlazaLocalPickedMushroomsState = {
      byTileKey,
    };
    managingWorldPlazaLocalPickedMushroomsByOwner.set(
      persistenceOwnerId,
      loadedState
    );
    return loadedState;
  } catch {
    managingWorldPlazaLocalPickedMushroomsByOwner.set(
      persistenceOwnerId,
      emptyState
    );
    return emptyState;
  }
}

function persistingWorldPlazaLocalPickedMushroomsState(
  persistenceOwnerId: string,
  state: ManagingWorldPlazaLocalPickedMushroomsState
): void {
  managingWorldPlazaLocalPickedMushroomsByOwner.set(persistenceOwnerId, state);

  if (typeof window === 'undefined') {
    return;
  }

  const serialized: Record<string, DefiningWorldPlazaPickedMushroomTileState> =
    {};

  for (const [tileKey, tileState] of state.byTileKey.entries()) {
    serialized[tileKey] = tileState;
  }

  window.localStorage.setItem(
    resolvingWorldPlazaPickedMushroomsLocalStorageKey(persistenceOwnerId),
    JSON.stringify(serialized)
  );
}

export function listingWorldPlazaLocalPickedMushrooms(
  persistenceOwnerId: string
): {
  readonly pickedMushroomStateByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaPickedMushroomTileState
  >;
} {
  const state = loadingWorldPlazaLocalPickedMushroomsState(persistenceOwnerId);
  const pickedMushroomStateByTileKey = new Map<
    string,
    DefiningWorldPlazaPickedMushroomTileState
  >();

  for (const [tileKey, tileState] of state.byTileKey.entries()) {
    pickedMushroomStateByTileKey.set(tileKey, tileState);
  }

  return { pickedMushroomStateByTileKey };
}

export function readingWorldPlazaPickedMushroomState(
  persistenceOwnerId: string | null,
  tileX: number,
  tileY: number
): DefiningWorldPlazaPickedMushroomTileState | undefined {
  if (!persistenceOwnerId) {
    return undefined;
  }

  const state = loadingWorldPlazaLocalPickedMushroomsState(persistenceOwnerId);

  return state.byTileKey.get(
    formattingWorldPlazaPickedMushroomTileKey(tileX, tileY)
  );
}

export type PickingWorldPlazaLocalMushroomRequest = {
  readonly tileX: number;
  readonly tileY: number;
  readonly playerX: number;
  readonly playerY: number;
};

export type CheckingWorldPlazaMushroomPickEligibilityRequest =
  PickingWorldPlazaLocalMushroomRequest & {
    readonly persistenceOwnerId: string;
    readonly existingTileState?: DefiningWorldPlazaPickedMushroomTileState;
  };

export type CheckingWorldPlazaMushroomPickEligibilityResult =
  CheckingWorldMushroomPickEligibilityResult;

export function checkingWorldPlazaMushroomPickEligibility(
  request: CheckingWorldPlazaMushroomPickEligibilityRequest
): CheckingWorldPlazaMushroomPickEligibilityResult {
  const existingTileState =
    request.existingTileState ??
    loadingWorldPlazaLocalPickedMushroomsState(
      request.persistenceOwnerId
    ).byTileKey.get(
      formattingWorldPlazaPickedMushroomTileKey(request.tileX, request.tileY)
    );

  return checkingWorldMushroomPickEligibility({
    tileX: request.tileX,
    tileY: request.tileY,
    playerX: request.playerX,
    playerY: request.playerY,
    existingTileState,
  });
}

export type PickingWorldPlazaLocalMushroomResult =
  | {
      readonly outcome: 'picked';
      readonly speciesId: DefiningWorldPlazaMushroomSpeciesId;
      readonly mushroomQuantity: number;
    }
  | { readonly outcome: 'out-of-range' }
  | { readonly outcome: 'already-picked' }
  | { readonly outcome: 'missing' };

export function pickingWorldPlazaLocalMushroom(
  persistenceOwnerId: string,
  request: PickingWorldPlazaLocalMushroomRequest
): PickingWorldPlazaLocalMushroomResult {
  const tileKey = formattingWorldPlazaPickedMushroomTileKey(
    request.tileX,
    request.tileY
  );
  const state = loadingWorldPlazaLocalPickedMushroomsState(persistenceOwnerId);
  const speciesId = resolvingWorldPlazaMushroomSpeciesIdAtTileIndex(
    request.tileX,
    request.tileY
  );

  if (!speciesId) {
    return { outcome: 'missing' };
  }

  const mutation = computingWorldMushroomPickMutation({
    ...request,
    speciesId,
    existingTileState: state.byTileKey.get(tileKey),
  });

  if (mutation.outcome !== 'picked') {
    return { outcome: mutation.outcome };
  }

  persistingWorldPlazaLocalPickedMushroomsState(persistenceOwnerId, {
    byTileKey: new Map(state.byTileKey).set(tileKey, mutation.nextTileState),
  });

  return {
    outcome: 'picked',
    speciesId,
    mushroomQuantity: mutation.mushroomQuantity,
  };
}

export function clearingWorldPlazaLocalPickedMushroomsMemoryForOwner(
  persistenceOwnerId: string
): void {
  managingWorldPlazaLocalPickedMushroomsByOwner.delete(persistenceOwnerId);
}
