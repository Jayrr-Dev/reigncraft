import { computingWorldBuildingWorldLayerScreenOffsetPx } from "@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx";
import {
  DEFINING_WORLD_PLAZA_PLAYER_HEIGHT_WORLD_LAYERS,
} from "@/components/world/building/domains/definingWorldBuildingBlockHeightConstants";
import { DEFINING_WORLD_BUILDING_WORLD_LAYER_HEIGHT_PX } from "@/components/world/building/domains/definingWorldBuildingWorldLayerConstants";
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from "@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint";
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from "@/components/world/domains/definingWorldPlazaIsometricConstants";
import type { DefiningWorldPlazaVisibleTileBounds } from "@/components/world/domains/definingWorldPlazaVisibleTileBounds";
import {
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_BLOCK_TILE_STROKE_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_COLUMN_ROCK_FACE_STROKE_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_COLUMN_ROCK_FOOTPRINT_TILE_STROKE_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_COLUMN_ROCK_PLAYER_CONTACT_STROKE_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_JUMP_TILE_STROKE_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_HITBOX_FILL_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_HITBOX_FOOTPRINT_SCALE,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_HITBOX_SIDE_FILL_ALPHA,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_HITBOX_STROKE_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_HITBOX_TOP_FILL_ALPHA,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_MARKER_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_MARKER_HALF_LENGTH_PX,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_ROCK_COLLIDER_STROKE_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_STANDING_TILE_FILL_ALPHA,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_STANDING_TILE_FILL_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_STANDING_TILE_STROKE_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_STROKE_WIDTH_PX,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_TREE_COLLIDER_STROKE_COLOR,
} from "@/components/world/domains/definingWorldPlazaTerrainCollisionDebugConstants";
import { DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID } from "@/components/world/domains/definingWorldPlazaPlayerCollisionConstants";
import { resolvingWorldPlazaPlayerWorldLayer } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { drawingWorldPlazaIsometricTileDiamondFillOnGraphics } from "@/components/world/domains/drawingWorldPlazaIsometricTileDiamondFillOnGraphics";
import {
  DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_BLOCK,
  DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_JUMP_OVER,
} from "@/components/world/domains/definingWorldPlazaTerrainObstacleConstants";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { drawingWorldPlazaDashedGridCircleColliderStrokeOnGraphics } from "@/components/world/domains/drawingWorldPlazaDashedGridCircleColliderStrokeOnGraphics";
import { drawingWorldPlazaDashedIsometricTileDiamondStrokeOnGraphics } from "@/components/world/domains/drawingWorldPlazaDashedIsometricTileDiamondStrokeOnGraphics";
import { drawingWorldPlazaDashedScreenDiamondColliderStrokeOnGraphics } from "@/components/world/domains/drawingWorldPlazaDashedScreenDiamondColliderStrokeOnGraphics";
import { formattingWorldPlazaTileIndexCacheKey } from "@/components/world/domains/formattingWorldPlazaTileIndexCacheKey";
import { listingWorldPlazaColumnRockFootprintTileIndicesAtAnchorTileIndex } from "@/components/world/domains/listingWorldPlazaColumnRockFootprintTileIndicesAtAnchorTileIndex";
import {
  resolvingWorldPlazaColumnRockBaseDiamondFromMetadata,
  resolvingWorldPlazaColumnRockBaseDiamondPlayerContactScreenHalfExtentsPx,
  resolvingWorldPlazaColumnRockBaseDiamondScreenHalfExtentsPx,
} from "@/components/world/domains/resolvingWorldPlazaColumnRockBaseDiamondFromMetadata";
import { resolvingWorldPlazaColumnRockMetadataAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtTileIndex";
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from "@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint";
import {
  resolvingWorldPlazaRockCollisionRadiusGridAtTileIndex,
  resolvingWorldPlazaTerrainObstacleKindAtTileIndex,
} from "@/components/world/domains/resolvingWorldPlazaTerrainObstacleKindFromFeature";
import { resolvingWorldPlazaTreeAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaTreeAtTileIndex";
import type { Graphics } from "pixi.js";

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
): void {
  for (let tileY = fromTileY; tileY <= toTileY; tileY += 1) {
    for (let tileX = bounds.minTileX; tileX <= bounds.maxTileX; tileX += 1) {
      const columnRockMetadata = resolvingWorldPlazaColumnRockMetadataAtTileIndex(
        tileX,
        tileY,
      );

      if (columnRockMetadata) {
        const anchorKey = formattingWorldPlazaTileIndexCacheKey(
          columnRockMetadata.anchorTileX,
          columnRockMetadata.anchorTileY,
        );

        if (!seenColumnRockAnchorKeys.has(anchorKey)) {
          seenColumnRockAnchorKeys.add(anchorKey);

          for (const footprintTile of listingWorldPlazaColumnRockFootprintTileIndicesAtAnchorTileIndex(
            columnRockMetadata.anchorTileX,
            columnRockMetadata.anchorTileY,
          )) {
            if (
              footprintTile.tileX < bounds.minTileX ||
              footprintTile.tileX > bounds.maxTileX ||
              footprintTile.tileY < bounds.minTileY ||
              footprintTile.tileY > bounds.maxTileY
            ) {
              continue;
            }

            drawingWorldPlazaDashedIsometricTileDiamondStrokeOnGraphics(
              graphics,
              footprintTile.tileX,
              footprintTile.tileY,
              DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_COLUMN_ROCK_FOOTPRINT_TILE_STROKE_COLOR,
            );
          }

          const columnRockBaseDiamond =
            resolvingWorldPlazaColumnRockBaseDiamondFromMetadata(columnRockMetadata);
          const columnRockFaceHalfExtents =
            resolvingWorldPlazaColumnRockBaseDiamondScreenHalfExtentsPx(
              columnRockBaseDiamond,
              DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
              DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
            );
          const columnRockPlayerContactHalfExtents =
            resolvingWorldPlazaColumnRockBaseDiamondPlayerContactScreenHalfExtentsPx(
              columnRockBaseDiamond,
              DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
              DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
              DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID,
            );

          drawingWorldPlazaDashedScreenDiamondColliderStrokeOnGraphics(
            graphics,
            columnRockBaseDiamond.centerGridX,
            columnRockBaseDiamond.centerGridY,
            columnRockFaceHalfExtents.halfWidthPx,
            columnRockFaceHalfExtents.halfHeightPx,
            DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_COLUMN_ROCK_FACE_STROKE_COLOR,
          );

          drawingWorldPlazaDashedScreenDiamondColliderStrokeOnGraphics(
            graphics,
            columnRockBaseDiamond.centerGridX,
            columnRockBaseDiamond.centerGridY,
            columnRockPlayerContactHalfExtents.halfWidthPx,
            columnRockPlayerContactHalfExtents.halfHeightPx,
            DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_COLUMN_ROCK_PLAYER_CONTACT_STROKE_COLOR,
          );
        }

        continue;
      }

      const obstacleKind = resolvingWorldPlazaTerrainObstacleKindAtTileIndex(
        tileX,
        tileY,
      );

      if (obstacleKind === DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_BLOCK) {
        drawingWorldPlazaDashedIsometricTileDiamondStrokeOnGraphics(
          graphics,
          tileX,
          tileY,
          DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_BLOCK_TILE_STROKE_COLOR,
        );
      } else if (
        obstacleKind === DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_JUMP_OVER
      ) {
        drawingWorldPlazaDashedIsometricTileDiamondStrokeOnGraphics(
          graphics,
          tileX,
          tileY,
          DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_JUMP_TILE_STROKE_COLOR,
        );
      }

      const rockRadiusGrid = resolvingWorldPlazaRockCollisionRadiusGridAtTileIndex(
        tileX,
        tileY,
      );

      if (rockRadiusGrid !== null) {
        drawingWorldPlazaDashedGridCircleColliderStrokeOnGraphics(
          graphics,
          tileX,
          tileY,
          rockRadiusGrid,
          DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_ROCK_COLLIDER_STROKE_COLOR,
        );
      }

      const tree = resolvingWorldPlazaTreeAtTileIndex(tileX, tileY);

      if (tree) {
        drawingWorldPlazaDashedGridCircleColliderStrokeOnGraphics(
          graphics,
          tree.tileX,
          tree.tileY,
          tree.collisionRadiusGrid,
          DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_TREE_COLLIDER_STROKE_COLOR,
        );
      }
    }
  }
}

/**
 * Draws obstacle colliders for all visible tiles in a single pass.
 *
 * @param graphics - Target Pixi Graphics instance.
 * @param bounds - Visible tile index bounds.
 */
export function drawingWorldPlazaVisibleTerrainCollisionDebugStaticTilesOnGraphics(
  graphics: Graphics,
  bounds: DefiningWorldPlazaVisibleTileBounds,
): void {
  drawingWorldPlazaVisibleTerrainCollisionDebugStaticTileRowsOnGraphics(
    graphics,
    bounds,
    bounds.minTileY,
    bounds.maxTileY,
    new Set<string>(),
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
  playerPosition: DefiningWorldPlazaWorldPoint,
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
    .poly([
      centerX,
      topNorthY,
      eastX,
      topY,
      centerX,
      topSouthY,
      westX,
      topY,
    ])
    .fill({
      color: DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_HITBOX_FILL_COLOR,
      alpha: DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_HITBOX_TOP_FILL_ALPHA,
    });

  graphics
    .poly([westX, baseY, centerX, bottomSouthY, centerX, topSouthY, westX, topY])
    .fill({
      color: DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_HITBOX_FILL_COLOR,
      alpha: DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_HITBOX_SIDE_FILL_ALPHA,
    });

  graphics
    .poly([centerX, bottomSouthY, eastX, baseY, eastX, topY, centerX, topSouthY])
    .fill({
      color: DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_HITBOX_FILL_COLOR,
      alpha: DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_HITBOX_SIDE_FILL_ALPHA,
    });

  graphics
    .poly([centerX, bottomNorthY, eastX, baseY, centerX, bottomSouthY, westX, baseY])
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
      color: DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_HITBOX_STROKE_COLOR,
      width: DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_STROKE_WIDTH_PX,
      cap: "round",
      join: "round",
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
  playerPosition: DefiningWorldPlazaWorldPoint,
): void {
  const standingTile =
    resolvingWorldPlazaIsometricTileIndexAtGridPoint(playerPosition);

  drawingWorldPlazaIsometricTileDiamondFillOnGraphics(
    graphics,
    standingTile.tileX,
    standingTile.tileY,
    DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_STANDING_TILE_FILL_COLOR,
    DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_STANDING_TILE_FILL_ALPHA,
  );
  drawingWorldPlazaDashedIsometricTileDiamondStrokeOnGraphics(
    graphics,
    standingTile.tileX,
    standingTile.tileY,
    DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_STANDING_TILE_STROKE_COLOR,
  );

  drawingWorldPlazaVisibleTerrainCollisionDebugPlayerHitboxOnGraphics(
    graphics,
    playerPosition,
  );

  const gridScreenPoint =
    convertingWorldPlazaGridPointToIsometricScreenPoint(playerPosition);
  const halfLengthPx =
    DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_MARKER_HALF_LENGTH_PX;

  graphics
    .moveTo(gridScreenPoint.x - halfLengthPx, gridScreenPoint.y)
    .lineTo(gridScreenPoint.x + halfLengthPx, gridScreenPoint.y)
    .moveTo(gridScreenPoint.x, gridScreenPoint.y - halfLengthPx)
    .lineTo(gridScreenPoint.x, gridScreenPoint.y + halfLengthPx)
    .stroke({
      color: DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_MARKER_COLOR,
      width: DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_STROKE_WIDTH_PX,
      cap: "round",
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
  playerPosition: DefiningWorldPlazaWorldPoint,
): void {
  drawingWorldPlazaVisibleTerrainCollisionDebugStaticTilesOnGraphics(
    graphics,
    bounds,
  );
  drawingWorldPlazaVisibleTerrainCollisionDebugPlayerMarkerOnGraphics(
    graphics,
    playerPosition,
  );
}
