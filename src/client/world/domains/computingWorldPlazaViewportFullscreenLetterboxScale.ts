import type { DefiningWorldPlazaPixiViewportSize } from "@/components/world/domains/resolvingWorldPlazaPixiViewportSize";

/**
 * Computes uniform letterbox scale for a locked plaza viewport in fullscreen.
 *
 * @module components/world/domains/computingWorldPlazaViewportFullscreenLetterboxScale
 */

/**
 * Returns the largest uniform scale that fits the locked viewport inside the host.
 *
 * @param hostWidthPx - Fullscreen host width in CSS pixels.
 * @param hostHeightPx - Fullscreen host height in CSS pixels.
 * @param lockedViewport - Internal Pixi viewport size to preserve.
 */
export function computingWorldPlazaViewportFullscreenLetterboxScale(
  hostWidthPx: number,
  hostHeightPx: number,
  lockedViewport: DefiningWorldPlazaPixiViewportSize,
): number {
  if (
    hostWidthPx <= 0 ||
    hostHeightPx <= 0 ||
    lockedViewport.width <= 0 ||
    lockedViewport.height <= 0
  ) {
    return 1;
  }

  return Math.min(
    hostWidthPx / lockedViewport.width,
    hostHeightPx / lockedViewport.height,
  );
}
