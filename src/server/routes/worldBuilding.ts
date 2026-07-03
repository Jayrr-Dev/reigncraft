import { Hono } from 'hono';
import { randomUUID } from 'node:crypto';
import { redis } from '@devvit/web/server';
import {
  WORLD_BUILDING_DEVVIT_DEFAULT_MAX_OWNED_PLOT_COUNT,
  WORLD_BUILDING_DEVVIT_DEFAULT_MAX_TEMPORARY_TILE_COUNT,
  WORLD_BUILDING_DEVVIT_DEFAULT_MAX_TILE_CLAIM_COUNT,
  WORLD_BUILDING_DEVVIT_OTHER_OWNER_MIN_CLAIM_DISTANCE_TILES,
  WORLD_BUILDING_DEVVIT_REGISTRY_MAX_PLOT_COUNT,
  type WorldBuildingDevvitBlockRow,
  type WorldBuildingDevvitClaimPlotRequest,
  type WorldBuildingDevvitErrorResponse,
  type WorldBuildingDevvitOwnerLimitsResponse,
  type WorldBuildingDevvitPlaceBlockRequest,
  type WorldBuildingDevvitPlaceBlockResponse,
  type WorldBuildingDevvitPlotRow,
  type WorldBuildingDevvitPlotsPayload,
} from '../../shared/worldBuildingDevvit';
import {
  buildingWorldBuildingBlockIndexRedisKey,
  buildingWorldBuildingPlotBlocksRedisKey,
  buildingWorldBuildingPlotsRosterRedisKey,
} from '../domains/buildingWorldBuildingDevvitRedisKeys';
import { resolvingDevvitRedditUserId } from '../domains/resolvingDevvitRedditUserId';
import { resolvingPlazaDevvitOnlineRoomScope } from '../domains/resolvingPlazaDevvitOnlineRoomScope';

type TileBounds = {
  minTileX: number;
  minTileY: number;
  maxTileX: number;
  maxTileY: number;
};

function parsingIntegerQueryParam(
  value: string | undefined,
): number | null {
  if (value === undefined) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return parsed;
}

function parsingTileBoundsFromQuery(
  query: Record<string, string>,
): TileBounds | null {
  const minTileX = parsingIntegerQueryParam(query.minTileX);
  const minTileY = parsingIntegerQueryParam(query.minTileY);
  const maxTileX = parsingIntegerQueryParam(query.maxTileX);
  const maxTileY = parsingIntegerQueryParam(query.maxTileY);

  if (
    minTileX === null ||
    minTileY === null ||
    maxTileX === null ||
    maxTileY === null
  ) {
    return null;
  }

  return { minTileX, minTileY, maxTileX, maxTileY };
}

function checkingPlotRowIntersectsBounds(
  plotRow: WorldBuildingDevvitPlotRow,
  bounds: TileBounds,
): boolean {
  return (
    plotRow.min_tile_x <= bounds.maxTileX &&
    plotRow.max_tile_x >= bounds.minTileX &&
    plotRow.min_tile_y <= bounds.maxTileY &&
    plotRow.max_tile_y >= bounds.minTileY
  );
}

function computingChebyshevDistanceToPlotBounds(
  tileX: number,
  tileY: number,
  plotRow: WorldBuildingDevvitPlotRow,
): number {
  const deltaX =
    tileX < plotRow.min_tile_x
      ? plotRow.min_tile_x - tileX
      : tileX > plotRow.max_tile_x
        ? tileX - plotRow.max_tile_x
        : 0;
  const deltaY =
    tileY < plotRow.min_tile_y
      ? plotRow.min_tile_y - tileY
      : tileY > plotRow.max_tile_y
        ? tileY - plotRow.max_tile_y
        : 0;

  return Math.max(deltaX, deltaY);
}

function checkingTileWithinOtherOwnerClaimBuffer(
  plots: WorldBuildingDevvitPlotRow[],
  tileX: number,
  tileY: number,
  claimingOwnerUserId: string,
): boolean {
  for (const plot of plots) {
    if (plot.owner_id === claimingOwnerUserId) {
      continue;
    }

    const distance = computingChebyshevDistanceToPlotBounds(tileX, tileY, plot);

    if (distance < WORLD_BUILDING_DEVVIT_OTHER_OWNER_MIN_CLAIM_DISTANCE_TILES) {
      return true;
    }
  }

  return false;
}

