import {
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_KILN,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_STOVE,
} from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_BOTTLE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_CUP,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_TEAPOT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_COPPER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_GOLD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_LEAD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_SILVER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_MERCURY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COAL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COPPER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_GOLD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_IRON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_LEAD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SCARLET,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SILVER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_BOTTLE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_CUP,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_TEAPOT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

/**
 * Default smelt duration when a recipe omits `durationMs` (should not happen
 * for registry rows; kept as a safe fallback).
 */
export const DEFINING_WORLD_PLAZA_ORE_SMELTING_DURATION_MS = 4_000;

/** Placed utility definitions that accept ore and fuel. */
export const DEFINING_WORLD_PLAZA_ORE_SMELTING_STATION_BLOCK_DEFINITION_IDS = [
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_KILN,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_STOVE,
] as const;

/** Fuel item types accepted by every smelting station. */
export const DEFINING_WORLD_PLAZA_ORE_SMELTING_FUEL_ITEM_TYPE_IDS = [
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COAL,
] as const;

/**
 * Inventory units consumed per smelt by fuel type at multiplier 1.
 * Coal is the baseline (1). Wood is 3× less efficient (needs 3).
 */
export const DEFINING_WORLD_PLAZA_ORE_SMELTING_FUEL_UNITS_COST_BY_ITEM_TYPE_ID =
  {
    [DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COAL]: 1,
    [DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD]: 3,
  } as const satisfies Record<
    (typeof DEFINING_WORLD_PLAZA_ORE_SMELTING_FUEL_ITEM_TYPE_IDS)[number],
    number
  >;

export type DefiningWorldPlazaOreSmeltingRecipe = {
  readonly inputItemTypeId: string;
  readonly outputItemTypeId: string;
  readonly outputDisplayName: string;
  /** Real-time milliseconds for one input unit. */
  readonly durationMs: number;
  /**
   * Multiplies baseline fuel units (coal=1, wood=3). Harder ores burn more.
   */
  readonly fuelCostMultiplier: number;
  /**
   * When set, only these station block definition ids may run the recipe.
   * Omit for every bloomery / kiln / stove.
   */
  readonly allowedStationBlockDefinitionIds?: readonly string[];
};

/** One-to-one ore refinement + kiln-only ceramics firing recipes. */
export const DEFINING_WORLD_PLAZA_ORE_SMELTING_RECIPE_REGISTRY = [
  {
    inputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COPPER,
    outputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_COPPER,
    outputDisplayName: 'Copper ingot',
    durationMs: 4_000,
    fuelCostMultiplier: 1,
  },
  {
    inputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_LEAD,
    outputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_LEAD,
    outputDisplayName: 'Lead ingot',
    durationMs: 4_500,
    fuelCostMultiplier: 1,
  },
  {
    inputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_IRON,
    outputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
    outputDisplayName: 'Iron ingot',
    durationMs: 6_000,
    fuelCostMultiplier: 2,
  },
  {
    inputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SILVER,
    outputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_SILVER,
    outputDisplayName: 'Silver ingot',
    durationMs: 7_000,
    fuelCostMultiplier: 2,
  },
  {
    inputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_GOLD,
    outputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_GOLD,
    outputDisplayName: 'Gold ingot',
    durationMs: 8_000,
    fuelCostMultiplier: 2,
  },
  {
    inputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SCARLET,
    outputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_MERCURY,
    outputDisplayName: 'Mercury',
    durationMs: 10_000,
    fuelCostMultiplier: 3,
  },
  {
    inputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_CUP,
    outputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_CUP,
    outputDisplayName: 'Empty Clay Cup',
    durationMs: 5_000,
    fuelCostMultiplier: 1,
    allowedStationBlockDefinitionIds: [
      DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_KILN,
    ],
  },
  {
    inputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_TEAPOT,
    outputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_TEAPOT,
    outputDisplayName: 'Empty Clay Tea Pot',
    durationMs: 7_000,
    fuelCostMultiplier: 2,
    allowedStationBlockDefinitionIds: [
      DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_KILN,
    ],
  },
  {
    inputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_BOTTLE,
    outputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_BOTTLE,
    outputDisplayName: 'Empty Clay Bottle',
    durationMs: 6_000,
    fuelCostMultiplier: 1,
    allowedStationBlockDefinitionIds: [
      DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_KILN,
    ],
  },
] as const satisfies readonly DefiningWorldPlazaOreSmeltingRecipe[];

/**
 * Resolves a smelting / firing recipe for an input item.
 * Pass `stationBlockDefinitionId` to enforce kiln-only ceramics (and similar).
 */
export function resolvingWorldPlazaOreSmeltingRecipe(
  inputItemTypeId: string,
  stationBlockDefinitionId?: string
): DefiningWorldPlazaOreSmeltingRecipe | null {
  const recipeEntry = DEFINING_WORLD_PLAZA_ORE_SMELTING_RECIPE_REGISTRY.find(
    (candidate) => candidate.inputItemTypeId === inputItemTypeId
  );

  if (!recipeEntry) {
    return null;
  }

  const recipe: DefiningWorldPlazaOreSmeltingRecipe = recipeEntry;

  if (stationBlockDefinitionId === undefined) {
    return recipe;
  }

  const allowedStationIds = recipe.allowedStationBlockDefinitionIds;

  if (!allowedStationIds || allowedStationIds.length === 0) {
    return recipe;
  }

  return allowedStationIds.includes(stationBlockDefinitionId) ? recipe : null;
}

export function checkingWorldPlazaOreSmeltingFuelItemTypeId(
  itemTypeId: string
): boolean {
  return DEFINING_WORLD_PLAZA_ORE_SMELTING_FUEL_ITEM_TYPE_IDS.some(
    (fuelItemTypeId) => fuelItemTypeId === itemTypeId
  );
}

/** Baseline inventory units of this fuel for one smelt at multiplier 1. */
export function resolvingWorldPlazaOreSmeltingFuelUnitsCost(
  itemTypeId: string
): number | null {
  for (const fuelItemTypeId of DEFINING_WORLD_PLAZA_ORE_SMELTING_FUEL_ITEM_TYPE_IDS) {
    if (fuelItemTypeId === itemTypeId) {
      return DEFINING_WORLD_PLAZA_ORE_SMELTING_FUEL_UNITS_COST_BY_ITEM_TYPE_ID[
        fuelItemTypeId
      ];
    }
  }

  return null;
}

/**
 * Fuel units needed for one recipe unit with the given fuel type.
 * `null` when the item is not accepted fuel.
 */
export function resolvingWorldPlazaOreSmeltingFuelUnitsCostForRecipe(
  fuelItemTypeId: string,
  recipe: DefiningWorldPlazaOreSmeltingRecipe
): number | null {
  const baselineCost =
    resolvingWorldPlazaOreSmeltingFuelUnitsCost(fuelItemTypeId);

  if (baselineCost === null) {
    return null;
  }

  return baselineCost * recipe.fuelCostMultiplier;
}

export function checkingWorldPlazaOreSmeltingStationBlockDefinitionId(
  definitionId: string
): boolean {
  return DEFINING_WORLD_PLAZA_ORE_SMELTING_STATION_BLOCK_DEFINITION_IDS.some(
    (stationDefinitionId) => stationDefinitionId === definitionId
  );
}
