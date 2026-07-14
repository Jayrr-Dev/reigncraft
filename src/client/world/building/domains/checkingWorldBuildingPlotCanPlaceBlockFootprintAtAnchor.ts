import type { DefiningWorldBuildingBlockDefinition } from '@/components/world/building/domains/definingWorldBuildingBlockDefinition';
import {
  checkingWorldBuildingPlotCanPlaceBlockAtTilePosition,
  checkingWorldBuildingPlotOwnedByUser,
  findingWorldBuildingPlotContainingTilePosition,
  type DefiningWorldBuildingPlot,
} from '@/components/world/building/domains/definingWorldBuildingPlot';
import { DEFINING_WORLD_BUILDING_PLOT_MAX_BLOCK_COUNT } from '@/components/world/building/domains/definingWorldBuildingPlotConstants';
import type { DefiningWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import {
  listingWorldBuildingPlacementFootprintTilePositions,
  resolvingWorldBuildingBlockPlacementFootprint,
} from '@/components/world/building/domains/definingWorldBuildingPlacementFootprint';

/**
 * Validates multi-tile footprint placement across owned claim tiles.
 *
 * Claims are stored as 1x1 plots, so a 2x2 utility may span several adjacent
 * owned plots. Each footprint tile must land on an owned plot that can accept
 * a block at that tile.
 *
 * @module components/world/building/domains/checkingWorldBuildingPlotCanPlaceBlockFootprintAtAnchor
 */

/**
 * Returns true when every footprint tile can accept the block on owned land.
 *
 * @param plots - Effective viewport / draft plots to search.
 * @param anchorTilePosition - North-west footprint corner.
 * @param actorUserId - Authenticated user id.
 * @param worldLayer - Target world layer.
 * @param blockHeight - Block height layers.
 * @param definition - Block definition (footprint span).
 * @param cutFootprintMask - Optional cut mask.
 */
export function checkingWorldBuildingPlotCanPlaceBlockFootprintAtAnchor(
  plots: readonly DefiningWorldBuildingPlot[],
  anchorTilePosition: DefiningWorldBuildingTilePosition,
  actorUserId: string,
  worldLayer: number,
  blockHeight: number,
  definition: DefiningWorldBuildingBlockDefinition,
  cutFootprintMask?: number
): boolean {
  const footprint = resolvingWorldBuildingBlockPlacementFootprint(definition);
  const footprintTiles = listingWorldBuildingPlacementFootprintTilePositions(
    anchorTilePosition,
    footprint
  );
  const addedBlockCountByPlotId = new Map<string, number>();

  for (const tilePosition of footprintTiles) {
    const plot = findingWorldBuildingPlotContainingTilePosition(
      plots,
      tilePosition
    );

    if (!plot || !checkingWorldBuildingPlotOwnedByUser(plot, actorUserId)) {
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

    addedBlockCountByPlotId.set(
      plot.plotId,
      (addedBlockCountByPlotId.get(plot.plotId) ?? 0) + 1
    );
  }

  for (const [plotId, addedBlockCount] of addedBlockCountByPlotId) {
    const plot = plots.find((candidate) => candidate.plotId === plotId);

    if (!plot) {
      return false;
    }

    if (
      plot.blocksByTileKey.size + addedBlockCount >
      DEFINING_WORLD_BUILDING_PLOT_MAX_BLOCK_COUNT
    ) {
      return false;
    }
  }

  return true;
}
