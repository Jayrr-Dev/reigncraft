/**
 * Bag container definitions for world plaza inventory items.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryBagConstants
 */

import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EXPEDITION_BAG,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PACK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_POUCH,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RUCKSACK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SATCHEL,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

/** Metadata key storing serialized bag slot contents on a bag item instance. */
export const DEFINING_WORLD_PLAZA_INVENTORY_BAG_SLOTS_METADATA_KEY =
  'bagSlots' as const;

/** Layout and label for one bag item type. */
export type DefiningWorldPlazaInventoryBagDefinition = {
  readonly columns: number;
  readonly rows: number;
  readonly label: string;
};

/** Bag registry keyed by item type id. */
export const DEFINING_WORLD_PLAZA_INVENTORY_BAG_DEFINITION_BY_TYPE_ID: Readonly<
  Record<string, DefiningWorldPlazaInventoryBagDefinition>
> = {
  [DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_POUCH]: {
    columns: 2,
    rows: 2,
    label: 'Pouch',
  },
  [DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SATCHEL]: {
    columns: 3,
    rows: 3,
    label: 'Satchel',
  },
  [DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PACK]: {
    columns: 3,
    rows: 4,
    label: 'Pack',
  },
  [DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RUCKSACK]: {
    columns: 3,
    rows: 5,
    label: 'Rucksack',
  },
  [DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EXPEDITION_BAG]: {
    columns: 3,
    rows: 6,
    label: 'Expedition Bag',
  },
};

/** Ordered bag type ids from smallest to largest capacity. */
export const DEFINING_WORLD_PLAZA_INVENTORY_BAG_TYPE_IDS: readonly string[] = [
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_POUCH,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SATCHEL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PACK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RUCKSACK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EXPEDITION_BAG,
];
