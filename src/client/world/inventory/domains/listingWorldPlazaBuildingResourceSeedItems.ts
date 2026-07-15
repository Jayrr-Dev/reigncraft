/**
 * Lists Creative-load building / Materials palette resources in group order.
 *
 * @module components/world/inventory/domains/listingWorldPlazaBuildingResourceSeedItems
 */

import { DEFINING_WORLD_PLAZA_DEV_QA_BUILDING_RESOURCE_SEED_GROUPS } from '@/components/world/domains/definingWorldPlazaDevQaBuildingResourceSeedConstants';
import { DEFINING_WORLD_PLAZA_DEV_QA_CRAFT_INGREDIENT_SEED_QUANTITY } from '@/components/world/domains/definingWorldPlazaDevQaLoadConstants';
import type { DefiningWorldPlazaInventoryDemoSeedItem } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';

/**
 * Returns one seed row per building-resource item type, grouped for storage order.
 */
export function listingWorldPlazaBuildingResourceSeedItems(
  quantity: number = DEFINING_WORLD_PLAZA_DEV_QA_CRAFT_INGREDIENT_SEED_QUANTITY
): readonly DefiningWorldPlazaInventoryDemoSeedItem[] {
  const seedQuantity = Math.max(1, Math.floor(quantity));
  const seedItems: DefiningWorldPlazaInventoryDemoSeedItem[] = [];
  const seenItemTypeIds = new Set<string>();

  for (const group of DEFINING_WORLD_PLAZA_DEV_QA_BUILDING_RESOURCE_SEED_GROUPS) {
    for (const itemTypeId of group.itemTypeIds) {
      if (seenItemTypeIds.has(itemTypeId)) {
        continue;
      }

      seenItemTypeIds.add(itemTypeId);
      seedItems.push({
        itemTypeId,
        quantity: seedQuantity,
      });
    }
  }

  return seedItems;
}
