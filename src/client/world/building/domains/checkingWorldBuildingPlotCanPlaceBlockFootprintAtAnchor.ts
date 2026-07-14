import type { DefiningWorldBuildingBlockDefinition } from '@/components/world/building/domains/definingWorldBuildingBlockDefinition';
import {
  checkingWorldBuildingPlotCanPlaceBlockAtTilePosition,
  checkingWorldBuildingPlotOwnedByUser,
  type DefiningWorldBuildingPlot,
} from '@/components/world/building/domains/definingWorldBuildingPlot';
import { checkingWorldBuildingTilePositionInsidePlotBounds } from '@/components/world/building/domains/definingWorldBuildingPlotBounds';
import { DEFINING_WORLD_BUILDING_PLOT_MAX_BLOCK_COUNT } from '@/components/world/building/domains/definingWorldBuildingPlotConstants';
import type { DefiningWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import {
  listingWorldBuildingPlacementFootprintTilePositions,
  resolvingWorldBuildingBlockPlacementFootprint,
} from '@/components/world/building/domains/definingWorldBuildingPlacementFootprint';

/**
 * Validates multi-tile footprint placement on an owned plot.
 *
 * @module components/world/building/domains/checkingWorldBuildingPlotCanPlaceBlockFootprintAtAnchor
 */

/**
 * Returns true when every footprint tile can accept the block on this plot.
 */
export function checkingWorldBuildingPlotCanPlaceBlockFootprintAtAnchor(
  plot: DefiningWorldBuildingPlot,
  anchorTilePosition: DefiningWorldBuildingTilePosition,
  actorUserId: string,
  worldLayer: number,
  blockHeight: number,
  definition: DefiningWorldBuildingBlockDefinition,
  cutFootprintMask?: number
): boolean {
  if (!checkingWorldBuildingPlotOwnedByUser(plot, actorUserId)) {
    return false;
  }

  const footprint = resolvingWorldBuildingBlockPlacementFootprint(definition);
  const footprintTiles = listingWorldBuildingPlacementFootprintTilePositions(
    anchorTilePosition,
    footprint
  );

  if (
    plot.blocksByTileKey.size + footprintTiles.length >
    DEFINING_WORLD_BUILDING_PLOT_MAX_BLOCK_COUNT
  ) {
    return false;
  }

  for (const tilePosition of footprintTiles) {
    if (
      !checkingWorldBuildingTilePositionInsidePlotBounds(
        plot.bounds,
        tilePosition
      )
    ) {
      return false;
    }

    if (
      !checkingWorldBuildingPlotCanPlaceBlockAtTilePosition(
        plot,
        tilePosition,
        actorUserId,
        worldLayer,
        blockHeight,
        cutFootprintMask
      )
    ) {
      return false;
    }
  }

  return true;
}
