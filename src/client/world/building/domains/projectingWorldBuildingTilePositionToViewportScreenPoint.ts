import { computingWorldBuildingWorldLayerScreenOffsetPx } from "@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx";
import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from "@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint";
import type { DefiningWorldPlazaCameraOffset } from "@/components/world/domains/definingWorldPlazaCameraOffset";
import { projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint } from "@/components/world/domains/projectingWorldPlazaIsometricScreenPointThroughCamera";

/**
 * Projects a build tile anchor to viewport coordinates for DOM overlays.
 *
 * @module components/world/building/domains/projectingWorldBuildingTilePositionToViewportScreenPoint
 */

/** Vertical lift above the tile center for build popover anchoring (pixels). */
export const PROJECTING_WORLD_BUILDING_TILE_POPOVER_OFFSET_ABOVE_TILE_PX = 12 as const;

/**
 * Maps a tile position to viewport screen coordinates.
 *
 * @param tilePosition - Target tile.
 * @param cameraOffset - Current camera translation.
 * @param cameraWorldZoom - Effective world zoom.
 * @param worldLayer - Layer used for vertical screen offset.
 */
export function projectingWorldBuildingTilePositionToViewportScreenPoint(
  tilePosition: DefiningWorldBuildingTilePosition,
  cameraOffset: DefiningWorldPlazaCameraOffset,
  cameraWorldZoom: number,
  worldLayer: number,
): {
  x: number;
  y: number;
} {
  const worldLocalPoint = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: tilePosition.tileX,
    y: tilePosition.tileY,
  });
  const layerOffsetPx = computingWorldBuildingWorldLayerScreenOffsetPx(worldLayer);
  const viewportPoint = projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint(
    {
      x: worldLocalPoint.x,
      y: worldLocalPoint.y + layerOffsetPx,
    },
    cameraOffset,
    cameraWorldZoom,
  );

  return {
    x: viewportPoint.x,
    y:
      viewportPoint.y -
      PROJECTING_WORLD_BUILDING_TILE_POPOVER_OFFSET_ABOVE_TILE_PX * cameraWorldZoom,
  };
}
