/**
 * Clears a minimap canvas to fully transparent pixels.
 *
 * @param context - Canvas 2D context.
 * @param canvasSizePx - Canvas width and height in CSS pixels.
 */
export function clearingWorldPlazaMiniMapCanvasOnContext(
  context: CanvasRenderingContext2D,
  canvasSizePx: number,
): void {
  context.clearRect(0, 0, canvasSizePx, canvasSizePx);
}
