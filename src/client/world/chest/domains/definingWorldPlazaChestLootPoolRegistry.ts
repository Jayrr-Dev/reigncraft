/**
 * Named loot pools for world chest props.
 *
 * @module components/world/chest/domains/definingWorldPlazaChestLootPoolRegistry
 */

import type { DefiningWorldPlazaChestLootPoolEntry } from '@/components/world/chest/domains/definingWorldPlazaChestTypes';
import { DEFINING_WORLD_PLAZA_DISTANCE_DANGER_BAND_TILES } from '@/components/world/domains/definingWorldPlazaDistanceDangerConstants';
import {
  DEFINING_WORLD_PLAZA_EARLY_UNIQUE_WEAPON_ITEM_TYPE_IDS,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE_GOLD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE_IRON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE_STEEL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_GOLDEN,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RED,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLOVER_3_LEAF,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EXPEDITION_BAG,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FISHROD_IRON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FISHROD_WOOD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PACK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PICKAXE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PICKAXE_IRON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PICKAXE_STEEL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_POUCH,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RUCKSACK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SATCHEL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SWORD_IRON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SWORD_WOOD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TOOL,
  DEFINING_WORLD_PLAZA_MID_UNIQUE_WEAPON_ITEM_TYPE_IDS,
  DEFINING_WORLD_PLAZA_UNIQUE_ARMOR_SET_ITEM_TYPE_IDS,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

/** Mid unique weapons only roll from chests this far from spawn. */
export const DEFINING_WORLD_PLAZA_CHEST_MID_UNIQUE_MIN_DISTANCE_FROM_ORIGIN_TILES =
  DEFINING_WORLD_PLAZA_DISTANCE_DANGER_BAND_TILES;

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
  /**
   * Locked / procedural chests: bag tiers + tools.
   * Bigger bags and higher tool tiers weigh less.
   */
  'packs-and-tools': [
    // Bags (weight ~50 total)
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_POUCH,
      quantity: 1,
      weight: 16,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SATCHEL,
      quantity: 1,
      weight: 14,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PACK,
      quantity: 1,
      weight: 10,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RUCKSACK,
      quantity: 1,
      weight: 7,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EXPEDITION_BAG,
      quantity: 1,
      weight: 3,
    },
    // Wood / starter tools
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TOOL,
      quantity: 1,
      weight: 6,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE,
      quantity: 1,
      weight: 5,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PICKAXE,
      quantity: 1,
      weight: 5,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FISHROD_WOOD,
      quantity: 1,
      weight: 4,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SWORD_WOOD,
      quantity: 1,
      weight: 4,
    },
    // Iron tools
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE_IRON,
      quantity: 1,
      weight: 2,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PICKAXE_IRON,
      quantity: 1,
      weight: 2,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SWORD_IRON,
      quantity: 1,
      weight: 2,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FISHROD_IRON,
      quantity: 1,
      weight: 2,
    },
    // Rare steel / gold
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE_STEEL,
      quantity: 1,
      weight: 1,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PICKAXE_STEEL,
      quantity: 1,
      weight: 1,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE_GOLD,
      quantity: 1,
      weight: 1,
    },
    // Early unique find-only weapons (rare among packs-and-tools rolls)
    ...DEFINING_WORLD_PLAZA_EARLY_UNIQUE_WEAPON_ITEM_TYPE_IDS.map(
      (itemTypeId) => ({
        itemTypeId,
        quantity: 1,
        weight: 1,
      })
    ),
    // Mid unique find-only weapons (rarer than early; past first danger band)
    ...DEFINING_WORLD_PLAZA_MID_UNIQUE_WEAPON_ITEM_TYPE_IDS.map(
      (itemTypeId) => ({
        itemTypeId,
        quantity: 1,
        weight: 0.5,
        minDistanceFromOriginTiles:
          DEFINING_WORLD_PLAZA_CHEST_MID_UNIQUE_MIN_DISTANCE_FROM_ORIGIN_TILES,
      })
    ),
    // Unique armour set pieces (Chaos / Bessemer / Glass Veil)
    ...DEFINING_WORLD_PLAZA_UNIQUE_ARMOR_SET_ITEM_TYPE_IDS.map(
      (itemTypeId) => ({
        itemTypeId,
        quantity: 1,
        weight: 1,
      })
    ),
  ],
  /**
   * Dedicated early unique weapon pool (equal weight).
   * Use for fixed chests that should always grant one early unique.
   */
  'early-unique-weapons':
    DEFINING_WORLD_PLAZA_EARLY_UNIQUE_WEAPON_ITEM_TYPE_IDS.map(
      (itemTypeId) => ({
        itemTypeId,
        quantity: 1,
        weight: 1,
      })
    ),
  /**
   * Dedicated mid unique weapon pool (equal weight).
   * Use for fixed chests that should always grant one mid unique.
   * Same distance gate as packs-and-tools mid uniques.
   */
  'mid-unique-weapons':
    DEFINING_WORLD_PLAZA_MID_UNIQUE_WEAPON_ITEM_TYPE_IDS.map((itemTypeId) => ({
      itemTypeId,
      quantity: 1,
      weight: 1,
      minDistanceFromOriginTiles:
        DEFINING_WORLD_PLAZA_CHEST_MID_UNIQUE_MIN_DISTANCE_FROM_ORIGIN_TILES,
    })),
  /**
   * Dedicated unique armour pool (equal weight across Chaos / Bessemer / Glass Veil).
   * Use for fixed chests that should always grant one unique armour piece.
   */
  'unique-armor-sets': DEFINING_WORLD_PLAZA_UNIQUE_ARMOR_SET_ITEM_TYPE_IDS.map(
    (itemTypeId) => ({
      itemTypeId,
      quantity: 1,
      weight: 1,
    })
  ),
} as const satisfies Record<
  string,
  readonly DefiningWorldPlazaChestLootPoolEntry[]
>;

export type DefiningWorldPlazaChestLootPoolId =
  keyof typeof DEFINING_WORLD_PLAZA_CHEST_LOOT_POOL_REGISTRY;
