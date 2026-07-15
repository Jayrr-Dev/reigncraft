/**
 * Declarative inventory cost for Materials palette block placement.
 * Each registered block consumes one or more item requirements per placed layer.
 *
 * @module components/world/building/domains/definingWorldBuildingBlockMaterialCostRegistry
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_STONE } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import {
  formattingWorldPlazaDyedWoodFloorBlockDefinitionId,
  resolvingWorldPlazaFlowerSpeciesIdFromDyedWoodFloorBlockDefinitionId,
} from '@/components/world/building/domains/definingWorldPlazaDyedWoodFloorBlockRegistry';
import {
  formattingWorldPlazaFlowerBlockDefinitionId,
  resolvingWorldPlazaFlowerSpeciesIdFromBlockDefinitionId,
} from '@/components/world/building/domains/definingWorldPlazaFlowerBlockRegistry';
import {
  DEFINING_WORLD_PLAZA_FLOWER_DYE_NAME_BY_SPECIES_ID,
  DEFINING_WORLD_PLAZA_FLOWER_DYE_SPECIES_ORDER,
} from '@/components/world/building/domains/definingWorldPlazaFlowerDyeConstants';
import {
  formattingWorldPlazaIngotWallBlockDefinitionId,
  resolvingWorldPlazaIngotMetalIdFromWallBlockDefinitionId,
} from '@/components/world/building/domains/definingWorldPlazaIngotWallBlockRegistry';
import {
  DEFINING_WORLD_PLAZA_INGOT_WALL_SURFACE_REGISTRY,
  type DefiningWorldPlazaIngotWallMetalId,
} from '@/components/world/building/domains/definingWorldPlazaIngotWallSurfaceRegistry';
import {
  formattingWorldPlazaOreWallBlockDefinitionId,
  resolvingWorldPlazaOreSpeciesIdFromWallBlockDefinitionId,
} from '@/components/world/building/domains/definingWorldPlazaOreWallBlockRegistry';
import {
  checkingWorldBuildingBlockDefinitionIdIsTreeFloor,
  DEFINING_WORLD_PLAZA_TREE_FLOOR_VARIANT_ORDER,
} from '@/components/world/building/domains/definingWorldPlazaTreeFloorBlockRegistry';
import { countingWorldPlazaInventoryItemTypeQuantity } from '@/components/world/crafting/domains/countingWorldPlazaInventoryItemTypeQuantity';
import { consumingWorldPlazaInventoryItemByType } from '@/components/world/inventory/domains/consumingWorldPlazaInventoryItemByType';
import { DEFINING_WORLD_PLAZA_FLOWER_SPECIES_TO_ITEM_TYPE_ID } from '@/components/world/inventory/domains/definingWorldPlazaInventoryFlowerSpriteSheetConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_COPPER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_GOLD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_LEAD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_SILVER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_STEEL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_CLAY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COAL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COPPER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_GOLD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_IRON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_LEAD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_NITER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SCARLET,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SILVER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SULFUR,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import type { WorldOreSpeciesId } from '../../../../shared/worldOreRarity';

/** Inventory units consumed per placed block layer (primary materials). */
export const DEFINING_WORLD_BUILDING_BLOCK_MATERIAL_COST_QUANTITY_PER_LAYER = 3;

/** Flower dye units consumed with wood for stained floors. */
export const DEFINING_WORLD_BUILDING_BLOCK_DYE_FLOWER_QUANTITY_PER_LAYER = 1;

export type DefiningWorldBuildingBlockMaterialCostRequirement = {
  readonly itemTypeId: string;
  readonly quantityPerLayer: number;
  readonly itemLabel: string;
};

export type DefiningWorldBuildingBlockMaterialCostEntry = {
  readonly requirements: readonly DefiningWorldBuildingBlockMaterialCostRequirement[];
};

const DEFINING_WORLD_BUILDING_ORE_ITEM_TYPE_ID_BY_SPECIES_ID: Record<
  WorldOreSpeciesId,
  string
