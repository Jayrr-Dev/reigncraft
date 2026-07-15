import { redis } from '@devvit/web/server';
import type { WorldHarvestDevvitChoppedTreeRow } from '../../shared/worldHarvestDevvit';
import {
  computingWorldTreeChopLayerMutation,
  formattingWorldTreeChopTileKey,
  parsingWorldTreeChopTileState,
  type WorldTreeChopTileState,
} from '../../shared/worldTreeChop';
import { buildingWorldHarvestChoppedTreesRedisKey } from './buildingWorldHarvestDevvitRedisKeys';

export async function listingWorldHarvestDevvitChoppedTrees(
  scope: string
): Promise<WorldHarvestDevvitChoppedTreeRow[]> {
  const choppedTreesKey = buildingWorldHarvestChoppedTreesRedisKey(scope);
  const rawTiles = await redis.hGetAll(choppedTreesKey);
  const tiles: WorldHarvestDevvitChoppedTreeRow[] = [];

  for (const [tileKey, rawTileState] of Object.entries(rawTiles)) {
    const parsedTileState = parsingWorldTreeChopTileState(rawTileState);

    if (!parsedTileState) {
      await redis.hDel(choppedTreesKey, [tileKey]);
      continue;
    }

    tiles.push({
      tileKey,
      ...parsedTileState,
    });
  }

  return tiles;
}

export async function readingWorldHarvestDevvitChoppedTreeState(
  scope: string,
  tileX: number,
  tileY: number
): Promise<WorldTreeChopTileState | undefined> {
  const choppedTreesKey = buildingWorldHarvestChoppedTreesRedisKey(scope);
  const tileKey = formattingWorldTreeChopTileKey(tileX, tileY);
  const rawTileState = await redis.hGet(choppedTreesKey, tileKey);

  if (!rawTileState) {
    return undefined;
  }

  return parsingWorldTreeChopTileState(rawTileState) ?? undefined;
}

export type ChoppingWorldHarvestDevvitTreeLayerRequest = {
  readonly tileX: number;
  readonly tileY: number;
  readonly playerX: number;
  readonly playerY: number;
  readonly currentVisualLayer: number;
  readonly standingSurfaceLayer: number;
  readonly layersPerSwing?: number;
  readonly resourcePerLayer?: number;
};

export type ChoppingWorldHarvestDevvitTreeLayerResult =
  | {
      readonly outcome: 'chopped';
      readonly remainingVisualLayer: number;
      readonly layersRemoved: number;
      readonly woodQuantity: number;
      readonly isFullyFelled: boolean;
    }
  | { readonly outcome: 'out-of-range' }
  | { readonly outcome: 'already-felled' };

/**
 * Applies one authoritative tree chop for an online persistence scope.
 */
export async function choppingWorldHarvestDevvitTreeLayer(
  scope: string,
  request: ChoppingWorldHarvestDevvitTreeLayerRequest
): Promise<ChoppingWorldHarvestDevvitTreeLayerResult> {
  const existingTileState = await readingWorldHarvestDevvitChoppedTreeState(
    scope,
    request.tileX,
    request.tileY
  );
  const mutation = computingWorldTreeChopLayerMutation({
    ...request,
    existingTileState,
  });

  if (mutation.outcome !== 'chopped') {
    return { outcome: mutation.outcome };
  }

  const choppedTreesKey = buildingWorldHarvestChoppedTreesRedisKey(scope);
  const tileKey = formattingWorldTreeChopTileKey(request.tileX, request.tileY);

  await redis.hSet(choppedTreesKey, {
    [tileKey]: JSON.stringify(mutation.nextTileState),
  });

  return {
    outcome: 'chopped',
    remainingVisualLayer: mutation.remainingVisualLayer,
    layersRemoved: mutation.layersRemoved,
    woodQuantity: mutation.woodQuantity,
    isFullyFelled: mutation.isFullyFelled,
  };
}
