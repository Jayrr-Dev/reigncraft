import {
  DEFINING_WORLD_PLAZA_CAMERA_VISIBLE_TILE_BOUNDS_REFERENCE_ZOOM,
  DEFINING_WORLD_PLAZA_CAMERA_ZOOM,
} from '@/components/world/domains/definingWorldPlazaCameraConstants';
import { computingWorldPlazaAnchoredPopoverViewportShiftX } from '@/components/world/domains/computingWorldPlazaAnchoredPopoverViewportShiftX';
import { DEFINING_WORLD_PLAZA_ANCHORED_POPOVER_VIEWPORT_EDGE_INSET_PX } from '@/components/world/domains/definingWorldPlazaAnchoredPopoverViewportConstants';

/** CSS transform-origin for plaza avatar DOM overlays (bottom-center anchor). */
export const COMPUTING_WORLD_PLAZA_CAMERA_ZOOMED_DOM_OVERLAY_TRANSFORM_ORIGIN =
  'bottom center' as const;

/**
 * Outer CSS transform that pins a DOM overlay above an avatar in viewport space.
 *
 * Pair with an inner wrapper using {@link computingWorldPlazaCameraZoomedDomOverlayScaleStyle}
 * so label size tracks camera zoom.
 *
 * @param viewportX - Horizontal viewport position (pixels).
 * @param viewportY - Vertical viewport position (pixels).
 * @param shiftXPx - Extra horizontal shift after centering (viewport collision).
 */
export function computingWorldPlazaCameraZoomedDomOverlayPositionTransform(
  viewportX: number,
  viewportY: number,
  shiftXPx: number = 0
): string {
  return `translate3d(${Math.round(viewportX + shiftXPx)}px, ${Math.round(viewportY)}px, 0) translate(-50%, -100%)`;
}

/**
 * Pins a world-anchored overlay, then shifts it horizontally so the shell stays
 * inside the viewport (same collision idea as slot-anchored popovers).
 */
export function applyingWorldPlazaCameraZoomedDomOverlayPositionWithViewportShift(
  wrapperElement: HTMLElement,
  shellElement: HTMLElement,
  viewportX: number,
  viewportY: number,
  edgeInsetPx: number = DEFINING_WORLD_PLAZA_ANCHORED_POPOVER_VIEWPORT_EDGE_INSET_PX
): void {
  wrapperElement.style.transform =
    computingWorldPlazaCameraZoomedDomOverlayPositionTransform(
      viewportX,
      viewportY
    );

  const shellRect = shellElement.getBoundingClientRect();
  const shiftXPx = computingWorldPlazaAnchoredPopoverViewportShiftX({
    popoverLeftPx: shellRect.left,
    popoverRightPx: shellRect.right,
    clipLeftPx: 0,
    clipRightPx: window.innerWidth,
    edgeInsetPx,
  });

  if (shiftXPx === 0) {
    return;
  }

  wrapperElement.style.transform =
    computingWorldPlazaCameraZoomedDomOverlayPositionTransform(
      viewportX,
      viewportY,
      shiftXPx
    );
}

/**
 * Applies a tracked overlay position only when its CSS transform changed.
 */
export function applyingWorldPlazaCameraZoomedDomOverlayPositionToElement(
  element: HTMLElement | null | undefined,
  viewportX: number,
  viewportY: number
): void {
  if (!element) {
    return;
  }

  const transform = computingWorldPlazaCameraZoomedDomOverlayPositionTransform(
    viewportX,
    viewportY
  );

  if (element.style.transform !== transform) {
    element.style.transform = transform;
  }
}

/**
 * Single CSS transform that pins and scales a DOM overlay in viewport space.
 */
export function computingWorldPlazaCameraZoomedDomOverlayTrackedTransform(
  viewportX: number,
  viewportY: number,
  worldZoom: number
): string {
  return `translate3d(${viewportX}px, ${viewportY}px, 0) translate(-50%, -100%) scale(${worldZoom})`;
}

/**
 * Inner CSS scale so DOM overlays match the zoomed Pixi world size.
 *
 * @param worldZoom - Effective world-container zoom for the current viewport.
 */
export function computingWorldPlazaCameraZoomedDomOverlayScaleStyle(
  worldZoom: number = DEFINING_WORLD_PLAZA_CAMERA_ZOOM
): {
  transform: string;
  transformOrigin: typeof COMPUTING_WORLD_PLAZA_CAMERA_ZOOMED_DOM_OVERLAY_TRANSFORM_ORIGIN;
} {
  return {
    transform: `scale(${worldZoom})`,
    transformOrigin:
      COMPUTING_WORLD_PLAZA_CAMERA_ZOOMED_DOM_OVERLAY_TRANSFORM_ORIGIN,
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
  worldZoom: number
): void {
  if (!element) {
    return;
  }

  const scaleStyle =
    computingWorldPlazaCameraZoomedDomOverlayScaleStyle(worldZoom);

  if (element.style.transform !== scaleStyle.transform) {
    element.style.transform = scaleStyle.transform;
  }

  if (element.style.transformOrigin !== scaleStyle.transformOrigin) {
    element.style.transformOrigin = scaleStyle.transformOrigin;
  }
}

/**
 * Effective viewport size in unscaled isometric world-local pixels for chunk
 * prefetch.
 *
 * @param viewportSizePx - Live Pixi screen width or height.
 * @param worldZoom - Zoom divisor for the visible tile window.
 */
export function computingWorldPlazaCameraZoomedViewportWorldLocalSizePx(
  viewportSizePx: number,
  worldZoom: number = DEFINING_WORLD_PLAZA_CAMERA_VISIBLE_TILE_BOUNDS_REFERENCE_ZOOM
): number {
  return viewportSizePx / worldZoom;
}
