import {
  creatingInventoryItemRegistry,
  type DefiningInventoryItemRegistry,
} from '@/components/inventory/domains/definingInventoryItemRegistry';
import { DEFINING_INVENTORY_UNLIMITED_STACK_SIZE } from '@/components/inventory/domains/definingInventoryStackConstants';
import {
  DEFINING_WORLD_PLAZA_HUNGER_RESTORE_APPLE,
  DEFINING_WORLD_PLAZA_HUNGER_RESTORE_BERRIES,
} from '@/components/world/hunger/domains/definingWorldPlazaHungerConstants';
import { registeringWorldPlazaWildlifeMeatInventoryItems } from '@/components/world/inventory/domains/registeringWorldPlazaWildlifeMeatInventoryItems';
import { DEFINING_WORLD_PLAZA_INVENTORY_CUSTOM_ITEM_ICON_SOULCORE_SPHERE } from '@/components/world/inventory/domains/definingWorldPlazaInventoryCustomItemIconIds';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_AXE_MAX_DURABILITY,
  DEFINING_WORLD_PLAZA_INVENTORY_BUILD_TOOL_MAX_DURABILITY,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryDurabilityConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_BLUEPRINT_FLASH,
  DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_STEADY_GRIP,
  DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_SWIFT_CHOP,
  DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_TIMBER_WHISPER,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryEnchantmentTypeIds';
import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_APPLE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRIES,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EXPEDITION_BAG,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLINT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PACK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_POUCH,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RUCKSACK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SATCHEL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SOULCORE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TOOL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import {
  DEFINING_WORLD_PLAZA_SOULCORE_ITEM_NAME,
  DEFINING_WORLD_PLAZA_SOULCORE_STACK_QUANTITY_DISPLAY,
} from '@/components/world/soulcore/domains/definingWorldPlazaSoulcoreConstants';
import { Axe, Hammer, Leaf, Package } from 'lucide-react';

export {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_APPLE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRIES,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EXPEDITION_BAG,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLINT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PACK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_POUCH,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RUCKSACK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SATCHEL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SOULCORE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TOOL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
};

/**
 * World plaza item type definitions.
 * Add new world items here — inventory metadata, food, and equipment in one row.
 */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_DEFINITIONS: readonly DefiningWorldPlazaInventoryItemTypeDefinition[] =
  [
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
      name: 'Wood',
      iconEmoji: '🪵',
      maxStack: 99,
      isDroppable: true,
      isStackable: true,
      tooltip: 'Wood resource',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
      name: 'Stone',
      iconEmoji: '🪨',
      maxStack: 99,
      isDroppable: true,
      isStackable: true,
      tooltip: 'Stone resource',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLINT,
      name: 'Flint',
      iconEmoji: '🪨',
      maxStack: 16,
      isDroppable: true,
      isStackable: true,
      tooltip: 'Ignite flammable blocks',
      equipment: {
        toolKinds: ['ignite'],
        harvestSpeedMultiplier: 1,
      },
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TOOL,
      name: 'Build Tool',
      Icon: Hammer,
      maxStack: 1,
      isDroppable: true,
      isStackable: false,
      tooltip: 'Building tool',
      equipment: {
        toolKinds: ['build'],
        harvestSpeedMultiplier: 1,
      },
      durability: {
        max: DEFINING_WORLD_PLAZA_INVENTORY_BUILD_TOOL_MAX_DURABILITY,
        breakChanceAtZero: 0.1,
      },
      defaultEnchantments: [
        DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_STEADY_GRIP,
        DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_BLUEPRINT_FLASH,
      ],
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE,
      name: 'Wood Axe',
      Icon: Axe,
      maxStack: 1,
      isDroppable: true,
      isStackable: false,
      tooltip: 'Chop trees for wood',
      equipment: {
        toolKinds: ['axe'],
        harvestSpeedMultiplier: 1,
      },
      durability: {
        max: DEFINING_WORLD_PLAZA_INVENTORY_AXE_MAX_DURABILITY,
        breakChanceAtZero: 0.15,
      },
      defaultEnchantments: [
        DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_TIMBER_WHISPER,
        DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_SWIFT_CHOP,
      ],
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRIES,
      name: 'Berries',
      iconEmoji: '🫐',
      maxStack: 99,
      isDroppable: true,
      isStackable: true,
      tooltip: 'Double-click to eat: restores a little hunger',
      food: {
        hungerRestoreRatio: DEFINING_WORLD_PLAZA_HUNGER_RESTORE_BERRIES,
      },
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_APPLE,
      name: 'Apple',
      iconEmoji: '🍎',
      maxStack: 99,
      isDroppable: true,
      isStackable: true,
      tooltip: 'Double-click to eat: restores hunger',
      food: {
        hungerRestoreRatio: DEFINING_WORLD_PLAZA_HUNGER_RESTORE_APPLE,
      },
    },
    ...registeringWorldPlazaWildlifeMeatInventoryItems(),
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SOULCORE,
      name: DEFINING_WORLD_PLAZA_SOULCORE_ITEM_NAME,
      customIconId:
        DEFINING_WORLD_PLAZA_INVENTORY_CUSTOM_ITEM_ICON_SOULCORE_SPHERE,
      maxStack: DEFINING_INVENTORY_UNLIMITED_STACK_SIZE,
      isDroppable: false,
      isStackable: true,
      tooltip: 'Condensed soul energy',
      stackQuantityDisplay:
        DEFINING_WORLD_PLAZA_SOULCORE_STACK_QUANTITY_DISPLAY,
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_POUCH,
      name: 'Pouch',
      iconifyIcon: 'mdi:purse',
      maxStack: 1,
      isDroppable: true,
      isStackable: false,
      tooltip: 'Tiny starter bag. Click to open extra storage (2x2).',
      container: { columns: 2, rows: 2 },
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SATCHEL,
      name: 'Satchel',
      iconifyIcon: 'mdi:bag-personal',
      maxStack: 1,
      isDroppable: true,
      isStackable: false,
      tooltip: 'Small adventurer bag. Click to open extra storage (3x3).',
      container: { columns: 3, rows: 3 },
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PACK,
      name: 'Pack',
      iconifyIcon: 'mdi:bag-suitcase',
      maxStack: 1,
      isDroppable: true,
      isStackable: false,
      tooltip: 'Standard travel bag. Click to open extra storage (3x4).',
      container: { columns: 3, rows: 4 },
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RUCKSACK,
      name: 'Rucksack',
      iconifyIcon: 'mdi:bag-checked',
      maxStack: 1,
      isDroppable: true,
      isStackable: false,
      tooltip: 'Larger utility bag. Click to open extra storage (3x5).',
      container: { columns: 3, rows: 5 },
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EXPEDITION_BAG,
      name: 'Expedition Bag',
      iconifyIcon: 'mdi:treasure-chest',
      maxStack: 1,
      isDroppable: true,
      isStackable: false,
      tooltip: 'Big serious bag. Click to open extra storage (3x6).',
      container: { columns: 3, rows: 6 },
    },
  ];

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
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLINT,
      quantity: 2,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TOOL,
      quantity: 1,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE,
      quantity: 1,
    },
  ] as const;

/** Placeholder icon for future item types without art. */
export const DEFINING_WORLD_PLAZA_INVENTORY_PLACEHOLDER_ICON = Leaf;

/** Catalog icon for empty registry expansion. */
export const DEFINING_WORLD_PLAZA_INVENTORY_CATALOG_ICON = Package;
