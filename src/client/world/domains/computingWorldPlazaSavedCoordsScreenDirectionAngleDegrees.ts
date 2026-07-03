/**
 * Computes the screen-space angle from one viewport point toward another.
 *
 * @param originViewportPoint - Screen position of the origin (player).
 * @param targetViewportPoint - Screen position of the destination (saved tile).
 * @returns Rotation angle in degrees for a CSS transform (0 points right).
 */
export function computingWorldPlazaSavedCoordsScreenDirectionAngleDegrees(
  originViewportPoint: { readonly x: number; readonly y: number },
  targetViewportPoint: { readonly x: number; readonly y: number },
): number {
  const deltaX = targetViewportPoint.x - originViewportPoint.x;
  const deltaY = targetViewportPoint.y - originViewportPoint.y;

  return (Math.atan2(deltaY, deltaX) * 180) / Math.PI + 90;
}