function checkingTileAlreadyClaimed(
  plots: WorldBuildingDevvitPlotRow[],
  tileX: number,
  tileY: number,
): boolean {
  return plots.some(
    (plot) =>
      tileX >= plot.min_tile_x &&
      tileX <= plot.max_tile_x &&
      tileY >= plot.min_tile_y &&
      tileY <= plot.max_tile_y,
  );
}

function parsingWorldBuildingDevvitPlotRow(
  rawValue: string,
): WorldBuildingDevvitPlotRow | null {
  try {
    const parsed = JSON.parse(rawValue) as Partial<WorldBuildingDevvitPlotRow>;

    if (
      typeof parsed.id !== 'string' ||
      typeof parsed.owner_id !== 'string' ||
      typeof parsed.min_tile_x !== 'number' ||
      typeof parsed.min_tile_y !== 'number' ||
      typeof parsed.max_tile_x !== 'number' ||
      typeof parsed.max_tile_y !== 'number' ||
      typeof parsed.created_at !== 'string'
    ) {
      return null;
    }

    return {
      id: parsed.id,
      owner_id: parsed.owner_id,
      min_tile_x: parsed.min_tile_x,
      min_tile_y: parsed.min_tile_y,
      max_tile_x: parsed.max_tile_x,
      max_tile_y: parsed.max_tile_y,
      created_at: parsed.created_at,
      is_temporary: parsed.is_temporary === true,
      expires_at:
        typeof parsed.expires_at === 'string' ? parsed.expires_at : null,
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
          ? (parsed.metadata as Record<string, unknown>)
          : null,
      placed_at: parsed.placed_at,
    };
  } catch {
    return null;
  }
}

async function listingWorldBuildingDevvitPlots(
  roomScope: string,
): Promise<WorldBuildingDevvitPlotRow[]> {
  const rosterKey = buildingWorldBuildingPlotsRosterRedisKey(roomScope);
  const rawPlots = await redis.hGetAll(rosterKey);
  const plots: WorldBuildingDevvitPlotRow[] = [];

  for (const [plotId, rawPlot] of Object.entries(rawPlots)) {
    const parsedPlot = parsingWorldBuildingDevvitPlotRow(rawPlot);

    if (!parsedPlot) {
      await redis.hDel(rosterKey, [plotId]);
      continue;
    }

    plots.push(parsedPlot);
  }

  return plots;
}

async function listingWorldBuildingDevvitBlocksForPlotIds(
  roomScope: string,
  plotIds: readonly string[],
  bounds: TileBounds | null,
): Promise<WorldBuildingDevvitBlockRow[]> {
  const blocks: WorldBuildingDevvitBlockRow[] = [];

  for (const plotId of plotIds) {
    const blocksKey = buildingWorldBuildingPlotBlocksRedisKey(roomScope, plotId);
    const rawBlocks = await redis.hGetAll(blocksKey);

    for (const [blockId, rawBlock] of Object.entries(rawBlocks)) {
      const parsedBlock = parsingWorldBuildingDevvitBlockRow(rawBlock);

      if (!parsedBlock) {
        await redis.hDel(blocksKey, [blockId]);
        continue;
      }

      if (bounds) {
        if (
          parsedBlock.tile_x < bounds.minTileX ||
          parsedBlock.tile_x > bounds.maxTileX ||
          parsedBlock.tile_y < bounds.minTileY ||
          parsedBlock.tile_y > bounds.maxTileY
        ) {
          continue;
        }
      }

      blocks.push(parsedBlock);
    }
  }

  return blocks;
}

function buildingWorldBuildingDevvitPlotsPayload(
  plots: WorldBuildingDevvitPlotRow[],
  blocks: WorldBuildingDevvitBlockRow[],
): WorldBuildingDevvitPlotsPayload {
  return {
    type: 'plots',
    plots,
    blocks,
  };
}

function parsingClaimPlotRequest(body: unknown): WorldBuildingDevvitClaimPlotRequest | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const payload = body as Partial<WorldBuildingDevvitClaimPlotRequest>;

  if (
    typeof payload.tileX !== 'number' ||
    typeof payload.tileY !== 'number' ||
    typeof payload.isTemporary !== 'boolean'
  ) {
    return null;
  }

  return {
    tileX: payload.tileX,
    tileY: payload.tileY,
    isTemporary: payload.isTemporary,
  };
}

