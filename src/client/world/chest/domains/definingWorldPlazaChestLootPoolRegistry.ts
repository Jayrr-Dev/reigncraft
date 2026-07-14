/**
 * Named loot pools for world chest props.
 *
 * @module components/world/chest/domains/definingWorldPlazaChestLootPoolRegistry
 */

import type { DefiningWorldPlazaChestLootPoolEntry } from '@/components/world/chest/domains/definingWorldPlazaChestTypes';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_GOLDEN,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RED,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLOVER_3_LEAF,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

export const DEFINING_WORLD_PLAZA_CHEST_LOOT_POOL_REGISTRY = {
  'starter-forage': [
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RED,
      quantity: 2,
      weight: 50,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLOVER_3_LEAF,
      quantity: 1,
      weight: 40,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_GOLDEN,
      quantity: 1,
      weight: 10,
    },
  ],
} as const satisfies Record<
  string,
  readonly DefiningWorldPlazaChestLootPoolEntry[]
>;

export type DefiningWorldPlazaChestLootPoolId =
  keyof typeof DEFINING_WORLD_PLAZA_CHEST_LOOT_POOL_REGISTRY;
