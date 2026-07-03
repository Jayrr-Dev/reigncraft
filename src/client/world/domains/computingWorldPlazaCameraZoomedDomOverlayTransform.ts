import { DEFINING_WORLD_PLAZA_CAMERA_ZOOM } from "@/components/world/domains/definingWorldPlazaCameraConstants";

/** CSS transform-origin for plaza avatar DOM overlays (bottom-center anchor). */
export const COMPUTING_WORLD_PLAZA_CAMERA_ZOOMED_DOM_OVERLAY_TRANSFORM_ORIGIN =
  "bottom center" as const;

/**
 * Outer CSS transform that pins a DOM overlay above an avatar in viewport space.
 *
 * Pair with an inner wrapper using {@link computingWorldPlazaCameraZoomedDomOverlayScaleStyle}
 * so label size tracks camera zoom.
 *
 * @param viewportX - Horizontal viewport position (pixels).
 * @param viewportY - Vertical viewport position (pixels).
 */
export function computingWorldPlazaCameraZoomedDomOverlayPositionTransform(
  viewportX: number,
  viewportY: number,
): string {
  return `translate(${viewportX}px, ${viewportY}px) translate(-50%, -100%)`;
}

/**
 * Inner CSS scale so DOM overlays match the zoomed Pixi world size.
 *
 * @param worldZoom - Effective world-container zoom for the current viewport.
 */
export function computingWorldPlazaCameraZoomedDomOverlayScaleStyle(
  worldZoom: number = DEFINING_WORLD_PLAZA_CAMERA_ZOOM,
): {
  transform: string;
  transformOrigin: typeof COMPUTING_WORLD_PLAZA_CAMERA_ZOOMED_DOM_OVERLAY_TRANSFORM_ORIGIN;
} {
  return {
    transform: `scale(${worldZoom})`,
    transformOrigin: COMPUTING_WORLD_PLAZA_CAMERA_ZOOMED_DOM_OVERLAY_TRANSFORM_ORIGIN,
  };
}

/**
 * Applies the live camera zoom scale to a DOM overlay element.
 *
 * @param element - Overlay inner wrapper to scale.
 * @param worldZoom - Effective world-container zoom for the current viewport.
 */
export function applyingWorldPlazaCameraZoomedDomOverlayScaleToElement(
  element: HTMLElement | null | undefined,
  worldZoom: number,
): void {
  if (!element) {
    return;
  }

  const scaleStyle = computingWorldPlazaCameraZoomedDomOverlayScaleStyle(worldZoom);
  element.style.transform = scaleStyle.transform;
  element.style.transformOrigin = scaleStyle.transformOrigin;
}

/**
 * Effective viewport size in unscaled isometric world-local pixels.
 *
 * @param viewportSizePx - Live Pixi screen width or height.
 */
export function computingWorldPlazaCameraZoomedViewportWorldLocalSizePx(
  viewportSizePx: number,
): number {
  return viewportSizePx / DEFINING_WORLD_PLAZA_CAMERA_ZOOM;
}
