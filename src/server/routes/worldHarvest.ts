import { Hono } from 'hono';
import {
  type WorldHarvestDevvitChoppedTreesResponse,
  type WorldHarvestDevvitChopTreeRequest,
  type WorldHarvestDevvitChopTreeResponse,
  type WorldHarvestDevvitErrorResponse,
  type WorldHarvestDevvitMinedRocksResponse,
  type WorldHarvestDevvitMineRockRequest,
  type WorldHarvestDevvitMineRockResponse,
} from '../../shared/worldHarvestDevvit';
import { checkingPlazaSaveSlotIndex } from '../../shared/plazaGameSession';
import {
  choppingWorldHarvestDevvitTreeLayer,
  listingWorldHarvestDevvitChoppedTrees,
} from '../domains/managingWorldHarvestDevvitChoppedTrees';
import {
  listingWorldHarvestDevvitMinedRocks,
  miningWorldHarvestDevvitRockLayer,
} from '../domains/managingWorldHarvestDevvitMinedRocks';
import { resolvingDevvitRedditUserId } from '../domains/resolvingDevvitRedditUserId';
import { resolvingPlazaDevvitOnlineRoomScope } from '../domains/resolvingPlazaDevvitOnlineRoomScope';

/**
 * Resolves harvest persistence scope: a private per-user scope for single-player
 * save slots, or the shared online room scope otherwise.
 */
function resolvingHarvestScope(
  userId: string,
  saveSlotIndex: number | null | undefined,
): string {
  if (
    typeof saveSlotIndex === 'number' &&
    checkingPlazaSaveSlotIndex(saveSlotIndex)
  ) {
    return `single-player:${userId}:slot-${saveSlotIndex}`;
  }

  return resolvingPlazaDevvitOnlineRoomScope();
}

function parsingWorldHarvestDevvitChopTreeRequest(
  body: unknown,
): WorldHarvestDevvitChopTreeRequest | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const payload = body as Partial<WorldHarvestDevvitChopTreeRequest>;

  if (
    typeof payload.tileX !== 'number' ||
    typeof payload.tileY !== 'number' ||
    typeof payload.playerX !== 'number' ||
    typeof payload.playerY !== 'number' ||
    typeof payload.currentVisualLayer !== 'number' ||
    typeof payload.standingSurfaceLayer !== 'number'
  ) {
    return null;
  }

  return {
    tileX: payload.tileX,
    tileY: payload.tileY,
    playerX: payload.playerX,
    playerY: payload.playerY,
    currentVisualLayer: payload.currentVisualLayer,
    standingSurfaceLayer: payload.standingSurfaceLayer,
    saveSlotIndex:
      typeof payload.saveSlotIndex === 'number' ? payload.saveSlotIndex : null,
  };
}

function parsingWorldHarvestDevvitMineRockRequest(
  body: unknown,
): WorldHarvestDevvitMineRockRequest | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const payload = body as Partial<WorldHarvestDevvitMineRockRequest>;

  if (
    typeof payload.tileX !== 'number' ||
    typeof payload.tileY !== 'number' ||
    typeof payload.targetCenterX !== 'number' ||
    typeof payload.targetCenterY !== 'number' ||
    typeof payload.playerX !== 'number' ||
    typeof payload.playerY !== 'number' ||
    typeof payload.currentVisualLayer !== 'number' ||
    typeof payload.standingSurfaceLayer !== 'number'
  ) {
    return null;
  }

  return {
    tileX: payload.tileX,
    tileY: payload.tileY,
    targetCenterX: payload.targetCenterX,
    targetCenterY: payload.targetCenterY,
    playerX: payload.playerX,
    playerY: payload.playerY,
    currentVisualLayer: payload.currentVisualLayer,
    standingSurfaceLayer: payload.standingSurfaceLayer,
    saveSlotIndex:
      typeof payload.saveSlotIndex === 'number' ? payload.saveSlotIndex : null,
  };
}

export const worldHarvest = new Hono();

