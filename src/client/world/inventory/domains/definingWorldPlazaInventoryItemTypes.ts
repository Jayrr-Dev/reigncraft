import {
  creatingInventoryItemRegistry,
  type DefiningInventoryItemRegistry,
} from '@/components/inventory/domains/definingInventoryItemRegistry';
import { DEFINING_INVENTORY_UNLIMITED_STACK_SIZE } from '@/components/inventory/domains/definingInventoryStackConstants';
import {
  DEFINING_WORLD_PLAZA_HUNGER_RESTORE_APPLE,
  DEFINING_WORLD_PLAZA_HUNGER_RESTORE_BERRIES,
  DEFINING_WORLD_PLAZA_HUNGER_RESTORE_FISH,
  DEFINING_WORLD_PLAZA_HUNGER_RESTORE_WHEAT,
} from '@/components/world/hunger/domains/definingWorldPlazaHungerConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_CUSTOM_ITEM_ICON_SOULCORE_SPHERE } from '@/components/world/inventory/domains/definingWorldPlazaInventoryCustomItemIconIds';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_AXE_MAX_DURABILITY,
  DEFINING_WORLD_PLAZA_INVENTORY_BUILD_TOOL_MAX_DURABILITY,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryDurabilityConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_BLUEPRINT_FLASH,
  DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_STEADY_GRIP,
  DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_TIMBER_WHISPER,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryEnchantmentTypeIds';
import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_APPLE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRIES,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLAIM_TOOL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CRAFT_TOOL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EXPEDITION_BAG,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FISH,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FISHROD_WOOD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLINT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_HOE_WOOD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PACK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_POUCH,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RUCKSACK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SATCHEL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SCYTHE_WOOD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SOULCORE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SWORD_WOOD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TOOL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WHEAT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WHEAT_SEED,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { DEFINING_WORLD_PLAZA_WOOD_AXE_INVENTORY_ICON_URL } from '@/components/world/inventory/domains/definingWorldPlazaToolInventoryIconConstants';
import { registeringWorldPlazaInventoryBagItemDefinitions } from '@/components/world/inventory/domains/registeringWorldPlazaInventoryBagItemDefinitions';
import { registeringWorldPlazaTieredToolInventoryItems } from '@/components/world/inventory/domains/registeringWorldPlazaTieredToolInventoryItems';
import { registeringWorldPlazaWildlifeMeatInventoryItems } from '@/components/world/inventory/domains/registeringWorldPlazaWildlifeMeatInventoryItems';
import { resolvingWorldPlazaInventoryFoodHealDeclaration } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryFoodHealDeclaration';
import {
  DEFINING_WORLD_PLAZA_SOULCORE_ITEM_NAME,
  DEFINING_WORLD_PLAZA_SOULCORE_STACK_QUANTITY_DISPLAY,
} from '@/components/world/soulcore/domains/definingWorldPlazaSoulcoreConstants';
import { Leaf, Package } from 'lucide-react';

