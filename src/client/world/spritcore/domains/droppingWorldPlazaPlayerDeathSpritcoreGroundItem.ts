/**
 * Spawns Spritcore spilled on player death as a ground stack at the corpse.
 *
 * @module components/world/spritcore/domains/droppingWorldPlazaPlayerDeathSpritcoreGroundItem
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWorldPlazaGroundItemsUseLocalPersistence } from '@/components/world/inventory/domains/checkingWorldPlazaGroundItemsUseLocalPersistence';
import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';
import { insertingWorldPlazaGroundItemOptimistically } from '@/components/world/inventory/domains/managingWorldPlazaGroundItemOptimisticBridge';
import { droppingWorldPlazaLocalGroundItem } from '@/components/world/inventory/domains/managingWorldPlazaLocalGroundItems';
import { droppingWorldInventoryDevvitGroundItem } from '@/components/world/inventory/repositories/callingWorldInventoryDevvitApi';
import { resolvingWorldPlazaSpritcoreDropItemTypeId } from '@/components/world/spritcore/domains/resolvingWorldPlazaSpritcoreDropTier';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';
import {
  WORLD_INVENTORY_DEVVIT_GROUND_ITEMS_DROP_API_PATH,
  WORLD_INVENTORY_DEVVIT_WILDLIFE_MEAT_GROUND_DROP_SLOT_INDEX,
} from '../../../../shared/worldInventoryDevvit';

/** Sentinel slot for death-spill loot (skips inventory drop-radius check). */
export const DEFINING_WORLD_PLAZA_PLAYER_DEATH_SPRITCORE_GROUND_DROP_SLOT_INDEX =
  WORLD_INVENTORY_DEVVIT_WILDLIFE_MEAT_GROUND_DROP_SLOT_INDEX;

export type DroppingWorldPlazaPlayerDeathSpritcoreGroundItemParams = {
  readonly localPersistenceOwnerId: string | null;
  readonly redditUserId: string | null;
  readonly saveSlotIndex: PlazaSaveSlotIndex | null;
  readonly quantity: number;
  readonly deathPosition: DefiningWorldPlazaWorldPoint;
};

export type DroppingWorldPlazaPlayerDeathSpritcoreGroundItemResult =
  | {
      readonly outcome: 'dropped';
      readonly groundItem: DefiningWorldPlazaGroundItem;
    }
  | { readonly outcome: 'none' | 'failed' };

/**
 * Drops a tiered Spritcore stack at the player death tile.
 */
export async function droppingWorldPlazaPlayerDeathSpritcoreGroundItem({
  localPersistenceOwnerId,
  redditUserId,
  saveSlotIndex,
  quantity,
  deathPosition,
}: DroppingWorldPlazaPlayerDeathSpritcoreGroundItemParams): Promise<DroppingWorldPlazaPlayerDeathSpritcoreGroundItemResult> {
  const dropQuantity = Math.floor(quantity);

  if (dropQuantity <= 0) {
    return { outcome: 'none' };
  }

  const itemTypeId = resolvingWorldPlazaSpritcoreDropItemTypeId(dropQuantity);
  const tileX = Math.floor(deathPosition.x);
  const tileY = Math.floor(deathPosition.y);
  const layer = deathPosition.layer ?? 1;
  const useLocalPersistence = checkingWorldPlazaGroundItemsUseLocalPersistence(
    localPersistenceOwnerId,
    redditUserId
  );

  const dropRequest = {
    itemTypeId,
    quantity: dropQuantity,
    gridX: tileX,
    gridY: tileY,
    layer,
    slotIndex:
      DEFINING_WORLD_PLAZA_PLAYER_DEATH_SPRITCORE_GROUND_DROP_SLOT_INDEX,
    playerX: deathPosition.x,
    playerY: deathPosition.y,
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

    const groundItem: DefiningWorldPlazaGroundItem = {
      id: ack.groundItemId,
      itemTypeId,
      quantity: dropQuantity,
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
