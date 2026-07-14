/**
 * Resolves Drop vs Place for the inventory item action tower.
 *
 * @module components/world/inventory/domains/resolvingWorldPlazaInventoryItemGroundActionLabel
 */

import {
  LABELING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_DROP,
  LABELING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_PLACE,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemDetailConstants';
import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';

/**
 * Placeables (traps) use Place; everything else that can leave inventory uses Drop.
 */
export function resolvingWorldPlazaInventoryItemGroundActionLabel(
  definition: Pick<
    DefiningWorldPlazaInventoryItemTypeDefinition,
    'placesOnWorldGround'
  >
):
  | typeof LABELING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_DROP
  | typeof LABELING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_PLACE {
  return definition.placesOnWorldGround
    ? LABELING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_PLACE
    : LABELING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_DROP;
}
