import {
  creatingInventoryItemRegistry,
  type DefiningInventoryItemRegistry,
} from '@/components/inventory/domains/definingInventoryItemRegistry';
import { DEFINING_INVENTORY_UNLIMITED_STACK_SIZE } from '@/components/inventory/domains/definingInventoryStackConstants';
import { registeringWorldPlazaCraftRecipePageInventoryItems } from '@/components/world/crafting/domains/registeringWorldPlazaCraftRecipePageInventoryItems';
import { DEFINING_WORLD_PLAZA_TOOL_TIER_STATS } from '@/components/world/equipment/domains/definingWorldPlazaToolTierConstants';
import { registeringWorldPlazaFishingCatchInventoryItems } from '@/components/world/fishing/domains/registeringWorldPlazaFishingCatchInventoryItems';
import {
  DEFINING_WORLD_PLAZA_HUNGER_RESTORE_APPLE,
  DEFINING_WORLD_PLAZA_HUNGER_RESTORE_BERRIES,
  DEFINING_WORLD_PLAZA_HUNGER_RESTORE_COCONUT,
  DEFINING_WORLD_PLAZA_HUNGER_RESTORE_COOKED_COCONUT,
  DEFINING_WORLD_PLAZA_HUNGER_RESTORE_FISH,
  DEFINING_WORLD_PLAZA_HUNGER_RESTORE_WHEAT,
} from '@/components/world/hunger/domains/definingWorldPlazaHungerConstants';
import { resolvingWorldPlazaInventoryCoconutSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryCoconutSpriteSheetConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_AXE_MAX_DURABILITY,
  DEFINING_WORLD_PLAZA_INVENTORY_BUILD_TOOL_MAX_DURABILITY,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryDurabilityConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_BLUEPRINT_FLASH,
  DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_STEADY_GRIP,
  DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_TIMBER_WHISPER,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryEnchantmentTypeIds';
import { DEFINING_WORLD_PLAZA_INVENTORY_IRON_TUBE_SPRITE_SHEET_ICON } from '@/components/world/inventory/domains/definingWorldPlazaInventoryIronTubeSpriteSheetConstants';
import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_APPLE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BEAR_TRAP,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRIES,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CALTROPS,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COCONUT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COOKED_COCONUT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EXPEDITION_BAG,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FISH,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FISHROD_WOOD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLINT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_IRON_TUBE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PACK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_POUCH,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RUCKSACK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SATCHEL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SWORD_WOOD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TOOL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WHEAT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WHEAT_SEED,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { DEFINING_WORLD_PLAZA_WOOD_AXE_INVENTORY_ICON_URL } from '@/components/world/inventory/domains/definingWorldPlazaToolInventoryIconConstants';
import { registeringWorldPlazaInventoryApostleClayArmorItemDefinitions } from '@/components/world/inventory/domains/registeringWorldPlazaInventoryApostleClayArmorItemDefinitions';
import { registeringWorldPlazaInventoryBagItemDefinitions } from '@/components/world/inventory/domains/registeringWorldPlazaInventoryBagItemDefinitions';
import { registeringWorldPlazaInventoryBerryItemDefinitions } from '@/components/world/inventory/domains/registeringWorldPlazaInventoryBerryItemDefinitions';
import { registeringWorldPlazaInventoryBessemerArmorItemDefinitions } from '@/components/world/inventory/domains/registeringWorldPlazaInventoryBessemerArmorItemDefinitions';
import { registeringWorldPlazaInventoryCeramicsItemDefinitions } from '@/components/world/inventory/domains/registeringWorldPlazaInventoryCeramicsItemDefinitions';
import { registeringWorldPlazaInventoryChaosArmorItemDefinitions } from '@/components/world/inventory/domains/registeringWorldPlazaInventoryChaosArmorItemDefinitions';
import { registeringWorldPlazaInventoryChestKeyItemDefinitions } from '@/components/world/inventory/domains/registeringWorldPlazaInventoryChestKeyItemDefinitions';
import { registeringWorldPlazaInventoryCloverItemDefinitions } from '@/components/world/inventory/domains/registeringWorldPlazaInventoryCloverItemDefinitions';
import { registeringWorldPlazaInventoryCoffeeItemDefinitions } from '@/components/world/inventory/domains/registeringWorldPlazaInventoryCoffeeItemDefinitions';
import { registeringWorldPlazaInventoryCraftablePlateArmorItemDefinitions } from '@/components/world/inventory/domains/registeringWorldPlazaInventoryCraftablePlateArmorItemDefinitions';
import { registeringWorldPlazaInventoryFlowerItemDefinitions } from '@/components/world/inventory/domains/registeringWorldPlazaInventoryFlowerItemDefinitions';
import { registeringWorldPlazaInventoryForageItemDefinitions } from '@/components/world/inventory/domains/registeringWorldPlazaInventoryForageItemDefinitions';
import { registeringWorldPlazaInventoryGlassVeilArmorItemDefinitions } from '@/components/world/inventory/domains/registeringWorldPlazaInventoryGlassVeilArmorItemDefinitions';
import { registeringWorldPlazaInventoryHealerItemDefinitions } from '@/components/world/inventory/domains/registeringWorldPlazaInventoryHealerItemDefinitions';
import { registeringWorldPlazaInventoryIngotItemDefinitions } from '@/components/world/inventory/domains/registeringWorldPlazaInventoryIngotItemDefinitions';
import { registeringWorldPlazaInventoryOreItemDefinitions } from '@/components/world/inventory/domains/registeringWorldPlazaInventoryOreItemDefinitions';
import { registeringWorldPlazaInventorySiphonArmorItemDefinitions } from '@/components/world/inventory/domains/registeringWorldPlazaInventorySiphonArmorItemDefinitions';
import { registeringWorldPlazaInventorySurvivalItemDefinitions } from '@/components/world/inventory/domains/registeringWorldPlazaInventorySurvivalItemDefinitions';
import { registeringWorldPlazaInventoryTallGrassItemDefinitions } from '@/components/world/inventory/domains/registeringWorldPlazaInventoryTallGrassItemDefinitions';
import { registeringWorldPlazaInventoryWetClayItemDefinitions } from '@/components/world/inventory/domains/registeringWorldPlazaInventoryWetClayItemDefinitions';
import { registeringWorldPlazaSpecialtyWeaponInventoryItems } from '@/components/world/inventory/domains/registeringWorldPlazaSpecialtyWeaponInventoryItems';
import { registeringWorldPlazaSpritcoreTierItemDefinitions } from '@/components/world/inventory/domains/registeringWorldPlazaSpritcoreTierItemDefinitions';
import { registeringWorldPlazaTieredToolInventoryItems } from '@/components/world/inventory/domains/registeringWorldPlazaTieredToolInventoryItems';
import { registeringWorldPlazaWildlifeMeatInventoryItems } from '@/components/world/inventory/domains/registeringWorldPlazaWildlifeMeatInventoryItems';
import { registeringWorldPlazaWildlifeSpecialtyLootInventoryItems } from '@/components/world/inventory/domains/registeringWorldPlazaWildlifeSpecialtyLootInventoryItems';
import { resolvingWorldPlazaInventoryFoodHealDeclaration } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryFoodHealDeclaration';
import { registeringWorldPlazaMushroomInventoryItems } from '@/components/world/mushrooms/domains/registeringWorldPlazaMushroomInventoryItems';
import {
  DEFINING_WORLD_PLAZA_SPRITCORE_ITEM_NAME,
  DEFINING_WORLD_PLAZA_SPRITCORE_STACK_QUANTITY_DISPLAY,
} from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_SPRITCORE_SPRITE_SHEET_ICON } from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreSpriteSheetConstants';
import { DEFINING_WORLD_PLAZA_BEAR_TRAP_SPRITE_SHEET_URL } from '@/components/world/trap/domains/definingWorldPlazaBearTrapConstants';
import { DEFINING_WORLD_PLAZA_CALTROP_SPRITE_SHEET_URL } from '@/components/world/trap/domains/definingWorldPlazaCaltropConstants';
import { Leaf, Package } from 'lucide-react';

