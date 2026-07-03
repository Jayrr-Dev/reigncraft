import type { ComputingWorldPlazaMiniMapLayout } from "@/components/world/domains/computingWorldPlazaMiniMapLayout";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";

/** Input for {@link computingWorldPlazaMiniMapCanvasPointFromGridPoint}. */
export interface ComputingWorldPlazaMiniMapCanvasPointFromGridPointInput {
  /** Position in world grid space. */
  readonly gridPoint: DefiningWorldPlazaWorldPoint;
  /** Reference position in grid space (player or terrain anchor). */
  readonly centerPosition: DefiningWorldPlazaWorldPoint;
  /** Active minimap layout. */
  readonly layout: ComputingWorldPlazaMiniMapLayout;
  /** Optional canvas center override for padded terrain buffers. */
  readonly canvasCenterPx?: number;
}

/** Half-extents for one terrain-aligned minimap tile diamond. */
export interface ComputingWorldPlazaMiniMapTerrainAlignedHalfExtentsPx {
  readonly halfWidthPx: number;
  readonly halfHeightPx: number;
}

/**
 * Resolves 2:1 isometric half-extents for terrain-aligned minimap tiles.
 *
 * @param pixelsPerTile - Minimap scale in CSS pixels per full tile width.
 */
export function computingWorldPlazaMiniMapTerrainAlignedHalfExtentsPx(
  pixelsPerTile: number,
): ComputingWorldPlazaMiniMapTerrainAlignedHalfExtentsPx {
  return {
    halfWidthPx: pixelsPerTile / 2,
    halfHeightPx: pixelsPerTile / 4,
  };
}

/**
 * Maps a grid delta to minimap canvas pixels using the plaza 2:1 isometric layout.
 *
 * Matches {@link convertingWorldPlazaGridPointToIsometricScreenPoint} so the
 * minimap rotation and spacing align with the main terrain view.
 *
 * @param deltaX - Grid delta on the X axis.
 * @param deltaY - Grid delta on the Y axis.
 * @param pixelsPerTile - Minimap scale in CSS pixels per grid tile.
 */
export function computingWorldPlazaMiniMapCanvasDeltaFromGridDelta(
  deltaX: number,
  deltaY: number,
  pixelsPerTile: number,
): DefiningWorldPlazaWorldPoint {
  const { halfWidthPx, halfHeightPx } =
    computingWorldPlazaMiniMapTerrainAlignedHalfExtentsPx(pixelsPerTile);

  return {
    x: (deltaX - deltaY) * halfWidthPx,
    y: (deltaX + deltaY) * halfHeightPx,
  };
}

/**
 * Maps a plaza grid point to minimap canvas coordinates.
 *
 * @param input - Grid point, center reference, layout, and optional canvas center.
 */
export function computingWorldPlazaMiniMapCanvasPointFromGridPoint(
  input: ComputingWorldPlazaMiniMapCanvasPointFromGridPointInput,
): DefiningWorldPlazaWorldPoint {
  const canvasCenterPx =
    input.canvasCenterPx ?? input.layout.canvasSizePx / 2;
  const gridDelta = computingWorldPlazaMiniMapCanvasDeltaFromGridDelta(
    input.gridPoint.x - input.centerPosition.x,
    input.gridPoint.y - input.centerPosition.y,
    input.layout.pixelsPerTile,
  );

  return {
    x: canvasCenterPx + gridDelta.x,
    y: canvasCenterPx + gridDelta.y,
  };
}
