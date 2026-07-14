/**
 * Finds the nearest ore-smelting station within player reach.
 *
 * @module components/world/crafting/domains/resolvingWorldPlazaOreSmeltingNearbyStation
 */

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { resolvingWorldBuildingBlockDefinition } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import {
  checkingWorldBuildingPlacedBlockIsFootprintSatellite,
  resolvingWorldBuildingBlockPlacementFootprint,
} from '@/components/world/building/domains/definingWorldBuildingPlacementFootprint';
import { DEFINING_WORLD_PLAZA_ORE_SMELTING_STATION_UI_KEEP_OPEN_RANGE_TILES } from '@/components/world/crafting/domains/definingWorldPlazaOreSmeltingInteractionLabelConstants';
import { checkingWorldPlazaOreSmeltingStationBlockDefinitionId } from '@/components/world/crafting/domains/definingWorldPlazaOreSmeltingRegistry';
import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { DEFINING_WORLD_PLAZA_INTERACTABLE_BLOCK_DEFAULT_PLAYER_RANGE_TILES } from '@/components/world/interaction/domains/definingWorldPlazaInteractableBlockClickActionRegistry';

export type ResolvingWorldPlazaOreSmeltingNearbyStationParams = {
  readonly playerWorldPoint: DefiningWorldPlazaWorldPoint;
  readonly placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
  readonly rangeTiles?: number;
};

/**
 * Chebyshev distance from the player to a station footprint center.
 */
export function computingWorldPlazaOreSmeltingStationDistanceTiles(
  playerWorldPoint: DefiningWorldPlazaWorldPoint,
  block: DefiningWorldBuildingPlacedBlock
): number {
  const definition = resolvingWorldBuildingBlockDefinition(block.definitionId);
  const footprint = definition
    ? resolvingWorldBuildingBlockPlacementFootprint(definition)
    : { tileWidth: 1, tileHeight: 1 };
  const centerTileX =
    block.tilePosition.tileX + (footprint.tileWidth - 1) * 0.5 + 0.5;
  const centerTileY =
    block.tilePosition.tileY + (footprint.tileHeight - 1) * 0.5 + 0.5;

  return computingWorldPlazaGridChebyshevDistance(
    playerWorldPoint.x,
    playerWorldPoint.y,
    centerTileX,
    centerTileY
  );
}

/**
 * True when the player is still close enough to keep a station UI open.
 */
export function checkingWorldPlazaOreSmeltingStationWithinUiKeepOpenRange(
  playerWorldPoint: DefiningWorldPlazaWorldPoint,
  block: DefiningWorldBuildingPlacedBlock,
  rangeTiles: number = DEFINING_WORLD_PLAZA_ORE_SMELTING_STATION_UI_KEEP_OPEN_RANGE_TILES
): boolean {
  return (
    computingWorldPlazaOreSmeltingStationDistanceTiles(
      playerWorldPoint,
      block
    ) <= rangeTiles
  );
}

/**
 * Returns the closest bloomery / kiln / stove anchor within Chebyshev reach,
 * or null when none are in range.
 */
export function resolvingWorldPlazaOreSmeltingNearbyStation({
  playerWorldPoint,
  placedBlocks,
  rangeTiles = DEFINING_WORLD_PLAZA_INTERACTABLE_BLOCK_DEFAULT_PLAYER_RANGE_TILES,
}: ResolvingWorldPlazaOreSmeltingNearbyStationParams): DefiningWorldBuildingPlacedBlock | null {
  let nearestStation: DefiningWorldBuildingPlacedBlock | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const block of placedBlocks) {
    if (!checkingWorldPlazaOreSmeltingStationBlockDefinitionId(block.definitionId)) {
      continue;
    }

    if (checkingWorldBuildingPlacedBlockIsFootprintSatellite(block)) {
      continue;
    }

    const distance = computingWorldPlazaOreSmeltingStationDistanceTiles(
      playerWorldPoint,
      block
    );

    if (distance > rangeTiles || distance >= nearestDistance) {
      continue;
    }

    nearestStation = block;
    nearestDistance = distance;
  }

  return nearestStation;
}

/** True when any ore-smelting station is within reach. */
export function checkingWorldPlazaOreSmeltingStationReachable(
  params: ResolvingWorldPlazaOreSmeltingNearbyStationParams
): boolean {
  return resolvingWorldPlazaOreSmeltingNearbyStation(params) !== null;
}