function parsingPlaceBlockRequest(body: unknown): WorldBuildingDevvitPlaceBlockRequest | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const payload = body as Partial<WorldBuildingDevvitPlaceBlockRequest>;

  if (
    typeof payload.blockId !== 'string' ||
    typeof payload.plotId !== 'string' ||
    typeof payload.definitionId !== 'string' ||
    typeof payload.tileX !== 'number' ||
    typeof payload.tileY !== 'number' ||
    typeof payload.worldLayer !== 'number' ||
    typeof payload.blockHeight !== 'number' ||
    typeof payload.placedAt !== 'string'
  ) {
    return null;
  }

  return {
    blockId: payload.blockId,
    plotId: payload.plotId,
    definitionId: payload.definitionId,
    tileX: payload.tileX,
    tileY: payload.tileY,
    worldLayer: payload.worldLayer,
    blockHeight: payload.blockHeight,
    placedAt: payload.placedAt,
    metadata:
      payload.metadata && typeof payload.metadata === 'object'
        ? payload.metadata
        : undefined,
  };
}

export const worldBuilding = new Hono();

worldBuilding.get('/owner-limits', async (c) => {
  const userId = await resolvingDevvitRedditUserId();

  if (!userId) {
    return c.json<WorldBuildingDevvitOwnerLimitsResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to claim land.',
      },
      401,
    );
  }

  return c.json<WorldBuildingDevvitOwnerLimitsResponse>({
    type: 'owner-limits',
    limits: {
      maxOwnedPlotCount: WORLD_BUILDING_DEVVIT_DEFAULT_MAX_OWNED_PLOT_COUNT,
      maxTileClaimCount: WORLD_BUILDING_DEVVIT_DEFAULT_MAX_TILE_CLAIM_COUNT,
      maxTemporaryTileCount: WORLD_BUILDING_DEVVIT_DEFAULT_MAX_TEMPORARY_TILE_COUNT,
    },
  });
});

worldBuilding.get('/plots/registry', async (c) => {
  const userId = await resolvingDevvitRedditUserId();

  if (!userId) {
    return c.json<WorldBuildingDevvitErrorResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to view claims.',
      },
      401,
    );
  }

  const roomScope = resolvingPlazaDevvitOnlineRoomScope();
  const plots = await listingWorldBuildingDevvitPlots(roomScope);

  plots.sort(
    (left, right) =>
      new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
  );

  return c.json(
    buildingWorldBuildingDevvitPlotsPayload(
      plots.slice(0, WORLD_BUILDING_DEVVIT_REGISTRY_MAX_PLOT_COUNT),
      [],
    ),
  );
});

worldBuilding.get('/plots/bounds', async (c) => {
  const userId = await resolvingDevvitRedditUserId();

  if (!userId) {
    return c.json<WorldBuildingDevvitErrorResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to view claims.',
      },
      401,
    );
  }

  const bounds = parsingTileBoundsFromQuery(c.req.query());

  if (!bounds) {
    return c.json<WorldBuildingDevvitErrorResponse>(
      {
        type: 'error',
        message: 'Invalid tile bounds query.',
      },
      400,
    );
  }

  const roomScope = resolvingPlazaDevvitOnlineRoomScope();
  const allPlots = await listingWorldBuildingDevvitPlots(roomScope);
  const matchingPlots = allPlots.filter((plot) =>
    checkingPlotRowIntersectsBounds(plot, bounds),
  );
  const blocks = await listingWorldBuildingDevvitBlocksForPlotIds(
    roomScope,
    matchingPlots.map((plot) => plot.id),
    bounds,
  );

  return c.json(buildingWorldBuildingDevvitPlotsPayload(matchingPlots, blocks));
});

worldBuilding.get('/plots/owned', async (c) => {
  const userId = await resolvingDevvitRedditUserId();

  if (!userId) {
    return c.json<WorldBuildingDevvitErrorResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to view your claims.',
      },
      401,
    );
  }

  const roomScope = resolvingPlazaDevvitOnlineRoomScope();
  const allPlots = await listingWorldBuildingDevvitPlots(roomScope);
  const ownedPlots = allPlots.filter((plot) => plot.owner_id === userId);
  const blocks = await listingWorldBuildingDevvitBlocksForPlotIds(
    roomScope,
    ownedPlots.map((plot) => plot.id),
    null,
  );

  return c.json(buildingWorldBuildingDevvitPlotsPayload(ownedPlots, blocks));
});

