import { redis } from '@devvit/web/server';
import type { WorldBuildingDevvitBlockRow } from '../../shared/worldBuildingDevvit';
import {
  WORLD_BURN_STAGE_BURNT,
  WORLD_BURN_STAGE_METADATA_KEY,
} from '../../shared/worldBurnStage';
import {
  WORLD_CAMPFIRE_STAGE_EXTINGUISHED,
  WORLD_CAMPFIRE_STAGE_METADATA_KEY,
} from '../../shared/worldCampfireStage';
import {
  buildingWorldFireDevvitTileKey,
  WORLD_FIRE_DEVVIT_CAMPFIRE_BLOCK_DEFINITION_ID,
  WORLD_FIRE_DEVVIT_TICK_MS,
  type WorldFireDevvitCell,
} from '../../shared/worldFireDevvit';
import type { ComputingWorldFireSimulationExtinguishedCampfireTile } from '../../shared/worldFireSimulation';
import {
  buildingWorldBuildingBlockIndexRedisKey,
  buildingWorldBuildingPlotBlocksRedisKey,
  buildingWorldBuildingPlotsRosterRedisKey,
} from './buildingWorldBuildingDevvitRedisKeys';
import {
  buildingWorldFireDevvitBurntGrassRedisKey,
  buildingWorldFireDevvitCellsRedisKey,
  buildingWorldFireDevvitLastSimulatedTickRedisKey,
} from './buildingWorldFireDevvitRedisKeys';
import {
  buildingWorldFireSimulationPlacedBlocksByTile,
  computingWorldFireSimulationTick,
} from './computingWorldFireSimulationTick';

function parsingWorldFireDevvitCell(
  rawValue: string
): WorldFireDevvitCell | null {
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
      initialFuelMs:
        typeof parsed.initialFuelMs === 'number' &&
        Number.isFinite(parsed.initialFuelMs)
          ? parsed.initialFuelMs
          : parsed.fuelRemainingMs,
      intensity: parsed.intensity,
      inventoryFuelWoodCount:
        typeof parsed.inventoryFuelWoodCount === 'number' &&
        Number.isFinite(parsed.inventoryFuelWoodCount)
          ? Math.max(0, parsed.inventoryFuelWoodCount)
          : undefined,
    };
  } catch {
    return null;
  }
}

function parsingWorldBuildingDevvitBlockRow(
  rawValue: string
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
          ? (parsed.metadata as Record<
              string,
              string | number | boolean | null
            >)
          : null,
      placed_at: parsed.placed_at,
    };
  } catch {
    return null;
  }
}

export async function listingWorldFireDevvitPlacedBlocks(
  roomScope: string
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
    const blocksKey = buildingWorldBuildingPlotBlocksRedisKey(
      roomScope,
      plotId
    );
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
  roomScope: string
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
  cells: ReadonlyMap<string, WorldFireDevvitCell>
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
  burnedBlockIds: readonly string[]
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

    const blocksKey = buildingWorldBuildingPlotBlocksRedisKey(
      roomScope,
      plotId
    );
    const rawBlock = await redis.hGet(blocksKey, blockId);
    const block = rawBlock
      ? parsingWorldBuildingDevvitBlockRow(rawBlock)
      : null;

    if (!block) {
      await redis.hDel(blockIndexKey, [blockId]);
      continue;
    }

    const metadata = {
      ...(block.metadata ?? {}),
      [WORLD_BURN_STAGE_METADATA_KEY]: WORLD_BURN_STAGE_BURNT,
    };

    await redis.hSet(blocksKey, {
      [block.id]: JSON.stringify({
        ...block,
        metadata,
      }),
    });
  }
}

async function loadingWorldFireDevvitBurntGrassTileKeys(
  roomScope: string
): Promise<Set<string>> {
  const burntGrassKey = buildingWorldFireDevvitBurntGrassRedisKey(roomScope);
  const rawTileKeys = await redis.sMembers(burntGrassKey);

  return new Set(rawTileKeys);
}

async function persistingWorldFireDevvitBurntGrassTileKeys(
  roomScope: string,
  tileKeys: readonly string[]
): Promise<void> {
  if (tileKeys.length === 0) {
    return;
  }

  const burntGrassKey = buildingWorldFireDevvitBurntGrassRedisKey(roomScope);

  await redis.sAdd(burntGrassKey, tileKeys);
}

async function markingWorldFireDevvitCampfireBlocksExtinguished(
  roomScope: string,
  extinguishedTiles: readonly ComputingWorldFireSimulationExtinguishedCampfireTile[]
): Promise<void> {
  if (extinguishedTiles.length === 0) {
    return;
  }

  const blockIndexKey = buildingWorldBuildingBlockIndexRedisKey(roomScope);

  for (const tile of extinguishedTiles) {
    const block = await findingWorldFireDevvitPlacedBlockAtTile(
      roomScope,
      tile.tileX,
      tile.tileY,
      tile.worldLayer
    );

    if (
      !block ||
      block.definition_id !== WORLD_FIRE_DEVVIT_CAMPFIRE_BLOCK_DEFINITION_ID
    ) {
      continue;
    }

    const blocksKey = buildingWorldBuildingPlotBlocksRedisKey(
      roomScope,
      block.plot_id
    );
    const metadata = {
      ...(block.metadata ?? {}),
      [WORLD_CAMPFIRE_STAGE_METADATA_KEY]: WORLD_CAMPFIRE_STAGE_EXTINGUISHED,
    };

    await redis.hSet(blocksKey, {
      [block.id]: JSON.stringify({
        ...block,
        metadata,
      }),
    });
  }
}

