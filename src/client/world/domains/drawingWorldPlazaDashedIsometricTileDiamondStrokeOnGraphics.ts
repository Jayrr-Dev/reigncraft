import { convertingWorldPlazaGridPointToIsometricScreenPoint } from "@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint";
import { computingWorldBuildingWorldLayerScreenOffsetPx } from "@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx";
import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from "@/components/world/building/domains/definingWorldBuildingWorldLayerConstants";
import {
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_DASH_LENGTH_PX,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_GAP_LENGTH_PX,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_STROKE_WIDTH_PX,
} from "@/components/world/domains/definingWorldPlazaTerrainCollisionDebugConstants";
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from "@/components/world/domains/definingWorldPlazaIsometricConstants";
import { drawingWorldPlazaDashedLineSegmentOnGraphics } from "@/components/world/domains/drawingWorldPlazaDashedLineSegmentOnGraphics";
import type { Graphics } from "pixi.js";

/**
 * Dashed isometric tile diamond used for collision debug overlays.
 *
 * @module components/world/domains/drawingWorldPlazaDashedIsometricTileDiamondStrokeOnGraphics
 */

/** One screen-space corner of an isometric tile diamond. */
interface DrawingWorldPlazaIsometricTileDiamondCorner {
  /** Corner X in screen space. */
  x: number;
  /** Corner Y in screen space. */
  y: number;
}

/**
 * Draws a dashed diamond outline for one tile collision footprint.
 *
 * @param graphics - Target Pixi Graphics instance.
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param strokeColor - Outline color.
 * @param worldLayer - One-based world layer for vertical alignment.
 */
export function drawingWorldPlazaDashedIsometricTileDiamondStrokeOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number,
  strokeColor: number,
  worldLayer: number = DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
): void {
  const center = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: tileX,
    y: tileY,
  });
  const centerY =
    center.y + computingWorldBuildingWorldLayerScreenOffsetPx(worldLayer);
  const halfWidth = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;
  const halfHeight = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;
  const corners: DrawingWorldPlazaIsometricTileDiamondCorner[] = [
    { x: center.x, y: centerY - halfHeight },
    { x: center.x + halfWidth, y: centerY },
    { x: center.x, y: centerY + halfHeight },
    { x: center.x - halfWidth, y: centerY },
  ];

  for (let cornerIndex = 0; cornerIndex < corners.length; cornerIndex += 1) {
    const fromCorner = corners[cornerIndex];
    const toCorner = corners[(cornerIndex + 1) % corners.length];

    drawingWorldPlazaDashedLineSegmentOnGraphics(
      graphics,
      fromCorner.x,
      fromCorner.y,
      toCorner.x,
      toCorner.y,
      DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_DASH_LENGTH_PX,
      DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_GAP_LENGTH_PX,
    );
  }

  graphics.stroke({
    color: strokeColor,
    width: DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_STROKE_WIDTH_PX,
    cap: "round",
    join: "round",
  });
}

/**
 * Draws a dashed diamond outline at a fractional grid position and scale.
 *
 * @param graphics - Target Pixi Graphics instance.
 * @param centerGridX - Diamond center X in grid space.
 * @param centerGridY - Diamond center Y in grid space.
 * @param footprintScale - Size relative to one full tile diamond.
 * @param strokeColor - Outline color.
 * @param worldLayer - One-based world layer for vertical alignment.
 */
export function drawingWorldPlazaDashedIsometricGridDiamondStrokeOnGraphics(
  graphics: Graphics,
  centerGridX: number,
  centerGridY: number,
  footprintScale: number,
  strokeColor: number,
  worldLayer: number = DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
): void {
  const center = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: centerGridX,
    y: centerGridY,
  });
  const centerY =
    center.y + computingWorldBuildingWorldLayerScreenOffsetPx(worldLayer);
  const halfWidth =
    DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX * footprintScale;
  const halfHeight =
    DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX * footprintScale;
  const corners: DrawingWorldPlazaIsometricTileDiamondCorner[] = [
    { x: center.x, y: centerY - halfHeight },
    { x: center.x + halfWidth, y: centerY },
    { x: center.x, y: centerY + halfHeight },
    { x: center.x - halfWidth, y: centerY },
  ];

  for (let cornerIndex = 0; cornerIndex < corners.length; cornerIndex += 1) {
    const fromCorner = corners[cornerIndex];
    const toCorner = corners[(cornerIndex + 1) % corners.length];

    drawingWorldPlazaDashedLineSegmentOnGraphics(
      graphics,
      fromCorner.x,
      fromCorner.y,
      toCorner.x,
      toCorner.y,
      DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_DASH_LENGTH_PX,
      DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_GAP_LENGTH_PX,
    );
  }

  graphics.stroke({
    color: strokeColor,
    width: DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_STROKE_WIDTH_PX,
    cap: "round",
    join: "round",
  });
}
