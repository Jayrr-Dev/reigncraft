/**
 * Checks whether a craft recipe's nearby-station requirement is met.
 *
 * @module components/world/crafting/domains/checkingWorldPlazaCraftRecipeNearbyStationSatisfied
 */

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  checkingWorldBuildingPlacedBlockIsFootprintSatellite,
  resolvingWorldBuildingBlockPlacementFootprint,
} from '@/components/world/building/domains/definingWorldBuildingPlacementFootprint';
import { resolvingWorldBuildingBlockDefinition } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import type { DefiningWorldPlazaCraftModeRecipeDefinition } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { DEFINING_WORLD_PLAZA_CRAFT_RECIPE_NEARBY_STATION_RANGE_TILES } from '@/components/world/crafting/domains/definingWorldPlazaCraftRecipeNearbyStationConstants';
import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';

export type CheckingWorldPlazaCraftRecipeNearbyStationSatisfiedParams = {
  readonly recipeDefinition: DefiningWorldPlazaCraftModeRecipeDefinition;
  readonly playerWorldPoint: DefiningWorldPlazaWorldPoint;
  readonly placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
};

/**
 * Returns true when the recipe has no station requirement, or the player is
 * within Chebyshev reach of a matching placed station anchor.
 */
export function checkingWorldPlazaCraftRecipeNearbyStationSatisfied({
  recipeDefinition,
  playerWorldPoint,
  placedBlocks,
}: CheckingWorldPlazaCraftRecipeNearbyStationSatisfiedParams): boolean {
  const requiredBlockDefinitionId =
    recipeDefinition.requiredNearbyBlockDefinitionId;

  if (!requiredBlockDefinitionId) {
    return true;
  }

  const rangeTiles =
    recipeDefinition.requiredNearbyBlockRangeTiles ??
    DEFINING_WORLD_PLAZA_CRAFT_RECIPE_NEARBY_STATION_RANGE_TILES;

  for (const block of placedBlocks) {
    if (block.definitionId !== requiredBlockDefinitionId) {
      continue;
    }

    if (checkingWorldBuildingPlacedBlockIsFootprintSatellite(block)) {
      continue;
    }

    const definition = resolvingWorldBuildingBlockDefinition(block.definitionId);
    const footprint = definition
      ? resolvingWorldBuildingBlockPlacementFootprint(definition)
      : { tileWidth: 1, tileHeight: 1 };
    const centerTileX =
      block.tilePosition.tileX + (footprint.tileWidth - 1) * 0.5 + 0.5;
    const centerTileY =
      block.tilePosition.tileY + (footprint.tileHeight - 1) * 0.5 + 0.5;
    const distance = computingWorldPlazaGridChebyshevDistance(
      playerWorldPoint.x,
      playerWorldPoint.y,
      centerTileX,
      centerTileY
    );

    if (distance <= rangeTiles) {
      return true;
    }
  }

  return false;
}