worldBuilding.post('/plots/claim', async (c) => {
  const userId = await resolvingDevvitRedditUserId();

  if (!userId) {
    return c.json<WorldBuildingDevvitErrorResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to claim land.',
      },
      401,
    );
  }

  const body: unknown = await c.req.json().catch(() => null);
  const claimRequest = parsingClaimPlotRequest(body);

  if (!claimRequest) {
    return c.json<WorldBuildingDevvitErrorResponse>(
      {
        type: 'error',
        message: 'Invalid claim request.',
      },
      400,
    );
  }

  const roomScope = resolvingPlazaDevvitOnlineRoomScope();
  const rosterKey = buildingWorldBuildingPlotsRosterRedisKey(roomScope);
  const plots = await listingWorldBuildingDevvitPlots(roomScope);

  if (checkingTileAlreadyClaimed(plots, claimRequest.tileX, claimRequest.tileY)) {
    return c.json<WorldBuildingDevvitErrorResponse>(
      {
        type: 'error',
        message: 'That tile is already claimed.',
      },
      409,
    );
  }

  if (
    checkingTileWithinOtherOwnerClaimBuffer(
      plots,
      claimRequest.tileX,
      claimRequest.tileY,
      userId,
    )
  ) {
    return c.json<WorldBuildingDevvitErrorResponse>(
      {
        type: 'error',
        message: "Stay at least 3 tiles away from other players' land.",
      },
      409,
    );
  }

  const ownedPermanentCount = plots.filter(
    (plot) => plot.owner_id === userId && !plot.is_temporary,
  ).length;
  const ownedTemporaryCount = plots.filter(
    (plot) => plot.owner_id === userId && plot.is_temporary,
  ).length;

  if (claimRequest.isTemporary) {
    if (ownedTemporaryCount >= WORLD_BUILDING_DEVVIT_DEFAULT_MAX_TEMPORARY_TILE_COUNT) {
      return c.json<WorldBuildingDevvitErrorResponse>(
        {
          type: 'error',
          message: `You can only have ${WORLD_BUILDING_DEVVIT_DEFAULT_MAX_TEMPORARY_TILE_COUNT} temporary tiles at a time.`,
        },
        409,
      );
    }
  } else if (ownedPermanentCount >= WORLD_BUILDING_DEVVIT_DEFAULT_MAX_TILE_CLAIM_COUNT) {
    return c.json<WorldBuildingDevvitErrorResponse>(
      {
        type: 'error',
        message: `You can only claim ${WORLD_BUILDING_DEVVIT_DEFAULT_MAX_TILE_CLAIM_COUNT} tiles.`,
      },
      409,
    );
  }

  const plotId = randomUUID();
  const plotRow: WorldBuildingDevvitPlotRow = {
    id: plotId,
    owner_id: userId,
    min_tile_x: claimRequest.tileX,
    min_tile_y: claimRequest.tileY,
    max_tile_x: claimRequest.tileX,
    max_tile_y: claimRequest.tileY,
    created_at: new Date().toISOString(),
    is_temporary: claimRequest.isTemporary,
    expires_at: null,
  };

  await redis.hSet(rosterKey, { [plotId]: JSON.stringify(plotRow) });

  return c.json({
    type: 'claim',
    plotId,
  });
});

worldBuilding.delete('/plots/:plotId', async (c) => {
  const userId = await resolvingDevvitRedditUserId();

  if (!userId) {
    return c.json<WorldBuildingDevvitErrorResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to edit claims.',
      },
      401,
    );
  }

  const plotId = c.req.param('plotId');
  const roomScope = resolvingPlazaDevvitOnlineRoomScope();
  const rosterKey = buildingWorldBuildingPlotsRosterRedisKey(roomScope);
  const rawPlot = await redis.hGet(rosterKey, plotId);

  if (!rawPlot) {
    return c.json<WorldBuildingDevvitErrorResponse>(
      {
        type: 'error',
        message: 'Plot not found.',
      },
      404,
    );
  }

  const plotRow = parsingWorldBuildingDevvitPlotRow(rawPlot);

  if (!plotRow || plotRow.owner_id !== userId) {
    return c.json<WorldBuildingDevvitErrorResponse>(
      {
        type: 'error',
        message: 'You can only unclaim your own plots.',
      },
      403,
    );
  }

  const blocksKey = buildingWorldBuildingPlotBlocksRedisKey(roomScope, plotId);
  const blockIndexKey = buildingWorldBuildingBlockIndexRedisKey(roomScope);
  const rawBlocks = await redis.hGetAll(blocksKey);

  for (const blockId of Object.keys(rawBlocks)) {
    await redis.hDel(blockIndexKey, [blockId]);
  }

  await redis.del(blocksKey);
  await redis.hDel(rosterKey, [plotId]);

  return c.json({ type: 'deleted', plotId });
});

