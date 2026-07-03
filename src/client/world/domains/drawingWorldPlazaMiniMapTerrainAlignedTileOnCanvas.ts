import {
  computingWorldPlazaMiniMapTerrainAlignedHalfExtentsPx,
} from "@/components/world/domains/computingWorldPlazaMiniMapCanvasPointFromGridPoint";
import type { ComputingWorldPlazaMiniMapLayout } from "@/components/world/domains/computingWorldPlazaMiniMapLayout";

/** Center point for one terrain-aligned minimap tile diamond. */
export interface DrawingWorldPlazaMiniMapTerrainAlignedTileCenter {
  readonly x: number;
  readonly y: number;
}

/** Input for {@link drawingWorldPlazaMiniMapTerrainAlignedTileFillOnCanvas}. */
export interface DrawingWorldPlazaMiniMapTerrainAlignedTileFillOnCanvasInput {
  readonly context: CanvasRenderingContext2D;
  readonly layout: ComputingWorldPlazaMiniMapLayout;
  readonly center: DrawingWorldPlazaMiniMapTerrainAlignedTileCenter;
  readonly fillColor: string;
}

/** Input for {@link drawingWorldPlazaMiniMapTerrainAlignedTileStrokeOnCanvas}. */
export interface DrawingWorldPlazaMiniMapTerrainAlignedTileStrokeOnCanvasInput {
  readonly context: CanvasRenderingContext2D;
  readonly layout: ComputingWorldPlazaMiniMapLayout;
  readonly center: DrawingWorldPlazaMiniMapTerrainAlignedTileCenter;
  readonly strokeColor: string;
  readonly lineWidth?: number;
  readonly dashPattern?: readonly number[];
}

/**
 * Traces one terrain-aligned isometric tile diamond on the canvas path.
 *
 * @param context - Canvas 2D context.
 * @param centerX - Diamond center X in CSS pixels.
 * @param centerY - Diamond center Y in CSS pixels.
 * @param halfWidthPx - Half tile width in CSS pixels.
 * @param halfHeightPx - Half tile height in CSS pixels.
 */
export function tracingWorldPlazaMiniMapTerrainAlignedTileDiamondPathOnCanvas(
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  halfWidthPx: number,
  halfHeightPx: number,
): void {
  context.moveTo(centerX, centerY - halfHeightPx);
  context.lineTo(centerX + halfWidthPx, centerY);
  context.lineTo(centerX, centerY + halfHeightPx);
  context.lineTo(centerX - halfWidthPx, centerY);
  context.closePath();
}

/**
 * Fills one terrain-aligned isometric tile diamond on the minimap.
 *
 * @param input - Canvas context, layout, center, and fill color.
 */
export function drawingWorldPlazaMiniMapTerrainAlignedTileFillOnCanvas(
  input: DrawingWorldPlazaMiniMapTerrainAlignedTileFillOnCanvasInput,
): void {
  const { halfWidthPx, halfHeightPx } =
    computingWorldPlazaMiniMapTerrainAlignedHalfExtentsPx(input.layout.pixelsPerTile);

  input.context.beginPath();
  tracingWorldPlazaMiniMapTerrainAlignedTileDiamondPathOnCanvas(
    input.context,
    input.center.x,
    input.center.y,
    halfWidthPx,
    halfHeightPx,
  );
  input.context.fillStyle = input.fillColor;
  input.context.fill();
}

/**
 * Strokes one terrain-aligned isometric tile diamond on the minimap.
 *
 * @param input - Canvas context, layout, center, and stroke options.
 */
export function drawingWorldPlazaMiniMapTerrainAlignedTileStrokeOnCanvas(
  input: DrawingWorldPlazaMiniMapTerrainAlignedTileStrokeOnCanvasInput,
): void {
  const { halfWidthPx, halfHeightPx } =
    computingWorldPlazaMiniMapTerrainAlignedHalfExtentsPx(input.layout.pixelsPerTile);

  input.context.beginPath();
  tracingWorldPlazaMiniMapTerrainAlignedTileDiamondPathOnCanvas(
    input.context,
    input.center.x,
    input.center.y,
    halfWidthPx,
    halfHeightPx,
  );
  input.context.strokeStyle = input.strokeColor;
  input.context.lineWidth = input.lineWidth ?? 1;
  input.context.setLineDash(input.dashPattern ? [...input.dashPattern] : []);
  input.context.stroke();
  input.context.setLineDash([]);
}

/**
 * Fills many terrain-aligned tile diamonds that share one fill color.
 *
 * @param context - Canvas 2D context.
 * @param layout - Active minimap layout.
 * @param centers - Diamond centers in CSS pixels.
 * @param fillColor - Shared fill color.
 */
export function drawingWorldPlazaMiniMapTerrainAlignedTileBatchFillOnCanvas(
  context: CanvasRenderingContext2D,
  layout: ComputingWorldPlazaMiniMapLayout,
  centers: readonly DrawingWorldPlazaMiniMapTerrainAlignedTileCenter[],
  fillColor: string,
): void {
  if (centers.length === 0) {
    return;
  }

  const { halfWidthPx, halfHeightPx } =
    computingWorldPlazaMiniMapTerrainAlignedHalfExtentsPx(layout.pixelsPerTile);

  context.beginPath();

  for (const center of centers) {
    tracingWorldPlazaMiniMapTerrainAlignedTileDiamondPathOnCanvas(
      context,
      center.x,
      center.y,
      halfWidthPx,
      halfHeightPx,
    );
  }

  context.fillStyle = fillColor;
  context.fill();
}