export {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_APPLE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRIES,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLAIM_TOOL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CRAFT_TOOL,
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
      rarity: 'basic',
      iconEmoji: '🪵',
      maxStack: 99,
      isDroppable: true,
      isStackable: true,
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
      name: 'Stone',
      rarity: 'basic',
      iconEmoji: '🪨',
      maxStack: 99,
      isDroppable: true,
      isStackable: true,
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLINT,
      name: 'Flint',
      rarity: 'uncommon',
      iconEmoji: '🪨',
      maxStack: 16,
      isDroppable: true,
      isStackable: true,
      equipment: {
        toolKinds: ['ignite'],
        harvestSpeedMultiplier: 1,
      },
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TOOL,
      name: 'Build',
      rarity: 'common',
      iconifyIcon: 'mdi:hammer',
      maxStack: 1,
      isDroppable: false,
      isStackable: false,
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
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CRAFT_TOOL,
      name: 'Craft',
      rarity: 'common',
      iconifyIcon: 'game-icons:anvil',
      maxStack: 1,
      isDroppable: false,
      isStackable: false,
      equipment: {
        toolKinds: ['craft'],
        harvestSpeedMultiplier: 1,
      },
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLAIM_TOOL,
      name: 'Claim',
      rarity: 'common',
      iconifyIcon: 'mdi:land-plots',
      maxStack: 1,
      isDroppable: false,
      isStackable: false,
      equipment: {
        toolKinds: ['claim'],
        harvestSpeedMultiplier: 1,
      },
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE,
      name: 'Wood Axe',
      rarity: 'common',
      iconImageUrl: DEFINING_WORLD_PLAZA_WOOD_AXE_INVENTORY_ICON_URL,
      maxStack: 1,
      isDroppable: true,
      isStackable: false,
      equipment: {
        toolKinds: ['axe'],
        harvestSpeedMultiplier: 1,
        heldItemVisualId: 'axe',
        heldItemTier: 'wood',
      },
      durability: {
        max: DEFINING_WORLD_PLAZA_INVENTORY_AXE_MAX_DURABILITY,
        breakChanceAtZero: 0.15,
      },
      defaultEnchantments: [
        DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_TIMBER_WHISPER,
      ],
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRIES,
      name: 'Berries',
      rarity: 'common',
      iconEmoji: '🫐',
      maxStack: 99,
      isDroppable: true,
      isStackable: true,
      food: {
        hungerRestoreRatio: DEFINING_WORLD_PLAZA_HUNGER_RESTORE_BERRIES,
        healthHeal: resolvingWorldPlazaInventoryFoodHealDeclaration({
          hungerRestoreRatio: DEFINING_WORLD_PLAZA_HUNGER_RESTORE_BERRIES,
        }),
      },
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_APPLE,
      name: 'Apple',
      rarity: 'common',
      iconEmoji: '🍎',
      maxStack: 99,
      isDroppable: true,
      isStackable: true,
      food: {
        hungerRestoreRatio: DEFINING_WORLD_PLAZA_HUNGER_RESTORE_APPLE,
        healthHeal: resolvingWorldPlazaInventoryFoodHealDeclaration({
          hungerRestoreRatio: DEFINING_WORLD_PLAZA_HUNGER_RESTORE_APPLE,
        }),
      },
    },
    ...registeringWorldPlazaWildlifeMeatInventoryItems(),
    ...registeringWorldPlazaTieredToolInventoryItems(),
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WHEAT_SEED,
      name: 'Wheat Seeds',
      rarity: 'basic',
      iconEmoji: '🌾',
      maxStack: 99,
      isDroppable: true,
      isStackable: true,
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WHEAT,
      name: 'Wheat',
      rarity: 'common',
      iconEmoji: '🌾',
      maxStack: 99,
      isDroppable: true,
      isStackable: true,
      food: {
        hungerRestoreRatio: DEFINING_WORLD_PLAZA_HUNGER_RESTORE_WHEAT,
        healthHeal: resolvingWorldPlazaInventoryFoodHealDeclaration({
          hungerRestoreRatio: DEFINING_WORLD_PLAZA_HUNGER_RESTORE_WHEAT,
        }),
      },
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FISH,
      name: 'Fish',
      rarity: 'common',
      iconEmoji: '🐟',
      maxStack: 99,
      isDroppable: true,
      isStackable: true,
      food: {
        hungerRestoreRatio: DEFINING_WORLD_PLAZA_HUNGER_RESTORE_FISH,
        healthHeal: resolvingWorldPlazaInventoryFoodHealDeclaration({
          hungerRestoreRatio: DEFINING_WORLD_PLAZA_HUNGER_RESTORE_FISH,
          meatKind: 'raw',
        }),
        meatKind: 'raw',
        rawSicknessChance: 0.08,
      },
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SOULCORE,
      name: DEFINING_WORLD_PLAZA_SOULCORE_ITEM_NAME,
      rarity: 'legendary',
      customIconId:
        DEFINING_WORLD_PLAZA_INVENTORY_CUSTOM_ITEM_ICON_SOULCORE_SPHERE,
      maxStack: DEFINING_INVENTORY_UNLIMITED_STACK_SIZE,
      isDroppable: false,
      isStackable: true,
      stackQuantityDisplay:
        DEFINING_WORLD_PLAZA_SOULCORE_STACK_QUANTITY_DISPLAY,
    },
    ...registeringWorldPlazaInventoryBagItemDefinitions(),
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
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CRAFT_TOOL,
      quantity: 1,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TOOL,
      quantity: 1,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLAIM_TOOL,
      quantity: 1,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE,
      quantity: 1,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SWORD_WOOD,
      quantity: 1,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_HOE_WOOD,
      quantity: 1,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SCYTHE_WOOD,
      quantity: 1,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FISHROD_WOOD,
      quantity: 1,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WHEAT_SEED,
      quantity: 8,
    },
  ] as const;

/** Placeholder icon for future item types without art. */
export const DEFINING_WORLD_PLAZA_INVENTORY_PLACEHOLDER_ICON = Leaf;

/** Catalog icon for empty registry expansion. */
export const DEFINING_WORLD_PLAZA_INVENTORY_CATALOG_ICON = Package;
