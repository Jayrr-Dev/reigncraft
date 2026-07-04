import {
  buildingWorldFireDevvitTileKey,
  WORLD_FIRE_DEVVIT_CAMPFIRE_FUEL_PER_WOOD_MS,
  WORLD_FIRE_DEVVIT_CAMPFIRE_INITIAL_FUEL_MS,
  WORLD_FIRE_DEVVIT_CAMPFIRE_MAX_FUEL_MS,
  WORLD_FIRE_DEVVIT_INTERACTION_RADIUS_TILES,
  WORLD_FIRE_DEVVIT_TICK_MS,
  type WorldFireDevvitCell,
} from '../../../../shared/worldFireDevvit';
import {
  computingWorldFireSimulationTick,
  creatingWorldFireDevvitCell,
} from '../../../../shared/worldFireSimulation';

/**
 * Single-player fire cells persisted in localStorage.
 *
 * Runs the same deterministic lazy simulation the multiplayer server uses,
 * advancing missed ticks whenever the state is read. Single-player worlds
 * have no placed blocks, so fires never spread or burn structures; flint
 * lights a campfire-style fire directly on the ground and wood refuels it.
 *
 * @module components/world/fire/domains/managingWorldPlazaLocalFireCells
 */

/** localStorage key prefix for offline single-player fire cells. */
export const DEFINING_WORLD_PLAZA_FIRE_LOCAL_STORAGE_KEY_PREFIX =
  'world-plaza-fire-cells' as const;

/**
 * Resolves the localStorage key for one persistence owner's fire state.
 *
 * @param persistenceOwnerId - Single-player slot owner id.
 */
export function resolvingWorldPlazaFireCellsLocalStorageKey(
  persistenceOwnerId: string
): string {
  return `${DEFINING_WORLD_PLAZA_FIRE_LOCAL_STORAGE_KEY_PREFIX}:${persistenceOwnerId}`;
}

type ManagingWorldPlazaLocalFireState = {
  readonly lastSimulatedTick: number;
  readonly cells: Map<string, WorldFireDevvitCell>;
};

/** Result of a local ignite attempt. */
export type ManagingWorldPlazaLocalFireIgniteResult =
  | { readonly outcome: 'ignited'; readonly cell: WorldFireDevvitCell }
  | { readonly outcome: 'already-burning' }
  | { readonly outcome: 'out-of-range' };

/** Result of a local add-fuel attempt. */
export type ManagingWorldPlazaLocalFireAddFuelResult =
  | { readonly outcome: 'fueled'; readonly cell: WorldFireDevvitCell }
  | { readonly outcome: 'no-fire' }
  | { readonly outcome: 'out-of-range' };

function parsingLocalFireCell(value: unknown): WorldFireDevvitCell | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const cell = value as Partial<WorldFireDevvitCell>;

  if (
    typeof cell.tileX !== 'number' ||
    typeof cell.tileY !== 'number' ||
    typeof cell.worldLayer !== 'number' ||
    (cell.kind !== 'spreading' && cell.kind !== 'campfire') ||
    typeof cell.ignitedAtMs !== 'number' ||
    typeof cell.fuelRemainingMs !== 'number' ||
    typeof cell.intensity !== 'number'
  ) {
    return null;
  }

  return {
    tileX: cell.tileX,
    tileY: cell.tileY,
    worldLayer: cell.worldLayer,
    kind: cell.kind,
    ignitedAtMs: cell.ignitedAtMs,
    fuelRemainingMs: cell.fuelRemainingMs,
    intensity: cell.intensity,
  };
}

function computingCurrentFireTick(): number {
  return Math.floor(Date.now() / WORLD_FIRE_DEVVIT_TICK_MS);
}

function loadingLocalFireState(
  persistenceOwnerId: string
): ManagingWorldPlazaLocalFireState {
  const emptyState: ManagingWorldPlazaLocalFireState = {
    lastSimulatedTick: computingCurrentFireTick(),
    cells: new Map(),
  };

  if (typeof window === 'undefined') {
    return emptyState;
  }

  try {
    const rawJson = window.localStorage.getItem(
      resolvingWorldPlazaFireCellsLocalStorageKey(persistenceOwnerId)
    );

    if (!rawJson) {
      return emptyState;
    }

    const parsed: unknown = JSON.parse(rawJson);

    if (!parsed || typeof parsed !== 'object') {
      return emptyState;
    }

    const state = parsed as {
      lastSimulatedTick?: unknown;
      cells?: unknown;
    };
    const cells = new Map<string, WorldFireDevvitCell>();

    if (Array.isArray(state.cells)) {
      for (const row of state.cells) {
        const cell = parsingLocalFireCell(row);

        if (cell) {
          cells.set(
            buildingWorldFireDevvitTileKey(
              cell.tileX,
              cell.tileY,
              cell.worldLayer
            ),
            cell
          );
        }
      }
    }

    return {
      lastSimulatedTick:
        typeof state.lastSimulatedTick === 'number' &&
        Number.isFinite(state.lastSimulatedTick)
          ? state.lastSimulatedTick
          : computingCurrentFireTick(),
      cells,
    };
  } catch {
    return emptyState;
  }
}

function persistingLocalFireState(
  persistenceOwnerId: string,
  state: ManagingWorldPlazaLocalFireState
): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    resolvingWorldPlazaFireCellsLocalStorageKey(persistenceOwnerId),
    JSON.stringify({
      lastSimulatedTick: state.lastSimulatedTick,
      cells: Array.from(state.cells.values()),
    })
  );
}

