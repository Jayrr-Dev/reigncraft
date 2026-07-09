import {
  formattingWorldRockMineTileKey,
  type WorldRockMineTileState,
} from '../../../../../shared/worldRockMine';
import { DEFINING_WORLD_PLAZA_MINED_ROCKS_LOCAL_STORAGE_KEY_PREFIX } from '@/components/world/harvest/domains/definingWorldPlazaRockMineConstants';

/**
 * Per-tile mine persistence for procedural column rocks.
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
 * Builds a stable tile key for mined-rock state maps (anchor tile).
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

  managingWorldPlazaLocalMinedRocksByOwner.set(persistenceOwnerId, emptyState);
  return emptyState;
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
