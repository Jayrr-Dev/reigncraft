/**
 * True when an inventory item is raw/cooked fishing catch food (not junk).
 *
 * @module components/world/fishing/domains/checkingWorldPlazaInventoryItemIsFishingCatchCreatureFood
 */

import { DEFINING_WORLD_PLAZA_FISHING_CATCH_CATALOG } from '@/components/world/fishing/domains/definingWorldPlazaFishingCatchRegistry';

const FISHING_CATCH_CREATURE_FOOD_ITEM_TYPE_IDS: ReadonlySet<string> = new Set(
  DEFINING_WORLD_PLAZA_FISHING_CATCH_CATALOG.flatMap((entry) => {
    if (entry.kind !== 'creature') {
      return [];
    }

    return [entry.rawItemTypeId, entry.cookedItemTypeId];
  })
);

/**
 * Returns true for raw or cooked fishing catch creature items (fish, shellfish,
 * etc.). Junk catches are excluded.
 */
export function checkingWorldPlazaInventoryItemIsFishingCatchCreatureFood(
  itemTypeId: string | null | undefined
): boolean {
  if (!itemTypeId) {
    return false;
  }

  return FISHING_CATCH_CREATURE_FOOD_ITEM_TYPE_IDS.has(itemTypeId);
}
