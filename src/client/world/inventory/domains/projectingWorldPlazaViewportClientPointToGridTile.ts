import { convertingWorldPlazaIsometricScreenPointToGridPointWithSurfaceElevation } from "@/components/world/domains/convertingWorldPlazaIsometricScreenPointToGridPoint";
import type { DefiningWorldPlazaCameraOffset } from "@/components/world/domains/definingWorldPlazaCameraOffset";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { projectingWorldPlazaViewportScreenPointToIsometricWorldLocal } from "@/components/world/domains/projectingWorldPlazaIsometricScreenPointThroughCamera";
import type { DefiningWorldPlazaPixiViewportSize } from "@/components/world/domains/resolvingWorldPlazaPixiViewportSize";

/**
 * Projects a viewport client pointer position into a grid tile coordinate.
 *
 * @param clientX - Pointer client X in CSS pixels.
 * @param clientY - Pointer client Y in CSS pixels.
 * @param viewportFrameBounds - Plaza viewport DOM bounds.
 * @param viewportSize - Internal Pixi canvas size in pixels.
 * @param cameraOffset - Current camera translation.
 * @param cameraWorldZoom - Effective world zoom.
 */
export function projectingWorldPlazaViewportClientPointToGridTile(
  clientX: number,
  clientY: number,
  viewportFrameBounds: DOMRect,
  viewportSize: DefiningWorldPlazaPixiViewportSize,
  cameraOffset: DefiningWorldPlazaCameraOffset,
  cameraWorldZoom: number,
): DefiningWorldPlazaWorldPoint | null {
  if (viewportFrameBounds.width === 0 || viewportFrameBounds.height === 0) {
    return null;
  }

  const domToCanvasScaleX = viewportSize.width / viewportFrameBounds.width;
  const domToCanvasScaleY = viewportSize.height / viewportFrameBounds.height;
  const viewportX = (clientX - viewportFrameBounds.left) * domToCanvasScaleX;
  const viewportY = (clientY - viewportFrameBounds.top) * domToCanvasScaleY;
  const worldLocalPoint = projectingWorldPlazaViewportScreenPointToIsometricWorldLocal(
    { x: viewportX, y: viewportY },
    cameraOffset,
    cameraWorldZoom,
  );

  return convertingWorldPlazaIsometricScreenPointToGridPointWithSurfaceElevation(
    worldLocalPoint
  );
}
