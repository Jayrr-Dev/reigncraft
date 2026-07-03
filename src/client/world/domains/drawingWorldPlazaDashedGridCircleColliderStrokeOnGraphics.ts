import { convertingWorldPlazaGridPointToIsometricScreenPoint } from "@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint";
import {
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_CIRCLE_SEGMENT_COUNT,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_DASH_LENGTH_PX,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_GAP_LENGTH_PX,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_STROKE_WIDTH_PX,
} from "@/components/world/domains/definingWorldPlazaTerrainCollisionDebugConstants";
import { drawingWorldPlazaDashedLineSegmentOnGraphics } from "@/components/world/domains/drawingWorldPlazaDashedLineSegmentOnGraphics";
import type { Graphics } from "pixi.js";

/**
 * Dashed grid-space circular collider debug outline.
 *
 * @module components/world/domains/drawingWorldPlazaDashedGridCircleColliderStrokeOnGraphics
 */

/** One sampled point on a grid-space circle projected to screen space. */
interface DrawingWorldPlazaGridCircleScreenPoint {
  /** Screen X. */
  x: number;
  /** Screen Y. */
  y: number;
}

/**
 * Draws a dashed circle collider centered on a tile in grid space.
 *
 * @param graphics - Target Pixi Graphics instance.
 * @param centerGridX - Collider center X in grid space.
 * @param centerGridY - Collider center Y in grid space.
 * @param radiusGrid - Collider radius in grid tiles.
 * @param strokeColor - Outline color.
 */
export function drawingWorldPlazaDashedGridCircleColliderStrokeOnGraphics(
  graphics: Graphics,
  centerGridX: number,
  centerGridY: number,
  radiusGrid: number,
  strokeColor: number,
): void {
  const segmentCount =
    DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_CIRCLE_SEGMENT_COUNT;
  const screenPoints: DrawingWorldPlazaGridCircleScreenPoint[] = [];

  for (let segmentIndex = 0; segmentIndex <= segmentCount; segmentIndex += 1) {
    const angleRadians = (Math.PI * 2 * segmentIndex) / segmentCount;
    const sampleGridPoint = convertingWorldPlazaGridPointToIsometricScreenPoint({
      x: centerGridX + Math.cos(angleRadians) * radiusGrid,
      y: centerGridY + Math.sin(angleRadians) * radiusGrid,
    });

    screenPoints.push({
      x: sampleGridPoint.x,
      y: sampleGridPoint.y,
    });
  }

  for (let segmentIndex = 0; segmentIndex < screenPoints.length - 1; segmentIndex += 1) {
    const fromPoint = screenPoints[segmentIndex];
    const toPoint = screenPoints[segmentIndex + 1];

    drawingWorldPlazaDashedLineSegmentOnGraphics(
      graphics,
      fromPoint.x,
      fromPoint.y,
      toPoint.x,
      toPoint.y,
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
