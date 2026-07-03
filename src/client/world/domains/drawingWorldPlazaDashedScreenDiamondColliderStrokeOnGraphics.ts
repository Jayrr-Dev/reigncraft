import { convertingWorldPlazaGridPointToIsometricScreenPoint } from "@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint";
import {
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_DASH_LENGTH_PX,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_GAP_LENGTH_PX,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_STROKE_WIDTH_PX,
} from "@/components/world/domains/definingWorldPlazaTerrainCollisionDebugConstants";
import { drawingWorldPlazaDashedLineSegmentOnGraphics } from "@/components/world/domains/drawingWorldPlazaDashedLineSegmentOnGraphics";
import type { Graphics } from "pixi.js";

/**
 * Dashed screen-axis-aligned diamond collider debug outline.
 *
 * @module components/world/domains/drawingWorldPlazaDashedScreenDiamondColliderStrokeOnGraphics
 */

/** One screen-space corner of a debug diamond outline. */
interface DrawingWorldPlazaScreenDiamondCorner {
  /** Corner X in screen space. */
  x: number;
  /** Corner Y in screen space. */
  y: number;
}

/**
 * Draws a dashed diamond collider sized in screen pixels around a grid center.
 *
 * The diamond is screen-axis-aligned (horizontal and vertical diagonals) so it
 * traces a boulder base footprint drawn with the same half extents.
 *
 * @param graphics - Target Pixi Graphics instance.
 * @param centerGridX - Diamond center X in grid space.
 * @param centerGridY - Diamond center Y in grid space.
 * @param halfWidthPx - Horizontal half diagonal in screen pixels.
 * @param halfHeightPx - Vertical half diagonal in screen pixels.
 * @param strokeColor - Outline color.
 */
export function drawingWorldPlazaDashedScreenDiamondColliderStrokeOnGraphics(
  graphics: Graphics,
  centerGridX: number,
  centerGridY: number,
  halfWidthPx: number,
  halfHeightPx: number,
  strokeColor: number,
): void {
  const center = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: centerGridX,
    y: centerGridY,
  });
  const corners: DrawingWorldPlazaScreenDiamondCorner[] = [
    { x: center.x, y: center.y - halfHeightPx },
    { x: center.x + halfWidthPx, y: center.y },
    { x: center.x, y: center.y + halfHeightPx },
    { x: center.x - halfWidthPx, y: center.y },
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
