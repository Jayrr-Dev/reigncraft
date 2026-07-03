/**
 * Returns the vertical screen offset for a jump arc at the given progress.
 *
 * Progress 0 and 1 sit on the ground; 0.5 reaches the peak lift.
 *
 * @param progress - Normalized jump progress from 0 (start) to 1 (landed).
 * @param arcPeakScreenPx - Peak lift for this jump instance.
 */
export function computingWorldPlazaGirlSampleJumpArcOffsetPx(
  progress: number,
  arcPeakScreenPx: number,
): number {
  const clampedProgress = Math.min(1, Math.max(0, progress));

  return -Math.sin(clampedProgress * Math.PI) * arcPeakScreenPx;
}
