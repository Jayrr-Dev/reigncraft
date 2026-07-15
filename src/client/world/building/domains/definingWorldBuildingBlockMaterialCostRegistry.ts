/**
 * Declarative inventory cost for Materials palette block placement.
 * Each registered block consumes a fixed quantity per placed layer.
 *
 * @module components/world/building/domains/definingWorldBuildingBlockMaterialCostRegistry
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_STONE } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
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
import {
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

/** Inventory units consumed per placed block layer. */
export const DEFINING_WORLD_BUILDING_BLOCK_MATERIAL_COST_QUANTITY_PER_LAYER = 3;

export type DefiningWorldBuildingBlockMaterialCostEntry = {
  readonly itemTypeId: string;
  readonly quantityPerLayer: number;
  readonly itemLabel: string;
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

const DEFINING_WORLD_BUILDING_BLOCK_MATERIAL_COST_BY_DEFINITION_ID: Record<
  string,
  DefiningWorldBuildingBlockMaterialCostEntry
> = {
  [DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_STONE]: {
    itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
    quantityPerLayer:
      DEFINING_WORLD_BUILDING_BLOCK_MATERIAL_COST_QUANTITY_PER_LAYER,
    itemLabel: 'Stone',
  },
};

function seedingWorldBuildingOreWallMaterialCosts(): void {
  for (const [speciesId, itemTypeId] of Object.entries(
    DEFINING_WORLD_BUILDING_ORE_ITEM_TYPE_ID_BY_SPECIES_ID
  )) {
    const definitionId = formattingWorldPlazaOreWallBlockDefinitionId(
      speciesId as WorldOreSpeciesId
    );

    DEFINING_WORLD_BUILDING_BLOCK_MATERIAL_COST_BY_DEFINITION_ID[definitionId] =
      {
        itemTypeId,
        quantityPerLayer:
          DEFINING_WORLD_BUILDING_BLOCK_MATERIAL_COST_QUANTITY_PER_LAYER,
        itemLabel: `${speciesId.charAt(0).toUpperCase()}${speciesId.slice(1)} ore`,
      };
  }
}

function seedingWorldBuildingTreeFloorMaterialCosts(): void {
  for (const variant of DEFINING_WORLD_PLAZA_TREE_FLOOR_VARIANT_ORDER) {
    const definitionId = `basic:floor:tree-${variant}`;

    DEFINING_WORLD_BUILDING_BLOCK_MATERIAL_COST_BY_DEFINITION_ID[definitionId] =
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
        quantityPerLayer:
          DEFINING_WORLD_BUILDING_BLOCK_MATERIAL_COST_QUANTITY_PER_LAYER,
        itemLabel: 'Wood',
      };
  }
}

seedingWorldBuildingTreeFloorMaterialCosts();
seedingWorldBuildingOreWallMaterialCosts();

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
    return {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
      quantityPerLayer:
        DEFINING_WORLD_BUILDING_BLOCK_MATERIAL_COST_QUANTITY_PER_LAYER,
      itemLabel: 'Wood',
    };
  }

  const oreSpeciesId =
    resolvingWorldPlazaOreSpeciesIdFromWallBlockDefinitionId(definitionId);

  if (oreSpeciesId === null) {
    return null;
  }

  return {
    itemTypeId:
      DEFINING_WORLD_BUILDING_ORE_ITEM_TYPE_ID_BY_SPECIES_ID[oreSpeciesId],
    quantityPerLayer:
      DEFINING_WORLD_BUILDING_BLOCK_MATERIAL_COST_QUANTITY_PER_LAYER,
    itemLabel: `${oreSpeciesId.charAt(0).toUpperCase()}${oreSpeciesId.slice(1)} ore`,
  };
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

  return (
    countingWorldPlazaInventoryItemTypeQuantity(
      inventoryState,
      cost.itemTypeId
    ) >= cost.quantityPerLayer
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

  const consumeResult = consumingWorldPlazaInventoryItemByType(
    inventoryState,
    cost.itemTypeId,
    cost.quantityPerLayer
  );

  if (!consumeResult.consumed) {
    return { outcome: 'missing-materials' };
  }

  return {
    outcome: 'consumed',
    nextState: consumeResult.nextState,
  };
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

  return `Need ${cost.quantityPerLayer} ${cost.itemLabel}.`;
}

/** Lists every block definition id with a registered material cost. */
export function listingWorldBuildingBlockMaterialCostDefinitionIds(): readonly string[] {
  return Object.keys(
    DEFINING_WORLD_BUILDING_BLOCK_MATERIAL_COST_BY_DEFINITION_ID
  );
}
