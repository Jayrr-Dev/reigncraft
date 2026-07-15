/**
 * Grants a chest key into inventory when an active source roll succeeds.
 *
 * @module components/world/chest/domains/grantingWorldPlazaChestKeyToInventory
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningWorldPlazaChestKeySource } from '@/components/world/chest/domains/definingWorldPlazaChestTypes';
import { listingWorldPlazaActiveLockedChestKeySources } from '@/components/world/chest/domains/managingWorldPlazaChestInstanceStore';
import { rollingWorldPlazaChestKeyDrop } from '@/components/world/chest/domains/rollingWorldPlazaChestKeyDrop';
import { addingWorldPlazaInventoryItemWithStacking } from '@/components/world/inventory/domains/addingWorldPlazaInventoryItemWithStacking';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CHEST_KEY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { notifyingWorldPlazaInventoryItemAdded } from '@/components/world/inventory/domains/notifyingWorldPlazaInventoryItemAdded';
import { showingWorldPlazaInventoryItemPickupToast } from '@/components/world/inventory/domains/showingWorldPlazaInventoryItemPickupToast';
import { playingWildlifeStudySfx } from '@/components/world/wildlife/domains/playingWildlifeStudySfx';

export type GrantingWorldPlazaChestKeyToInventoryResult = {
  readonly state: DefiningInventoryState;
  readonly didGrant: boolean;
  readonly quantityAccepted: number;
};

/**
 * Attempts to add one chest key after a forage or wildlife-adjacent action.
 */
export function grantingWorldPlazaChestKeyToInventory(
  inventoryState: DefiningInventoryState,
  source: DefiningWorldPlazaChestKeySource,
  randomUnit: number = Math.random()
): GrantingWorldPlazaChestKeyToInventoryResult {
  const activeSources = listingWorldPlazaActiveLockedChestKeySources();

  if (!rollingWorldPlazaChestKeyDrop(activeSources, source, randomUnit)) {
    return { state: inventoryState, didGrant: false, quantityAccepted: 0 };
  }

  const addResult = addingWorldPlazaInventoryItemWithStacking(
    inventoryState,
    {
      id: crypto.randomUUID(),
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CHEST_KEY,
      quantity: 1,
    },
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
  );

  if (addResult.quantityAccepted < 1) {
    return {
      state: inventoryState,
      didGrant: false,
      quantityAccepted: 0,
    };
  }

  notifyingWorldPlazaInventoryItemAdded(addResult.quantityAccepted);
  showingWorldPlazaInventoryItemPickupToast({
    itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CHEST_KEY,
    quantity: addResult.quantityAccepted,
  });
  playingWildlifeStudySfx({ sectionId: 'key' });

  return {
    state: addResult.state,
    didGrant: true,
    quantityAccepted: addResult.quantityAccepted,
  };
}
