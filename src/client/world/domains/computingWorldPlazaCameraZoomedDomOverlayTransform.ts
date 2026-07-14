import { computingWorldPlazaAnchoredPopoverViewportShiftX } from '@/components/world/domains/computingWorldPlazaAnchoredPopoverViewportShiftX';
import { DEFINING_WORLD_PLAZA_ANCHORED_POPOVER_VIEWPORT_EDGE_INSET_PX } from '@/components/world/domains/definingWorldPlazaAnchoredPopoverViewportConstants';
import {
  DEFINING_WORLD_PLAZA_CAMERA_VISIBLE_TILE_BOUNDS_REFERENCE_ZOOM,
  DEFINING_WORLD_PLAZA_CAMERA_ZOOM,
} from '@/components/world/domains/definingWorldPlazaCameraConstants';

/** CSS transform-origin for plaza avatar DOM overlays (bottom-center anchor). */
export const COMPUTING_WORLD_PLAZA_CAMERA_ZOOMED_DOM_OVERLAY_TRANSFORM_ORIGIN =
  'bottom center' as const;

/**
 * Inherited CSS custom property for live camera world zoom.
 *
 * World-anchored shells set this while applying `scale(zoom)`. Screen-space
 * children (buff detail cards) counter-scale with
 * `scale(calc(1 / var(--plaza-camera-world-zoom)))`.
 */
export const COMPUTING_WORLD_PLAZA_CAMERA_WORLD_ZOOM_CSS_VARIABLE =
  '--plaza-camera-world-zoom' as const;

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
  [COMPUTING_WORLD_PLAZA_CAMERA_WORLD_ZOOM_CSS_VARIABLE]: string;
} {
  return {
    transform: `scale(${worldZoom})`,
    transformOrigin:
      COMPUTING_WORLD_PLAZA_CAMERA_ZOOMED_DOM_OVERLAY_TRANSFORM_ORIGIN,
    [COMPUTING_WORLD_PLAZA_CAMERA_WORLD_ZOOM_CSS_VARIABLE]: String(worldZoom),
  };
}

/**
 * Counter-scale so a child stays screen-sized inside a camera-zoomed overlay.
 *
 * Pair with {@link computingWorldPlazaCameraZoomedDomOverlayScaleStyle} on an
 * ancestor. Uses the inherited `--plaza-camera-world-zoom` custom property.
 *
 * @param placement - Vertical anchor relative to the host control.
 */
export function computingWorldPlazaCameraZoomedDomOverlayScreenSpaceCounterScaleStyle(
  placement: 'above' | 'below' = 'above'
): {
  transform: string;
  transformOrigin: 'bottom center' | 'top center';
} {
  return {
    transform: `translateX(-50%) scale(calc(1 / var(${COMPUTING_WORLD_PLAZA_CAMERA_WORLD_ZOOM_CSS_VARIABLE}, ${DEFINING_WORLD_PLAZA_CAMERA_ZOOM})))`,
    transformOrigin: placement === 'above' ? 'bottom center' : 'top center',
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

  const zoomVariableValue =
    scaleStyle[COMPUTING_WORLD_PLAZA_CAMERA_WORLD_ZOOM_CSS_VARIABLE];

  if (
    element.style.getPropertyValue(
      COMPUTING_WORLD_PLAZA_CAMERA_WORLD_ZOOM_CSS_VARIABLE
    ) !== zoomVariableValue
  ) {
    element.style.setProperty(
      COMPUTING_WORLD_PLAZA_CAMERA_WORLD_ZOOM_CSS_VARIABLE,
      zoomVariableValue
    );
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
