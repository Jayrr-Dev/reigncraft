import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWorldPlazaGroundItemsUseLocalPersistence } from '@/components/world/inventory/domains/checkingWorldPlazaGroundItemsUseLocalPersistence';
import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { insertingWorldPlazaGroundItemOptimistically } from '@/components/world/inventory/domains/managingWorldPlazaGroundItemOptimisticBridge';
import { droppingWorldPlazaLocalGroundItem } from '@/components/world/inventory/domains/managingWorldPlazaLocalGroundItems';
import { droppingWorldInventoryDevvitGroundItem } from '@/components/world/inventory/repositories/callingWorldInventoryDevvitApi';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';
import { WORLD_INVENTORY_DEVVIT_GROUND_ITEMS_DROP_API_PATH } from '../../../../shared/worldInventoryDevvit';

/** Sentinel slot index for world-spawned ground drops (not from inventory). */
export const DEFINING_WORLD_PLAZA_ROCK_MINE_GROUND_DROP_SLOT_INDEX = -1;

export type DroppingWorldPlazaRockMineStoneGroundItemParams = {
  readonly localPersistenceOwnerId: string | null;
  readonly redditUserId: string | null;
  readonly saveSlotIndex: PlazaSaveSlotIndex | null;
  readonly tileX: number;
  readonly tileY: number;
  readonly layer: number;
  readonly stoneQuantity: number;
  readonly playerPosition: DefiningWorldPlazaWorldPoint;
  /** Defaults to plain stone when omitted. */
  readonly itemTypeId?: string;
};

export type DroppingWorldPlazaRockMineStoneGroundItemResult =
  | {
      readonly outcome: 'dropped';
      readonly groundItem: DefiningWorldPlazaGroundItem;
    }
  | { readonly outcome: 'failed' };

/**
 * Spawns stone or ore from a completed rock mine as a ground item at the rock tile.
 */
export async function droppingWorldPlazaRockMineStoneGroundItem({
  localPersistenceOwnerId,
  redditUserId,
  saveSlotIndex,
  tileX,
  tileY,
  layer,
  stoneQuantity,
  playerPosition,
  itemTypeId = DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
}: DroppingWorldPlazaRockMineStoneGroundItemParams): Promise<DroppingWorldPlazaRockMineStoneGroundItemResult> {
  if (stoneQuantity <= 0) {
    return { outcome: 'failed' };
  }

  const useLocalPersistence = checkingWorldPlazaGroundItemsUseLocalPersistence(
    localPersistenceOwnerId,
    redditUserId
  );

  const dropRequest = {
    itemTypeId,
    quantity: stoneQuantity,
    gridX: tileX,
    gridY: tileY,
    layer,
    slotIndex: DEFINING_WORLD_PLAZA_ROCK_MINE_GROUND_DROP_SLOT_INDEX,
    playerX: playerPosition.x,
    playerY: playerPosition.y,
  };

  try {
    const ack =
      useLocalPersistence && localPersistenceOwnerId
        ? droppingWorldPlazaLocalGroundItem(
            localPersistenceOwnerId,
            dropRequest
          )
        : await droppingWorldInventoryDevvitGroundItem(
            WORLD_INVENTORY_DEVVIT_GROUND_ITEMS_DROP_API_PATH,
            {
              ...dropRequest,
              saveSlotIndex,
            }
          );

    if (!ack.success || !ack.groundItemId || ack.groundItemId.length === 0) {
      return { outcome: 'failed' };
    }

    const groundItemId = ack.groundItemId;

    const groundItem: DefiningWorldPlazaGroundItem = {
      id: groundItemId,
      itemTypeId,
      quantity: stoneQuantity,
      gridX: tileX,
      gridY: tileY,
      layer,
      spawnedAt: Date.now(),
    };

    insertingWorldPlazaGroundItemOptimistically(
      groundItem,
      useLocalPersistence
    );

    return { outcome: 'dropped', groundItem };
  } catch {
    return { outcome: 'failed' };
  }
}