export {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_APPLE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRIES,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COCONUT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COOKED_COCONUT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EXPEDITION_BAG,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLINT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PACK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_POUCH,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RUCKSACK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SATCHEL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE,
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
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_IRON_TUBE,
      name: 'Iron Tube',
      rarity: 'uncommon',
      iconSpriteSheet:
        DEFINING_WORLD_PLAZA_INVENTORY_IRON_TUBE_SPRITE_SHEET_ICON,
      maxStack: 99,
      isDroppable: true,
      isStackable: true,
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BEAR_TRAP,
      name: 'Bear Trap',
      rarity: 'uncommon',
      maxStack: 5,
      isDroppable: true,
      isStackable: true,
      placesOnWorldGround: true,
      iconSpriteSheet: {
        spriteSheetUrl: DEFINING_WORLD_PLAZA_BEAR_TRAP_SPRITE_SHEET_URL,
        columnCount: 4,
        rowCount: 1,
        columnIndex: 0,
        rowIndex: 0,
      },
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CALTROPS,
      name: 'Caltrops',
      rarity: 'common',
      maxStack: 20,
      isDroppable: true,
      isStackable: true,
      placesOnWorldGround: true,
      iconSpriteSheet: {
        spriteSheetUrl: DEFINING_WORLD_PLAZA_CALTROP_SPRITE_SHEET_URL,
        columnCount: 2,
        rowCount: 1,
        columnIndex: 0,
        rowIndex: 0,
      },
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TOOL,
      name: 'Build Tool',
      rarity: 'common',
      iconifyIcon: 'mdi:hammer',
      maxStack: 1,
      isDroppable: true,
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
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE,
      name: 'Wood Axe',
      rarity: 'common',
      iconImageUrl: DEFINING_WORLD_PLAZA_WOOD_AXE_INVENTORY_ICON_URL,
      maxStack: 1,
      isDroppable: true,
      isStackable: false,
      equipment: {
        toolKinds: ['axe'],
        harvestSpeedMultiplier:
          DEFINING_WORLD_PLAZA_TOOL_TIER_STATS.wood.harvestSpeedMultiplier,
        heldItemVisualId: 'axe',
        heldItemTier: 'wood',
        attackEvModifier: {
          mode: 'multiplicative',
          value:
            DEFINING_WORLD_PLAZA_TOOL_TIER_STATS.wood.meleeDamageMultiplier,
        },
        meleeDamageMultiplier:
          DEFINING_WORLD_PLAZA_TOOL_TIER_STATS.wood.meleeDamageMultiplier,
        meleeFlatDamage:
          DEFINING_WORLD_PLAZA_TOOL_TIER_STATS.wood.meleeFlatDamage,
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
        healthHeal: { baseFlat: 0, percentOfMax: 0 },
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
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COCONUT,
      name: 'Coconut',
      rarity: 'common',
      iconEmoji: '🥥',
      iconSpriteSheet:
        resolvingWorldPlazaInventoryCoconutSpriteSheetIcon(
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COCONUT
        ) ?? undefined,
      maxStack: 99,
      isDroppable: true,
      isStackable: true,
      food: {
        hungerRestoreRatio: DEFINING_WORLD_PLAZA_HUNGER_RESTORE_COCONUT,
        healthHeal: resolvingWorldPlazaInventoryFoodHealDeclaration({
          hungerRestoreRatio: DEFINING_WORLD_PLAZA_HUNGER_RESTORE_COCONUT,
        }),
      },
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COOKED_COCONUT,
      name: 'Cooked Coconut',
      rarity: 'uncommon',
      iconEmoji: '🥥',
      iconSpriteSheet:
        resolvingWorldPlazaInventoryCoconutSpriteSheetIcon(
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COOKED_COCONUT
        ) ?? undefined,
      maxStack: 99,
      isDroppable: true,
      isStackable: true,
      food: {
        hungerRestoreRatio: DEFINING_WORLD_PLAZA_HUNGER_RESTORE_COOKED_COCONUT,
        healthHeal: resolvingWorldPlazaInventoryFoodHealDeclaration({
          hungerRestoreRatio:
            DEFINING_WORLD_PLAZA_HUNGER_RESTORE_COOKED_COCONUT,
        }),
      },
    },
    ...registeringWorldPlazaWildlifeMeatInventoryItems(),
    ...registeringWorldPlazaWildlifeSpecialtyLootInventoryItems(),
    ...registeringWorldPlazaInventoryFlowerItemDefinitions(),
    ...registeringWorldPlazaInventoryCloverItemDefinitions(),
    ...registeringWorldPlazaInventoryTallGrassItemDefinitions(),
    ...registeringWorldPlazaInventoryChestKeyItemDefinitions(),
    ...registeringWorldPlazaInventoryBerryItemDefinitions(),
    ...registeringWorldPlazaInventoryForageItemDefinitions(),
    ...registeringWorldPlazaMushroomInventoryItems(),
    ...registeringWorldPlazaFishingCatchInventoryItems(),
    ...registeringWorldPlazaInventoryCoffeeItemDefinitions(),
    ...registeringWorldPlazaInventoryCeramicsItemDefinitions(),
    ...registeringWorldPlazaInventoryHealerItemDefinitions(),
    ...registeringWorldPlazaInventorySurvivalItemDefinitions(),
    ...registeringWorldPlazaInventoryChaosArmorItemDefinitions(),
    ...registeringWorldPlazaInventoryBessemerArmorItemDefinitions(),
    ...registeringWorldPlazaInventoryGlassVeilArmorItemDefinitions(),
    ...registeringWorldPlazaInventorySiphonArmorItemDefinitions(),
    ...registeringWorldPlazaInventoryCraftablePlateArmorItemDefinitions(),
    ...registeringWorldPlazaInventoryApostleClayArmorItemDefinitions(),
    ...registeringWorldPlazaSpecialtyWeaponInventoryItems(),
    ...registeringWorldPlazaInventoryOreItemDefinitions(),
    ...registeringWorldPlazaInventoryWetClayItemDefinitions(),
    ...registeringWorldPlazaInventoryIngotItemDefinitions(),
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
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE,
      name: DEFINING_WORLD_PLAZA_SPRITCORE_ITEM_NAME,
      rarity: 'legendary',
      iconSpriteSheet:
        DEFINING_WORLD_PLAZA_INVENTORY_SPRITCORE_SPRITE_SHEET_ICON,
      maxStack: DEFINING_INVENTORY_UNLIMITED_STACK_SIZE,
      isDroppable: false,
      isStackable: true,
      stackQuantityDisplay:
        DEFINING_WORLD_PLAZA_SPRITCORE_STACK_QUANTITY_DISPLAY,
    },
    ...registeringWorldPlazaSpritcoreTierItemDefinitions(),
    ...registeringWorldPlazaInventoryBagItemDefinitions(),
    ...registeringWorldPlazaCraftRecipePageInventoryItems(),
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
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SWORD_WOOD,
      quantity: 1,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FISHROD_WOOD,
      quantity: 1,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BEAR_TRAP,
      quantity: 2,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CALTROPS,
      quantity: 6,
    },
  ] as const;

/** Placeholder icon for future item types without art. */
export const DEFINING_WORLD_PLAZA_INVENTORY_PLACEHOLDER_ICON = Leaf;

/** Catalog icon for empty registry expansion. */
export const DEFINING_WORLD_PLAZA_INVENTORY_CATALOG_ICON = Package;
