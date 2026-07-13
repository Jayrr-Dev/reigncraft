/**
 * Local farmland tile persistence (tilled → mature crop).
 *
 * @module components/world/farming/domains/managingWorldPlazaLocalFarmland
 */

import { advancingWorldPlazaFarmlandGrowthPhases } from '@/components/world/farming/domains/advancingWorldPlazaFarmlandGrowthPhases';
import { DEFINING_WORLD_PLAZA_FARMLAND_LOCAL_STORAGE_KEY_PREFIX } from '@/components/world/farming/domains/definingWorldPlazaFarmingConstants';
import type { DefiningWorldPlazaFarmlandTileState } from '@/components/world/farming/domains/definingWorldPlazaFarmlandTypes';

type ManagingWorldPlazaLocalFarmlandState = {
  readonly byTileKey: Map<string, DefiningWorldPlazaFarmlandTileState>;
};

const managingWorldPlazaLocalFarmlandByOwner = new Map<
  string,
  ManagingWorldPlazaLocalFarmlandState
>();

export function formattingWorldPlazaFarmlandTileKey(
  tileX: number,
  tileY: number
): string {
  return `${tileX},${tileY}`;
}

export function resolvingWorldPlazaFarmlandLocalStorageKey(
  persistenceOwnerId: string
): string {
  return `${DEFINING_WORLD_PLAZA_FARMLAND_LOCAL_STORAGE_KEY_PREFIX}:${persistenceOwnerId}`;
}

function loadingWorldPlazaLocalFarmlandState(
  persistenceOwnerId: string
): ManagingWorldPlazaLocalFarmlandState {
  const cached = managingWorldPlazaLocalFarmlandByOwner.get(persistenceOwnerId);

  if (cached) {
    return cached;
  }

  const emptyState: ManagingWorldPlazaLocalFarmlandState = {
    byTileKey: new Map(),
  };

  if (typeof window === 'undefined') {
    managingWorldPlazaLocalFarmlandByOwner.set(persistenceOwnerId, emptyState);
    return emptyState;
  }

  try {
    const raw = window.localStorage.getItem(
      resolvingWorldPlazaFarmlandLocalStorageKey(persistenceOwnerId)
    );

    if (!raw) {
      managingWorldPlazaLocalFarmlandByOwner.set(
        persistenceOwnerId,
        emptyState
      );
      return emptyState;
    }

    const parsed = JSON.parse(raw) as Record<
      string,
      DefiningWorldPlazaFarmlandTileState
    >;
    const byTileKey = new Map(Object.entries(parsed));
    const loadedState = { byTileKey };
    managingWorldPlazaLocalFarmlandByOwner.set(persistenceOwnerId, loadedState);
    return loadedState;
  } catch {
    managingWorldPlazaLocalFarmlandByOwner.set(persistenceOwnerId, emptyState);
    return emptyState;
  }
}

function persistingWorldPlazaLocalFarmlandState(
  persistenceOwnerId: string,
  state: ManagingWorldPlazaLocalFarmlandState
): void {
  managingWorldPlazaLocalFarmlandByOwner.set(persistenceOwnerId, state);

  if (typeof window === 'undefined') {
    return;
  }

  const serialized = Object.fromEntries(state.byTileKey.entries());
  window.localStorage.setItem(
    resolvingWorldPlazaFarmlandLocalStorageKey(persistenceOwnerId),
    JSON.stringify(serialized)
  );
}

function checkingFarmlandTileStateChanged(
  previous: DefiningWorldPlazaFarmlandTileState,
  next: DefiningWorldPlazaFarmlandTileState
): boolean {
  return (
    previous.phase !== next.phase ||
    previous.phaseStartedAtMs !== next.phaseStartedAtMs
  );
}

export function readingWorldPlazaLocalFarmlandByTileKey(
  persistenceOwnerId: string
): ReadonlyMap<string, DefiningWorldPlazaFarmlandTileState> {
  return loadingWorldPlazaLocalFarmlandState(persistenceOwnerId).byTileKey;
}

/**
 * Advances growth phases for all stored tiles and persists when any phase changes.
 */
export function advancingWorldPlazaLocalFarmlandGrowthForOwner(
  persistenceOwnerId: string,
  nowMs: number
): boolean {
  const state = loadingWorldPlazaLocalFarmlandState(persistenceOwnerId);
  const nextByTileKey = new Map(state.byTileKey);
  let didChange = false;

  for (const [tileKey, tileState] of state.byTileKey.entries()) {
    const advanced = advancingWorldPlazaFarmlandGrowthPhases(tileState, nowMs);

    if (checkingFarmlandTileStateChanged(tileState, advanced)) {
      nextByTileKey.set(tileKey, advanced);
      didChange = true;
    }
  }

  if (!didChange) {
    return false;
  }

  persistingWorldPlazaLocalFarmlandState(persistenceOwnerId, {
    byTileKey: nextByTileKey,
  });
  return true;
}

export function writingWorldPlazaLocalFarmlandTileState(
  persistenceOwnerId: string,
  tileX: number,
  tileY: number,
  tileState: DefiningWorldPlazaFarmlandTileState | null
): void {
  const state = loadingWorldPlazaLocalFarmlandState(persistenceOwnerId);
  const nextByTileKey = new Map(state.byTileKey);
  const tileKey = formattingWorldPlazaFarmlandTileKey(tileX, tileY);

  if (tileState === null) {
    nextByTileKey.delete(tileKey);
  } else {
    nextByTileKey.set(tileKey, tileState);
  }

  persistingWorldPlazaLocalFarmlandState(persistenceOwnerId, {
    byTileKey: nextByTileKey,
  });
}

/**
 * Drops in-memory farmland cache for one persistence owner (save-slot wipe).
 *
 * @param persistenceOwnerId - Scoped localStorage owner id for the slot.
 */
export function clearingWorldPlazaLocalFarmlandMemoryForOwner(
  persistenceOwnerId: string
): void {
  managingWorldPlazaLocalFarmlandByOwner.delete(persistenceOwnerId);
}
