import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { droppingWorldPlazaLocalGroundItem } from '@/components/world/inventory/domains/managingWorldPlazaLocalGroundItems';
import {
  checkingWorldPlazaGroundItemsUseLocalPersistence,
  insertingWorldPlazaGroundItemOptimistically,
} from '@/components/world/inventory/hooks/usingWorldPlazaGroundItems';
import { droppingWorldInventoryDevvitGroundItem } from '@/components/world/inventory/repositories/callingWorldInventoryDevvitApi';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';
import { WORLD_INVENTORY_DEVVIT_GROUND_ITEMS_DROP_API_PATH } from '../../../../shared/worldInventoryDevvit';

/** Sentinel slot index for world-spawned ground drops (not from inventory). */
export const DEFINING_WORLD_PLAZA_TREE_CHOP_GROUND_DROP_SLOT_INDEX = -1;

export type DroppingWorldPlazaTreeChopWoodGroundItemParams = {
  readonly localPersistenceOwnerId: string | null;
  readonly redditUserId: string | null;
  readonly saveSlotIndex: PlazaSaveSlotIndex | null;
  readonly tileX: number;
  readonly tileY: number;
  readonly layer: number;
  readonly woodQuantity: number;
  readonly playerPosition: DefiningWorldPlazaWorldPoint;
};

export type DroppingWorldPlazaTreeChopWoodGroundItemResult =
  | {
      readonly outcome: 'dropped';
      readonly groundItem: DefiningWorldPlazaGroundItem;
    }
  | { readonly outcome: 'failed' };

/**
 * Spawns wood from a completed tree chop as a ground item at the tree tile.
 */
export async function droppingWorldPlazaTreeChopWoodGroundItem({
  localPersistenceOwnerId,
  redditUserId,
  saveSlotIndex,
  tileX,
  tileY,
  layer,
  woodQuantity,
  playerPosition,
}: DroppingWorldPlazaTreeChopWoodGroundItemParams): Promise<DroppingWorldPlazaTreeChopWoodGroundItemResult> {
  if (woodQuantity <= 0) {
    return { outcome: 'failed' };
  }

  const useLocalPersistence = checkingWorldPlazaGroundItemsUseLocalPersistence(
    localPersistenceOwnerId,
    redditUserId
  );

  const dropRequest = {
    itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
    quantity: woodQuantity,
    gridX: tileX,
    gridY: tileY,
    layer,
    slotIndex: DEFINING_WORLD_PLAZA_TREE_CHOP_GROUND_DROP_SLOT_INDEX,
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

    if (!ack.success || ack.groundItemId.length === 0) {
      return { outcome: 'failed' };
    }

    const groundItem: DefiningWorldPlazaGroundItem = {
      id: ack.groundItemId,
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
      quantity: woodQuantity,
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
