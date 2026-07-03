import type { ComputingWorldPlazaMiniMapLayout } from "@/components/world/domains/computingWorldPlazaMiniMapLayout";
import {
  DEFINING_WORLD_PLAZA_MINI_MAP_BOULDER_FOOTPRINT_BORDER_COLOR,
} from "@/components/world/domains/definingWorldPlazaMiniMapConstants";
import {
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_MIN_FOOTPRINT_TILE_SPAN,
} from "@/components/world/domains/definingWorldPlazaTerrainRockConstants";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import {
  computingWorldPlazaMiniMapCanvasPointFromGridPoint,
  computingWorldPlazaMiniMapTerrainAlignedHalfExtentsPx,
} from "@/components/world/domains/computingWorldPlazaMiniMapCanvasPointFromGridPoint";
import { listingWorldPlazaColumnRockMiniMapFootprintsInTileWindow } from "@/components/world/domains/listingWorldPlazaColumnRockMiniMapFootprintsInTileWindow";
import type { DefiningWorldPlazaColumnRockMetadata } from "@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex";
import { resolvingWorldPlazaMiniMapBoulderFillColorFromSurfaceWorldLayer } from "@/components/world/domains/resolvingWorldPlazaMiniMapBoulderFillColorFromSurfaceWorldLayer";

/**
 * Draws multi-tile boulder footprints on the minimap terrain layer.
 *
 * @module components/world/domains/drawingWorldPlazaMiniMapColumnRockFootprintsOnTerrainLayer
 */

/** Input for {@link drawingWorldPlazaMiniMapColumnRockFootprintsOnTerrainLayer}. */
export interface DrawingWorldPlazaMiniMapColumnRockFootprintsOnTerrainLayerInput {
  readonly context: CanvasRenderingContext2D;
  readonly layout: ComputingWorldPlazaMiniMapLayout;
  readonly terrainCenterPosition: DefiningWorldPlazaWorldPoint;
  readonly centerTileX: number;
  readonly centerTileY: number;
  readonly viewRadiusTiles: number;
  readonly terrainCanvasSizePx: number;
}

/**
 * Draws one mega-boulder footprint rectangle sized to its occupied tile span.
 *
 * @param context - Canvas 2D context.
 * @param metadata - Anchor column-rock metadata.
 * @param terrainCenterPosition - Snapped terrain anchor in grid space.
 * @param layout - Active minimap layout.
 * @param canvasCenterPx - Center of the offscreen terrain canvas in CSS pixels.
 */
function drawingWorldPlazaMiniMapColumnRockFootprintOnTerrainLayer(
  context: CanvasRenderingContext2D,
  metadata: DefiningWorldPlazaColumnRockMetadata,
  terrainCenterPosition: DefiningWorldPlazaWorldPoint,
  layout: ComputingWorldPlazaMiniMapLayout,
  canvasCenterPx: number,
): void {
  const { halfWidthPx, halfHeightPx } =
    computingWorldPlazaMiniMapTerrainAlignedHalfExtentsPx(layout.pixelsPerTile);
  const projectedCornerPoints: DefiningWorldPlazaWorldPoint[] = [];

  for (
    let tileOffsetY = 0;
    tileOffsetY < metadata.footprintTileHeight;
    tileOffsetY += 1
  ) {
    for (
      let tileOffsetX = 0;
      tileOffsetX < metadata.footprintTileWidth;
      tileOffsetX += 1
    ) {
      projectedCornerPoints.push(
        computingWorldPlazaMiniMapCanvasPointFromGridPoint({
          gridPoint: {
            x: metadata.anchorTileX + tileOffsetX,
            y: metadata.anchorTileY + tileOffsetY,
          },
          centerPosition: terrainCenterPosition,
          layout,
          canvasCenterPx,
        }),
      );
    }
  }

  const rectLeft =
    Math.min(...projectedCornerPoints.map((point) => point.x)) - halfWidthPx;
  const rectTop =
    Math.min(...projectedCornerPoints.map((point) => point.y)) - halfHeightPx;
  const rectRight =
    Math.max(...projectedCornerPoints.map((point) => point.x)) + halfWidthPx;
  const rectBottom =
    Math.max(...projectedCornerPoints.map((point) => point.y)) + halfHeightPx;
  const rectWidth = rectRight - rectLeft;
  const rectHeight = rectBottom - rectTop;
  const borderWidthPx = Math.max(
    1,
    Math.min(
      3,
      Math.max(metadata.footprintTileWidth, metadata.footprintTileHeight) * 0.35,
    ),
  );

  context.fillStyle = resolvingWorldPlazaMiniMapBoulderFillColorFromSurfaceWorldLayer(
    metadata.surfaceWorldLayer,
  );
  context.fillRect(rectLeft, rectTop, rectWidth, rectHeight);
  context.strokeStyle = DEFINING_WORLD_PLAZA_MINI_MAP_BOULDER_FOOTPRINT_BORDER_COLOR;
  context.lineWidth = borderWidthPx;
  context.strokeRect(
    rectLeft + borderWidthPx / 2,
    rectTop + borderWidthPx / 2,
    rectWidth - borderWidthPx,
    rectHeight - borderWidthPx,
  );
}

/**
 * Draws footprint rectangles for every multi-tile boulder in the rebuild window.
 *
 * Single-tile boulders are already colored per tile; only spans larger than 1x1
 * get a merged footprint overlay so size reads clearly on the minimap.
 *
 * @param input - Canvas context, layout, center, and rebuild radius.
 */
export function drawingWorldPlazaMiniMapColumnRockFootprintsOnTerrainLayer(
  input: DrawingWorldPlazaMiniMapColumnRockFootprintsOnTerrainLayerInput,
): void {
  for (const columnRockMetadata of listingWorldPlazaColumnRockMiniMapFootprintsInTileWindow(
    input.centerTileX,
    input.centerTileY,
    input.viewRadiusTiles,
  )) {
    if (
      columnRockMetadata.footprintTileWidth <=
        DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_MIN_FOOTPRINT_TILE_SPAN &&
      columnRockMetadata.footprintTileHeight <=
        DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_MIN_FOOTPRINT_TILE_SPAN
    ) {
      continue;
    }

    drawingWorldPlazaMiniMapColumnRockFootprintOnTerrainLayer(
      input.context,
      columnRockMetadata,
      input.terrainCenterPosition,
      input.layout,
      input.terrainCanvasSizePx / 2,
    );
  }
}
