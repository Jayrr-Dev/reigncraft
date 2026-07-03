import {
  creatingInventoryItemRegistry,
  type DefiningInventoryItemRegistry,
} from "@/components/inventory/domains/definingInventoryItemRegistry";
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TOOL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
} from "@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds";
import { Hammer, Leaf, Package } from "lucide-react";

export {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TOOL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
};

/**
 * World plaza item type definitions.
 * Add new world items here as they are implemented.
 */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_DEFINITIONS = [
  {
    typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
    name: "Wood",
    iconEmoji: "🪵",
    maxStack: 99,
    isDroppable: true,
    isStackable: true,
    tooltip: "Wood resource",
  },
  {
    typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
    name: "Stone",
    iconEmoji: "🪨",
    maxStack: 99,
    isDroppable: true,
    isStackable: true,
    tooltip: "Stone resource",
  },
  {
    typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TOOL,
    name: "Build Tool",
    Icon: Hammer,
    maxStack: 1,
    isDroppable: true,
    isStackable: false,
    tooltip: "Building tool",
  },
] as const;

/** Pre-built registry for world plaza inventory item types. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY: DefiningInventoryItemRegistry =
  creatingInventoryItemRegistry([
    ...DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_DEFINITIONS,
  ]);

/** Demo seed items for manual DnD testing. */
export interface DefiningWorldPlazaInventoryDemoSeedItem {
  readonly itemTypeId: string;
  readonly quantity: number;
}

/** Default demo items placed on first load when seed flag is enabled. */
export const DEFINING_WORLD_PLAZA_INVENTORY_DEMO_SEED_ITEMS: readonly DefiningWorldPlazaInventoryDemoSeedItem[] =
  [
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
      quantity: 5,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
      quantity: 3,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TOOL,
      quantity: 1,
    },
  ] as const;

/** Placeholder icon for future item types without art. */
export const DEFINING_WORLD_PLAZA_INVENTORY_PLACEHOLDER_ICON = Leaf;

/** Catalog icon for empty registry expansion. */
export const DEFINING_WORLD_PLAZA_INVENTORY_CATALOG_ICON = Package;
