/**
 * True when an inventory item type is Spritcore (tiered or legacy).
 *
 * @module components/world/spritcore/domains/checkingWorldPlazaInventoryItemIsSpritcore
 */

import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { DEFINING_WORLD_PLAZA_SPRITCORE_TIERED_ITEM_TYPE_IDS } from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreDropTierConstants';

const CHECKING_WORLD_PLAZA_SPRITCORE_ITEM_TYPE_ID_SET = new Set<string>([
  ...DEFINING_WORLD_PLAZA_SPRITCORE_TIERED_ITEM_TYPE_IDS,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE,
]);

/** Returns true when `itemTypeId` is any Spritcore stack type. */
export function checkingWorldPlazaInventoryItemIsSpritcore(
  itemTypeId: string
): boolean {
  return CHECKING_WORLD_PLAZA_SPRITCORE_ITEM_TYPE_ID_SET.has(itemTypeId);
}
