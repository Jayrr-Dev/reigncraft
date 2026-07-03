import { convertingWorldPlazaIsometricScreenPointToGridPoint } from "@/components/world/domains/convertingWorldPlazaIsometricScreenPointToGridPoint";
import type { DefiningWorldPlazaCameraOffset } from "@/components/world/domains/definingWorldPlazaCameraOffset";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { projectingWorldPlazaViewportScreenPointToIsometricWorldLocal } from "@/components/world/domains/projectingWorldPlazaIsometricScreenPointThroughCamera";
import type { DefiningWorldPlazaPixiViewportSize } from "@/components/world/domains/resolvingWorldPlazaPixiViewportSize";

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
  cameraWorldZoom: number,
): DefiningWorldPlazaWorldPoint | null {
  const viewportFrameBounds = viewportFrame.getBoundingClientRect();

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

  return convertingWorldPlazaIsometricScreenPointToGridPoint(worldLocalPoint);
}
