/**
 * Lists every mineable ore as inventory seed rows for Dev QA.
 *
 * @module components/world/inventory/domains/listingWorldPlazaOreItemSeedItems
 */

import { DEFINING_WORLD_PLAZA_DEV_QA_CRAFT_INGREDIENT_SEED_QUANTITY } from '@/components/world/domains/definingWorldPlazaDevQaLoadConstants';
import type { DefiningWorldPlazaInventoryDemoSeedItem } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { DEFINING_WORLD_PLAZA_INVENTORY_ORE_ITEM_TYPE_IDS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

/**
 * Returns one seed row per ore item type.
 * Quantity defaults to the Dev QA craft ingredient stack size.
 */
export function listingWorldPlazaOreItemSeedItems(
  quantity: number = DEFINING_WORLD_PLAZA_DEV_QA_CRAFT_INGREDIENT_SEED_QUANTITY
): readonly DefiningWorldPlazaInventoryDemoSeedItem[] {
  const seedQuantity = Math.max(1, Math.floor(quantity));

  return DEFINING_WORLD_PLAZA_INVENTORY_ORE_ITEM_TYPE_IDS.map((itemTypeId) => ({
    itemTypeId,
    quantity: seedQuantity,
  }));
}
