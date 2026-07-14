/**
 * Backfills herbarium clover discovery from inventory holdings.
 *
 * @module components/world/domains/syncingWorldPlazaHerbariumCloversFromInventory
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import {
  ensuringWorldPlazaHerbariumCloverStudyAtLeast,
  gettingWorldPlazaHerbariumCloverStudyCountSnapshot,
} from '@/components/world/domains/managingWorldPlazaHerbariumDiscoveryStore';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLOVER_3_LEAF,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLOVER_4_LEAF,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import type { WorldCloverSearchLootKind } from '../../../shared/worldCloverSearchLoot';

function countingWorldPlazaInventoryCloverQuantity(
  inventoryState: DefiningInventoryState,
  itemTypeId: string
): number {
  let total = 0;

  for (const slot of inventoryState.slots) {
    if (slot?.itemTypeId === itemTypeId) {
      total += slot.quantity;
    }
  }

  return total;
}

/**
 * Raises combined clover study to at least held clover counts.
 */
export function syncingWorldPlazaHerbariumCloversFromInventory(
  inventoryState: DefiningInventoryState
): void {
  const threeLeafCount = countingWorldPlazaInventoryCloverQuantity(
    inventoryState,
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLOVER_3_LEAF
  );
  const fourLeafCount = countingWorldPlazaInventoryCloverQuantity(
    inventoryState,
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLOVER_4_LEAF
  );
  const heldCloverCount = threeLeafCount + fourLeafCount;

  if (heldCloverCount <= 0) {
    return;
  }

  const currentStudyCount =
    gettingWorldPlazaHerbariumCloverStudyCountSnapshot();

  if (heldCloverCount <= currentStudyCount) {
    if (threeLeafCount > 0) {
      ensuringWorldPlazaHerbariumCloverStudyAtLeast('three_leaf', 1);
    }

    if (fourLeafCount > 0) {
      ensuringWorldPlazaHerbariumCloverStudyAtLeast('four_leaf', 1);
    }

    return;
  }

  const kindsToSight: WorldCloverSearchLootKind[] = [];

  if (threeLeafCount > 0) {
    kindsToSight.push('three_leaf');
  }

  if (fourLeafCount > 0) {
    kindsToSight.push('four_leaf');
  }

  for (const cloverKind of kindsToSight) {
    ensuringWorldPlazaHerbariumCloverStudyAtLeast(cloverKind, 1);
  }

  ensuringWorldPlazaHerbariumCloverStudyAtLeast(
    kindsToSight[0] ?? 'three_leaf',
    heldCloverCount
  );
}
