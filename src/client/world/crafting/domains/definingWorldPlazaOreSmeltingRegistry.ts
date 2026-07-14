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

/** Milliseconds required for one ore / ware unit to finish smelting or firing. */
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
 * Inventory units consumed per smelt by fuel type.
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
  /**
   * When set, only these station block definition ids may run the recipe.
   * Omit for every bloomery / kiln / stove.
   */
  readonly allowedStationBlockDefinitionIds?: readonly string[];
};

/** One-to-one ore refinement + kiln-only ceramics firing recipes. */
export const DEFINING_WORLD_PLAZA_ORE_SMELTING_RECIPE_REGISTRY = [
  {
    inputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_IRON,
    outputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
    outputDisplayName: 'Iron ingot',
  },
  {
    inputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COPPER,
    outputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_COPPER,
    outputDisplayName: 'Copper ingot',
  },
  {
    inputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SILVER,
    outputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_SILVER,
    outputDisplayName: 'Silver ingot',
  },
  {
    inputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_GOLD,
    outputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_GOLD,
    outputDisplayName: 'Gold ingot',
  },
  {
    inputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_LEAD,
    outputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_LEAD,
    outputDisplayName: 'Lead ingot',
  },
  {
    inputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SCARLET,
    outputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_MERCURY,
    outputDisplayName: 'Mercury',
  },
  {
    inputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_CUP,
    outputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_CUP,
    outputDisplayName: 'Empty Clay Cup',
    allowedStationBlockDefinitionIds: [
      DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_KILN,
    ],
  },
  {
    inputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_TEAPOT,
    outputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_TEAPOT,
    outputDisplayName: 'Empty Clay Tea Pot',
    allowedStationBlockDefinitionIds: [
      DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_KILN,
    ],
  },
  {
    inputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_BOTTLE,
    outputItemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_BOTTLE,
    outputDisplayName: 'Empty Clay Bottle',
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
  const recipe =
    DEFINING_WORLD_PLAZA_ORE_SMELTING_RECIPE_REGISTRY.find(
      (candidate) => candidate.inputItemTypeId === inputItemTypeId
    ) ?? null;

  if (!recipe) {
    return null;
  }

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

/** Inventory units of this fuel needed for one smelt, or null if not fuel. */
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

export function checkingWorldPlazaOreSmeltingStationBlockDefinitionId(
  definitionId: string
): boolean {
  return DEFINING_WORLD_PLAZA_ORE_SMELTING_STATION_BLOCK_DEFINITION_IDS.some(
    (stationDefinitionId) => stationDefinitionId === definitionId
  );
}
