import { checkingWorldBuildingPlotIsTemporary } from "@/components/world/building/domains/checkingWorldBuildingPlotIsTemporary";
import {
  DEFINING_WORLD_BUILDING_PLOT_CLAIM_FILL_COLOR,
  DEFINING_WORLD_BUILDING_PLOT_CLAIM_TOP_FILL_ALPHA,
  DEFINING_WORLD_BUILDING_PLOT_CLAIM_WORLD_LAYER,
  DEFINING_WORLD_BUILDING_PLOT_CLAIMABLE_FILL_COLOR,
  DEFINING_WORLD_BUILDING_PLOT_CLAIMABLE_TOP_FILL_ALPHA,
  DEFINING_WORLD_BUILDING_PLOT_OTHER_OWNER_FILL_COLOR,
  DEFINING_WORLD_BUILDING_PLOT_OTHER_OWNER_TOP_FILL_ALPHA,
  DEFINING_WORLD_BUILDING_PLOT_TEMPORARY_CLAIM_BORDER_COLOR,
  DEFINING_WORLD_BUILDING_PLOT_TEMPORARY_CLAIM_FILL_COLOR,
  DEFINING_WORLD_BUILDING_PLOT_TEMPORARY_CLAIM_TOP_FILL_ALPHA,
} from "@/components/world/building/domains/definingWorldBuildingPlotClaimConstants";
import type { DefiningWorldBuildingPlot } from "@/components/world/building/domains/definingWorldBuildingPlot";
import type { DefiningWorldBuildingPlotOwnerLimits } from "@/components/world/building/domains/definingWorldBuildingPlotOwnerLimits";
import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";
import { formattingWorldBuildingTileLayerKey } from "@/components/world/building/domains/formattingWorldBuildingTileLayerKey";
import { resolvingWorldBuildingPlotClaimOverlayRenderLayer } from "@/components/world/building/domains/drawingWorldBuildingPlotClaimFlatTileOnGraphics";
import type { ResolvingWorldBuildingClaimModePlotOverlayRenderLayer } from "@/components/world/building/domains/resolvingWorldBuildingClaimModePlotOverlayZIndex";
import { listingWorldBuildingClaimableTilePositionsForOwner } from "@/components/world/building/domains/listingWorldBuildingClaimableTilePositionsForOwner";

/**
 * Per-tile claim-mode overlay draw specs for depth-sorted rendering.
 *
 * @module components/world/building/domains/listingWorldBuildingClaimModeOverlayTileDraws
 */

/** Visual styling for one claim-mode overlay tile. */
export interface ListingWorldBuildingClaimModeOverlayTileDraw {
  tileKey: string;
  tilePosition: DefiningWorldBuildingTilePosition;
  fillColor: number;
  fillAlpha: number;
  strokeColor?: number;
  renderLayer: ResolvingWorldBuildingClaimModePlotOverlayRenderLayer;
}

/**
 * Lists every claim-mode overlay tile with colors and stable React keys.
 *
 * @param overlayPlots - Viewport plots plus distant owned temporary tiles.
 * @param localUserId - Authenticated user id.
 * @param plotOwnerLimits - Per-user plot and tile caps.
 */
export function listingWorldBuildingClaimModeOverlayTileDraws(
  overlayPlots: readonly DefiningWorldBuildingPlot[],
  localUserId: string | null,
  plotOwnerLimits: DefiningWorldBuildingPlotOwnerLimits,
): ListingWorldBuildingClaimModeOverlayTileDraw[] {
  const tileDraws: ListingWorldBuildingClaimModeOverlayTileDraw[] = [];
  const drawnTileKeys = new Set<string>();

  const recordingTileDraw = (
    tilePosition: DefiningWorldBuildingTilePosition,
    fillColor: number,
    fillAlpha: number,
    strokeColor?: number,
  ): void => {
    const tileKey = formattingWorldBuildingTileLayerKey(
      tilePosition,
      DEFINING_WORLD_BUILDING_PLOT_CLAIM_WORLD_LAYER,
    );

    if (drawnTileKeys.has(tileKey)) {
      return;
    }

    drawnTileKeys.add(tileKey);
    tileDraws.push({
      tileKey,
      tilePosition,
      fillColor,
      fillAlpha,
      strokeColor,
      renderLayer: resolvingWorldBuildingPlotClaimOverlayRenderLayer(
        tilePosition.tileX,
        tilePosition.tileY,
      ),
    });
  };

  if (localUserId) {
    for (const tilePosition of listingWorldBuildingClaimableTilePositionsForOwner(
      overlayPlots,
      localUserId,
      plotOwnerLimits,
    )) {
      recordingTileDraw(
        tilePosition,
        DEFINING_WORLD_BUILDING_PLOT_CLAIMABLE_FILL_COLOR,
        DEFINING_WORLD_BUILDING_PLOT_CLAIMABLE_TOP_FILL_ALPHA,
      );
    }
  }

  for (const plot of overlayPlots) {
    const isLocalOwner = Boolean(localUserId) && plot.ownerId === localUserId;
    const isTemporary = checkingWorldBuildingPlotIsTemporary(plot);

    if (!isLocalOwner && !isTemporary) {
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
          recordingTileDraw(
            { tileX, tileY },
            DEFINING_WORLD_BUILDING_PLOT_OTHER_OWNER_FILL_COLOR,
            DEFINING_WORLD_BUILDING_PLOT_OTHER_OWNER_TOP_FILL_ALPHA,
          );
        }
      }
      continue;
    }

    if (!isLocalOwner || !isTemporary) {
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
          recordingTileDraw(
            { tileX, tileY },
            DEFINING_WORLD_BUILDING_PLOT_CLAIM_FILL_COLOR,
            DEFINING_WORLD_BUILDING_PLOT_CLAIM_TOP_FILL_ALPHA,
          );
        }
      }
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
        recordingTileDraw(
          { tileX, tileY },
          DEFINING_WORLD_BUILDING_PLOT_TEMPORARY_CLAIM_FILL_COLOR,
          DEFINING_WORLD_BUILDING_PLOT_TEMPORARY_CLAIM_TOP_FILL_ALPHA,
          DEFINING_WORLD_BUILDING_PLOT_TEMPORARY_CLAIM_BORDER_COLOR,
        );
      }
    }
  }

  return tileDraws;
}
