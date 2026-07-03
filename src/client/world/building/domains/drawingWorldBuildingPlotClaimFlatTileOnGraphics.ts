import { computingWorldBuildingBlockSideFillColor } from "@/components/world/building/domains/computingWorldBuildingBlockSideFillColor";
import { DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_OVERLAY_RAISED_TERRAIN_BLOCK_HEIGHT_LAYERS } from "@/components/world/building/domains/definingWorldBuildingClaimModeConstants";
import { drawingWorldBuildingFlatWorldLayerTileOnGraphics } from "@/components/world/building/domains/drawingWorldBuildingFlatWorldLayerTileOnGraphics";
import { drawingWorldBuildingIsometricTileColumnExtrusionSpanOnGraphics } from "@/components/world/building/domains/drawingWorldBuildingIsometricTileColumnExtrusionOnGraphics";
import {
  DEFINING_WORLD_BUILDING_PLOT_CLAIM_BORDER_COLOR,
  DEFINING_WORLD_BUILDING_PLOT_CLAIM_WORLD_LAYER,
} from "@/components/world/building/domains/definingWorldBuildingPlotClaimConstants";
import type { ResolvingWorldBuildingClaimModePlotOverlayRenderLayer } from "@/components/world/building/domains/resolvingWorldBuildingClaimModePlotOverlayZIndex";
import { drawingWorldPlazaDashedIsometricTileDiamondStrokeOnGraphics } from "@/components/world/domains/drawingWorldPlazaDashedIsometricTileDiamondStrokeOnGraphics";
import { checkingWorldPlazaTerrainElevationTileHasHigherElevationNeighborAtTileIndex } from "@/components/world/domains/checkingWorldPlazaTerrainElevationTileHasHigherElevationNeighborAtTileIndex";
import { checkingWorldPlazaTerrainElevationHasRaisedSurfaceAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex";
import type { Graphics } from "pixi.js";

/**
 * Draws one owned or preview plot tile with an orange fill and dashed black border.
 *
 * @module components/world/building/domains/drawingWorldBuildingPlotClaimFlatTileOnGraphics
 */

/** Opaque enough that grass does not bleed through the top cap. */
const DRAWING_WORLD_BUILDING_PLOT_CLAIM_TOP_CAP_MIN_FILL_ALPHA = 0.9;

/** Input for {@link drawingWorldBuildingPlotClaimFlatTileOnGraphics}. */
export interface DrawingWorldBuildingPlotClaimFlatTileOnGraphicsInput {
  readonly graphics: Graphics;
  readonly tileX: number;
  readonly tileY: number;
  readonly fillColor: number;
  readonly fillAlpha: number;
  readonly strokeColor?: number;
  readonly renderLayer?: ResolvingWorldBuildingClaimModePlotOverlayRenderLayer;
}

/**
 * Returns the render layer for one claim overlay tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldBuildingPlotClaimOverlayRenderLayer(
  tileX: number,
  tileY: number,
): ResolvingWorldBuildingClaimModePlotOverlayRenderLayer {
  if (checkingWorldPlazaTerrainElevationHasRaisedSurfaceAtTileIndex(tileX, tileY)) {
    return "entity";
  }

  if (
    checkingWorldPlazaTerrainElevationTileHasHigherElevationNeighborAtTileIndex(
      tileX,
      tileY,
    )
  ) {
    return "entity";
  }

  return "floor";
}

/**
 * Returns true when a claim overlay should use raised terrain extrusion drawing.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldBuildingPlotClaimOverlayUsesRaisedTerrainExtrusion(
  tileX: number,
  tileY: number,
): boolean {
  return checkingWorldPlazaTerrainElevationHasRaisedSurfaceAtTileIndex(tileX, tileY);
}

/**
 * Draws a plot claim marker using the same ground-layer column rules as 2D blocks.
 *
 * @param input - Tile indices, styling, and render layer.
 */
export function drawingWorldBuildingPlotClaimFlatTileOnGraphics(
  input: DrawingWorldBuildingPlotClaimFlatTileOnGraphicsInput,
): void {
  const strokeColor =
    input.strokeColor ?? DEFINING_WORLD_BUILDING_PLOT_CLAIM_BORDER_COLOR;
  const renderLayer =
    input.renderLayer ??
    resolvingWorldBuildingPlotClaimOverlayRenderLayer(
      input.tileX,
      input.tileY,
    );
  const topFillAlpha = Math.max(
    input.fillAlpha,
    DRAWING_WORLD_BUILDING_PLOT_CLAIM_TOP_CAP_MIN_FILL_ALPHA,
  );
  const usesRaisedTerrainExtrusion = checkingWorldBuildingPlotClaimOverlayUsesRaisedTerrainExtrusion(
    input.tileX,
    input.tileY,
  );

  if (renderLayer === "entity" && usesRaisedTerrainExtrusion) {
    drawingWorldBuildingIsometricTileColumnExtrusionSpanOnGraphics({
      graphics: input.graphics,
      tileX: input.tileX,
      tileY: input.tileY,
      worldLayer: DEFINING_WORLD_BUILDING_PLOT_CLAIM_WORLD_LAYER,
      blockHeightLayers:
        DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_OVERLAY_RAISED_TERRAIN_BLOCK_HEIGHT_LAYERS,
      topFillColor: input.fillColor,
      strokeColor,
      sideFillColor: computingWorldBuildingBlockSideFillColor(input.fillColor),
      topFillAlpha,
      topStrokeAlpha: 0,
      topCapOutlineMode: "exposedTopEdgesOnly",
    });
  } else {
    drawingWorldBuildingFlatWorldLayerTileOnGraphics({
      graphics: input.graphics,
      tileX: input.tileX,
      tileY: input.tileY,
      worldLayer: DEFINING_WORLD_BUILDING_PLOT_CLAIM_WORLD_LAYER,
      fillColor: input.fillColor,
      strokeColor,
      fillAlpha: topFillAlpha,
      strokeAlpha: 0,
      topCapOutlineMode: "exposedTopEdgesOnly",
    });
  }

  drawingWorldPlazaDashedIsometricTileDiamondStrokeOnGraphics(
    input.graphics,
    input.tileX,
    input.tileY,
    strokeColor,
    DEFINING_WORLD_BUILDING_PLOT_CLAIM_WORLD_LAYER,
  );
}