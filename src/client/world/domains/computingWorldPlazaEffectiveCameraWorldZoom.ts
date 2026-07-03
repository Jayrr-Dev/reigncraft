import {
  DEFINING_WORLD_PLAZA_CAMERA_MOBILE_ZOOM,
  DEFINING_WORLD_PLAZA_CAMERA_ZOOM,
} from "@/components/world/domains/definingWorldPlazaCameraConstants";
import type { DefiningWorldPlazaPixiViewportSize } from "@/components/world/domains/resolvingWorldPlazaPixiViewportSize";

/**
 * Resolves the base world-container zoom before fullscreen compensation.
 *
 * @param isMobile - True on narrow viewports where the camera pulls back further.
 */
export function resolvingWorldPlazaBaseCameraWorldZoom(isMobile = false): number {
  return isMobile
    ? DEFINING_WORLD_PLAZA_CAMERA_MOBILE_ZOOM
    : DEFINING_WORLD_PLAZA_CAMERA_ZOOM;
}

/**
 * Resolves world-container zoom so a larger fullscreen viewport keeps the same
 * visible map area as the embedded logical viewport.
 *
 * @param liveViewportSize - Current Pixi screen dimensions.
 * @param fullscreenLogicalViewport - Embedded viewport locked on fullscreen enter.
 * @param isMobile - True on narrow viewports where the camera pulls back further.
 */
export function computingWorldPlazaEffectiveCameraWorldZoom(
  liveViewportSize: DefiningWorldPlazaPixiViewportSize,
  fullscreenLogicalViewport: DefiningWorldPlazaPixiViewportSize | null,
  isMobile = false,
): number {
  const baseCameraZoom = resolvingWorldPlazaBaseCameraWorldZoom(isMobile);

  if (
    !fullscreenLogicalViewport ||
    fullscreenLogicalViewport.width <= 0 ||
    liveViewportSize.width <= 0
  ) {
    return baseCameraZoom;
  }

  return (
    baseCameraZoom *
    (liveViewportSize.width / fullscreenLogicalViewport.width)
  );
}
