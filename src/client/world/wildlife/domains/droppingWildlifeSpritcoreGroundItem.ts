/**
 * Spawns a Spritcore stack as a ground item on a wildlife corpse.
 *
 * @module components/world/wildlife/domains/droppingWildlifeSpritcoreGroundItem
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWorldPlazaGroundItemsUseLocalPersistence } from '@/components/world/inventory/domains/checkingWorldPlazaGroundItemsUseLocalPersistence';
import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';
import { insertingWorldPlazaGroundItemOptimistically } from '@/components/world/inventory/domains/managingWorldPlazaGroundItemOptimisticBridge';
import { droppingWorldPlazaLocalGroundItem } from '@/components/world/inventory/domains/managingWorldPlazaLocalGroundItems';
import { droppingWorldInventoryDevvitGroundItem } from '@/components/world/inventory/repositories/callingWorldInventoryDevvitApi';
import { resolvingWorldPlazaSpritcoreWildlifeKillDrop } from '@/components/world/spritcore/domains/resolvingWorldPlazaSpritcoreWildlifeKillDrop';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { DEFINING_WILDLIFE_MEAT_GROUND_DROP_SLOT_INDEX } from '@/components/world/wildlife/domains/droppingWildlifeMeatGroundItem';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';
import { WORLD_INVENTORY_DEVVIT_GROUND_ITEMS_DROP_API_PATH } from '../../../../shared/worldInventoryDevvit';

export type DroppingWildlifeSpritcoreGroundItemParams = {
  readonly localPersistenceOwnerId: string | null;
  readonly redditUserId: string | null;
  readonly saveSlotIndex: PlazaSaveSlotIndex | null;
  readonly instance: DefiningWildlifeInstance;
  readonly species: DefiningWildlifeSpeciesDefinition;
  readonly playerPosition: DefiningWorldPlazaWorldPoint;
};

export type DroppingWildlifeSpritcoreGroundItemResult =
  | {
      readonly outcome: 'dropped';
      readonly groundItem: DefiningWorldPlazaGroundItem;
    }
  | { readonly outcome: 'none' | 'failed' };

/**
 * Drops a Spritcore quantity stack at the corpse (Magiccore-style ground loot).
 */
export async function droppingWildlifeSpritcoreGroundItem({
  localPersistenceOwnerId,
  redditUserId,
  saveSlotIndex,
  instance,
  species,
  playerPosition,
}: DroppingWildlifeSpritcoreGroundItemParams): Promise<DroppingWildlifeSpritcoreGroundItemResult> {
  const killDrop = resolvingWorldPlazaSpritcoreWildlifeKillDrop(species);

  if (!killDrop) {
    return { outcome: 'none' };
  }

  const tileX = Math.floor(instance.position.x);
  const tileY = Math.floor(instance.position.y);
  const layer = instance.position.layer ?? 1;
  const useLocalPersistence = checkingWorldPlazaGroundItemsUseLocalPersistence(
    localPersistenceOwnerId,
    redditUserId
  );

  const dropRequest = {
    itemTypeId: killDrop.itemTypeId,
    quantity: killDrop.amount,
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
      return { outcome: 'failed' };
    }

    const groundItem: DefiningWorldPlazaGroundItem = {
      id: ack.groundItemId,
      itemTypeId: killDrop.itemTypeId,
      quantity: killDrop.amount,
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
