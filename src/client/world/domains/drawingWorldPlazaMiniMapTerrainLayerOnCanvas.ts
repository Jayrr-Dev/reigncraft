import {
  DEFINING_WORLD_BUILDING_PLOT_CLAIM_MINI_MAP_BORDER_COLOR,
  DEFINING_WORLD_BUILDING_PLOT_CLAIM_MINI_MAP_FILL_COLOR,
} from "@/components/world/building/domains/definingWorldBuildingPlotClaimConstants";
import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";
import { clearingWorldPlazaMiniMapCanvasOnContext } from "@/components/world/domains/clearingWorldPlazaMiniMapCanvasOnContext";
import { computingWorldPlazaMiniMapCanvasPointFromGridPoint } from "@/components/world/domains/computingWorldPlazaMiniMapCanvasPointFromGridPoint";
import type { ComputingWorldPlazaMiniMapLayout } from "@/components/world/domains/computingWorldPlazaMiniMapLayout";
import {
  checkingWorldPlazaMiniMapTileOffsetIsInsideSquareViewport,
  computingWorldPlazaMiniMapSquareViewportBuildRadiusTiles,
} from "@/components/world/domains/computingWorldPlazaMiniMapSquareViewportMetrics";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { drawingWorldPlazaMiniMapColumnRockFootprintsOnTerrainLayer } from "@/components/world/domains/drawingWorldPlazaMiniMapColumnRockFootprintsOnTerrainLayer";
import {
  drawingWorldPlazaMiniMapTerrainAlignedTileBatchFillOnCanvas,
  drawingWorldPlazaMiniMapTerrainAlignedTileFillOnCanvas,
  drawingWorldPlazaMiniMapTerrainAlignedTileStrokeOnCanvas,
} from "@/components/world/domains/drawingWorldPlazaMiniMapTerrainAlignedTileOnCanvas";
import { resolvingWorldPlazaMiniMapTileFillColor } from "@/components/world/domains/resolvingWorldPlazaMiniMapTileFillColor";

/** Minimap dash length for owned plot tile borders. */
const DRAWING_WORLD_PLAZA_MINI_MAP_OWNED_PLOT_BORDER_DASH_LENGTH_PX =
  2 as const;

/** Minimap gap length for owned plot tile borders. */
const DRAWING_WORLD_PLAZA_MINI_MAP_OWNED_PLOT_BORDER_GAP_LENGTH_PX = 2 as const;

/** Input for {@link drawingWorldPlazaMiniMapTerrainLayerOnCanvas}. */
export interface DrawingWorldPlazaMiniMapTerrainLayerOnCanvasInput {
  readonly context: CanvasRenderingContext2D;
  readonly layout: ComputingWorldPlazaMiniMapLayout;
  /** Snapped terrain anchor in grid space (tile center). */
  readonly terrainCenterPosition: DefiningWorldPlazaWorldPoint;
  readonly ownedPlotTilePositions: readonly DefiningWorldBuildingTilePosition[];
  /** Offscreen terrain canvas width and height in CSS pixels. */
  readonly terrainCanvasSizePx?: number;
  /** Tile radius for the cached terrain rebuild. */
  readonly buildViewRadiusTiles?: number;
}

/**
 * Draws one owned plot tile on the minimap terrain layer.
 *
 * @param context - Canvas 2D context.
 * @param tilePosition - Plot tile indices.
 * @param terrainCenterPosition - Snapped terrain anchor in grid space.
 * @param layout - Active minimap layout.
 */
