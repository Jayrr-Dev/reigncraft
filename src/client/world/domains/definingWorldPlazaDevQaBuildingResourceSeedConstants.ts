/**
 * Declarative Creative-load inventory groups for Materials palette resources.
 * Seed order = storage order (basics → ores → ingots → flowers → survival mats).
 *
 * @module components/world/domains/definingWorldPlazaDevQaBuildingResourceSeedConstants
 */

import { DEFINING_WORLD_PLAZA_FLOWER_DYE_SPECIES_ORDER } from '@/components/world/building/domains/definingWorldPlazaFlowerDyeConstants';
import type { DefiningWorldPlazaIngotWallMetalId } from '@/components/world/building/domains/definingWorldPlazaIngotWallSurfaceRegistry';
import { DEFINING_WORLD_PLAZA_INGOT_WALL_SURFACE_REGISTRY } from '@/components/world/building/domains/definingWorldPlazaIngotWallSurfaceRegistry';
import { DEFINING_WORLD_PLAZA_FLOWER_SPECIES_TO_ITEM_TYPE_ID } from '@/components/world/inventory/domains/definingWorldPlazaInventoryFlowerSpriteSheetConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_COPPER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_GOLD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_LEAD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_SILVER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_STEEL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SURVIVAL_ADOBE_BRICK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SURVIVAL_CLAY_DAUB_MIX,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SURVIVAL_LASHING_TWINE_SPOOL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SURVIVAL_PEG_STAKE_PACK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SURVIVAL_REED_MAT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SURVIVAL_ROPE_COIL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SURVIVAL_SPLIT_PLANKS,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SURVIVAL_WATTLE_PANEL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
  DEFINING_WORLD_PLAZA_INVENTORY_ORE_ITEM_TYPE_IDS,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

/** One labeled Creative seed group (flat inventory fill order). */
export type DefiningWorldPlazaDevQaBuildingResourceSeedGroup = {
  readonly groupId: string;
  readonly label: string;
  readonly itemTypeIds: readonly string[];
};

const DEFINING_WORLD_PLAZA_DEV_QA_INGOT_ITEM_TYPE_ID_BY_METAL_ID: Record<
  DefiningWorldPlazaIngotWallMetalId,
  string
> = {
  iron: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
  copper: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_COPPER,
  silver: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_SILVER,
  gold: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_GOLD,
  lead: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_LEAD,
  steel: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_STEEL,
};

const DEFINING_WORLD_PLAZA_DEV_QA_INGOT_ITEM_TYPE_IDS =
  DEFINING_WORLD_PLAZA_INGOT_WALL_SURFACE_REGISTRY.map(
    (surface) =>
      DEFINING_WORLD_PLAZA_DEV_QA_INGOT_ITEM_TYPE_ID_BY_METAL_ID[
        surface.metalId
      ]
  );

/** Survival construction mats (not trail wear). */
const DEFINING_WORLD_PLAZA_DEV_QA_SURVIVAL_BUILD_ITEM_TYPE_IDS = [
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SURVIVAL_SPLIT_PLANKS,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SURVIVAL_WATTLE_PANEL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SURVIVAL_ADOBE_BRICK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SURVIVAL_ROPE_COIL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SURVIVAL_PEG_STAKE_PACK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SURVIVAL_REED_MAT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SURVIVAL_CLAY_DAUB_MIX,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SURVIVAL_LASHING_TWINE_SPOOL,
] as const;

const DEFINING_WORLD_PLAZA_DEV_QA_FLOWER_DYE_ITEM_TYPE_IDS =
  DEFINING_WORLD_PLAZA_FLOWER_DYE_SPECIES_ORDER.map(
    (speciesId) =>
      DEFINING_WORLD_PLAZA_FLOWER_SPECIES_TO_ITEM_TYPE_ID[speciesId]
  );

/**
 * Ordered Creative building-resource groups for Materials palette QA.
 * Covers stone walls, tree floors, ore/ingot walls, flower dyes, survival mats.
 */
export const DEFINING_WORLD_PLAZA_DEV_QA_BUILDING_RESOURCE_SEED_GROUPS = [
  {
    groupId: 'basics',
    label: 'Wood & stone',
    itemTypeIds: [
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
    ],
  },
  {
    groupId: 'ores',
    label: 'Ores',
    itemTypeIds: DEFINING_WORLD_PLAZA_INVENTORY_ORE_ITEM_TYPE_IDS,
  },
  {
    groupId: 'ingots',
    label: 'Ingots',
    itemTypeIds: DEFINING_WORLD_PLAZA_DEV_QA_INGOT_ITEM_TYPE_IDS,
  },
  {
    groupId: 'flowers',
    label: 'Flower dyes',
    itemTypeIds: DEFINING_WORLD_PLAZA_DEV_QA_FLOWER_DYE_ITEM_TYPE_IDS,
  },
  {
    groupId: 'survival-build',
    label: 'Survival build mats',
    itemTypeIds: DEFINING_WORLD_PLAZA_DEV_QA_SURVIVAL_BUILD_ITEM_TYPE_IDS,
  },
] as const satisfies readonly DefiningWorldPlazaDevQaBuildingResourceSeedGroup[];