> = {
  clay: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_CLAY,
  iron: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_IRON,
  silver: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SILVER,
  gold: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_GOLD,
  copper: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COPPER,
  coal: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COAL,
  niter: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_NITER,
  scarlet: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SCARLET,
  lead: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_LEAD,
  sulfur: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SULFUR,
};

const DEFINING_WORLD_BUILDING_INGOT_ITEM_TYPE_ID_BY_METAL_ID: Record<
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

const DEFINING_WORLD_BUILDING_INGOT_ITEM_LABEL_BY_METAL_ID: Record<
  DefiningWorldPlazaIngotWallMetalId,
  string
> = {
  iron: 'Iron ingot',
  copper: 'Copper ingot',
  silver: 'Silver ingot',
  gold: 'Gold ingot',
  lead: 'Lead ingot',
  steel: 'Steel ingot',
};

function creatingWorldBuildingSingleMaterialCostEntry(
  itemTypeId: string,
  itemLabel: string,
  quantityPerLayer: number = DEFINING_WORLD_BUILDING_BLOCK_MATERIAL_COST_QUANTITY_PER_LAYER
): DefiningWorldBuildingBlockMaterialCostEntry {
  return {
    requirements: [
      {
        itemTypeId,
        quantityPerLayer,
        itemLabel,
      },
    ],
  };
}

const DEFINING_WORLD_BUILDING_BLOCK_MATERIAL_COST_BY_DEFINITION_ID: Record<
  string,
  DefiningWorldBuildingBlockMaterialCostEntry
> = {
  [DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_STONE]:
    creatingWorldBuildingSingleMaterialCostEntry(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
      'Stone'
    ),
};

function seedingWorldBuildingOreWallMaterialCosts(): void {
  for (const [speciesId, itemTypeId] of Object.entries(
    DEFINING_WORLD_BUILDING_ORE_ITEM_TYPE_ID_BY_SPECIES_ID
  )) {
    const definitionId = formattingWorldPlazaOreWallBlockDefinitionId(
      speciesId as WorldOreSpeciesId
    );

    DEFINING_WORLD_BUILDING_BLOCK_MATERIAL_COST_BY_DEFINITION_ID[definitionId] =
      creatingWorldBuildingSingleMaterialCostEntry(
        itemTypeId,
        `${speciesId.charAt(0).toUpperCase()}${speciesId.slice(1)} ore`
      );
  }
}

function seedingWorldBuildingIngotWallMaterialCosts(): void {
  for (const surface of DEFINING_WORLD_PLAZA_INGOT_WALL_SURFACE_REGISTRY) {
    const definitionId = formattingWorldPlazaIngotWallBlockDefinitionId(
      surface.metalId
    );

    DEFINING_WORLD_BUILDING_BLOCK_MATERIAL_COST_BY_DEFINITION_ID[definitionId] =
      creatingWorldBuildingSingleMaterialCostEntry(
        DEFINING_WORLD_BUILDING_INGOT_ITEM_TYPE_ID_BY_METAL_ID[surface.metalId],
        DEFINING_WORLD_BUILDING_INGOT_ITEM_LABEL_BY_METAL_ID[surface.metalId]
      );
  }
}

function seedingWorldBuildingTreeFloorMaterialCosts(): void {
  for (const variant of DEFINING_WORLD_PLAZA_TREE_FLOOR_VARIANT_ORDER) {
    const definitionId = `basic:floor:tree-${variant}`;

    DEFINING_WORLD_BUILDING_BLOCK_MATERIAL_COST_BY_DEFINITION_ID[definitionId] =
      creatingWorldBuildingSingleMaterialCostEntry(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
        'Wood'
      );
  }
}

