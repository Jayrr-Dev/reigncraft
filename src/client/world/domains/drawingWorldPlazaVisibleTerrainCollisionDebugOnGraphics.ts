import { computingWorldBuildingWorldLayerScreenOffsetPx } from '@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx';
import { DEFINING_WORLD_PLAZA_PLAYER_HEIGHT_WORLD_LAYERS } from '@/components/world/building/domains/definingWorldBuildingBlockHeightConstants';
import { DEFINING_WORLD_BUILDING_WORLD_LAYER_HEIGHT_PX } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import { drawingWorldCollisionProviderDebugStaticTileRowsOnGraphics } from '@/components/world/collision/domains/drawingWorldCollisionProviderDebugOnGraphics';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_HITBOX_FILL_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_HITBOX_FOOTPRINT_SCALE,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_HITBOX_SIDE_FILL_ALPHA,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_HITBOX_STROKE_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_HITBOX_TOP_FILL_ALPHA,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_MARKER_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_MARKER_HALF_LENGTH_PX,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_STANDING_TILE_FILL_ALPHA,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_STANDING_TILE_FILL_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_STANDING_TILE_STROKE_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_STROKE_WIDTH_PX,
} from '@/components/world/domains/definingWorldPlazaTerrainCollisionDebugConstants';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { drawingWorldPlazaDashedIsometricTileDiamondStrokeOnGraphics } from '@/components/world/domains/drawingWorldPlazaDashedIsometricTileDiamondStrokeOnGraphics';
import { drawingWorldPlazaIsometricTileDiamondFillOnGraphics } from '@/components/world/domains/drawingWorldPlazaIsometricTileDiamondFillOnGraphics';
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from '@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint';
import type { Graphics } from 'pixi.js';

/**
 * Batched terrain collision debug overlay for visible tiles.
 *
 * @module components/world/domains/drawingWorldPlazaVisibleTerrainCollisionDebugOnGraphics
 */

/**
 * Draws obstacle colliders for a horizontal band of visible tile rows.
 *
 * Folds column-rock collider collection into the same scan and dedupes boulders
 * via the caller-owned anchor-key set, so an incremental builder can stream the
 * overlay row-band by row-band across frames without drawing a boulder twice.
 *
 * @param graphics - Target Pixi Graphics instance.
 * @param bounds - Visible tile index bounds (supplies the column range).
 * @param fromTileY - First tile row to draw (inclusive).
 * @param toTileY - Last tile row to draw (inclusive).
 * @param seenColumnRockAnchorKeys - Anchor keys already drawn this build pass.
 */
export function drawingWorldPlazaVisibleTerrainCollisionDebugStaticTileRowsOnGraphics(
  graphics: Graphics,
  bounds: DefiningWorldPlazaVisibleTileBounds,
  fromTileY: number,
  toTileY: number,
  seenColumnRockAnchorKeys: Set<string>,
  seenFirelandsPropAnchorKeys: Set<string> = new Set<string>()
): void {
  drawingWorldCollisionProviderDebugStaticTileRowsOnGraphics(
    graphics,
    bounds,
    fromTileY,
    toTileY,
    seenColumnRockAnchorKeys,
    seenFirelandsPropAnchorKeys
  );
}

/**
 * Draws obstacle colliders for all visible tiles in a single pass.
 *
 * @param graphics - Target Pixi Graphics instance.
 * @param bounds - Visible tile index bounds.
 */
export function drawingWorldPlazaVisibleTerrainCollisionDebugStaticTilesOnGraphics(
  graphics: Graphics,
  bounds: DefiningWorldPlazaVisibleTileBounds
): void {
  drawingWorldPlazaVisibleTerrainCollisionDebugStaticTileRowsOnGraphics(
    graphics,
    bounds,
    bounds.minTileY,
    bounds.maxTileY,
    new Set<string>()
  );
}

/** Total screen height of the player hitbox volume in pixels. */
const DRAWING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_HITBOX_HEIGHT_PX =
  DEFINING_WORLD_PLAZA_PLAYER_HEIGHT_WORLD_LAYERS *
  DEFINING_WORLD_BUILDING_WORLD_LAYER_HEIGHT_PX;

/**
 * Draws the player collision hitbox as a wireframe isometric box.
 *
 * The footprint diamond is anchored at the avatar's standing surface and
 * extruded upward by the player's full vertical extent ({@link
 * DEFINING_WORLD_PLAZA_PLAYER_HEIGHT_WORLD_LAYERS} layers), so the volume reads
 * as a 4-layer-high box rising out of the standing tile.
 *
 * @param graphics - Target Pixi Graphics instance.
 * @param playerPosition - Current avatar position in grid space.
 */
