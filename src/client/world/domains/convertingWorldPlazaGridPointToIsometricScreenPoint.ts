import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from "@/components/world/domains/definingWorldPlazaIsometricConstants";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";

/** Screen-space point in Pixi world coordinates. */
export interface ConvertingWorldPlazaIsometricScreenPoint {
  x: number;
  y: number;
}

/**
 * Projects a logical grid position to 2:1 isometric screen space.
 *
 * @param gridPoint - Tile/grid coordinates (floats allowed for smooth movement).
 */
export function convertingWorldPlazaGridPointToIsometricScreenPoint(
  gridPoint: DefiningWorldPlazaWorldPoint,
): ConvertingWorldPlazaIsometricScreenPoint {
  return {
    x:
      (gridPoint.x - gridPoint.y) *
      DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
    y:
      (gridPoint.x + gridPoint.y) *
      DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  };
}
