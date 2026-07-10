import { redis } from '@devvit/web/server';
import {
  computingWorldPebblePickMutation,
  formattingWorldPebblePickTileKey,
  parsingWorldPebblePickTileState,
  type WorldPebblePickTileState,
} from '../../shared/worldPebblePick';
import type { WorldHarvestDevvitPickedPebbleRow } from '../../shared/worldHarvestDevvit';
import { buildingWorldHarvestPickedPebblesRedisKey } from './buildingWorldHarvestDevvitRedisKeys';

export async function listingWorldHarvestDevvitPickedPebbles(
  scope: string,
): Promise<WorldHarvestDevvitPickedPebbleRow[]> {
  const pickedPebblesKey = buildingWorldHarvestPickedPebblesRedisKey(scope);
  const rawTiles = await redis.hGetAll(pickedPebblesKey);
  const tiles: WorldHarvestDevvitPickedPebbleRow[] = [];

  for (const [tileKey, rawTileState] of Object.entries(rawTiles)) {
    const parsedTileState = parsingWorldPebblePickTileState(rawTileState);

    if (!parsedTileState) {
      await redis.hDel(pickedPebblesKey, [tileKey]);
      continue;
    }

    tiles.push({
      tileKey,
      ...parsedTileState,
    });
  }

  return tiles;
}

export async function readingWorldHarvestDevvitPickedPebbleState(
  scope: string,
  tileX: number,
  tileY: number,
): Promise<WorldPebblePickTileState | undefined> {
  const pickedPebblesKey = buildingWorldHarvestPickedPebblesRedisKey(scope);
  const tileKey = formattingWorldPebblePickTileKey(tileX, tileY);
  const rawTileState = await redis.hGet(pickedPebblesKey, tileKey);

  if (!rawTileState) {
    return undefined;
  }

  return parsingWorldPebblePickTileState(rawTileState) ?? undefined;
}

export type PickingWorldHarvestDevvitPebbleRequest = {
  readonly tileX: number;
  readonly tileY: number;
  readonly playerX: number;
  readonly playerY: number;
};

export type PickingWorldHarvestDevvitPebbleResult =
  | {
      readonly outcome: 'picked';
      readonly stoneQuantity: number;
    }
  | { readonly outcome: 'out-of-range' }
  | { readonly outcome: 'already-picked' };

/**
 * Applies one authoritative floor-pebble pick for an online persistence scope.
 */
export async function pickingWorldHarvestDevvitPebble(
  scope: string,
  request: PickingWorldHarvestDevvitPebbleRequest,
): Promise<PickingWorldHarvestDevvitPebbleResult> {
  const existingTileState = await readingWorldHarvestDevvitPickedPebbleState(
    scope,
    request.tileX,
    request.tileY,
  );
  const mutation = computingWorldPebblePickMutation({
    ...request,
    existingTileState,
  });

  if (mutation.outcome !== 'picked') {
    return { outcome: mutation.outcome };
  }

  const pickedPebblesKey = buildingWorldHarvestPickedPebblesRedisKey(scope);
  const tileKey = formattingWorldPebblePickTileKey(request.tileX, request.tileY);

  await redis.hSet(pickedPebblesKey, {
    [tileKey]: JSON.stringify(mutation.nextTileState),
  });

  return {
    outcome: 'picked',
    stoneQuantity: mutation.stoneQuantity,
  };
}
