import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWorldPlazaGroundItemsUseLocalPersistence } from '@/components/world/inventory/domains/checkingWorldPlazaGroundItemsUseLocalPersistence';
import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';
import { insertingWorldPlazaGroundItemOptimistically } from '@/components/world/inventory/domains/managingWorldPlazaGroundItemOptimisticBridge';
import { droppingWorldPlazaLocalGroundItem } from '@/components/world/inventory/domains/managingWorldPlazaLocalGroundItems';
import { droppingWorldInventoryDevvitGroundItem } from '@/components/world/inventory/repositories/callingWorldInventoryDevvitApi';
import type { DefiningWildlifeMeatDropKillContext } from '@/components/world/wildlife/domains/attemptingWildlifeMeatGroundDropOnDeath';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeMeatDropQuantity } from '@/components/world/wildlife/domains/resolvingWildlifeLargeSizeFrameMeatDropQuantity';
import { resolvingWildlifeMeatDropRawItemTypeId } from '@/components/world/wildlife/domains/resolvingWildlifeMeatCatalogEntryForInstance';
import { resolvingWildlifeMeatDropMetadata } from '@/components/world/wildlife/domains/resolvingWildlifeMeatDropMetadata';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';
import {
  WORLD_INVENTORY_DEVVIT_GROUND_ITEMS_DROP_API_PATH,
  WORLD_INVENTORY_DEVVIT_WILDLIFE_MEAT_GROUND_DROP_SLOT_INDEX,
} from '../../../../shared/worldInventoryDevvit';

/** Sentinel slot index for wildlife loot ground drops. */
export const DEFINING_WILDLIFE_MEAT_GROUND_DROP_SLOT_INDEX =
  WORLD_INVENTORY_DEVVIT_WILDLIFE_MEAT_GROUND_DROP_SLOT_INDEX;

export type DroppingWildlifeMeatGroundItemParams = {
  readonly localPersistenceOwnerId: string | null;
  readonly redditUserId: string | null;
  readonly saveSlotIndex: PlazaSaveSlotIndex | null;
  readonly instance: DefiningWildlifeInstance;
  readonly species: DefiningWildlifeSpeciesDefinition;
  readonly playerPosition: DefiningWorldPlazaWorldPoint;
  readonly killContext?: DefiningWildlifeMeatDropKillContext | null;
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
  killContext = null,
}: DroppingWildlifeMeatGroundItemParams): Promise<DroppingWildlifeMeatGroundItemResult> {
  const rawMeatItemTypeId = resolvingWildlifeMeatDropRawItemTypeId(
    instance,
    species.loot.rawMeatItemTypeId
  );
  const quantity = resolvingWildlifeMeatDropQuantity(instance, species);

  if (quantity <= 0) {
    return { outcome: 'failed' };
  }

  const playerUserId = redditUserId ?? localPersistenceOwnerId;
  const meatMetadata = resolvingWildlifeMeatDropMetadata({
    instance,
    species,
    killerTargetId: killContext?.killerTargetId,
    playerUserId,
    nowMs: killContext?.nowMs ?? Date.now(),
  });

  const tileX = Math.floor(instance.position.x);
  const tileY = Math.floor(instance.position.y);
  const layer = instance.position.layer ?? 1;

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
    metadata: meatMetadata,
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
      itemTypeId: rawMeatItemTypeId,
      quantity,
      gridX: tileX,
      gridY: tileY,
      layer,
      spawnedAt: Date.now(),
      metadata: meatMetadata,
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
