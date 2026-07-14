import { redis } from '@devvit/web/server';
import type { PlazaSaveSlotIndex } from '../../shared/plazaGameSession';
import {
  buildingWorldBuildingBlockIndexRedisKey,
  buildingWorldBuildingPlotBlocksRedisKey,
  buildingWorldBuildingPlotsRosterRedisKey,
  buildingWorldBuildingSessionBlocksRedisKey,
} from './buildingWorldBuildingDevvitRedisKeys';
import {
  buildingWorldHarvestChoppedTreesRedisKey,
  buildingWorldHarvestMinedRocksRedisKey,
  buildingWorldHarvestPickedFlowersRedisKey,
  buildingWorldHarvestPickedPebblesRedisKey,
} from './buildingWorldHarvestDevvitRedisKeys';
import { buildingWorldInventoryGroundItemsRedisKey } from './buildingWorldInventoryDevvitRedisKeys';
import { resolvingPlazaDevvitOnlineRoomScope } from './resolvingPlazaDevvitOnlineRoomScope';
import { PLAZA_DEVVIT_ONLINE_SINGLE_PLAYER_DEFAULT_ROOM_ID } from './resolvingPlazaDevvitOnlineRoomScopeFromRequest';

/**
 * Private single-player Redis scope for harvest / ground items (matches
 * worldHarvest / worldInventory route helpers).
 */
function resolvingPlazaSinglePlayerWorldPersistenceScope(
  userId: string,
  saveSlotIndex: PlazaSaveSlotIndex
): string {
  return `single-player:${userId}:slot-${saveSlotIndex}`;
}

function parsingOwnedPlotIdFromRosterJson(
  plotId: string,
  rawPlot: string,
  ownerUserId: string
): string | null {
  try {
    const parsed = JSON.parse(rawPlot) as { owner_id?: unknown };

    if (parsed.owner_id !== ownerUserId) {
      return null;
    }

    return plotId;
  } catch {
    return null;
  }
}

function parsingOwnedSessionBlockIdFromJson(
  blockId: string,
  rawBlock: string,
  ownerUserId: string
): string | null {
  try {
    const parsed = JSON.parse(rawBlock) as { owner_id?: unknown };

    if (parsed.owner_id !== ownerUserId) {
      return null;
    }

    return blockId;
  } catch {
    return null;
  }
}

/**
 * Deletes every plot (and plot blocks) owned by one user in a room scope.
 */
async function clearingOwnedWorldBuildingPlotsForUser(
  roomScope: string,
  ownerUserId: string
): Promise<void> {
  const rosterKey = buildingWorldBuildingPlotsRosterRedisKey(roomScope);
  const blockIndexKey = buildingWorldBuildingBlockIndexRedisKey(roomScope);
  const rawPlots = await redis.hGetAll(rosterKey);
  const ownedPlotIds: string[] = [];

  for (const [plotId, rawPlot] of Object.entries(rawPlots)) {
    const ownedPlotId = parsingOwnedPlotIdFromRosterJson(
      plotId,
      rawPlot,
      ownerUserId
    );

    if (ownedPlotId) {
      ownedPlotIds.push(ownedPlotId);
    }
  }

  for (const plotId of ownedPlotIds) {
    const blocksKey = buildingWorldBuildingPlotBlocksRedisKey(
      roomScope,
      plotId
    );
    const rawBlocks = await redis.hGetAll(blocksKey);
    const blockIds = Object.keys(rawBlocks);

    if (blockIds.length > 0) {
      await redis.hDel(blockIndexKey, blockIds);
    }

    await redis.del(blocksKey);
    await redis.hDel(rosterKey, [plotId]);
  }
}

/**
 * Deletes session blocks owned by one user in a room scope.
 */
async function clearingOwnedWorldBuildingSessionBlocksForUser(
  roomScope: string,
  ownerUserId: string
): Promise<void> {
  const sessionBlocksKey =
    buildingWorldBuildingSessionBlocksRedisKey(roomScope);
  const rawBlocks = await redis.hGetAll(sessionBlocksKey);
  const blockIdsToDelete: string[] = [];

  for (const [blockId, rawBlock] of Object.entries(rawBlocks)) {
    const ownedBlockId = parsingOwnedSessionBlockIdFromJson(
      blockId,
      rawBlock,
      ownerUserId
    );

    if (ownedBlockId) {
      blockIdsToDelete.push(ownedBlockId);
    }
  }

  if (blockIdsToDelete.length > 0) {
    await redis.hDel(sessionBlocksKey, blockIdsToDelete);
  }
}

/**
 * Wipes world Redis state tied to one single-player save slot.
 *
 * Clears slot-scoped harvest + ground items, plus the caller's owned plots and
 * session blocks in the default online room (SP claims currently share that
 * roster with room 1).
 *
 * @param userId - Authenticated Reddit user id (`reddit:{username}`).
 * @param saveSlotIndex - Save slot being deleted (1–3).
 */
export async function clearingPlazaSinglePlayerSaveSlotWorldPersistence(
  userId: string,
  saveSlotIndex: PlazaSaveSlotIndex
): Promise<void> {
  const slotScope = resolvingPlazaSinglePlayerWorldPersistenceScope(
    userId,
    saveSlotIndex
  );

  await redis.del(buildingWorldHarvestChoppedTreesRedisKey(slotScope));
  await redis.del(buildingWorldHarvestMinedRocksRedisKey(slotScope));
  await redis.del(buildingWorldHarvestPickedPebblesRedisKey(slotScope));
  await redis.del(buildingWorldHarvestPickedFlowersRedisKey(slotScope));
  await redis.del(buildingWorldInventoryGroundItemsRedisKey(slotScope));

  const roomScope = resolvingPlazaDevvitOnlineRoomScope(
    PLAZA_DEVVIT_ONLINE_SINGLE_PLAYER_DEFAULT_ROOM_ID
  );
  await clearingOwnedWorldBuildingPlotsForUser(roomScope, userId);
  await clearingOwnedWorldBuildingSessionBlocksForUser(roomScope, userId);
}
