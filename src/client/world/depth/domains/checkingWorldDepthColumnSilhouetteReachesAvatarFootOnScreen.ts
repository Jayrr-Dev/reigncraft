import { checkingWorldBuildingFloatingOverheadSlabAboveStandingLayerAtTileIndex } from '@/components/world/building/domains/checkingWorldBuildingFloatingOverheadSlabAboveStandingLayerAtTileIndex';
import { computingWorldBuildingWorldLayerScreenOffsetPx } from '@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx';
import { DEFINING_WORLD_PLAZA_PLAYER_HEIGHT_WORLD_LAYERS } from '@/components/world/building/domains/definingWorldBuildingBlockHeightConstants';
import {
  DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
  DEFINING_WORLD_BUILDING_WORLD_LAYER_HEIGHT_PX,
} from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import { DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX } from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import { DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HALF_EXTENT_GRID } from '@/components/world/domains/definingWorldPlazaIsometricTileLayoutConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';

/**
 * Screen-space silhouette reach test for front-occluder caps.
 *
 * @module components/world/depth/domains/checkingWorldDepthColumnSilhouetteReachesAvatarFootOnScreen
 */

/**
 * Foot-sum margin before a column counts as "in front" of the avatar.
 *
 * Without this, a taller floor block one step west/north of the SE diagonal
 * front-occludes while the sprite still overlaps the column's south/west face —
 * the flat-ground case where elevated standing-bump does not apply.
 */
const CHECKING_WORLD_DEPTH_COLUMN_FRONT_FOOT_SUM_MARGIN =
  DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HALF_EXTENT_GRID;

/**
 * Slack (px) when comparing avatar feet to a column's south tip. Covers sub-pixel
 * foot jitter and the sprite foot sitting slightly below the grid anchor.
 */
const CHECKING_WORLD_DEPTH_COLUMN_SOUTH_TIP_SCREEN_Y_SLACK_PX = 2;

/**
 * Extra screen-Y slack when testing elevated-slab body overlap so thin high
 * slabs still cover the torso when the avatar stands just north of the tile.
 */
const CHECKING_WORLD_DEPTH_ELEVATED_COLUMN_BODY_OVERLAP_SLACK_PX = 4;

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
 * Returns true when the avatar foot is at or south of a column's front (south)
 * diamond tip on screen — i.e. the player should draw in front of that column.
 *
 * Tip height uses {@code tipWorldLayer}, which should be the avatar standing
 * layer (tile footprint), not an elevated cap. Using the raised surface layer
 * lifts the tip on screen so ground feet always look "south of" a high slab.
 */
export function checkingWorldDepthAvatarFootIsAtOrSouthOfColumnSouthTipOnScreen(
  gridPoint: DefiningWorldPlazaWorldPoint,
  standingLayer: number,
  columnTileX: number,
  columnTileY: number,
  tipWorldLayer: number,
  avatarFootOffsetBelowGridAnchorPx = 0
): boolean {
  const avatarFootScreenY =
    convertingWorldPlazaGridPointToIsometricScreenPoint(gridPoint).y +
    computingWorldBuildingWorldLayerScreenOffsetPx(standingLayer) +
    avatarFootOffsetBelowGridAnchorPx;
  const columnCenterScreenY =
    convertingWorldPlazaGridPointToIsometricScreenPoint({
      x: columnTileX,
      y: columnTileY,
    }).y + computingWorldBuildingWorldLayerScreenOffsetPx(tipWorldLayer);
  const columnSouthTipScreenY =
    columnCenterScreenY + DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;

  return (
    avatarFootScreenY + CHECKING_WORLD_DEPTH_COLUMN_SOUTH_TIP_SCREEN_Y_SLACK_PX >=
    columnSouthTipScreenY
  );
}

/**
 * Returns true when a floating elevated slab should draw over an avatar standing
 * north of or under it (not clearly south of the tile footprint).
 *
 * Only applies to true walk-under / floating stacks (air under). Solid columns
 * keep the normal south-face "draw in front" rules. Higher caps expand the
 * screen band that must overlap the avatar body.
 */