function advancingLocalFireState(
  persistenceOwnerId: string
): ManagingWorldPlazaLocalFireState {
  const state = loadingLocalFireState(persistenceOwnerId);
  const currentTick = computingCurrentFireTick();

  if (state.cells.size === 0 || currentTick <= state.lastSimulatedTick) {
    return { lastSimulatedTick: currentTick, cells: state.cells };
  }

  let cells = state.cells;
  // Fires never spread locally (no placed blocks), so no fire can outlive
  // its max fuel; anything beyond that many missed ticks is burned out.
  const maxUsefulTicks = Math.ceil(
    WORLD_FIRE_DEVVIT_CAMPFIRE_MAX_FUEL_MS / WORLD_FIRE_DEVVIT_TICK_MS
  );
  const firstTick = Math.max(
    state.lastSimulatedTick + 1,
    currentTick - maxUsefulTicks
  );

  for (let tickIndex = firstTick; tickIndex <= currentTick; tickIndex += 1) {
    if (cells.size === 0) {
      break;
    }

    cells = computingWorldFireSimulationTick({
      roomScope: `local:${persistenceOwnerId}`,
      tickIndex,
      cells,
      placedBlocksByTile: new Map(),
    }).nextCells;
  }

  return { lastSimulatedTick: currentTick, cells };
}

function computingChebyshevTileDistance(
  playerX: number,
  playerY: number,
  tileX: number,
  tileY: number
): number {
  return Math.max(
    Math.abs(playerX - (tileX + 0.5)),
    Math.abs(playerY - (tileY + 0.5))
  );
}

/**
 * Advances and lists active local fire cells for one persistence owner.
 *
 * @param persistenceOwnerId - Single-player slot owner id.
 */
export function listingWorldPlazaLocalFireCells(
  persistenceOwnerId: string
): WorldFireDevvitCell[] {
  const state = advancingLocalFireState(persistenceOwnerId);
  persistingLocalFireState(persistenceOwnerId, state);

  return Array.from(state.cells.values());
}

/**
 * Ignites a campfire-style local fire on a ground tile with flint.
 *
 * @param persistenceOwnerId - Single-player slot owner id.
 * @param request - Target tile and player position for range checks.
 */
export function ignitingWorldPlazaLocalFireCell(
  persistenceOwnerId: string,
  request: {
    readonly tileX: number;
    readonly tileY: number;
    readonly worldLayer: number;
    readonly playerX: number;
    readonly playerY: number;
  }
): ManagingWorldPlazaLocalFireIgniteResult {
  if (
    computingChebyshevTileDistance(
      request.playerX,
      request.playerY,
      request.tileX,
      request.tileY
    ) > WORLD_FIRE_DEVVIT_INTERACTION_RADIUS_TILES
  ) {
    return { outcome: 'out-of-range' };
  }

  const state = advancingLocalFireState(persistenceOwnerId);
  const tileKey = buildingWorldFireDevvitTileKey(
    request.tileX,
    request.tileY,
    request.worldLayer
  );

  if (state.cells.has(tileKey)) {
    return { outcome: 'already-burning' };
  }

  const cell = creatingWorldFireDevvitCell(
    'campfire',
    request.tileX,
    request.tileY,
    request.worldLayer,
    WORLD_FIRE_DEVVIT_CAMPFIRE_INITIAL_FUEL_MS
  );

  state.cells.set(tileKey, cell);
  persistingLocalFireState(persistenceOwnerId, state);

  return { outcome: 'ignited', cell };
}

/**
 * Adds wood fuel to an active local fire on a tile.
 *
 * @param persistenceOwnerId - Single-player slot owner id.
 * @param request - Target tile and player position for range checks.
 */
export function addingWorldPlazaLocalFireCellFuel(
  persistenceOwnerId: string,
  request: {
    readonly tileX: number;
    readonly tileY: number;
    readonly worldLayer: number;
    readonly playerX: number;
    readonly playerY: number;
  }
): ManagingWorldPlazaLocalFireAddFuelResult {
  if (
    computingChebyshevTileDistance(
      request.playerX,
      request.playerY,
      request.tileX,
      request.tileY
    ) > WORLD_FIRE_DEVVIT_INTERACTION_RADIUS_TILES
  ) {
    return { outcome: 'out-of-range' };
  }

  const state = advancingLocalFireState(persistenceOwnerId);
  const tileKey = buildingWorldFireDevvitTileKey(
    request.tileX,
    request.tileY,
    request.worldLayer
  );
  const existingCell = state.cells.get(tileKey);

  if (!existingCell) {
    return { outcome: 'no-fire' };
  }

  const fueledCell: WorldFireDevvitCell = {
    ...existingCell,
    fuelRemainingMs: Math.min(
      WORLD_FIRE_DEVVIT_CAMPFIRE_MAX_FUEL_MS,
      existingCell.fuelRemainingMs + WORLD_FIRE_DEVVIT_CAMPFIRE_FUEL_PER_WOOD_MS
    ),
    intensity: 1,
  };

  state.cells.set(tileKey, fueledCell);
  persistingLocalFireState(persistenceOwnerId, state);

  return { outcome: 'fueled', cell: fueledCell };
}

/**
 * Finds an active local fire cell at a tile, advancing simulation first.
 *
 * @param persistenceOwnerId - Single-player slot owner id.
 * @param tileX - Tile X index.
 * @param tileY - Tile Y index.
 * @param worldLayer - World layer index.
 */
export function findingWorldPlazaLocalFireCellAtTile(
  persistenceOwnerId: string,
  tileX: number,
  tileY: number,
  worldLayer: number
): WorldFireDevvitCell | null {
  const state = advancingLocalFireState(persistenceOwnerId);

  return (
    state.cells.get(buildingWorldFireDevvitTileKey(tileX, tileY, worldLayer)) ??
    null
  );
}
