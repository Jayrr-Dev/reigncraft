/**
 * Explains why a block footprint cannot be placed at an anchor tile.
 *
 * @module components/world/building/domains/resolvingWorldBuildingBlockPlacementBlockedMessage
 */

import type { DefiningWorldBuildingBlockDefinition } from '@/components/world/building/domains/definingWorldBuildingBlockDefinition';
import {
  LABELING_WORLD_BUILDING_PLACEMENT_BLOCKED_FOOTPRINT_GENERIC,
  LABELING_WORLD_BUILDING_PLACEMENT_BLOCKED_FOOTPRINT_OCCUPIED,
  LABELING_WORLD_BUILDING_PLACEMENT_BLOCKED_FOOTPRINT_PLOT_LIMIT,
  LABELING_WORLD_BUILDING_PLACEMENT_BLOCKED_FOOTPRINT_UNCLAIMED,
  LABELING_WORLD_BUILDING_PLACEMENT_BLOCKED_TILE_GENERIC,
  LABELING_WORLD_BUILDING_PLACEMENT_BLOCKED_TILE_OCCUPIED,
  LABELING_WORLD_BUILDING_PLACEMENT_BLOCKED_TILE_PLOT_LIMIT,
  LABELING_WORLD_BUILDING_PLACEMENT_BLOCKED_TILE_UNCLAIMED,
} from '@/components/world/building/domains/definingWorldBuildingPlacementBlockedMessageConstants';
import {
  checkingWorldBuildingPlacementFootprintIsMultiTile,
  listingWorldBuildingPlacementFootprintTilePositions,
  resolvingWorldBuildingBlockPlacementFootprint,
} from '@/components/world/building/domains/definingWorldBuildingPlacementFootprint';
import {
  checkingWorldBuildingPlotOwnedByUser,
  findingWorldBuildingPlotBlockAtTileLayerPosition,
  findingWorldBuildingPlotContainingTilePosition,
  type DefiningWorldBuildingPlot,
} from '@/components/world/building/domains/definingWorldBuildingPlot';
import { DEFINING_WORLD_BUILDING_PLOT_MAX_BLOCK_COUNT } from '@/components/world/building/domains/definingWorldBuildingPlotConstants';
import type { DefiningWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';

export type ResolvingWorldBuildingBlockPlacementBlockedMessageInput = {
  readonly plots: readonly DefiningWorldBuildingPlot[];
  readonly anchorTilePosition: DefiningWorldBuildingTilePosition;
  readonly actorUserId: string;
  readonly worldLayer: number;
  readonly definition: DefiningWorldBuildingBlockDefinition;
};

/**
 * Returns a short toast / panel message for a rejected placement preview.
 */
export function resolvingWorldBuildingBlockPlacementBlockedMessage({
  plots,
  anchorTilePosition,
  actorUserId,
  worldLayer,
  definition,
}: ResolvingWorldBuildingBlockPlacementBlockedMessageInput): string {
  const footprint = resolvingWorldBuildingBlockPlacementFootprint(definition);
  const isMultiTile =
    checkingWorldBuildingPlacementFootprintIsMultiTile(footprint);
  const footprintTiles = listingWorldBuildingPlacementFootprintTilePositions(
    anchorTilePosition,
    footprint
  );

  let hasUnclaimedTile = false;
  let hasOccupiedTile = false;
  let hasPlotLimitTile = false;

  for (const tilePosition of footprintTiles) {
    const plot = findingWorldBuildingPlotContainingTilePosition(
      plots,
      tilePosition
    );

    if (!plot || !checkingWorldBuildingPlotOwnedByUser(plot, actorUserId)) {
      hasUnclaimedTile = true;
      continue;
    }

    if (
      findingWorldBuildingPlotBlockAtTileLayerPosition(
        plot,
        tilePosition,
        worldLayer
      )
    ) {
      hasOccupiedTile = true;
    }

    if (plot.blocksByTileKey.size >= DEFINING_WORLD_BUILDING_PLOT_MAX_BLOCK_COUNT) {
      hasPlotLimitTile = true;
    }
  }

  if (isMultiTile) {
    if (hasOccupiedTile) {
      return LABELING_WORLD_BUILDING_PLACEMENT_BLOCKED_FOOTPRINT_OCCUPIED;
    }

    if (hasUnclaimedTile) {
      return LABELING_WORLD_BUILDING_PLACEMENT_BLOCKED_FOOTPRINT_UNCLAIMED;
    }

    if (hasPlotLimitTile) {
      return LABELING_WORLD_BUILDING_PLACEMENT_BLOCKED_FOOTPRINT_PLOT_LIMIT;
    }

    return LABELING_WORLD_BUILDING_PLACEMENT_BLOCKED_FOOTPRINT_GENERIC;
  }

  if (hasOccupiedTile) {
    return LABELING_WORLD_BUILDING_PLACEMENT_BLOCKED_TILE_OCCUPIED;
  }

  if (hasUnclaimedTile) {
    return LABELING_WORLD_BUILDING_PLACEMENT_BLOCKED_TILE_UNCLAIMED;
  }

  if (hasPlotLimitTile) {
    return LABELING_WORLD_BUILDING_PLACEMENT_BLOCKED_TILE_PLOT_LIMIT;
  }

  return LABELING_WORLD_BUILDING_PLACEMENT_BLOCKED_TILE_GENERIC;
}
