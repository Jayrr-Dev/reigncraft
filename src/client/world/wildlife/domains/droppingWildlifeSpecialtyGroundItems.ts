/**
 * Spawns rolled specialty loot ground items at a wildlife corpse tile.
 *
 * @module components/world/wildlife/domains/droppingWildlifeSpecialtyGroundItems
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWorldPlazaGroundItemsUseLocalPersistence } from '@/components/world/inventory/domains/checkingWorldPlazaGroundItemsUseLocalPersistence';
import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';
import { insertingWorldPlazaGroundItemOptimistically } from '@/components/world/inventory/domains/managingWorldPlazaGroundItemOptimisticBridge';
import { droppingWorldPlazaLocalGroundItem } from '@/components/world/inventory/domains/managingWorldPlazaLocalGroundItems';
import { droppingWorldInventoryDevvitGroundItem } from '@/components/world/inventory/repositories/callingWorldInventoryDevvitApi';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { DEFINING_WILDLIFE_MEAT_GROUND_DROP_SLOT_INDEX } from '@/components/world/wildlife/domains/droppingWildlifeMeatGroundItem';
import { resolvingWildlifeSpecialtyLootRolls } from '@/components/world/wildlife/domains/resolvingWildlifeSpecialtyLootRolls';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';
import { WORLD_INVENTORY_DEVVIT_GROUND_ITEMS_DROP_API_PATH } from '../../../../shared/worldInventoryDevvit';

export type DroppingWildlifeSpecialtyGroundItemsParams = {
  readonly localPersistenceOwnerId: string | null;
  readonly redditUserId: string | null;
  readonly saveSlotIndex: PlazaSaveSlotIndex | null;
  readonly instance: DefiningWildlifeInstance;
  readonly playerPosition: DefiningWorldPlazaWorldPoint;
  readonly commonRandomUnit?: number;
  readonly rareRandomUnit?: number;
};

export type DroppingWildlifeSpecialtyGroundItemsResult = {
  readonly outcome: 'dropped' | 'none' | 'failed';
  readonly groundItems: readonly DefiningWorldPlazaGroundItem[];
};

/**
 * Rolls and drops specialty parts/products beside meat at the corpse.
 * Failures on individual rolls are skipped; meat drop stays independent.
 */
export async function droppingWildlifeSpecialtyGroundItems({
  localPersistenceOwnerId,
  redditUserId,
  saveSlotIndex,
  instance,
  playerPosition,
  commonRandomUnit,
  rareRandomUnit,
}: DroppingWildlifeSpecialtyGroundItemsParams): Promise<DroppingWildlifeSpecialtyGroundItemsResult> {
  const rolls = resolvingWildlifeSpecialtyLootRolls(
    instance.speciesId,
    commonRandomUnit,
    rareRandomUnit
  );

  if (rolls.length === 0) {
    return { outcome: 'none', groundItems: [] };
  }

  const useLocalPersistence = checkingWorldPlazaGroundItemsUseLocalPersistence(
    localPersistenceOwnerId,
    redditUserId
  );
  const tileX = Math.floor(instance.position.x);
  const tileY = Math.floor(instance.position.y);
  const layer = instance.position.layer ?? 1;
  const groundItems: DefiningWorldPlazaGroundItem[] = [];

  for (const roll of rolls) {
    const dropRequest = {
      itemTypeId: roll.itemTypeId,
      quantity: roll.quantity,
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
        continue;
      }

      const groundItem: DefiningWorldPlazaGroundItem = {
        id: ack.groundItemId,
        itemTypeId: roll.itemTypeId,
        quantity: roll.quantity,
        gridX: tileX,
        gridY: tileY,
        layer,
        spawnedAt: Date.now(),
      };

      insertingWorldPlazaGroundItemOptimistically(
        groundItem,
        useLocalPersistence
      );
      groundItems.push(groundItem);
    } catch {
      // Keep meat loot valid even if a specialty drop fails.
    }
  }

  if (groundItems.length === 0) {
    return { outcome: 'failed', groundItems: [] };
  }

  return { outcome: 'dropped', groundItems };
}
