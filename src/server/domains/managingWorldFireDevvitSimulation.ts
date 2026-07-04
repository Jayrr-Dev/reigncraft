import { redis } from '@devvit/web/server';
import type { WorldBuildingDevvitBlockRow } from '../../shared/worldBuildingDevvit';
import {
  buildingWorldFireDevvitTileKey,
  parsingWorldFireDevvitTileKey,
  WORLD_FIRE_DEVVIT_TICK_MS,
  type WorldFireDevvitCell,
} from '../../shared/worldFireDevvit';
import {
  buildingWorldBuildingBlockIndexRedisKey,
  buildingWorldBuildingPlotBlocksRedisKey,
  buildingWorldBuildingPlotsRosterRedisKey,
} from './buildingWorldBuildingDevvitRedisKeys';
import {
  buildingWorldFireDevvitCellsRedisKey,
  buildingWorldFireDevvitLastSimulatedTickRedisKey,
} from './buildingWorldFireDevvitRedisKeys';
import {
  buildingWorldFireSimulationPlacedBlocksByTile,
  computingWorldFireSimulationTick,
} from './computingWorldFireSimulationTick';

function parsingWorldFireDevvitCell(rawValue: string): WorldFireDevvitCell | null {
  try {
    const parsed = JSON.parse(rawValue) as Partial<WorldFireDevvitCell>;

    if (
      typeof parsed.tileX !== 'number' ||
      typeof parsed.tileY !== 'number' ||
      typeof parsed.worldLayer !== 'number' ||
      (parsed.kind !== 'spreading' && parsed.kind !== 'campfire') ||
      typeof parsed.ignitedAtMs !== 'number' ||
      typeof parsed.fuelRemainingMs !== 'number' ||
      typeof parsed.intensity !== 'number'
    ) {
      return null;
    }

    return {
      tileX: parsed.tileX,
      tileY: parsed.tileY,
      worldLayer: parsed.worldLayer,
      kind: parsed.kind,
      ignitedAtMs: parsed.ignitedAtMs,
      fuelRemainingMs: parsed.fuelRemainingMs,
      intensity: parsed.intensity,
    };
  } catch {
    return null;
  }
}

function parsingWorldBuildingDevvitBlockRow(
  rawValue: string,
): WorldBuildingDevvitBlockRow | null {
  try {
    const parsed = JSON.parse(rawValue) as Partial<WorldBuildingDevvitBlockRow>;

    if (
      typeof parsed.id !== 'string' ||
      typeof parsed.plot_id !== 'string' ||
      typeof parsed.definition_id !== 'string' ||
      typeof parsed.tile_x !== 'number' ||
      typeof parsed.tile_y !== 'number' ||
      typeof parsed.owner_id !== 'string' ||
      typeof parsed.placed_at !== 'string'
    ) {
      return null;
    }

    return {
      id: parsed.id,
      plot_id: parsed.plot_id,
      definition_id: parsed.definition_id,
      tile_x: parsed.tile_x,
      tile_y: parsed.tile_y,
      world_layer:
        typeof parsed.world_layer === 'number' ? parsed.world_layer : 0,
      owner_id: parsed.owner_id,
      metadata:
        parsed.metadata && typeof parsed.metadata === 'object'
          ? (parsed.metadata as Record<string, string | number | boolean | null>)
          : null,
      placed_at: parsed.placed_at,
    };
  } catch {
    return null;
  }
}

