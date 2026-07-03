import {
  computingWorldPlazaMiniMapCanvasDeltaFromGridDelta,
  computingWorldPlazaMiniMapTerrainAlignedHalfExtentsPx,
} from "@/components/world/domains/computingWorldPlazaMiniMapCanvasPointFromGridPoint";
import type { ComputingWorldPlazaMiniMapLayout } from "@/components/world/domains/computingWorldPlazaMiniMapLayout";

/**
 * Returns true when a grid-offset tile should appear inside a square minimap viewport.
 *
 * Isometric projection maps a square grid window to a diamond silhouette. This check
 * keeps the iso layout but includes corner tiles so the visible square fills in.
 *
 * @param tileOffsetX - Tile offset from the anchor center on the X axis.
 * @param tileOffsetY - Tile offset from the anchor center on the Y axis.
 * @param layout - Active minimap layout.
 * @param viewportHalfSizePx - Half of the square viewport width in CSS pixels.
 */
export function checkingWorldPlazaMiniMapTileOffsetIsInsideSquareViewport(
  tileOffsetX: number,
  tileOffsetY: number,
  layout: ComputingWorldPlazaMiniMapLayout,
  viewportHalfSizePx: number,
): boolean {
  const gridDelta = computingWorldPlazaMiniMapCanvasDeltaFromGridDelta(
    tileOffsetX,
    tileOffsetY,
    layout.pixelsPerTile,
  );
  const { halfWidthPx, halfHeightPx } =
    computingWorldPlazaMiniMapTerrainAlignedHalfExtentsPx(layout.pixelsPerTile);
  const tileExtentMarginPx = Math.max(halfWidthPx, halfHeightPx);

  return (
    Math.abs(gridDelta.x) <= viewportHalfSizePx + tileExtentMarginPx &&
    Math.abs(gridDelta.y) <= viewportHalfSizePx + tileExtentMarginPx
  );
}

/**
 * Resolves how far out to scan in grid space to fill a square minimap viewport.
 *
 * @param layout - Active minimap layout.
 * @param viewportHalfSizePx - Half of the square viewport width in CSS pixels.
 */
export function computingWorldPlazaMiniMapSquareViewportBuildRadiusTiles(
  layout: ComputingWorldPlazaMiniMapLayout,
  viewportHalfSizePx: number,
): number {
  const { halfWidthPx, halfHeightPx } =
    computingWorldPlazaMiniMapTerrainAlignedHalfExtentsPx(layout.pixelsPerTile);
  const gridSpanForCanvasAxis = Math.max(
    viewportHalfSizePx / halfWidthPx,
    viewportHalfSizePx / halfHeightPx,
  );

  return Math.max(
    layout.viewRadiusTiles,
    Math.ceil(gridSpanForCanvasAxis),
  );
}