export function checkingWorldDepthElevatedColumnOccludesAvatarBehindOnScreen(
  gridPoint: DefiningWorldPlazaWorldPoint,
  standingLayer: number,
  columnTileX: number,
  columnTileY: number,
  columnSurfaceLayer: number,
  avatarFootOffsetBelowGridAnchorPx = 0,
  playerHeightWorldLayers: number = DEFINING_WORLD_PLAZA_PLAYER_HEIGHT_WORLD_LAYERS,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[] = [],
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile
): boolean {
  if (columnSurfaceLayer <= standingLayer) {
    return false;
  }

  if (
    !checkingWorldBuildingFloatingOverheadSlabAboveStandingLayerAtTileIndex(
      columnTileX,
      columnTileY,
      standingLayer,
      placedBlocks,
      placedBlocksByTile
    )
  ) {
    return false;
  }

  // South of the ground/standing footprint → avatar stays in front.
  if (
    checkingWorldDepthAvatarFootIsAtOrSouthOfColumnSouthTipOnScreen(
      gridPoint,
      standingLayer,
      columnTileX,
      columnTileY,
      standingLayer,
      avatarFootOffsetBelowGridAnchorPx
    )
  ) {
    return false;
  }

  const avatarFootScreenY =
    convertingWorldPlazaGridPointToIsometricScreenPoint(gridPoint).y +
    computingWorldBuildingWorldLayerScreenOffsetPx(standingLayer) +
    avatarFootOffsetBelowGridAnchorPx;
  const avatarHeadScreenY =
    avatarFootScreenY -
    Math.max(1, playerHeightWorldLayers) *
      DEFINING_WORLD_BUILDING_WORLD_LAYER_HEIGHT_PX;

  const columnCenterScreenY =
    convertingWorldPlazaGridPointToIsometricScreenPoint({
      x: columnTileX,
      y: columnTileY,
    }).y +
    computingWorldBuildingWorldLayerScreenOffsetPx(columnSurfaceLayer);
  const columnTopScreenY =
    columnCenterScreenY - DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;
  // Underside of a thin elevated slab sits near the diamond center; taller
  // extrusions reach farther down toward the standing footprint.
  const layersAboveStanding = columnSurfaceLayer - standingLayer;
  const undersideDropPx = Math.min(
    layersAboveStanding * DEFINING_WORLD_BUILDING_WORLD_LAYER_HEIGHT_PX,
    DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX * 2
  );
  const columnUndersideScreenY = columnCenterScreenY + undersideDropPx;

  return (
    columnTopScreenY <
      avatarFootScreenY +
        CHECKING_WORLD_DEPTH_ELEVATED_COLUMN_BODY_OVERLAP_SLACK_PX &&
    columnUndersideScreenY >
      avatarHeadScreenY -
        CHECKING_WORLD_DEPTH_ELEVATED_COLUMN_BODY_OVERLAP_SLACK_PX
  );
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
 * Returns true when a column foot sorts clearly in front of the avatar foot.
 *
 * Requires more than a half-tile foot-sum lead so side-adjacent floor columns do
 * not front-occlude an avatar whose sprite still overlaps their south/west face.
 */
export function checkingWorldDepthColumnFootIsInFrontOfAvatarFoot(
  gridPoint: DefiningWorldPlazaWorldPoint,
  columnFootX: number,
  columnFootY: number
): boolean {
  return (
    columnFootX + columnFootY >
    gridPoint.x +
      gridPoint.y +
      CHECKING_WORLD_DEPTH_COLUMN_FRONT_FOOT_SUM_MARGIN
  );
}

/**
 * Returns true when a column sits on the avatar's standing tile (same-tile roof /
 * overhead slab occlusion).
 */
export function checkingWorldDepthColumnFootIsOnAvatarStandingTile(
  gridPoint: DefiningWorldPlazaWorldPoint,
  columnFootX: number,
  columnFootY: number
): boolean {
  return (
    Math.floor(columnFootX) === Math.floor(gridPoint.x) &&
    Math.floor(columnFootY) === Math.floor(gridPoint.y)
  );
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
