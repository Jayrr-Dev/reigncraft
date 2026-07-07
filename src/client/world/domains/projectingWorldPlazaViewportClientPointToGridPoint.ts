import type { ConvertingWorldPlazaIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import { convertingWorldPlazaIsometricScreenPointToGridPointWithSurfaceElevation } from '@/components/world/domains/convertingWorldPlazaIsometricScreenPointToGridPoint';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { projectingWorldPlazaViewportScreenPointToIsometricWorldLocal } from '@/components/world/domains/projectingWorldPlazaIsometricScreenPointThroughCamera';
import type { DefiningWorldPlazaPixiViewportSize } from '@/components/world/domains/resolvingWorldPlazaPixiViewportSize';

/**
 * Projects a viewport client pointer position into viewport canvas pixels.
 */
export function projectingWorldPlazaViewportClientPointToViewportScreenPoint(
  clientX: number,
  clientY: number,
  viewportFrame: HTMLElement,
  viewportSize: DefiningWorldPlazaPixiViewportSize
): ConvertingWorldPlazaIsometricScreenPoint | null {
  const viewportFrameBounds = viewportFrame.getBoundingClientRect();

  if (viewportFrameBounds.width === 0 || viewportFrameBounds.height === 0) {
    return null;
  }

  const domToCanvasScaleX = viewportSize.width / viewportFrameBounds.width;
  const domToCanvasScaleY = viewportSize.height / viewportFrameBounds.height;

  return {
    x: (clientX - viewportFrameBounds.left) * domToCanvasScaleX,
    y: (clientY - viewportFrameBounds.top) * domToCanvasScaleY,
  };
}

/**
 * Projects a viewport client pointer position into plaza grid coordinates.
 *
 * @param clientX - Pointer X in client pixels.
 * @param clientY - Pointer Y in client pixels.
 * @param viewportFrame - Plaza viewport frame element.
 * @param cameraOffset - Live camera offset.
 * @param viewportSize - Live Pixi viewport size.
 * @param cameraWorldZoom - Effective camera zoom multiplier.
 */
export function projectingWorldPlazaViewportClientPointToGridPoint(
  clientX: number,
  clientY: number,
  viewportFrame: HTMLElement,
  cameraOffset: DefiningWorldPlazaCameraOffset,
  viewportSize: DefiningWorldPlazaPixiViewportSize,
  cameraWorldZoom: number
): DefiningWorldPlazaWorldPoint | null {
  const viewportScreenPoint =
    projectingWorldPlazaViewportClientPointToViewportScreenPoint(
      clientX,
      clientY,
      viewportFrame,
      viewportSize
    );

  if (!viewportScreenPoint) {
    return null;
  }

  const worldLocalPoint =
    projectingWorldPlazaViewportScreenPointToIsometricWorldLocal(
      viewportScreenPoint,
      cameraOffset,
      cameraWorldZoom
    );

  return convertingWorldPlazaIsometricScreenPointToGridPointWithSurfaceElevation(
    worldLocalPoint
  );
}