function creatingWorldBuildingWoodPlusFlowerMaterialCostEntry(
  speciesId: (typeof DEFINING_WORLD_PLAZA_FLOWER_DYE_SPECIES_ORDER)[number]
): DefiningWorldBuildingBlockMaterialCostEntry {
  return {
    requirements: [
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
        quantityPerLayer:
          DEFINING_WORLD_BUILDING_BLOCK_MATERIAL_COST_QUANTITY_PER_LAYER,
        itemLabel: 'Wood',
      },
      {
        itemTypeId:
          DEFINING_WORLD_PLAZA_FLOWER_SPECIES_TO_ITEM_TYPE_ID[speciesId],
        quantityPerLayer:
          DEFINING_WORLD_BUILDING_BLOCK_DYE_FLOWER_QUANTITY_PER_LAYER,
        itemLabel:
          DEFINING_WORLD_PLAZA_FLOWER_DYE_NAME_BY_SPECIES_ID[speciesId],
      },
    ],
  };
}

function seedingWorldBuildingFlowerBlockMaterialCosts(): void {
  for (const speciesId of DEFINING_WORLD_PLAZA_FLOWER_DYE_SPECIES_ORDER) {
    const definitionId = formattingWorldPlazaFlowerBlockDefinitionId(speciesId);

    DEFINING_WORLD_BUILDING_BLOCK_MATERIAL_COST_BY_DEFINITION_ID[definitionId] =
      creatingWorldBuildingWoodPlusFlowerMaterialCostEntry(speciesId);
  }
}

function seedingWorldBuildingDyedWoodFloorMaterialCosts(): void {
  for (const speciesId of DEFINING_WORLD_PLAZA_FLOWER_DYE_SPECIES_ORDER) {
    const definitionId =
      formattingWorldPlazaDyedWoodFloorBlockDefinitionId(speciesId);

    DEFINING_WORLD_BUILDING_BLOCK_MATERIAL_COST_BY_DEFINITION_ID[definitionId] =
      creatingWorldBuildingWoodPlusFlowerMaterialCostEntry(speciesId);
  }
}

seedingWorldBuildingTreeFloorMaterialCosts();
seedingWorldBuildingDyedWoodFloorMaterialCosts();
seedingWorldBuildingOreWallMaterialCosts();
seedingWorldBuildingIngotWallMaterialCosts();
seedingWorldBuildingFlowerBlockMaterialCosts();

/**
 * Resolves inventory cost for one block definition id, if any.
 */
export function resolvingWorldBuildingBlockMaterialCost(
  definitionId: string
): DefiningWorldBuildingBlockMaterialCostEntry | null {
  const directEntry =
    DEFINING_WORLD_BUILDING_BLOCK_MATERIAL_COST_BY_DEFINITION_ID[definitionId];

  if (directEntry) {
    return directEntry;
  }

  if (checkingWorldBuildingBlockDefinitionIdIsTreeFloor(definitionId)) {
    return creatingWorldBuildingSingleMaterialCostEntry(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
      'Wood'
    );
  }

  const dyedSpeciesId =
    resolvingWorldPlazaFlowerSpeciesIdFromDyedWoodFloorBlockDefinitionId(
      definitionId
    );

  if (dyedSpeciesId !== null) {
    return creatingWorldBuildingWoodPlusFlowerMaterialCostEntry(dyedSpeciesId);
  }

  const flowerSpeciesId =
    resolvingWorldPlazaFlowerSpeciesIdFromBlockDefinitionId(definitionId);

  if (flowerSpeciesId !== null) {
    return creatingWorldBuildingWoodPlusFlowerMaterialCostEntry(
      flowerSpeciesId
    );
  }

  const ingotMetalId =
    resolvingWorldPlazaIngotMetalIdFromWallBlockDefinitionId(definitionId);

  if (ingotMetalId !== null) {
    return creatingWorldBuildingSingleMaterialCostEntry(
      DEFINING_WORLD_BUILDING_INGOT_ITEM_TYPE_ID_BY_METAL_ID[ingotMetalId],
      DEFINING_WORLD_BUILDING_INGOT_ITEM_LABEL_BY_METAL_ID[ingotMetalId]
    );
  }

  const oreSpeciesId =
    resolvingWorldPlazaOreSpeciesIdFromWallBlockDefinitionId(definitionId);

  if (oreSpeciesId === null) {
    return null;
  }

  return creatingWorldBuildingSingleMaterialCostEntry(
    DEFINING_WORLD_BUILDING_ORE_ITEM_TYPE_ID_BY_SPECIES_ID[oreSpeciesId],
    `${oreSpeciesId.charAt(0).toUpperCase()}${oreSpeciesId.slice(1)} ore`
  );
}

