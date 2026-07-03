import type { DefiningWorldBuildingPlot } from "@/components/world/building/domains/definingWorldBuildingPlot";
import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";
import { creatingWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";

/**
 * Expands owned plot bounds into individual tile positions.
 *
 * @module components/world/building/domains/listingWorldBuildingPlotTilePositions
 */

/**
 * Lists every tile occupied by the provided plots.
 *
 * @param plots - Owned build plots.
 */
export function listingWorldBuildingPlotTilePositions(
  plots: readonly DefiningWorldBuildingPlot[],
): DefiningWorldBuildingTilePosition[] {
  const tilePositions: DefiningWorldBuildingTilePosition[] = [];

  for (const plot of plots) {
    for (
      let tileY = plot.bounds.minTileY;
      tileY <= plot.bounds.maxTileY;
      tileY += 1
    ) {
      for (
        let tileX = plot.bounds.minTileX;
        tileX <= plot.bounds.maxTileX;
        tileX += 1
      ) {
        tilePositions.push(creatingWorldBuildingTilePosition(tileX, tileY));
      }
    }
  }

  return tilePositions;
}
