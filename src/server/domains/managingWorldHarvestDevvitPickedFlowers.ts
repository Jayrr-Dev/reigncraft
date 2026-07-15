import { redis } from '@devvit/web/server';
import {
  computingWorldFlowerPickMutation,
  formattingWorldFlowerPickTileKey,
  parsingWorldFlowerPickTileState,
  type WorldFlowerPickTileState,
} from '../../shared/worldFlowerPick';
import { resolvingWorldFlowerSpeciesAtTileIndex } from '../../shared/worldFlowerRarity';
import type { WorldHarvestDevvitPickedFlowerRow } from '../../shared/worldHarvestDevvit';
import { buildingWorldHarvestPickedFlowersRedisKey } from './buildingWorldHarvestDevvitRedisKeys';

export async function listingWorldHarvestDevvitPickedFlowers(
  scope: string
): Promise<WorldHarvestDevvitPickedFlowerRow[]> {
  const pickedFlowersKey = buildingWorldHarvestPickedFlowersRedisKey(scope);
  // Devvit redis.hGetAll returns undefined when the hash does not exist yet.
  const rawTiles = (await redis.hGetAll(pickedFlowersKey)) ?? {};
  const tiles: WorldHarvestDevvitPickedFlowerRow[] = [];

  for (const [tileKey, rawTileState] of Object.entries(rawTiles)) {
    const parsedTileState = parsingWorldFlowerPickTileState(rawTileState);

    if (!parsedTileState) {
      await redis.hDel(pickedFlowersKey, [tileKey]);
      continue;
    }

    tiles.push({
      tileKey,
      ...parsedTileState,
    });
  }

  return tiles;
}

export async function readingWorldHarvestDevvitPickedFlowerState(
  scope: string,
  tileX: number,
  tileY: number
): Promise<WorldFlowerPickTileState | undefined> {
  const pickedFlowersKey = buildingWorldHarvestPickedFlowersRedisKey(scope);
  const tileKey = formattingWorldFlowerPickTileKey(tileX, tileY);
  const rawTileState = await redis.hGet(pickedFlowersKey, tileKey);

  if (!rawTileState) {
    return undefined;
  }

  return parsingWorldFlowerPickTileState(rawTileState) ?? undefined;
}

export type PickingWorldHarvestDevvitFlowerRequest = {
  readonly tileX: number;
  readonly tileY: number;
  readonly playerX: number;
  readonly playerY: number;
};

export type PickingWorldHarvestDevvitFlowerResult =
  | {
      readonly outcome: 'picked';
      readonly speciesId: ReturnType<
        typeof resolvingWorldFlowerSpeciesAtTileIndex
      >;
      readonly flowerQuantity: number;
    }
  | { readonly outcome: 'out-of-range' }
  | { readonly outcome: 'already-picked' };

/**
 * Applies one authoritative biome-flower pick for an online persistence scope.
 */
export async function pickingWorldHarvestDevvitFlower(
  scope: string,
  request: PickingWorldHarvestDevvitFlowerRequest
): Promise<PickingWorldHarvestDevvitFlowerResult> {
  const speciesId = resolvingWorldFlowerSpeciesAtTileIndex(
    request.tileX,
    request.tileY
  );
  const existingTileState = await readingWorldHarvestDevvitPickedFlowerState(
    scope,
    request.tileX,
    request.tileY
  );
  const mutation = computingWorldFlowerPickMutation({
    ...request,
    speciesId,
    existingTileState,
  });

  if (mutation.outcome !== 'picked') {
    return { outcome: mutation.outcome };
  }

  const pickedFlowersKey = buildingWorldHarvestPickedFlowersRedisKey(scope);
  const tileKey = formattingWorldFlowerPickTileKey(
    request.tileX,
    request.tileY
  );

  await redis.hSet(pickedFlowersKey, {
    [tileKey]: JSON.stringify(mutation.nextTileState),
  });

  return {
    outcome: 'picked',
    speciesId: mutation.speciesId,
    flowerQuantity: mutation.flowerQuantity,
  };
}