/**
 * True when inventory holds enough material for one layer of this block.
 */
export function checkingWorldBuildingBlockMaterialAffordable(
  inventoryState: DefiningInventoryState,
  definitionId: string
): boolean {
  const cost = resolvingWorldBuildingBlockMaterialCost(definitionId);

  if (cost === null) {
    return true;
  }

  return cost.requirements.every(
    (requirement) =>
      countingWorldPlazaInventoryItemTypeQuantity(
        inventoryState,
        requirement.itemTypeId
      ) >= requirement.quantityPerLayer
  );
}

export type ConsumingWorldBuildingBlockMaterialCostResult =
  | {
      readonly outcome: 'consumed';
      readonly nextState: DefiningInventoryState;
    }
  | {
      readonly outcome: 'missing-materials';
    };

/**
 * Consumes material cost for one placed block layer, or returns missing-materials.
 */
export function consumingWorldBuildingBlockMaterialCost(
  inventoryState: DefiningInventoryState,
  definitionId: string
): ConsumingWorldBuildingBlockMaterialCostResult {
  const cost = resolvingWorldBuildingBlockMaterialCost(definitionId);

  if (cost === null) {
    return { outcome: 'consumed', nextState: inventoryState };
  }

  if (
    !checkingWorldBuildingBlockMaterialAffordable(inventoryState, definitionId)
  ) {
    return { outcome: 'missing-materials' };
  }

  let nextState = inventoryState;

  for (const requirement of cost.requirements) {
    const consumeResult = consumingWorldPlazaInventoryItemByType(
      nextState,
      requirement.itemTypeId,
      requirement.quantityPerLayer
    );

    if (!consumeResult.consumed) {
      return { outcome: 'missing-materials' };
    }

    nextState = consumeResult.nextState;
  }

  return {
    outcome: 'consumed',
    nextState,
  };
}

/**
 * Formats inventory requirements as `3 Wood + 1 Foxglove` (per placed layer).
 */
export function formattingWorldBuildingBlockMaterialCostRequirementsLabel(
  requirements: readonly DefiningWorldBuildingBlockMaterialCostRequirement[]
): string {
  return requirements
    .map(
      (requirement) =>
        `${requirement.quantityPerLayer} ${requirement.itemLabel}`
    )
    .join(' + ');
}

/**
 * Formats the Materials palette cost readout for one block, or null when free.
 */
export function formattingWorldBuildingBlockMaterialCostReadout(
  definitionId: string
): string | null {
  const cost = resolvingWorldBuildingBlockMaterialCost(definitionId);

  if (cost === null || cost.requirements.length === 0) {
    return null;
  }

  return formattingWorldBuildingBlockMaterialCostRequirementsLabel(
    cost.requirements
  );
}

/**
 * Formats a player-facing toast when materials are short for one layer.
 */
export function formattingWorldBuildingBlockMaterialShortfallMessage(
  definitionId: string
): string {
  const cost = resolvingWorldBuildingBlockMaterialCost(definitionId);

  if (cost === null) {
    return 'Not enough materials.';
  }

  return `Need ${formattingWorldBuildingBlockMaterialCostRequirementsLabel(
    cost.requirements
  )}.`;
}

/** Lists every block definition id with a registered material cost. */
export function listingWorldBuildingBlockMaterialCostDefinitionIds(): readonly string[] {
  return Object.keys(
    DEFINING_WORLD_BUILDING_BLOCK_MATERIAL_COST_BY_DEFINITION_ID
  );
}
