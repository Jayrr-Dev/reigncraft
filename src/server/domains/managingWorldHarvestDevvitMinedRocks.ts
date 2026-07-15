import { redis } from '@devvit/web/server';
import type { WorldHarvestDevvitMinedRockRow } from '../../shared/worldHarvestDevvit';
import {
  computingWorldRockMineLayerMutation,
  formattingWorldRockMineTileKey,
  parsingWorldRockMineTileState,
  type WorldRockMineTileState,
} from '../../shared/worldRockMine';
import { buildingWorldHarvestMinedRocksRedisKey } from './buildingWorldHarvestDevvitRedisKeys';

export async function listingWorldHarvestDevvitMinedRocks(
  scope: string
): Promise<WorldHarvestDevvitMinedRockRow[]> {
  const minedRocksKey = buildingWorldHarvestMinedRocksRedisKey(scope);
  const rawTiles = await redis.hGetAll(minedRocksKey);
  const tiles: WorldHarvestDevvitMinedRockRow[] = [];

  for (const [tileKey, rawTileState] of Object.entries(rawTiles)) {
    const parsedTileState = parsingWorldRockMineTileState(rawTileState);

    if (!parsedTileState) {
      await redis.hDel(minedRocksKey, [tileKey]);
      continue;
    }

    tiles.push({
      tileKey,
      ...parsedTileState,
    });
  }

  return tiles;
}

export async function readingWorldHarvestDevvitMinedRockState(
  scope: string,
  tileX: number,
  tileY: number
): Promise<WorldRockMineTileState | undefined> {
  const minedRocksKey = buildingWorldHarvestMinedRocksRedisKey(scope);
  const tileKey = formattingWorldRockMineTileKey(tileX, tileY);
  const rawTileState = await redis.hGet(minedRocksKey, tileKey);

  if (!rawTileState) {
    return undefined;
  }

  return parsingWorldRockMineTileState(rawTileState) ?? undefined;
}

export type MiningWorldHarvestDevvitRockLayerRequest = {
  readonly tileX: number;
  readonly tileY: number;
  readonly targetCenterX: number;
  readonly targetCenterY: number;
  readonly playerX: number;
  readonly playerY: number;
  readonly currentVisualLayer: number;
  readonly standingSurfaceLayer: number;
  readonly layersPerSwing?: number;
  readonly resourcePerLayer?: number;
};

export type MiningWorldHarvestDevvitRockLayerResult =
  | {
      readonly outcome: 'mined';
      readonly remainingVisualLayer: number;
      readonly layersRemoved: number;
      readonly stoneQuantity: number;
      readonly isFullyDepleted: boolean;
    }
  | { readonly outcome: 'out-of-range' }
  | { readonly outcome: 'already-depleted' };

/**
 * Applies one authoritative rock mine for an online persistence scope.
 */
export async function miningWorldHarvestDevvitRockLayer(
  scope: string,
  request: MiningWorldHarvestDevvitRockLayerRequest
): Promise<MiningWorldHarvestDevvitRockLayerResult> {
  const existingTileState = await readingWorldHarvestDevvitMinedRockState(
    scope,
    request.tileX,
    request.tileY
  );
  const mutation = computingWorldRockMineLayerMutation({
    ...request,
    existingTileState,
  });

  if (mutation.outcome !== 'mined') {
    return { outcome: mutation.outcome };
  }

  const minedRocksKey = buildingWorldHarvestMinedRocksRedisKey(scope);
  const tileKey = formattingWorldRockMineTileKey(request.tileX, request.tileY);

  await redis.hSet(minedRocksKey, {
    [tileKey]: JSON.stringify(mutation.nextTileState),
  });

  return {
    outcome: 'mined',
    remainingVisualLayer: mutation.remainingVisualLayer,
    layersRemoved: mutation.layersRemoved,
    stoneQuantity: mutation.stoneQuantity,
    isFullyDepleted: mutation.isFullyDepleted,
  };
}
