import type { Graphics } from "pixi.js";

/**
 * Draws one dashed line segment on a Pixi Graphics path.
 *
 * @module components/world/domains/drawingWorldPlazaDashedLineSegmentOnGraphics
 */

/**
 * Appends dashed line geometry between two screen points.
 *
 * @param graphics - Target Pixi Graphics path (caller applies stroke).
 * @param fromX - Start X in screen space.
 * @param fromY - Start Y in screen space.
 * @param toX - End X in screen space.
 * @param toY - End Y in screen space.
 * @param dashLengthPx - Visible dash length in pixels.
 * @param gapLengthPx - Gap length between dashes in pixels.
 */
export function drawingWorldPlazaDashedLineSegmentOnGraphics(
  graphics: Graphics,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  dashLengthPx: number,
  gapLengthPx: number,
): void {
  const deltaX = toX - fromX;
  const deltaY = toY - fromY;
  const segmentLength = Math.hypot(deltaX, deltaY);

  if (segmentLength === 0) {
    return;
  }

  const unitX = deltaX / segmentLength;
  const unitY = deltaY / segmentLength;
  let traveledPx = 0;
  let isDrawingDash = true;
  let currentX = fromX;
  let currentY = fromY;

  while (traveledPx < segmentLength) {
    const patternLengthPx = isDrawingDash ? dashLengthPx : gapLengthPx;
    const remainingPx = segmentLength - traveledPx;
    const stepPx = Math.min(patternLengthPx, remainingPx);
    const nextX = currentX + unitX * stepPx;
    const nextY = currentY + unitY * stepPx;

    if (isDrawingDash) {
      graphics.moveTo(currentX, currentY);
      graphics.lineTo(nextX, nextY);
    }

    currentX = nextX;
    currentY = nextY;
    traveledPx += stepPx;
    isDrawingDash = !isDrawingDash;
  }
}
