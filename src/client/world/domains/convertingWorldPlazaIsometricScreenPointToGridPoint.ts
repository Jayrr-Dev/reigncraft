import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from "@/components/world/domains/definingWorldPlazaIsometricConstants";
import type { ConvertingWorldPlazaIsometricScreenPoint } from "@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";

/**
 * Inverse of {@link convertingWorldPlazaGridPointToIsometricScreenPoint}.
 *
 * @param screenPoint - Pixi world coordinates (after camera offset).
 */
export function convertingWorldPlazaIsometricScreenPointToGridPoint(
  screenPoint: ConvertingWorldPlazaIsometricScreenPoint,
): DefiningWorldPlazaWorldPoint {
  const halfTileWidthPx = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;
  const halfTileHeightPx = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;

  return {
    x:
      (screenPoint.x / halfTileWidthPx + screenPoint.y / halfTileHeightPx) / 2,
    y:
      (screenPoint.y / halfTileHeightPx - screenPoint.x / halfTileWidthPx) / 2,
  };
}