worldHarvest.get('/chopped-trees', async (c) => {
  const userId = await resolvingDevvitRedditUserId();

  if (!userId) {
    return c.json<WorldHarvestDevvitChoppedTreesResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to view chopped trees.',
      },
      401,
    );
  }

  const rawSaveSlotIndex = c.req.query('saveSlotIndex');
  const parsedSaveSlotIndex = rawSaveSlotIndex
    ? Number.parseInt(rawSaveSlotIndex, 10)
    : null;
  const harvestScope = resolvingHarvestScope(userId, parsedSaveSlotIndex);
  const tiles = await listingWorldHarvestDevvitChoppedTrees(harvestScope);

  return c.json<WorldHarvestDevvitChoppedTreesResponse>({
    type: 'chopped-trees',
    tiles,
  });
});

worldHarvest.post('/chop-tree', async (c) => {
  const userId = await resolvingDevvitRedditUserId();

  if (!userId) {
    return c.json<WorldHarvestDevvitErrorResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to chop trees.',
      },
      401,
    );
  }

  const body: unknown = await c.req.json().catch(() => null);
  const chopRequest = parsingWorldHarvestDevvitChopTreeRequest(body);

  if (!chopRequest) {
    return c.json<WorldHarvestDevvitErrorResponse>(
      {
        type: 'error',
        message: 'Invalid tree chop request.',
      },
      400,
    );
  }

  const harvestScope = resolvingHarvestScope(userId, chopRequest.saveSlotIndex);
  const chopResult = await choppingWorldHarvestDevvitTreeLayer(
    harvestScope,
    chopRequest,
  );

  if (chopResult.outcome === 'out-of-range') {
    return c.json<WorldHarvestDevvitChopTreeResponse>({
      type: 'out-of-range',
    });
  }

  if (chopResult.outcome === 'already-felled') {
    return c.json<WorldHarvestDevvitChopTreeResponse>({
      type: 'already-felled',
    });
  }

  return c.json<WorldHarvestDevvitChopTreeResponse>({
    type: 'chopped',
    remainingVisualLayer: chopResult.remainingVisualLayer,
    layersRemoved: chopResult.layersRemoved,
    woodQuantity: chopResult.woodQuantity,
    isFullyFelled: chopResult.isFullyFelled,
  });
});

worldHarvest.get('/mined-rocks', async (c) => {
  const userId = await resolvingDevvitRedditUserId();

  if (!userId) {
    return c.json<WorldHarvestDevvitMinedRocksResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to view mined rocks.',
      },
      401,
    );
  }

  const rawSaveSlotIndex = c.req.query('saveSlotIndex');
  const parsedSaveSlotIndex = rawSaveSlotIndex
    ? Number.parseInt(rawSaveSlotIndex, 10)
    : null;
  const harvestScope = resolvingHarvestScope(userId, parsedSaveSlotIndex);
  const tiles = await listingWorldHarvestDevvitMinedRocks(harvestScope);

  return c.json<WorldHarvestDevvitMinedRocksResponse>({
    type: 'mined-rocks',
    tiles,
  });
});

worldHarvest.post('/mine-rock', async (c) => {
  const userId = await resolvingDevvitRedditUserId();

  if (!userId) {
    return c.json<WorldHarvestDevvitErrorResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to mine rocks.',
      },
      401,
    );
  }

  const body: unknown = await c.req.json().catch(() => null);
  const mineRequest = parsingWorldHarvestDevvitMineRockRequest(body);

  if (!mineRequest) {
    return c.json<WorldHarvestDevvitErrorResponse>(
      {
        type: 'error',
        message: 'Invalid rock mine request.',
      },
      400,
    );
  }

  const harvestScope = resolvingHarvestScope(userId, mineRequest.saveSlotIndex);
  const mineResult = await miningWorldHarvestDevvitRockLayer(
    harvestScope,
    mineRequest,
  );

  if (mineResult.outcome === 'out-of-range') {
    return c.json<WorldHarvestDevvitMineRockResponse>({
      type: 'out-of-range',
    });
  }

  if (mineResult.outcome === 'already-depleted') {
    return c.json<WorldHarvestDevvitMineRockResponse>({
      type: 'already-depleted',
    });
  }

  return c.json<WorldHarvestDevvitMineRockResponse>({
    type: 'mined',
    remainingVisualLayer: mineResult.remainingVisualLayer,
    layersRemoved: mineResult.layersRemoved,
    stoneQuantity: mineResult.stoneQuantity,
    isFullyDepleted: mineResult.isFullyDepleted,
  });
});