export async function clearingWorldFireDevvitCampfireExtinguishedMetadata(
  roomScope: string,
  block: WorldBuildingDevvitBlockRow
): Promise<void> {
  if (
    block.definition_id !== WORLD_FIRE_DEVVIT_CAMPFIRE_BLOCK_DEFINITION_ID ||
    !block.metadata?.[WORLD_CAMPFIRE_STAGE_METADATA_KEY]
  ) {
    return;
  }

  const metadata = { ...(block.metadata ?? {}) };
  delete metadata[WORLD_CAMPFIRE_STAGE_METADATA_KEY];

  const blocksKey = buildingWorldBuildingPlotBlocksRedisKey(
    roomScope,
    block.plot_id
  );

  await redis.hSet(blocksKey, {
    [block.id]: JSON.stringify({
      ...block,
      metadata,
    }),
  });
}

/** Result from advancing lazy fire simulation. */
export type AdvancingWorldFireDevvitSimulationResult = {
  readonly cells: WorldFireDevvitCell[];
  readonly burnedBlockIds: string[];
  readonly burntGrassTileKeys: string[];
  readonly extinguishedCampfireTileKeys: string[];
  readonly lastSimulatedTick: number;
};

/**
 * Advances fire simulation from the stored tick to the current wall-clock tick.
 *
 * @param roomScope - Online room scope.
 */
export async function advancingWorldFireDevvitSimulation(
  roomScope: string
): Promise<AdvancingWorldFireDevvitSimulationResult> {
  const lastTickKey =
    buildingWorldFireDevvitLastSimulatedTickRedisKey(roomScope);
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
  const allBurntGrassTileKeys: string[] = [];
  const burntGrassTileKeys =
    await loadingWorldFireDevvitBurntGrassTileKeys(roomScope);

  if (cells.size === 0) {
    await redis.set(lastTickKey, String(currentTick));

    return {
      cells: [],
      burnedBlockIds: [],
      burntGrassTileKeys: Array.from(burntGrassTileKeys),
      extinguishedCampfireTileKeys: [],
      lastSimulatedTick: currentTick,
    };
  }

  let placedBlocks = await listingWorldFireDevvitPlacedBlocks(roomScope);
  let placedBlocksByTile =
    buildingWorldFireSimulationPlacedBlocksByTile(placedBlocks);
  const allExtinguishedCampfireTiles: ComputingWorldFireSimulationExtinguishedCampfireTile[] =
    [];

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
      burntGrassTileKeys,
    });

    cells = tickResult.nextCells;
    allBurnedBlockIds.push(...tickResult.burnedBlockIds);
    allBurntGrassTileKeys.push(...tickResult.burntGrassTileKeys);
    allExtinguishedCampfireTiles.push(...tickResult.extinguishedCampfireTiles);

    for (const tileKey of tickResult.burntGrassTileKeys) {
      burntGrassTileKeys.add(tileKey);
    }

    if (tickResult.burnedBlockIds.length > 0) {
      placedBlocks = placedBlocks.map((block) => {
        if (!allBurnedBlockIds.includes(block.id)) {
          return block;
        }

        return {
          ...block,
          metadata: {
            ...(block.metadata ?? {}),
            [WORLD_BURN_STAGE_METADATA_KEY]: WORLD_BURN_STAGE_BURNT,
          },
        };
      });
      placedBlocksByTile =
        buildingWorldFireSimulationPlacedBlocksByTile(placedBlocks);
    }
  }

  await persistingWorldFireDevvitCells(roomScope, cells);
  await deletingWorldFireDevvitBurnedBlocks(roomScope, allBurnedBlockIds);
  await persistingWorldFireDevvitBurntGrassTileKeys(
    roomScope,
    allBurntGrassTileKeys
  );
  await markingWorldFireDevvitCampfireBlocksExtinguished(
    roomScope,
    allExtinguishedCampfireTiles
  );
  await redis.set(lastTickKey, String(currentTick));

  return {
    cells: Array.from(cells.values()),
    burnedBlockIds: allBurnedBlockIds,
    burntGrassTileKeys: Array.from(burntGrassTileKeys),
    extinguishedCampfireTileKeys: allExtinguishedCampfireTiles.map((tile) =>
      buildingWorldFireDevvitTileKey(tile.tileX, tile.tileY, tile.worldLayer)
    ),
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
  cell: WorldFireDevvitCell
): Promise<void> {
  const cellsKey = buildingWorldFireDevvitCellsRedisKey(roomScope);
  const tileKey = buildingWorldFireDevvitTileKey(
    cell.tileX,
    cell.tileY,
    cell.worldLayer
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
  worldLayer: number
): Promise<WorldBuildingDevvitBlockRow | null> {
  const placedBlocks = await listingWorldFireDevvitPlacedBlocks(roomScope);
  const tileKey = buildingWorldFireDevvitTileKey(tileX, tileY, worldLayer);

  for (const block of placedBlocks) {
    if (
      buildingWorldFireDevvitTileKey(
        block.tile_x,
        block.tile_y,
        block.world_layer
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
  worldLayer: number
): Promise<WorldFireDevvitCell | null> {
  const cellsKey = buildingWorldFireDevvitCellsRedisKey(roomScope);
  const tileKey = buildingWorldFireDevvitTileKey(tileX, tileY, worldLayer);
  const rawCell = await redis.hGet(cellsKey, tileKey);

  if (!rawCell) {
    return null;
  }

  return parsingWorldFireDevvitCell(rawCell);
}
