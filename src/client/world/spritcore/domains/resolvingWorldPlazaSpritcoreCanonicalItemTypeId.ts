/**
 * Remaps legacy Spritcore tier item ids onto the shared stack pool id.
 *
 * @module components/world/spritcore/domains/resolvingWorldPlazaSpritcoreCanonicalItemTypeId
 */

import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { checkingWorldPlazaInventoryItemIsSpritcore } from '@/components/world/spritcore/domains/checkingWorldPlazaInventoryItemIsSpritcore';

/**
 * Returns the shared Spritcore pool id when `itemTypeId` is any Spritcore
 * variant; otherwise returns the input unchanged.
 */
export function resolvingWorldPlazaSpritcoreCanonicalItemTypeId(
  itemTypeId: string
): string {
  if (checkingWorldPlazaInventoryItemIsSpritcore(itemTypeId)) {
    return DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE;
  }

  return itemTypeId;
}
