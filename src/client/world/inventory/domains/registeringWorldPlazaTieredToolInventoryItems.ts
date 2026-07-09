/**
 * Tiered sword, axe, pickaxe, hoe, scythe, and fishrod inventory rows.
 *
 * @module components/world/inventory/domains/registeringWorldPlazaTieredToolInventoryItems
 */

import {
  DEFINING_WORLD_PLAZA_HELD_ITEM_TIERS,
  type DefiningWorldPlazaHeldItemTier,
  type DefiningWorldPlazaHeldItemVisualId,
} from '@/components/world/equipment/domains/definingWorldPlazaHeldItemTypes';
import { DEFINING_WORLD_PLAZA_TOOL_TIER_STATS } from '@/components/world/equipment/domains/definingWorldPlazaToolTierConstants';
import type { DefiningWorldPlazaInventoryItemRarity } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';
import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE_GOLD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE_IRON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE_STEEL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FISHROD_GOLD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FISHROD_IRON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FISHROD_STEEL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FISHROD_WOOD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_HOE_GOLD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_HOE_IRON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_HOE_STEEL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_HOE_WOOD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PICKAXE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PICKAXE_GOLD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PICKAXE_IRON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PICKAXE_STEEL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SCYTHE_GOLD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SCYTHE_IRON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SCYTHE_STEEL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SCYTHE_WOOD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SWORD_GOLD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SWORD_IRON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SWORD_STEEL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SWORD_WOOD,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

type DefiningWorldPlazaTieredToolFamily = {
  readonly visualId: DefiningWorldPlazaHeldItemVisualId;
  readonly toolKind: 'sword' | 'axe' | 'pickaxe' | 'hoe' | 'scythe' | 'fishrod';
  readonly displayBaseName: string;
  readonly iconifyIcon: string;
  readonly typeIdByTier: Record<DefiningWorldPlazaHeldItemTier, string>;
};

const DEFINING_WORLD_PLAZA_TIERED_TOOL_FAMILIES: readonly DefiningWorldPlazaTieredToolFamily[] =
  [
    {
      visualId: 'sword',
      toolKind: 'sword',
      displayBaseName: 'Sword',
      iconifyIcon: 'game-icons:broadsword',
      typeIdByTier: {
        wood: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SWORD_WOOD,
        iron: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SWORD_IRON,
        steel: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SWORD_STEEL,
        gold: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SWORD_GOLD,
      },
    },
    {
      visualId: 'axe',
      toolKind: 'axe',
      displayBaseName: 'Axe',
      iconifyIcon: 'game-icons:wood-axe',
      typeIdByTier: {
        wood: 'world-plaza-axe',
        iron: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE_IRON,
        steel: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE_STEEL,
        gold: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE_GOLD,
      },
    },
    {
      // Temporary: reuse axe sheet until pickaxes.png exists (overlay disabled).
      visualId: 'axe',
      toolKind: 'pickaxe',
      displayBaseName: 'Pickaxe',
      iconifyIcon: 'game-icons:stone-pile',
      typeIdByTier: {
        wood: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PICKAXE,
        iron: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PICKAXE_IRON,
        steel: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PICKAXE_STEEL,
        gold: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PICKAXE_GOLD,
      },
    },
    {
      visualId: 'hoe',
      toolKind: 'hoe',
      displayBaseName: 'Hoe',
      iconifyIcon: 'game-icons:trowel',
      typeIdByTier: {
        wood: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_HOE_WOOD,
        iron: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_HOE_IRON,
        steel: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_HOE_STEEL,
        gold: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_HOE_GOLD,
      },
    },
    {
      visualId: 'scythe',
      toolKind: 'scythe',
      displayBaseName: 'Scythe',
      iconifyIcon: 'game-icons:scythe',
      typeIdByTier: {
        wood: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SCYTHE_WOOD,
        iron: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SCYTHE_IRON,
        steel: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SCYTHE_STEEL,
        gold: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SCYTHE_GOLD,
      },
    },
    {
      visualId: 'fishrod',
      toolKind: 'fishrod',
      displayBaseName: 'Fishing Rod',
      iconifyIcon: 'mdi:fishing',
      typeIdByTier: {
        wood: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FISHROD_WOOD,
        iron: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FISHROD_IRON,
        steel: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FISHROD_STEEL,
        gold: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FISHROD_GOLD,
      },
    },
  ];

const DEFINING_WORLD_PLAZA_TIERED_TOOL_RARITY_BY_TIER: Readonly<
  Record<DefiningWorldPlazaHeldItemTier, DefiningWorldPlazaInventoryItemRarity>
> = {
  wood: 'common',
  iron: 'uncommon',
  steel: 'rare',
  gold: 'epic',
};

function buildingTieredToolInventoryItem(
  family: DefiningWorldPlazaTieredToolFamily,
  tier: DefiningWorldPlazaHeldItemTier
): DefiningWorldPlazaInventoryItemTypeDefinition {
  const tierStats = DEFINING_WORLD_PLAZA_TOOL_TIER_STATS[tier];

  return {
    typeId: family.typeIdByTier[tier],
    name: `${tierStats.displayNameSuffix} ${family.displayBaseName}`,
    rarity: DEFINING_WORLD_PLAZA_TIERED_TOOL_RARITY_BY_TIER[tier],
    iconifyIcon: family.iconifyIcon,
    maxStack: 1,
    isDroppable: true,
    isStackable: false,
    equipment: {
      toolKinds: [family.toolKind],
      harvestSpeedMultiplier: tierStats.harvestSpeedMultiplier,
      heldItemVisualId: family.visualId,
      heldItemTier: tier,
      ...(family.toolKind === 'sword'
        ? {
            attackEvModifier: {
              mode: 'multiplicative' as const,
              value: tierStats.meleeDamageMultiplier,
            },
            meleeDamageMultiplier: tierStats.meleeDamageMultiplier,
          }
        : {}),
    },
    durability: {
      max: tierStats.maxDurability,
      breakChanceAtZero:
        family.toolKind === 'axe' || family.toolKind === 'pickaxe' ? 0.15 : 0.1,
    },
  };
}

/**
 * Registers every tier row except the legacy wood axe id (`world-plaza-axe`).
 * Wood pickaxe (`world-plaza-pickaxe`) is registered here (all four tiers).
 */
export function registeringWorldPlazaTieredToolInventoryItems(): readonly DefiningWorldPlazaInventoryItemTypeDefinition[] {
  const definitions: DefiningWorldPlazaInventoryItemTypeDefinition[] = [];

  for (const family of DEFINING_WORLD_PLAZA_TIERED_TOOL_FAMILIES) {
    for (const tier of DEFINING_WORLD_PLAZA_HELD_ITEM_TIERS) {
      if (family.typeIdByTier[tier] === 'world-plaza-axe') {
        continue;
      }

      definitions.push(buildingTieredToolInventoryItem(family, tier));
    }
  }

  return definitions;
}
