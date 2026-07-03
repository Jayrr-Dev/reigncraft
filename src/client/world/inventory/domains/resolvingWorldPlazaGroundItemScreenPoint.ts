import { convertingWorldPlazaGridPointToIsometricScreenPoint } from "@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint";
import type { DefiningWorldPlazaCameraOffset } from "@/components/world/domains/definingWorldPlazaCameraOffset";
import { DEFINING_WORLD_PLAZA_GROUND_ITEM_VERTICAL_OFFSET_PX } from "@/components/world/inventory/domains/definingWorldPlazaGroundItemConstants";
import type { DefiningWorldPlazaGroundItem } from "@/components/world/inventory/domains/definingWorldPlazaGroundItem";
import { projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint } from "@/components/world/domains/projectingWorldPlazaIsometricScreenPointThroughCamera";

/**
 * Resolves viewport screen coordinates for one ground item marker.
 *
 * @param groundItem - Ground item on a tile
 * @param cameraOffset - Current camera translation
 * @param cameraWorldZoom - Effective world zoom
 */
export function resolvingWorldPlazaGroundItemScreenPoint(
  groundItem: DefiningWorldPlazaGroundItem,
  cameraOffset: DefiningWorldPlazaCameraOffset,
  cameraWorldZoom: number,
): { x: number; y: number } {
  const worldLocalPoint = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: groundItem.gridX,
    y: groundItem.gridY,
    layer: groundItem.layer,
  });

  const viewportPoint = projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint(
    {
      x: worldLocalPoint.x,
      y: worldLocalPoint.y - DEFINING_WORLD_PLAZA_GROUND_ITEM_VERTICAL_OFFSET_PX,
    },
    cameraOffset,
    cameraWorldZoom,
  );

  return viewportPoint;
}
