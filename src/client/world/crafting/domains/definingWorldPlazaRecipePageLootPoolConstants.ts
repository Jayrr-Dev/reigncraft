/**
 * Leftover craft recipe pages not covered by Codex / lapidary / bestiary / starters.
 * Categorized for source-weighted world loot (chests, mining, kills, tree chops).
 *
 * @module components/world/crafting/domains/definingWorldPlazaRecipePageLootPoolConstants
 */

import {
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID,
  type DefiningWorldPlazaCraftModeRecipeId,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeToolRecipeIds';
import { DEFINING_WORLD_PLAZA_FARMING_FEATURE_ENABLED } from '@/components/world/farming/domains/definingWorldPlazaFarmingConstants';

/** Loot-pool category for leftover recipe pages. */
export type DefiningWorldPlazaRecipePageLootPoolCategory =
  | 'tools'
  | 'plateArmor'
  | 'survivalWear'
  | 'survivalMats'
  | 'specialtyWeapons';

/** World action that can roll a leftover recipe page. */
export type DefiningWorldPlazaRecipePageLootSource =
  | 'chest'
  | 'mining'
  | 'wildlifeKill'
  | 'treeChop';

/**
 * Hoe / scythe leftover pages. Only loot when farming crafts are registered;
 * otherwise drops become ghost `?` inventory slots.
 */
const DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_POOL_TOOLS_FARMING = [
  DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.HOE_STEEL,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.HOE_GOLD,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.SCYTHE_IRON,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.SCYTHE_STEEL,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.SCYTHE_GOLD,
] as const satisfies readonly DefiningWorldPlazaCraftModeRecipeId[];

/** Mid/late tools still missing from Codex / other grants. */
export const DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_POOL_TOOLS = [
  DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.AXE_GOLD,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.FISHROD_IRON,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.FISHROD_STEEL,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.FISHROD_GOLD,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.SWORD_GOLD,
  ...(DEFINING_WORLD_PLAZA_FARMING_FEATURE_ENABLED
    ? DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_POOL_TOOLS_FARMING
    : []),
] as const satisfies readonly DefiningWorldPlazaCraftModeRecipeId[];

/** Plate pieces not already granted (leather breastplate is on Lapidary Studied). */
export const DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_POOL_PLATE_ARMOR = [
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.LEATHER_PLATE_CASQUE,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.LEATHER_PLATE_GAUNTLETS,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.LEATHER_PLATE_GREAVES,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.LEATHER_PLATE_SABATONS,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.COPPER_PLATE_CASQUE,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.COPPER_PLATE_GAUNTLETS,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.COPPER_PLATE_BREASTPLATE,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.COPPER_PLATE_GREAVES,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.COPPER_PLATE_SABATONS,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.IRON_PLATE_CASQUE,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.IRON_PLATE_GAUNTLETS,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.IRON_PLATE_BREASTPLATE,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.IRON_PLATE_GREAVES,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.IRON_PLATE_SABATONS,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.STEEL_PLATE_CASQUE,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.STEEL_PLATE_GAUNTLETS,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.STEEL_PLATE_BREASTPLATE,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.STEEL_PLATE_GREAVES,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.STEEL_PLATE_SABATONS,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.GOLD_PLATE_CASQUE,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.GOLD_PLATE_GAUNTLETS,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.GOLD_PLATE_BREASTPLATE,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.GOLD_PLATE_GREAVES,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.GOLD_PLATE_SABATONS,
] as const satisfies readonly DefiningWorldPlazaCraftModeRecipeId[];

/** Trail wear still missing from Codex survival grants. */
export const DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_POOL_SURVIVAL_WEAR = [
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_WOOL_NECK_WRAP,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_FINGERLESS_WORK_MITTS,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_CLOTH_LEG_WRAPS,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_HIDE_TRAIL_BOOTS,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_FUR_SHOULDER_CAPE,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_PALM_LEAF_PONCHO,
] as const satisfies readonly DefiningWorldPlazaCraftModeRecipeId[];

/** Build mats still missing from Codex survival grants. */
export const DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_POOL_SURVIVAL_MATS = [
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_WATTLE_PANEL,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_ADOBE_BRICK,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_PEG_STAKE_PACK,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_REED_MAT,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_CLAY_DAUB_MIX,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_LASHING_TWINE_SPOOL,
] as const satisfies readonly DefiningWorldPlazaCraftModeRecipeId[];

/** Specialty weapons still missing from Codex. */
export const DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_POOL_SPECIALTY_WEAPONS = [
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.WEAPON_CHAOS_DIE,
] as const satisfies readonly DefiningWorldPlazaCraftModeRecipeId[];

/** Category → recipe ids. */
export const DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_POOL_BY_CATEGORY = {
  tools: DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_POOL_TOOLS,
  plateArmor: DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_POOL_PLATE_ARMOR,
  survivalWear: DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_POOL_SURVIVAL_WEAR,
  survivalMats: DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_POOL_SURVIVAL_MATS,
  specialtyWeapons:
    DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_POOL_SPECIALTY_WEAPONS,
} as const satisfies Record<
  DefiningWorldPlazaRecipePageLootPoolCategory,
  readonly DefiningWorldPlazaCraftModeRecipeId[]
>;

/**
 * Flat leftover pool (every page that can roll from world loot).
 * Keep in sync with category arrays above.
 */
export const DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_POOL_RECIPE_IDS = [
  ...DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_POOL_TOOLS,
  ...DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_POOL_PLATE_ARMOR,
  ...DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_POOL_SURVIVAL_WEAR,
  ...DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_POOL_SURVIVAL_MATS,
  ...DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_POOL_SPECIALTY_WEAPONS,
] as const satisfies readonly DefiningWorldPlazaCraftModeRecipeId[];

export type DefiningWorldPlazaRecipePageLootSourceConfig = {
  /** Chance in [0, 1] to attempt a recipe-page drop on this action. */
  readonly chance: number;
  /** Preferred categories; empty themed pool falls back to full leftover list. */
  readonly categories: readonly DefiningWorldPlazaRecipePageLootPoolCategory[];
};

/**
 * Small drop chances by source. Chests are rarer events so slightly higher odds.
 */
export const DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_SOURCE_CONFIG = {
  chest: {
    chance: 0.1,
    categories: [
      'tools',
      'plateArmor',
      'survivalWear',
      'survivalMats',
      'specialtyWeapons',
    ],
  },
  mining: {
    chance: 0.03,
    categories: ['tools', 'plateArmor'],
  },
  wildlifeKill: {
    chance: 0.04,
    categories: ['survivalWear', 'specialtyWeapons'],
  },
  treeChop: {
    chance: 0.03,
    categories: ['survivalMats', 'survivalWear'],
  },
} as const satisfies Record<
  DefiningWorldPlazaRecipePageLootSource,
  DefiningWorldPlazaRecipePageLootSourceConfig
>;
