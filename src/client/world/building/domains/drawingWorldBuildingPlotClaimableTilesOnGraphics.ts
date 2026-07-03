import { drawingWorldBuildingPlotClaimFlatTileOnGraphics } from "@/components/world/building/domains/drawingWorldBuildingPlotClaimFlatTileOnGraphics";
import {
  DEFINING_WORLD_BUILDING_PLOT_CLAIMABLE_FILL_COLOR,
  DEFINING_WORLD_BUILDING_PLOT_CLAIMABLE_TOP_FILL_ALPHA,
} from "@/components/world/building/domains/definingWorldBuildingPlotClaimConstants";
import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";
import type { Graphics } from "pixi.js";

/**
 * Draws claimable plot tiles in claim mode.
 *
 * @module components/world/building/domains/drawingWorldBuildingPlotClaimableTilesOnGraphics
 */

/**
 * Draws blue ground-layer tiles where the local player can claim next.
 *
 * @param graphics - Target graphics instance.
 * @param claimableTilePositions - Unclaimed tiles adjacent to owned plots.
 */
export function drawingWorldBuildingPlotClaimableTilesOnGraphics(
  graphics: Graphics,
  claimableTilePositions: readonly DefiningWorldBuildingTilePosition[],
): void {
  for (const tilePosition of claimableTilePositions) {
    drawingWorldBuildingPlotClaimFlatTileOnGraphics({
      graphics,
      tileX: tilePosition.tileX,
      tileY: tilePosition.tileY,
      fillColor: DEFINING_WORLD_BUILDING_PLOT_CLAIMABLE_FILL_COLOR,
      fillAlpha: DEFINING_WORLD_BUILDING_PLOT_CLAIMABLE_TOP_FILL_ALPHA,
    });
  }
}
