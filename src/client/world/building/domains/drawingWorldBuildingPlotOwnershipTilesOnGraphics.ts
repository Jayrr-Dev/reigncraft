import { checkingWorldBuildingPlotIsTemporary } from "@/components/world/building/domains/checkingWorldBuildingPlotIsTemporary";
import { drawingWorldBuildingPlotClaimFlatTileOnGraphics } from "@/components/world/building/domains/drawingWorldBuildingPlotClaimFlatTileOnGraphics";
import type { DefiningWorldBuildingPlot } from "@/components/world/building/domains/definingWorldBuildingPlot";
import {
  DEFINING_WORLD_BUILDING_PLOT_CLAIM_FILL_COLOR,
  DEFINING_WORLD_BUILDING_PLOT_CLAIM_TOP_FILL_ALPHA,
  DEFINING_WORLD_BUILDING_PLOT_OTHER_OWNER_FILL_COLOR,
  DEFINING_WORLD_BUILDING_PLOT_OTHER_OWNER_TOP_FILL_ALPHA,
  DEFINING_WORLD_BUILDING_PLOT_TEMPORARY_CLAIM_BORDER_COLOR,
  DEFINING_WORLD_BUILDING_PLOT_TEMPORARY_CLAIM_FILL_COLOR,
  DEFINING_WORLD_BUILDING_PLOT_TEMPORARY_CLAIM_TOP_FILL_ALPHA,
} from "@/components/world/building/domains/definingWorldBuildingPlotClaimConstants";
import type { Graphics } from "pixi.js";

/**
 * Draws plot ownership tiles with per-owner styling in claim mode.
 *
 * @module components/world/building/domains/drawingWorldBuildingPlotOwnershipTilesOnGraphics
 */

/**
 * Draws viewport plots with local-owner orange tiles and other-owner purple tiles.
 *
 * @param graphics - Target graphics instance.
 * @param plots - Viewport plots including all owners.
 * @param localUserId - Authenticated user id.
 */
export function drawingWorldBuildingPlotOwnershipTilesOnGraphics(
  graphics: Graphics,
  plots: readonly DefiningWorldBuildingPlot[],
  localUserId: string | null,
): void {
  for (const plot of plots) {
    const isLocalOwner = Boolean(localUserId) && plot.ownerId === localUserId;
    const isTemporary = checkingWorldBuildingPlotIsTemporary(plot);

    if (isLocalOwner && isTemporary) {
      continue;
    }

    const fillColor = isLocalOwner
      ? DEFINING_WORLD_BUILDING_PLOT_CLAIM_FILL_COLOR
      : DEFINING_WORLD_BUILDING_PLOT_OTHER_OWNER_FILL_COLOR;
    const fillAlpha = isLocalOwner
      ? DEFINING_WORLD_BUILDING_PLOT_CLAIM_TOP_FILL_ALPHA
      : DEFINING_WORLD_BUILDING_PLOT_OTHER_OWNER_TOP_FILL_ALPHA;

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
          fillColor,
          fillAlpha,
        });
      }
    }
  }

  for (const plot of plots) {
    const isLocalOwner = Boolean(localUserId) && plot.ownerId === localUserId;
    const isTemporary = checkingWorldBuildingPlotIsTemporary(plot);

    if (!isLocalOwner || !isTemporary) {
      continue;
    }

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
          fillColor: DEFINING_WORLD_BUILDING_PLOT_TEMPORARY_CLAIM_FILL_COLOR,
          fillAlpha: DEFINING_WORLD_BUILDING_PLOT_TEMPORARY_CLAIM_TOP_FILL_ALPHA,
          strokeColor: DEFINING_WORLD_BUILDING_PLOT_TEMPORARY_CLAIM_BORDER_COLOR,
        });
      }
    }
  }
}
