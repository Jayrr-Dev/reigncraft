import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWorldPlazaGroundItemsUseLocalPersistence } from '@/components/world/inventory/domains/checkingWorldPlazaGroundItemsUseLocalPersistence';
import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';
import { insertingWorldPlazaGroundItemOptimistically } from '@/components/world/inventory/domains/managingWorldPlazaGroundItemOptimisticBridge';
import { droppingWorldPlazaLocalGroundItem } from '@/components/world/inventory/domains/managingWorldPlazaLocalGroundItems';
import { droppingWorldInventoryDevvitGroundItem } from '@/components/world/inventory/repositories/callingWorldInventoryDevvitApi';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';
import { WORLD_INVENTORY_DEVVIT_GROUND_ITEMS_DROP_API_PATH } from '../../../../shared/worldInventoryDevvit';

/** Sentinel slot index for world-spawned ground drops (not from inventory). */
export const DEFINING_WORLD_PLAZA_TREE_CHOP_GROUND_DROP_SLOT_INDEX = -1;

export type DroppingWorldPlazaTreeChopGroundItemParams = {
  readonly localPersistenceOwnerId: string | null;
  readonly redditUserId: string | null;
  readonly saveSlotIndex: PlazaSaveSlotIndex | null;
  readonly tileX: number;
  readonly tileY: number;
  readonly layer: number;
  readonly itemTypeId: string;
  readonly quantity: number;
  readonly playerPosition: DefiningWorldPlazaWorldPoint;
};

export type DroppingWorldPlazaTreeChopGroundItemResult =
  | {
      readonly outcome: 'dropped';
      readonly groundItem: DefiningWorldPlazaGroundItem;
    }
  | { readonly outcome: 'failed' };

/**
 * Spawns a ground item from a completed tree chop at the tree tile.
 */
export async function droppingWorldPlazaTreeChopGroundItem({
  localPersistenceOwnerId,
  redditUserId,
  saveSlotIndex,
  tileX,
  tileY,
  layer,
  itemTypeId,
  quantity,
  playerPosition,
}: DroppingWorldPlazaTreeChopGroundItemParams): Promise<DroppingWorldPlazaTreeChopGroundItemResult> {
  if (quantity <= 0 || itemTypeId.length === 0) {
    return { outcome: 'failed' };
  }

  const useLocalPersistence = checkingWorldPlazaGroundItemsUseLocalPersistence(
    localPersistenceOwnerId,
    redditUserId
  );

  const dropRequest = {
    itemTypeId,
    quantity,
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

    if (!ack.success || !ack.groundItemId || ack.groundItemId.length === 0) {
      return { outcome: 'failed' };
    }

    const groundItemId = ack.groundItemId;

    const groundItem: DefiningWorldPlazaGroundItem = {
      id: groundItemId,
      itemTypeId,
      quantity,
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