function drawingWorldPlazaMiniMapOwnedPlotTileOnTerrainLayer(
  context: CanvasRenderingContext2D,
  tilePosition: DefiningWorldBuildingTilePosition,
  terrainCenterPosition: DefiningWorldPlazaWorldPoint,
  layout: ComputingWorldPlazaMiniMapLayout,
  canvasCenterPx: number,
): void {
  const tileCenter = computingWorldPlazaMiniMapCanvasPointFromGridPoint({
    gridPoint: { x: tilePosition.tileX, y: tilePosition.tileY },
    centerPosition: terrainCenterPosition,
    layout,
    canvasCenterPx,
  });

  drawingWorldPlazaMiniMapTerrainAlignedTileFillOnCanvas({
    context,
    layout,
    center: tileCenter,
    fillColor: DEFINING_WORLD_BUILDING_PLOT_CLAIM_MINI_MAP_FILL_COLOR,
  });
  drawingWorldPlazaMiniMapTerrainAlignedTileStrokeOnCanvas({
    context,
    layout,
    center: tileCenter,
    strokeColor: DEFINING_WORLD_BUILDING_PLOT_CLAIM_MINI_MAP_BORDER_COLOR,
    dashPattern: [
      DRAWING_WORLD_PLAZA_MINI_MAP_OWNED_PLOT_BORDER_DASH_LENGTH_PX,
      DRAWING_WORLD_PLAZA_MINI_MAP_OWNED_PLOT_BORDER_GAP_LENGTH_PX,
    ],
  });
}

/**
 * Draws terrain tiles batched by fill color onto an offscreen canvas.
 *
 * @param input - Canvas context, layout, snapped center, and plot tiles.
 */
export function drawingWorldPlazaMiniMapTerrainLayerOnCanvas(
  input: DrawingWorldPlazaMiniMapTerrainLayerOnCanvasInput,
): void {
  const { context, layout, terrainCenterPosition, ownedPlotTilePositions } =
    input;
  const terrainCanvasSizePx = input.terrainCanvasSizePx ?? layout.canvasSizePx;
  const canvasCenterPx = terrainCanvasSizePx / 2;
  const viewportHalfSizePx = canvasCenterPx;
  const buildRadiusTiles =
    input.buildViewRadiusTiles ??
    computingWorldPlazaMiniMapSquareViewportBuildRadiusTiles(
      layout,
      viewportHalfSizePx,
    );
  const centerTileX = Math.floor(terrainCenterPosition.x);
  const centerTileY = Math.floor(terrainCenterPosition.y);
  const tileCentersByFillColor = new Map<string, { x: number; y: number }[]>();

  clearingWorldPlazaMiniMapCanvasOnContext(context, terrainCanvasSizePx);

  for (
    let tileOffsetY = -buildRadiusTiles;
    tileOffsetY <= buildRadiusTiles;
    tileOffsetY += 1
  ) {
    for (
      let tileOffsetX = -buildRadiusTiles;
      tileOffsetX <= buildRadiusTiles;
      tileOffsetX += 1
    ) {
      if (
        !checkingWorldPlazaMiniMapTileOffsetIsInsideSquareViewport(
          tileOffsetX,
          tileOffsetY,
          layout,
          viewportHalfSizePx,
        )
      ) {
        continue;
      }

      const tileX = centerTileX + tileOffsetX;
      const tileY = centerTileY + tileOffsetY;
      const tileCenter = computingWorldPlazaMiniMapCanvasPointFromGridPoint({
        gridPoint: { x: tileX, y: tileY },
        centerPosition: terrainCenterPosition,
        layout,
        canvasCenterPx,
      });
      const fillColor = resolvingWorldPlazaMiniMapTileFillColor(tileX, tileY);
      const tileCenters = tileCentersByFillColor.get(fillColor) ?? [];

      tileCenters.push(tileCenter);
      tileCentersByFillColor.set(fillColor, tileCenters);
    }
  }

  for (const [fillColor, tileCenters] of tileCentersByFillColor) {
    drawingWorldPlazaMiniMapTerrainAlignedTileBatchFillOnCanvas(
      context,
      layout,
      tileCenters,
      fillColor,
    );
  }

  for (const ownedPlotTilePosition of ownedPlotTilePositions) {
    drawingWorldPlazaMiniMapOwnedPlotTileOnTerrainLayer(
      context,
      ownedPlotTilePosition,
      terrainCenterPosition,
      layout,
      canvasCenterPx,
    );
  }

  drawingWorldPlazaMiniMapColumnRockFootprintsOnTerrainLayer({
    context,
    layout,
    terrainCenterPosition,
    centerTileX,
    centerTileY,
    viewRadiusTiles: buildRadiusTiles,
    terrainCanvasSizePx,
  });
}