worldBuilding.post('/blocks', async (c) => {
  const userId = await resolvingDevvitRedditUserId();

  if (!userId) {
    return c.json<WorldBuildingDevvitPlaceBlockResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to build.',
      },
      401,
    );
  }

  const body: unknown = await c.req.json().catch(() => null);
  const placeRequest = parsingPlaceBlockRequest(body);

  if (!placeRequest) {
    return c.json<WorldBuildingDevvitPlaceBlockResponse>(
      {
        type: 'error',
        message: 'Invalid block placement request.',
      },
      400,
    );
  }

  const roomScope = resolvingPlazaDevvitOnlineRoomScope();
  const rosterKey = buildingWorldBuildingPlotsRosterRedisKey(roomScope);
  const rawPlot = await redis.hGet(rosterKey, placeRequest.plotId);
  const plotRow = rawPlot ? parsingWorldBuildingDevvitPlotRow(rawPlot) : null;

  if (!plotRow || plotRow.owner_id !== userId) {
    return c.json<WorldBuildingDevvitPlaceBlockResponse>(
      {
        type: 'error',
        message: 'You can only build on plots you own.',
      },
      403,
    );
  }

  if (
    placeRequest.tileX < plotRow.min_tile_x ||
    placeRequest.tileX > plotRow.max_tile_x ||
    placeRequest.tileY < plotRow.min_tile_y ||
    placeRequest.tileY > plotRow.max_tile_y
  ) {
    return c.json<WorldBuildingDevvitPlaceBlockResponse>(
      {
        type: 'error',
        message: 'That tile is outside your plot.',
      },
      409,
    );
  }

  const blocksKey = buildingWorldBuildingPlotBlocksRedisKey(
    roomScope,
    placeRequest.plotId,
  );
  const blockIndexKey = buildingWorldBuildingBlockIndexRedisKey(roomScope);
  const metadata: Record<string, string | number | boolean | null> = {
    ...(placeRequest.metadata ?? {}),
    worldLayer: placeRequest.worldLayer,
    blockHeight: placeRequest.blockHeight,
  };
  const blockRow: WorldBuildingDevvitBlockRow = {
    id: placeRequest.blockId,
    plot_id: placeRequest.plotId,
    definition_id: placeRequest.definitionId,
    tile_x: placeRequest.tileX,
    tile_y: placeRequest.tileY,
    world_layer: placeRequest.worldLayer,
    owner_id: userId,
    metadata,
    placed_at: placeRequest.placedAt,
  };

  await redis.hSet(blocksKey, {
    [placeRequest.blockId]: JSON.stringify(blockRow),
  });
  await redis.hSet(blockIndexKey, {
    [placeRequest.blockId]: placeRequest.plotId,
  });

  return c.json<WorldBuildingDevvitPlaceBlockResponse>({
    type: 'block',
    block: blockRow,
  });
});

worldBuilding.delete('/blocks/:blockId', async (c) => {
  const userId = await resolvingDevvitRedditUserId();

  if (!userId) {
    return c.json<WorldBuildingDevvitErrorResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to edit builds.',
      },
      401,
    );
  }

  const blockId = c.req.param('blockId');
  const roomScope = resolvingPlazaDevvitOnlineRoomScope();
  const blockIndexKey = buildingWorldBuildingBlockIndexRedisKey(roomScope);
  const plotId = await redis.hGet(blockIndexKey, blockId);

  if (!plotId) {
    return c.json<WorldBuildingDevvitErrorResponse>(
      {
        type: 'error',
        message: 'Block not found.',
      },
      404,
    );
  }

  const rosterKey = buildingWorldBuildingPlotsRosterRedisKey(roomScope);
  const rawPlot = await redis.hGet(rosterKey, plotId);
  const plotRow = rawPlot ? parsingWorldBuildingDevvitPlotRow(rawPlot) : null;

  if (!plotRow || plotRow.owner_id !== userId) {
    return c.json<WorldBuildingDevvitErrorResponse>(
      {
        type: 'error',
        message: 'You can only remove blocks from your own plots.',
      },
      403,
    );
  }

  const blocksKey = buildingWorldBuildingPlotBlocksRedisKey(roomScope, plotId);
  await redis.hDel(blocksKey, [blockId]);
  await redis.hDel(blockIndexKey, [blockId]);

  return c.json({ type: 'deleted', blockId });
});
