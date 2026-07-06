import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';
import { droppingWorldPlazaLocalGroundItem } from '@/components/world/inventory/domains/managingWorldPlazaLocalGroundItems';
import {
  checkingWorldPlazaGroundItemsUseLocalPersistence,
  insertingWorldPlazaGroundItemOptimistically,
} from '@/components/world/inventory/hooks/usingWorldPlazaGroundItems';
import { droppingWorldInventoryDevvitGroundItem } from '@/components/world/inventory/repositories/callingWorldInventoryDevvitApi';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';
import { WORLD_INVENTORY_DEVVIT_GROUND_ITEMS_DROP_API_PATH } from '../../../../shared/worldInventoryDevvit';

/** Sentinel slot index for wildlife loot ground drops. */
export const DEFINING_WILDLIFE_MEAT_GROUND_DROP_SLOT_INDEX = -2;

export type DroppingWildlifeMeatGroundItemParams = {
  readonly localPersistenceOwnerId: string | null;
  readonly redditUserId: string | null;
  readonly saveSlotIndex: PlazaSaveSlotIndex | null;
  readonly instance: DefiningWildlifeInstance;
  readonly species: DefiningWildlifeSpeciesDefinition;
  readonly playerPosition: DefiningWorldPlazaWorldPoint;
};

export type DroppingWildlifeMeatGroundItemResult =
  | {
      readonly outcome: 'dropped';
      readonly groundItem: DefiningWorldPlazaGroundItem;
    }
  | { readonly outcome: 'failed' };

/**
 * Spawns raw meat from a dead animal as a ground item at the corpse tile.
 */
export async function droppingWildlifeMeatGroundItem({
  localPersistenceOwnerId,
  redditUserId,
  saveSlotIndex,
  instance,
  species,
  playerPosition,
}: DroppingWildlifeMeatGroundItemParams): Promise<DroppingWildlifeMeatGroundItemResult> {
  const { rawMeatItemTypeId, quantity } = species.loot;

  if (quantity <= 0) {
    return { outcome: 'failed' };
  }

  const tileX = Math.floor(instance.position.x);
  const tileY = Math.floor(instance.position.y);
  const layer = instance.position.layer;

  const useLocalPersistence = checkingWorldPlazaGroundItemsUseLocalPersistence(
    localPersistenceOwnerId,
    redditUserId
  );

  const dropRequest = {
    itemTypeId: rawMeatItemTypeId,
    quantity,
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

    if (!ack.success || ack.groundItemId.length === 0) {
      return { outcome: 'failed' };
    }

    const groundItem: DefiningWorldPlazaGroundItem = {
      id: ack.groundItemId,
      itemTypeId: rawMeatItemTypeId,
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