async function listingWorldFireDevvitPlacedBlocks(
  roomScope: string,
): Promise<WorldBuildingDevvitBlockRow[]> {
  const rosterKey = buildingWorldBuildingPlotsRosterRedisKey(roomScope);
  const blockIndexKey = buildingWorldBuildingBlockIndexRedisKey(roomScope);
  const rawPlotIds = await redis.hGetAll(blockIndexKey);
  const plotIds = new Set<string>();

  for (const plotId of Object.values(rawPlotIds)) {
    if (typeof plotId === 'string') {
      plotIds.add(plotId);
    }
  }

  const rawPlots = await redis.hGetAll(rosterKey);

  for (const plotId of Object.keys(rawPlots)) {
    plotIds.add(plotId);
  }

  const blocks: WorldBuildingDevvitBlockRow[] = [];

  for (const plotId of plotIds) {
    const blocksKey = buildingWorldBuildingPlotBlocksRedisKey(roomScope, plotId);
    const rawBlocks = await redis.hGetAll(blocksKey);

    for (const rawBlock of Object.values(rawBlocks)) {
      const parsedBlock = parsingWorldBuildingDevvitBlockRow(rawBlock);

      if (parsedBlock) {
        blocks.push(parsedBlock);
      }
    }
  }

  return blocks;
}

async function loadingWorldFireDevvitCells(
  roomScope: string,
): Promise<Map<string, WorldFireDevvitCell>> {
  const cellsKey = buildingWorldFireDevvitCellsRedisKey(roomScope);
  const rawCells = await redis.hGetAll(cellsKey);
  const cells = new Map<string, WorldFireDevvitCell>();

  for (const [tileKey, rawCell] of Object.entries(rawCells)) {
    const parsedCell = parsingWorldFireDevvitCell(rawCell);

    if (!parsedCell) {
      await redis.hDel(cellsKey, [tileKey]);
      continue;
    }

    cells.set(tileKey, parsedCell);
  }

  return cells;
}

async function persistingWorldFireDevvitCells(
  roomScope: string,
  cells: ReadonlyMap<string, WorldFireDevvitCell>,
): Promise<void> {
  const cellsKey = buildingWorldFireDevvitCellsRedisKey(roomScope);
  const rawCells = await redis.hGetAll(cellsKey);
  const nextTileKeys = new Set(cells.keys());

  for (const tileKey of Object.keys(rawCells)) {
    if (!nextTileKeys.has(tileKey)) {
      await redis.hDel(cellsKey, [tileKey]);
    }
  }

  if (cells.size === 0) {
    return;
  }

  const serializedEntries: Record<string, string> = {};

  for (const [tileKey, cell] of cells) {
    serializedEntries[tileKey] = JSON.stringify(cell);
  }

  await redis.hSet(cellsKey, serializedEntries);
}

async function deletingWorldFireDevvitBurnedBlocks(
  roomScope: string,
  burnedBlockIds: readonly string[],
): Promise<void> {
  if (burnedBlockIds.length === 0) {
    return;
  }

  const blockIndexKey = buildingWorldBuildingBlockIndexRedisKey(roomScope);

  for (const blockId of burnedBlockIds) {
    const plotId = await redis.hGet(blockIndexKey, blockId);

    if (!plotId) {
      continue;
    }

    const blocksKey = buildingWorldBuildingPlotBlocksRedisKey(roomScope, plotId);
    await redis.hDel(blocksKey, [blockId]);
    await redis.hDel(blockIndexKey, [blockId]);
  }
}

/** Result from advancing lazy fire simulation. */
export type AdvancingWorldFireDevvitSimulationResult = {
  readonly cells: WorldFireDevvitCell[];
  readonly burnedBlockIds: string[];
  readonly lastSimulatedTick: number;
};

/**
 * Advances fire simulation from the stored tick to the current wall-clock tick.
 *
 * @param roomScope - Online room scope.
 */
