import { computingWorldPlazaViewportFullscreenLetterboxScale } from "@/components/world/domains/computingWorldPlazaViewportFullscreenLetterboxScale";
import type { DefiningWorldPlazaPixiViewportSize } from "@/components/world/domains/resolvingWorldPlazaPixiViewportSize";

/**
 * Computes the letterboxed CSS viewport size for fullscreen plaza rendering.
 *
 * @param hostWidthPx - Fullscreen host width in CSS pixels.
 * @param hostHeightPx - Fullscreen host height in CSS pixels.
 * @param logicalViewport - Embedded internal viewport size to preserve.
 */
export function computingWorldPlazaViewportFullscreenLetterboxDisplaySize(
  hostWidthPx: number,
  hostHeightPx: number,
  logicalViewport: DefiningWorldPlazaPixiViewportSize,
): DefiningWorldPlazaPixiViewportSize {
  const letterboxScale = computingWorldPlazaViewportFullscreenLetterboxScale(
    hostWidthPx,
    hostHeightPx,
    logicalViewport,
  );

  return {
    width: Math.max(1, Math.round(logicalViewport.width * letterboxScale)),
    height: Math.max(1, Math.round(logicalViewport.height * letterboxScale)),
  };
}
