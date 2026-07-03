import type { DefiningWorldBuildingPlacedBlock } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import { listingWorldBuildingPlotPlacedBlocks } from "@/components/world/building/domains/definingWorldBuildingPlot";
import type { DefiningWorldBuildingPlot } from "@/components/world/building/domains/definingWorldBuildingPlot";

/**
 * Flattens placed blocks from plot aggregates.
 *
 * @module components/world/building/domains/listingWorldBuildingPlacedBlocksFromPlots
 */

/**
 * Returns every placed block contained in the plot list.
 *
 * @param plots - Plot aggregates loaded for the viewport.
 */
export function listingWorldBuildingPlacedBlocksFromPlots(
  plots: DefiningWorldBuildingPlot[],
): DefiningWorldBuildingPlacedBlock[] {
  return plots.flatMap(listingWorldBuildingPlotPlacedBlocks);
}