export async function advancingWorldFireDevvitSimulation(
  roomScope: string,
): Promise<AdvancingWorldFireDevvitSimulationResult> {
  const lastTickKey = buildingWorldFireDevvitLastSimulatedTickRedisKey(roomScope);
  const currentTick = Math.floor(Date.now() / WORLD_FIRE_DEVVIT_TICK_MS);
  const rawLastTick = await redis.get(lastTickKey);
  const parsedLastTick =
    rawLastTick !== null && rawLastTick !== undefined
      ? Number.parseInt(rawLastTick, 10)
      : currentTick;
  const lastSimulatedTick = Number.isFinite(parsedLastTick)
    ? parsedLastTick
    : currentTick;

  let cells = await loadingWorldFireDevvitCells(roomScope);
  const allBurnedBlockIds: string[] = [];

  if (cells.size === 0) {
    await redis.set(lastTickKey, String(currentTick));

    return {
      cells: [],
      burnedBlockIds: [],
      lastSimulatedTick: currentTick,
    };
  }

  const placedBlocks = await listingWorldFireDevvitPlacedBlocks(roomScope);
  let placedBlocksByTile = buildingWorldFireSimulationPlacedBlocksByTile(
    placedBlocks,
  );

  for (
    let tickIndex = lastSimulatedTick + 1;
    tickIndex <= currentTick;
    tickIndex += 1
  ) {
    if (cells.size === 0) {
      break;
    }

    const tickResult = computingWorldFireSimulationTick({
      roomScope,
      tickIndex,
      cells,
      placedBlocksByTile,
    });

    cells = tickResult.nextCells;
    allBurnedBlockIds.push(...tickResult.burnedBlockIds);

    if (tickResult.burnedBlockIds.length > 0) {
      const remainingBlocks = placedBlocks.filter(
        (block) => !allBurnedBlockIds.includes(block.id),
      );
      placedBlocksByTile =
        buildingWorldFireSimulationPlacedBlocksByTile(remainingBlocks);
    }
  }

  await persistingWorldFireDevvitCells(roomScope, cells);
  await deletingWorldFireDevvitBurnedBlocks(roomScope, allBurnedBlockIds);
  await redis.set(lastTickKey, String(currentTick));

  return {
    cells: Array.from(cells.values()),
    burnedBlockIds: allBurnedBlockIds,
    lastSimulatedTick: currentTick,
  };
}

/**
 * Upserts one fire cell without advancing simulation.
 *
 * @param roomScope - Online room scope.
 * @param cell - Fire cell to store.
 */
export async function upsertingWorldFireDevvitCell(
  roomScope: string,
  cell: WorldFireDevvitCell,
): Promise<void> {
  const cellsKey = buildingWorldFireDevvitCellsRedisKey(roomScope);
  const tileKey = buildingWorldFireDevvitTileKey(
    cell.tileX,
    cell.tileY,
    cell.worldLayer,
  );

  await redis.hSet(cellsKey, {
    [tileKey]: JSON.stringify(cell),
  });
}

/**
 * Finds a placed block at a tile position.
 *
 * @param roomScope - Online room scope.
 * @param tileX - Tile X index.
 * @param tileY - Tile Y index.
 * @param worldLayer - World layer index.
 */
export async function findingWorldFireDevvitPlacedBlockAtTile(
  roomScope: string,
  tileX: number,
  tileY: number,
  worldLayer: number,
): Promise<WorldBuildingDevvitBlockRow | null> {
  const placedBlocks = await listingWorldFireDevvitPlacedBlocks(roomScope);
  const tileKey = buildingWorldFireDevvitTileKey(tileX, tileY, worldLayer);

  for (const block of placedBlocks) {
    if (
      buildingWorldFireDevvitTileKey(
        block.tile_x,
        block.tile_y,
        block.world_layer,
      ) === tileKey
    ) {
      return block;
    }
  }

  return null;
}

/**
 * Finds an active fire cell at a tile position.
 *
 * @param roomScope - Online room scope.
 * @param tileX - Tile X index.
 * @param tileY - Tile Y index.
 * @param worldLayer - World layer index.
 */
export async function findingWorldFireDevvitCellAtTile(
  roomScope: string,
  tileX: number,
  tileY: number,
  worldLayer: number,
): Promise<WorldFireDevvitCell | null> {
  const cellsKey = buildingWorldFireDevvitCellsRedisKey(roomScope);
  const tileKey = buildingWorldFireDevvitTileKey(tileX, tileY, worldLayer);
  const rawCell = await redis.hGet(cellsKey, tileKey);

  if (!rawCell) {
    return null;
  }

  return parsingWorldFireDevvitCell(rawCell);
}

export { parsingWorldFireDevvitTileKey };
