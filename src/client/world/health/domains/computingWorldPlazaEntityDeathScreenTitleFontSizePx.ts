/**
 * Scales death-screen title font size so one line fits the available width.
 *
 * @module components/world/health/domains/computingWorldPlazaEntityDeathScreenTitleFontSizePx
 */

export type ComputingWorldPlazaEntityDeathScreenTitleFontSizePxInput = {
  availableWidthPx: number;
  naturalWidthPx: number;
  maxFontSizePx: number;
  minFontSizePx: number;
};

/**
 * Returns a font size that keeps the title on one line within `availableWidthPx`.
 * Assumes `naturalWidthPx` was measured at `maxFontSizePx`.
 */
export function computingWorldPlazaEntityDeathScreenTitleFontSizePx({
  availableWidthPx,
  naturalWidthPx,
  maxFontSizePx,
  minFontSizePx,
}: ComputingWorldPlazaEntityDeathScreenTitleFontSizePxInput): number {
  if (
    availableWidthPx <= 0 ||
    naturalWidthPx <= 0 ||
    maxFontSizePx <= 0 ||
    minFontSizePx <= 0
  ) {
    return maxFontSizePx;
  }

  if (naturalWidthPx <= availableWidthPx) {
    return maxFontSizePx;
  }

  const scaledFontSizePx =
    maxFontSizePx * (availableWidthPx / naturalWidthPx);

  return Math.max(minFontSizePx, scaledFontSizePx);
}
