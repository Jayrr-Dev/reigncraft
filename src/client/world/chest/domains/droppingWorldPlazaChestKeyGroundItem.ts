/**
 * Drops a chest key ground item on wildlife death when the wildlife source is active.
 *
 * @module components/world/chest/domains/droppingWorldPlazaChestKeyGroundItem
 */

import { listingWorldPlazaActiveLockedChestKeySources } from '@/components/world/chest/domains/managingWorldPlazaChestInstanceStore';
import { rollingWorldPlazaChestKeyDrop } from '@/components/world/chest/domains/rollingWorldPlazaChestKeyDrop';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWorldPlazaGroundItemsUseLocalPersistence } from '@/components/world/inventory/domains/checkingWorldPlazaGroundItemsUseLocalPersistence';
import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CHEST_KEY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { insertingWorldPlazaGroundItemOptimistically } from '@/components/world/inventory/domains/managingWorldPlazaGroundItemOptimisticBridge';
import { droppingWorldPlazaLocalGroundItem } from '@/components/world/inventory/domains/managingWorldPlazaLocalGroundItems';
import { droppingWorldInventoryDevvitGroundItem } from '@/components/world/inventory/repositories/callingWorldInventoryDevvitApi';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { DEFINING_WILDLIFE_MEAT_GROUND_DROP_SLOT_INDEX } from '@/components/world/wildlife/domains/droppingWildlifeMeatGroundItem';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';
import { WORLD_INVENTORY_DEVVIT_GROUND_ITEMS_DROP_API_PATH } from '../../../../shared/worldInventoryDevvit';

export type DroppingWorldPlazaChestKeyGroundItemParams = {
  readonly localPersistenceOwnerId: string | null;
  readonly redditUserId: string | null;
  readonly saveSlotIndex: PlazaSaveSlotIndex | null;
  readonly instance: DefiningWildlifeInstance;
  readonly playerPosition: DefiningWorldPlazaWorldPoint;
  readonly randomUnit?: number;
};

export type DroppingWorldPlazaChestKeyGroundItemResult = {
  readonly outcome: 'dropped' | 'none' | 'failed';
  readonly groundItem: DefiningWorldPlazaGroundItem | null;
};

/**
 * Rolls and drops one chest key beside a wildlife corpse when wildlife is an active source.
 */
export async function droppingWorldPlazaChestKeyGroundItem({
  localPersistenceOwnerId,
  redditUserId,
  saveSlotIndex,
  instance,
  playerPosition,
  randomUnit = Math.random(),
}: DroppingWorldPlazaChestKeyGroundItemParams): Promise<DroppingWorldPlazaChestKeyGroundItemResult> {
  const activeSources = listingWorldPlazaActiveLockedChestKeySources();

  if (!rollingWorldPlazaChestKeyDrop(activeSources, 'wildlife', randomUnit)) {
    return { outcome: 'none', groundItem: null };
  }

  const useLocalPersistence = checkingWorldPlazaGroundItemsUseLocalPersistence(
    localPersistenceOwnerId,
    redditUserId
  );
  const tileX = Math.floor(instance.position.x);
  const tileY = Math.floor(instance.position.y);
  const layer = instance.position.layer ?? 1;

  const dropRequest = {
    itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CHEST_KEY,
    quantity: 1,
    gridX: tileX,
    gridY: tileY,
    layer,
    slotIndex: DEFINING_WILDLIFE_MEAT_GROUND_DROP_SLOT_INDEX,
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
      return { outcome: 'failed', groundItem: null };
    }

    const groundItem: DefiningWorldPlazaGroundItem = {
      id: ack.groundItemId,
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CHEST_KEY,
      quantity: 1,
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
    return { outcome: 'failed', groundItem: null };
  }
}
