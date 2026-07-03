import { snappingWorldBuildingTilePositionFromGridPoint } from "@/components/world/building/domains/definingWorldBuildingTilePosition";
import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";
import type { DefiningWorldPlazaCameraOffset } from "@/components/world/domains/definingWorldPlazaCameraOffset";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { convertingWorldPlazaIsometricScreenPointToGridPoint } from "@/components/world/domains/convertingWorldPlazaIsometricScreenPointToGridPoint";
import { projectingWorldPlazaViewportScreenPointToIsometricWorldLocal } from "@/components/world/domains/projectingWorldPlazaIsometricScreenPointThroughCamera";
import type { DefiningWorldPlazaPixiViewportSize } from "@/components/world/domains/resolvingWorldPlazaPixiViewportSize";

/**
 * Projects viewport pointer events into snapped build tile positions.
 *
 * @module components/world/building/domains/projectingWorldBuildingTilePositionFromViewportPointerEvent
 */

/**
 * Converts a viewport pointer event into the tile under the cursor.
 *
 * @param clientX - Pointer X in client pixels.
 * @param clientY - Pointer Y in client pixels.
 * @param viewportFrame - Plaza viewport frame element.
 * @param cameraOffset - Live camera offset.
 * @param viewportSize - Live Pixi viewport size.
 * @param cameraWorldZoom - Effective camera zoom multiplier.
 */
export function projectingWorldBuildingTilePositionFromViewportPointer(
  clientX: number,
  clientY: number,
  viewportFrame: HTMLElement,
  cameraOffset: DefiningWorldPlazaCameraOffset,
  viewportSize: DefiningWorldPlazaPixiViewportSize,
  cameraWorldZoom: number,
): DefiningWorldBuildingTilePosition | null {
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
  const gridPoint: DefiningWorldPlazaWorldPoint =
    convertingWorldPlazaIsometricScreenPointToGridPoint(worldLocalPoint);

  return snappingWorldBuildingTilePositionFromGridPoint(gridPoint);
}
