/**
 * Builds inventory item definitions for all plaza bag tiers.
 *
 * @module components/world/inventory/domains/registeringWorldPlazaInventoryBagItemDefinitions
 */

import {
  DEFINING_WORLD_PLAZA_INVENTORY_BAG_DEFINITION_BY_TYPE_ID,
  DEFINING_WORLD_PLAZA_INVENTORY_BAG_TYPE_IDS,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryBagConstants';
import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';

/** Item type rows for every bag tier, smallest to largest. */
export function registeringWorldPlazaInventoryBagItemDefinitions(): readonly DefiningWorldPlazaInventoryItemTypeDefinition[] {
  return DEFINING_WORLD_PLAZA_INVENTORY_BAG_TYPE_IDS.map((typeId) => {
    const bag =
      DEFINING_WORLD_PLAZA_INVENTORY_BAG_DEFINITION_BY_TYPE_ID[typeId];

    return {
      typeId,
      name: bag.label,
      iconifyIcon: bag.iconifyIcon,
      maxStack: 1,
      isDroppable: true,
      isStackable: false,
      container: { columns: bag.columns, rows: bag.rows },
    };
  });
}
