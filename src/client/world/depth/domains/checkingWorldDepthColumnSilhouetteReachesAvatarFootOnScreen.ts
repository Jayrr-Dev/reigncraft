import { computingWorldBuildingWorldLayerScreenOffsetPx } from '@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx';
import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import { DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX } from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';

/**
 * Screen-space silhouette reach test for front-occluder caps.
 *
 * @module components/world/depth/domains/checkingWorldDepthColumnSilhouetteReachesAvatarFootOnScreen
 */

/**
 * Returns true when a column cap visually reaches the avatar foot line on screen.
 *
 * @param gridPoint - Avatar grid position (floats allowed).
 * @param standingLayer - Walkable world layer under the avatar.
 * @param columnTileX - Column foot tile column index.
 * @param columnTileY - Column foot tile row index.
 * @param columnSurfaceLayer - Walkable top layer of the column.
 */
export function checkingWorldDepthColumnSilhouetteReachesAvatarFootOnScreen(
  gridPoint: DefiningWorldPlazaWorldPoint,
  standingLayer: number,
  columnTileX: number,
  columnTileY: number,
  columnSurfaceLayer: number
): boolean {
  const avatarFootScreenY =
    convertingWorldPlazaGridPointToIsometricScreenPoint(gridPoint).y +
    computingWorldBuildingWorldLayerScreenOffsetPx(standingLayer);
  const columnCapTopScreenY =
    convertingWorldPlazaGridPointToIsometricScreenPoint({
      x: columnTileX,
      y: columnTileY,
    }).y +
    computingWorldBuildingWorldLayerScreenOffsetPx(columnSurfaceLayer) -
    DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;

  return columnCapTopScreenY < avatarFootScreenY;
}

/**
 * Returns true when a column's walkable top rises above the avatar's standing layer.
 */
export function checkingWorldDepthColumnIsTallerThanAvatarStandingLayer(
  columnSurfaceLayer: number,
  standingLayer: number
): boolean {
  return columnSurfaceLayer > standingLayer;
}

/**
 * Returns true when a column foot sorts strictly in front of the avatar foot.
 */
export function checkingWorldDepthColumnFootIsInFrontOfAvatarFoot(
  gridPoint: DefiningWorldPlazaWorldPoint,
  columnFootX: number,
  columnFootY: number
): boolean {
  return columnFootX + columnFootY > gridPoint.x + gridPoint.y;
}

/**
 * Returns true when a column surface is at or below the avatar standing layer
 * (standing bump — includes coplanar ground).
 */
export function checkingWorldDepthColumnIsAtOrBelowAvatarStandingLayer(
  columnSurfaceLayer: number,
  standingLayer: number
): boolean {
  return columnSurfaceLayer <= standingLayer;
}

/**
 * Returns true when a raised column cap can act as hard floor under the avatar.
 */
export function checkingWorldDepthColumnIsRaisedAtOrBelowAvatarStandingLayer(
  columnSurfaceLayer: number,
  standingLayer: number
): boolean {
  return (
    columnSurfaceLayer > DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND &&
    columnSurfaceLayer <= standingLayer
  );
}
