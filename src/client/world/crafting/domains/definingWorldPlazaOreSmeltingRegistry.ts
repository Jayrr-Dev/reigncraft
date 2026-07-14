import {
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_KILN,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_STOVE,
} from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import {
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
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

/** Milliseconds required for one ore unit to finish smelting. */
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

export type DefiningWorldPlazaOreSmeltingRecipe = {
  readonly inputItemTypeId: string;
  readonly outputItemTypeId: string;
  readonly outputDisplayName: string;
};

/** One-to-one ore refinement recipes shared by all smelting stations. */
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
] as const satisfies readonly DefiningWorldPlazaOreSmeltingRecipe[];

export function resolvingWorldPlazaOreSmeltingRecipe(
  inputItemTypeId: string
): DefiningWorldPlazaOreSmeltingRecipe | null {
  return (
    DEFINING_WORLD_PLAZA_ORE_SMELTING_RECIPE_REGISTRY.find(
      (recipe) => recipe.inputItemTypeId === inputItemTypeId
    ) ?? null
  );
}

export function checkingWorldPlazaOreSmeltingFuelItemTypeId(
  itemTypeId: string
): boolean {
  return DEFINING_WORLD_PLAZA_ORE_SMELTING_FUEL_ITEM_TYPE_IDS.some(
    (fuelItemTypeId) => fuelItemTypeId === itemTypeId
  );
}

export function checkingWorldPlazaOreSmeltingStationBlockDefinitionId(
  definitionId: string
): boolean {
  return DEFINING_WORLD_PLAZA_ORE_SMELTING_STATION_BLOCK_DEFINITION_IDS.some(
    (stationDefinitionId) => stationDefinitionId === definitionId
  );
}
