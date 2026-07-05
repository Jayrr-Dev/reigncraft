import { Hono } from 'hono';
import {
  type WorldHarvestDevvitChoppedTreesResponse,
  type WorldHarvestDevvitChopTreeRequest,
  type WorldHarvestDevvitChopTreeResponse,
  type WorldHarvestDevvitErrorResponse,
} from '../../shared/worldHarvestDevvit';
import { checkingPlazaSaveSlotIndex } from '../../shared/plazaGameSession';
import {
  choppingWorldHarvestDevvitTreeLayer,
  listingWorldHarvestDevvitChoppedTrees,
} from '../domains/managingWorldHarvestDevvitChoppedTrees';
import { resolvingDevvitRedditUserId } from '../domains/resolvingDevvitRedditUserId';
import { resolvingPlazaDevvitOnlineRoomScope } from '../domains/resolvingPlazaDevvitOnlineRoomScope';

/**
 * Resolves the chopped-trees scope: a private per-user scope for single-player
 * save slots, or the shared online room scope otherwise.
 */
function resolvingChoppedTreesScope(
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
  const choppedTreesScope = resolvingChoppedTreesScope(
    userId,
    parsedSaveSlotIndex,
  );
  const tiles = await listingWorldHarvestDevvitChoppedTrees(choppedTreesScope);

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

  const choppedTreesScope = resolvingChoppedTreesScope(
    userId,
    chopRequest.saveSlotIndex,
  );
  const chopResult = await choppingWorldHarvestDevvitTreeLayer(
    choppedTreesScope,
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
