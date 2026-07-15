/**
 * Declarative cost + family tables for blacksmith tiered-tool recipes.
 *
 * @module components/world/crafting/domains/definingWorldPlazaCraftModeToolRecipeConstants
 */

import { DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeToolRecipeIds';
import type { DefiningWorldPlazaHeldItemTier } from '@/components/world/equipment/domains/definingWorldPlazaHeldItemTypes';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE,
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
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_GOLD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_STEEL,
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

export type DefiningWorldPlazaCraftModeToolRecipeFamily =
  | 'sword'
  | 'axe'
  | 'pickaxe'
  | 'hoe'
  | 'scythe'
  | 'fishrod';

/** Ordered tool families for cookbook pager layout. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_FAMILIES = [
  'sword',
  'axe',
  'pickaxe',
  'hoe',
  'scythe',
  'fishrod',
] as const satisfies readonly DefiningWorldPlazaCraftModeToolRecipeFamily[];

/** Ordered material tiers for tool recipes. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_TIERS = [
  'wood',
  'iron',
  'steel',
  'gold',
] as const satisfies readonly DefiningWorldPlazaHeldItemTier[];

export type DefiningWorldPlazaCraftModeToolRecipeTierCost = {
  readonly woodQuantity: number;
  readonly stoneQuantity: number;
  readonly ingotQuantity: number;
  readonly complexity: number;
  /** Metal tools need an anvil; wood replacements do not. */
  readonly requiresAnvil: boolean;
};

