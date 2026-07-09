/**
 * Builds inventory item definitions for all plaza bag tiers.
 *
 * @module components/world/inventory/domains/registeringWorldPlazaInventoryBagItemDefinitions
 */

import {
  DEFINING_WORLD_PLAZA_INVENTORY_BAG_DEFINITION_BY_TYPE_ID,
  DEFINING_WORLD_PLAZA_INVENTORY_BAG_TYPE_IDS,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryBagConstants';
import type { DefiningWorldPlazaInventoryItemRarity } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';
import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EXPEDITION_BAG,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PACK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_POUCH,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RUCKSACK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SATCHEL,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

const DEFINING_WORLD_PLAZA_BAG_RARITY_BY_TYPE_ID: Readonly<
  Record<string, DefiningWorldPlazaInventoryItemRarity>
> = {
  [DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_POUCH]: 'common',
  [DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SATCHEL]: 'common',
  [DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PACK]: 'uncommon',
  [DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RUCKSACK]: 'uncommon',
  [DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EXPEDITION_BAG]: 'rare',
};

/** Item type rows for every bag tier, smallest to largest. */
export function registeringWorldPlazaInventoryBagItemDefinitions(): readonly DefiningWorldPlazaInventoryItemTypeDefinition[] {
  return DEFINING_WORLD_PLAZA_INVENTORY_BAG_TYPE_IDS.map((typeId) => {
    const bag =
      DEFINING_WORLD_PLAZA_INVENTORY_BAG_DEFINITION_BY_TYPE_ID[typeId];

    return {
      typeId,
      name: bag.label,
      rarity: DEFINING_WORLD_PLAZA_BAG_RARITY_BY_TYPE_ID[typeId] ?? 'common',
      iconifyIcon: bag.iconifyIcon,
      maxStack: 1,
      isDroppable: true,
      isStackable: false,
      container: { columns: bag.columns, rows: bag.rows },
    };
  });
}