export function drawingWorldPlazaVisibleTerrainCollisionDebugPlayerHitboxOnGraphics(
  graphics: Graphics,
  playerPosition: DefiningWorldPlazaWorldPoint
): void {
  const screenPoint =
    convertingWorldPlazaGridPointToIsometricScreenPoint(playerPosition);
  const playerLayer = resolvingWorldPlazaPlayerWorldLayer(playerPosition);
  const baseY =
    screenPoint.y + computingWorldBuildingWorldLayerScreenOffsetPx(playerLayer);
  const topY =
    baseY - DRAWING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_HITBOX_HEIGHT_PX;
  const halfWidth =
    DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX *
    DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_HITBOX_FOOTPRINT_SCALE;
  const halfHeight =
    DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX *
    DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_HITBOX_FOOTPRINT_SCALE;
  const centerX = screenPoint.x;

  const bottomNorthY = baseY - halfHeight;
  const bottomSouthY = baseY + halfHeight;
  const topNorthY = topY - halfHeight;
  const topSouthY = topY + halfHeight;
  const westX = centerX - halfWidth;
  const eastX = centerX + halfWidth;

  graphics
    .poly([centerX, topNorthY, eastX, topY, centerX, topSouthY, westX, topY])
    .fill({
      color:
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_HITBOX_FILL_COLOR,
      alpha:
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_HITBOX_TOP_FILL_ALPHA,
    });

  graphics
    .poly([
      westX,
      baseY,
      centerX,
      bottomSouthY,
      centerX,
      topSouthY,
      westX,
      topY,
    ])
    .fill({
      color:
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_HITBOX_FILL_COLOR,
      alpha:
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_HITBOX_SIDE_FILL_ALPHA,
    });

  graphics
    .poly([
      centerX,
      bottomSouthY,
      eastX,
      baseY,
      eastX,
      topY,
      centerX,
      topSouthY,
    ])
    .fill({
      color:
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_HITBOX_FILL_COLOR,
      alpha:
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_HITBOX_SIDE_FILL_ALPHA,
    });

  graphics
    .poly([
      centerX,
      bottomNorthY,
      eastX,
      baseY,
      centerX,
      bottomSouthY,
      westX,
      baseY,
    ])
    .poly([centerX, topNorthY, eastX, topY, centerX, topSouthY, westX, topY])
    .moveTo(westX, baseY)
    .lineTo(westX, topY)
    .moveTo(eastX, baseY)
    .lineTo(eastX, topY)
    .moveTo(centerX, bottomNorthY)
    .lineTo(centerX, topNorthY)
    .moveTo(centerX, bottomSouthY)
    .lineTo(centerX, topSouthY)
    .stroke({
      color:
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_HITBOX_STROKE_COLOR,
      width: DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_STROKE_WIDTH_PX,
      cap: 'round',
      join: 'round',
    });
}

/**
 * Draws the standing tile highlight and player crosshair (cheap per-frame pass).
 *
 * @param graphics - Target Pixi Graphics instance.
 * @param playerPosition - Current avatar position in grid space.
 */
export function drawingWorldPlazaVisibleTerrainCollisionDebugPlayerMarkerOnGraphics(
  graphics: Graphics,
  playerPosition: DefiningWorldPlazaWorldPoint
): void {
  const standingTile =
    resolvingWorldPlazaIsometricTileIndexAtGridPoint(playerPosition);
  const playerLayer = resolvingWorldPlazaPlayerWorldLayer(playerPosition);

  drawingWorldPlazaIsometricTileDiamondFillOnGraphics(
    graphics,
    standingTile.tileX,
    standingTile.tileY,
    DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_STANDING_TILE_FILL_COLOR,
    DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_STANDING_TILE_FILL_ALPHA,
    playerLayer
  );
  drawingWorldPlazaDashedIsometricTileDiamondStrokeOnGraphics(
    graphics,
    standingTile.tileX,
    standingTile.tileY,
    DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_STANDING_TILE_STROKE_COLOR,
    playerLayer
  );

  drawingWorldPlazaVisibleTerrainCollisionDebugPlayerHitboxOnGraphics(
    graphics,
    playerPosition
  );

  const gridScreenPoint =
    convertingWorldPlazaGridPointToIsometricScreenPoint(playerPosition);
  const markerCenterY =
    gridScreenPoint.y +
    computingWorldBuildingWorldLayerScreenOffsetPx(playerLayer);
  const halfLengthPx =
    DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_MARKER_HALF_LENGTH_PX;

  graphics
    .moveTo(gridScreenPoint.x - halfLengthPx, markerCenterY)
    .lineTo(gridScreenPoint.x + halfLengthPx, markerCenterY)
    .moveTo(gridScreenPoint.x, markerCenterY - halfLengthPx)
    .lineTo(gridScreenPoint.x, markerCenterY + halfLengthPx)
    .stroke({
      color: DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_MARKER_COLOR,
      width: DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_STROKE_WIDTH_PX,
      cap: 'round',
    });
}

/**
 * Draws dashed collision boxes for every visible tile near the player.
 *
 * @param graphics - Target Pixi Graphics (caller clears before calling).
 * @param bounds - Visible tile index bounds.
 * @param playerPosition - Current avatar position in grid space.
 */
export function drawingWorldPlazaVisibleTerrainCollisionDebugOnGraphics(
  graphics: Graphics,
  bounds: DefiningWorldPlazaVisibleTileBounds,
  playerPosition: DefiningWorldPlazaWorldPoint
): void {
  drawingWorldPlazaVisibleTerrainCollisionDebugStaticTilesOnGraphics(
    graphics,
    bounds
  );
  drawingWorldPlazaVisibleTerrainCollisionDebugPlayerMarkerOnGraphics(
    graphics,
    playerPosition
  );
}
