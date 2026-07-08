/**
 * Builds and persists raw meat ground items from wildlife corpses.
 *
 * @module components/world/wildlife/domains/spawningWildlifeKillMeatGroundItem
 */

import { checkingWorldPlazaGroundItemsUseLocalPersistence } from '@/components/world/inventory/domains/checkingWorldPlazaGroundItemsUseLocalPersistence';
import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';
import { insertingWorldPlazaGroundItemOptimistically } from '@/components/world/inventory/domains/managingWorldPlazaGroundItemOptimisticBridge';
import { droppingWorldPlazaLocalGroundItem } from '@/components/world/inventory/domains/managingWorldPlazaLocalGroundItems';
import type { DefiningWildlifeMeatDropContext } from '@/components/world/wildlife/domains/attemptingWildlifeMeatGroundDropOnDeath';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  DEFINING_WILDLIFE_MEAT_GROUND_DROP_SLOT_INDEX,
  droppingWildlifeMeatGroundItem,
} from '@/components/world/wildlife/domains/droppingWildlifeMeatGroundItem';
import {
  enqueueingWildlifeEphemeralGroundFoodItem,
  replacingWildlifeEphemeralGroundFoodItemId,
} from '@/components/world/wildlife/domains/managingWildlifeGroundFoodBridge';

export type SpawningWildlifeKillMeatGroundItemParams = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  meatDropContext: DefiningWildlifeMeatDropContext | null | undefined;
  groundItemId?: string;
};

/** Builds a ground-item row for one wildlife corpse. */
export function buildingWildlifeKillMeatGroundItem(
  instance: DefiningWildlifeInstance,
  species: DefiningWildlifeSpeciesDefinition,
  groundItemId: string = crypto.randomUUID()
): DefiningWorldPlazaGroundItem | null {
  const { rawMeatItemTypeId, quantity } = species.loot;

  if (quantity <= 0) {
    return null;
  }

  return {
    id: groundItemId,
    itemTypeId: rawMeatItemTypeId,
    quantity,
    gridX: Math.floor(instance.position.x),
    gridY: Math.floor(instance.position.y),
    layer: instance.position.layer ?? 1,
    spawnedAt: Date.now(),
  };
}

/**
 * Spawns meat at a corpse so wildlife can eat it the same simulation tick.
 * Also mirrors the drop into player-visible ground-item state when possible.
 */
export function spawningWildlifeKillMeatGroundItem({
  instance,
  species,
  meatDropContext,
  groundItemId = crypto.randomUUID(),
}: SpawningWildlifeKillMeatGroundItemParams): DefiningWorldPlazaGroundItem | null {
  const groundItem = buildingWildlifeKillMeatGroundItem(
    instance,
    species,
    groundItemId
  );

  if (!groundItem) {
    return null;
  }

  enqueueingWildlifeEphemeralGroundFoodItem(groundItem);

  if (!meatDropContext) {
    return groundItem;
  }

  const useLocalPersistence = checkingWorldPlazaGroundItemsUseLocalPersistence(
    meatDropContext.localPersistenceOwnerId,
    meatDropContext.redditUserId
  );

  if (useLocalPersistence && meatDropContext.localPersistenceOwnerId) {
    const dropResult = droppingWorldPlazaLocalGroundItem(
      meatDropContext.localPersistenceOwnerId,
      {
        itemTypeId: groundItem.itemTypeId,
        quantity: groundItem.quantity,
        gridX: groundItem.gridX,
        gridY: groundItem.gridY,
        layer: groundItem.layer ?? 1,
        slotIndex: DEFINING_WILDLIFE_MEAT_GROUND_DROP_SLOT_INDEX,
        playerX: meatDropContext.playerPosition.x,
        playerY: meatDropContext.playerPosition.y,
      }
    );

    if (dropResult.success) {
      replacingWildlifeEphemeralGroundFoodItemId(
        groundItem.id,
        dropResult.groundItemId
      );
      const persistedItem: DefiningWorldPlazaGroundItem = {
        ...groundItem,
        id: dropResult.groundItemId,
      };
      insertingWorldPlazaGroundItemOptimistically(persistedItem, true);
      return persistedItem;
    }
  }

  void droppingWildlifeMeatGroundItem({
    localPersistenceOwnerId: meatDropContext.localPersistenceOwnerId,
    redditUserId: meatDropContext.redditUserId,
    saveSlotIndex: meatDropContext.saveSlotIndex,
    instance,
    species,
    playerPosition: meatDropContext.playerPosition,
  }).then((dropResult) => {
    if (dropResult.outcome !== 'dropped') {
      return;
    }

    replacingWildlifeEphemeralGroundFoodItemId(
      groundItem.id,
      dropResult.groundItem.id
    );
    insertingWorldPlazaGroundItemOptimistically(dropResult.groundItem, false);
  });

  return groundItem;
}
