import type { ComputingWorldPlazaMiniMapLayout } from "@/components/world/domains/computingWorldPlazaMiniMapLayout";
import {
  DEFINING_WORLD_PLAZA_MINI_MAP_EMBEDDED_CANVAS_SIZE_PX,
  DEFINING_WORLD_PLAZA_MINI_MAP_SQUARE_PANEL_CORNER_RADIUS_PX,
  DEFINING_WORLD_PLAZA_MINI_MAP_SQUARE_PANEL_FILL_COLOR,
} from "@/components/world/domains/definingWorldPlazaMiniMapConstants";

/**
 * Paints a frosted square panel behind the terrain-aligned minimap tiles.
 *
 * @param context - Canvas 2D context.
 * @param layout - Active minimap layout.
 */
export function drawingWorldPlazaMiniMapSquarePanelOnCanvas(
  context: CanvasRenderingContext2D,
  layout: ComputingWorldPlazaMiniMapLayout,
): void {
  const canvasSizePx = layout.canvasSizePx;
  const scale =
    canvasSizePx / DEFINING_WORLD_PLAZA_MINI_MAP_EMBEDDED_CANVAS_SIZE_PX;
  const cornerRadiusPx =
    DEFINING_WORLD_PLAZA_MINI_MAP_SQUARE_PANEL_CORNER_RADIUS_PX * scale;

  context.fillStyle = DEFINING_WORLD_PLAZA_MINI_MAP_SQUARE_PANEL_FILL_COLOR;
  context.beginPath();

  if (typeof context.roundRect === "function") {
    context.roundRect(0, 0, canvasSizePx, canvasSizePx, cornerRadiusPx);
  } else {
    context.rect(0, 0, canvasSizePx, canvasSizePx);
  }

  context.fill();
}