/** Base material cost before family deltas. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_TIER_COST: Record<
  DefiningWorldPlazaHeldItemTier,
  DefiningWorldPlazaCraftModeToolRecipeTierCost
> = {
  wood: {
    woodQuantity: 6,
    stoneQuantity: 2,
    ingotQuantity: 0,
    complexity: 2,
    requiresAnvil: false,
  },
  iron: {
    woodQuantity: 2,
    stoneQuantity: 0,
    ingotQuantity: 4,
    complexity: 4,
    requiresAnvil: true,
  },
  steel: {
    woodQuantity: 2,
    stoneQuantity: 0,
    ingotQuantity: 5,
    complexity: 6,
    requiresAnvil: true,
  },
  gold: {
    woodQuantity: 2,
    stoneQuantity: 0,
    ingotQuantity: 4,
    complexity: 5,
    requiresAnvil: true,
  },
};

export type DefiningWorldPlazaCraftModeToolRecipeFamilyDelta = {
  readonly woodDelta: number;
  readonly stoneDelta: number;
  readonly ingotDelta: number;
};

/** Per-family tweaks on top of tier base cost. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_FAMILY_DELTA: Record<
  DefiningWorldPlazaCraftModeToolRecipeFamily,
  DefiningWorldPlazaCraftModeToolRecipeFamilyDelta
> = {
  sword: { woodDelta: 0, stoneDelta: 0, ingotDelta: 1 },
  axe: { woodDelta: 0, stoneDelta: 0, ingotDelta: 0 },
  pickaxe: { woodDelta: 0, stoneDelta: 0, ingotDelta: 0 },
  hoe: { woodDelta: 0, stoneDelta: 0, ingotDelta: -1 },
  scythe: { woodDelta: 0, stoneDelta: 0, ingotDelta: 0 },
  fishrod: { woodDelta: 3, stoneDelta: -2, ingotDelta: -2 },
};

export type DefiningWorldPlazaCraftModeToolRecipeFamilySpec = {
  readonly family: DefiningWorldPlazaCraftModeToolRecipeFamily;
  readonly displayBaseName: string;
  readonly iconifyIcon: string;
  readonly typeIdByTier: Record<DefiningWorldPlazaHeldItemTier, string>;
  readonly recipeIdByTier: Record<
    DefiningWorldPlazaHeldItemTier,
    (typeof DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID)[keyof typeof DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID]
  >;
  readonly descriptionByTier: Record<DefiningWorldPlazaHeldItemTier, string>;
};

/** One row per tool family: outcome ids, recipe ids, copy, and emblem. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_FAMILY_SPECS = [
  {
    family: 'sword',
    displayBaseName: 'Sword',
    iconifyIcon: 'game-icons:broadsword',
    typeIdByTier: {
      wood: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SWORD_WOOD,
      iron: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SWORD_IRON,
      steel: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SWORD_STEEL,
      gold: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SWORD_GOLD,
    },
    recipeIdByTier: {
      wood: DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.SWORD_WOOD,
      iron: DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.SWORD_IRON,
      steel: DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.SWORD_STEEL,
      gold: DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.SWORD_GOLD,
    },
    descriptionByTier: {
      wood: 'A rough wood blade for early scrapes. Carve a spare when the last one splinters.',
      iron: 'Forge an iron blade and bind it to a wood grip at an anvil.',
      steel:
        'Harder steel edge for real fights. Needs steel ingots and an anvil.',
      gold: 'A gold blade with soft shine and sharp greed. Hammer it at an anvil.',
    },
  },
  {
    family: 'axe',
    displayBaseName: 'Axe',
    iconifyIcon: 'game-icons:wood-axe',
    typeIdByTier: {
      wood: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE,
      iron: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE_IRON,
      steel: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE_STEEL,
      gold: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE_GOLD,
    },
    recipeIdByTier: {
      wood: DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.AXE_WOOD,
      iron: DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.AXE_IRON,
      steel: DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.AXE_STEEL,
      gold: DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.AXE_GOLD,
    },
    descriptionByTier: {
      wood: 'Wood head and haft. Replace a worn starter axe without standing at a forge.',
      iron: 'Iron chopping head on a wood haft. Shape it at an anvil.',
      steel: 'Steel head for faster fells. Needs steel ingots and an anvil.',
      gold: 'Gold head that bites deep when luck holds. Hammer it at an anvil.',
    },
  },
  {
    family: 'pickaxe',
    displayBaseName: 'Pickaxe',
    iconifyIcon: 'game-icons:war-pick',
    typeIdByTier: {
      wood: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PICKAXE,
      iron: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PICKAXE_IRON,
      steel: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PICKAXE_STEEL,
      gold: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PICKAXE_GOLD,
    },
    recipeIdByTier: {
      wood: DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.PICKAXE_WOOD,
      iron: DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.PICKAXE_IRON,
      steel: DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.PICKAXE_STEEL,
      gold: DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.PICKAXE_GOLD,
    },
    descriptionByTier: {
      wood: 'Stone tip on wood. Enough to break soft rock when the starter pick dies.',
      iron: 'Iron pick head for honest mining. Forge it at an anvil.',
      steel:
        'Steel tip that clears more rock per swing. Needs steel and an anvil.',
      gold: 'Gold pick with hungry yield swings. Hammer it at an anvil.',
    },
  },
  {
    family: 'hoe',
    displayBaseName: 'Hoe',
    iconifyIcon: 'game-icons:trowel',
    typeIdByTier: {
      wood: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_HOE_WOOD,
      iron: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_HOE_IRON,
      steel: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_HOE_STEEL,
      gold: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_HOE_GOLD,
    },
    recipeIdByTier: {
      wood: DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.HOE_WOOD,
      iron: DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.HOE_IRON,
      steel: DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.HOE_STEEL,
      gold: DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.HOE_GOLD,
    },
    descriptionByTier: {
      wood: 'A light wood hoe for turning soil. Cheap to remake when it cracks.',
      iron: 'Iron blade for tilling. Shape the head at an anvil.',
      steel: 'Steel hoe that holds an edge longer. Needs steel and an anvil.',
      gold: 'Gold hoe for show and speed. Hammer it at an anvil.',
    },
  },
  {
    family: 'scythe',
    displayBaseName: 'Scythe',
    iconifyIcon: 'game-icons:scythe',
    typeIdByTier: {
      wood: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SCYTHE_WOOD,
      iron: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SCYTHE_IRON,
      steel: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SCYTHE_STEEL,
      gold: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SCYTHE_GOLD,
    },
    recipeIdByTier: {
      wood: DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.SCYTHE_WOOD,
      iron: DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.SCYTHE_IRON,
      steel: DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.SCYTHE_STEEL,
      gold: DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.SCYTHE_GOLD,
    },
    descriptionByTier: {
      wood: 'Curved wood blade for cutting crops and brush. Remake it from scrap wood.',
      iron: 'Iron crescent for harvest work. Forge the blade at an anvil.',
      steel: 'Steel scythe that shears faster. Needs steel and an anvil.',
      gold: 'Gold scythe with a bright arc. Hammer it at an anvil.',
    },
  },
  {
    family: 'fishrod',
    displayBaseName: 'Fishing Rod',
    iconifyIcon: 'mdi:fishing',
    typeIdByTier: {
      wood: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FISHROD_WOOD,
      iron: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FISHROD_IRON,
      steel: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FISHROD_STEEL,
      gold: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FISHROD_GOLD,
    },
    recipeIdByTier: {
      wood: DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.FISHROD_WOOD,
      iron: DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.FISHROD_IRON,
      steel: DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.FISHROD_STEEL,
      gold: DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.FISHROD_GOLD,
    },
    descriptionByTier: {
      wood: 'A plain wood rod and line. Rebuild it from wood when the tip snaps.',
      iron: 'Iron fittings on a wood blank. Fit them at an anvil.',
      steel: 'Steel guides for a stronger cast. Needs steel and an anvil.',
      gold: 'Gold-trimmed rod for patient anglers. Hammer the fittings at an anvil.',
    },
  },
] as const satisfies readonly DefiningWorldPlazaCraftModeToolRecipeFamilySpec[];

/** Ingot item type for metal tool tiers. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_INGOT_BY_TIER: Partial<
  Record<DefiningWorldPlazaHeldItemTier, string>
> = {
  iron: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
  steel: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_STEEL,
  gold: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_GOLD,
};
