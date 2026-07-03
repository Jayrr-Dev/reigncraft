import { drawingWorldBuildingPlotClaimFlatTileOnGraphics } from "@/components/world/building/domains/drawingWorldBuildingPlotClaimFlatTileOnGraphics";
import type { DefiningWorldBuildingPlot } from "@/components/world/building/domains/definingWorldBuildingPlot";
import {
  DEFINING_WORLD_BUILDING_PLOT_CLAIM_FILL_COLOR,
  DEFINING_WORLD_BUILDING_PLOT_CLAIM_INVALID_PREVIEW_COLOR,
  DEFINING_WORLD_BUILDING_PLOT_CLAIM_TOP_FILL_ALPHA,
  DEFINING_WORLD_BUILDING_PLOT_CLAIMABLE_FILL_COLOR,
  DEFINING_WORLD_BUILDING_PLOT_CLAIMABLE_PREVIEW_FILL_ALPHA,
} from "@/components/world/building/domains/definingWorldBuildingPlotClaimConstants";
import type { Graphics } from "pixi.js";

/**
 * Draws owned plot claim tiles as flat ground-layer diamonds.
 *
 * @module components/world/building/domains/drawingWorldBuildingPlotClaimTilesOnGraphics
 */

/**
 * Draws all tiles in owned plots as orange claim markers with dashed black borders.
 *
 * @param graphics - Target graphics instance.
 * @param plots - Owned build plots in the current viewport.
 */
export function drawingWorldBuildingPlotClaimTilesOnGraphics(
  graphics: Graphics,
  plots: readonly DefiningWorldBuildingPlot[],
): void {
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
        drawingWorldBuildingPlotClaimFlatTileOnGraphics({
          graphics,
          tileX,
          tileY,
          fillColor: DEFINING_WORLD_BUILDING_PLOT_CLAIM_FILL_COLOR,
          fillAlpha: DEFINING_WORLD_BUILDING_PLOT_CLAIM_TOP_FILL_ALPHA,
        });
      }
    }
  }
}

/**
 * Draws a hover or selection preview for a claimable tile on the ground layer.
 *
 * @param graphics - Target graphics instance.
 * @param tileX - Preview tile column.
 * @param tileY - Preview tile row.
 * @param isValid - True when the tile can be claimed.
 */
export function drawingWorldBuildingPlotClaimPreviewOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number,
  isValid: boolean,
): void {
  drawingWorldBuildingPlotClaimFlatTileOnGraphics({
    graphics,
    tileX,
    tileY,
    fillColor: isValid
      ? DEFINING_WORLD_BUILDING_PLOT_CLAIMABLE_FILL_COLOR
      : DEFINING_WORLD_BUILDING_PLOT_CLAIM_INVALID_PREVIEW_COLOR,
    fillAlpha: isValid
      ? DEFINING_WORLD_BUILDING_PLOT_CLAIMABLE_PREVIEW_FILL_ALPHA
      : 0.22,
  });
}
