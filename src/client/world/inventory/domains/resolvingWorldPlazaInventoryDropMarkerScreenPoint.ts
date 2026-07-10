import type { DefiningWorldPlazaCameraOffset } from "@/components/world/domains/definingWorldPlazaCameraOffset";
import { projectingWorldPlazaGridPointToViewportScreenPoint } from "@/components/world/domains/projectingWorldPlazaGridPointToViewportScreenPoint";
import { DEFINING_WORLD_PLAZA_INVENTORY_DROP_PREVIEW_ICON_VERTICAL_OFFSET_PX } from "@/components/world/inventory/domains/definingWorldPlazaInventoryDropConstants";

/**
 * Resolves viewport screen coordinates for the inventory drop item marker,
 * horizontally centered on the target tile with a slight upward lift.
 *
 * @param tileX - Target tile column.
 * @param tileY - Target tile row.
 * @param cameraOffset - Current camera translation.
 * @param cameraWorldZoom - Effective world zoom multiplier.
 * @param bobOffsetPx - Optional vertical bob offset.
 */
export function resolvingWorldPlazaInventoryDropMarkerScreenPoint(
  tileX: number,
  tileY: number,
  cameraOffset: DefiningWorldPlazaCameraOffset,
  cameraWorldZoom: number,
  bobOffsetPx = 0,
): { x: number; y: number } {
  const viewportPoint = projectingWorldPlazaGridPointToViewportScreenPoint(
    { x: tileX, y: tileY, layer: 1 },
    cameraOffset,
    cameraWorldZoom,
  );

  const verticalOffsetPx =
    DEFINING_WORLD_PLAZA_INVENTORY_DROP_PREVIEW_ICON_VERTICAL_OFFSET_PX *
    cameraWorldZoom;

  return {
    x: viewportPoint.x,
    y: viewportPoint.y - verticalOffsetPx + bobOffsetPx,
  };
}
