import { convertingWorldPlazaGridPointToIsometricScreenPoint } from "@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint";
import {
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_MARKER_FILL_ALPHA,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_MARKER_FILL_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_MARKER_RADIUS_PX,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_MARKER_STROKE_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_MARKER_STROKE_WIDTH_PX,
} from "@/components/world/domains/definingWorldPlazaTerrainCollisionBlockerHitDebugConstants";
import type { DefiningWorldPlazaTerrainCollisionBlockerHitDebugState } from "@/components/world/domains/recordingWorldPlazaTerrainCollisionBlockerHitDebugState";
import type { Graphics } from "pixi.js";

/**
 * Draws a flash marker at the latest collision blocker hit point.
 *
 * @module components/world/domains/drawingWorldPlazaTerrainCollisionBlockerHitDebugMarkerOnGraphics
 */

/**
 * Draws a pulsing ring at the stop point for the latest blocker hit.
 *
 * @param graphics - Target Pixi Graphics instance.
 * @param hit - Latest blocker-hit debug state.
 * @param nowMs - Current `performance.now()` timestamp.
 */
export function drawingWorldPlazaTerrainCollisionBlockerHitDebugMarkerOnGraphics(
  graphics: Graphics,
  hit: DefiningWorldPlazaTerrainCollisionBlockerHitDebugState,
  nowMs: number,
): void {
  const screenPoint = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: hit.gridX,
    y: hit.gridY,
  });
  const ageMs = nowMs - hit.recordedAtMs;
  const pulseScale = 1 + 0.15 * Math.sin(ageMs * 0.02);
  const markerRadiusPx =
    DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_MARKER_RADIUS_PX *
    pulseScale;

  graphics
    .circle(screenPoint.x, screenPoint.y, markerRadiusPx)
    .fill({
      color: DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_MARKER_FILL_COLOR,
      alpha: DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_MARKER_FILL_ALPHA,
    })
    .stroke({
      color:
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_MARKER_STROKE_COLOR,
      width:
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_MARKER_STROKE_WIDTH_PX,
    });

  graphics
    .moveTo(screenPoint.x - markerRadiusPx, screenPoint.y)
    .lineTo(screenPoint.x + markerRadiusPx, screenPoint.y)
    .moveTo(screenPoint.x, screenPoint.y - markerRadiusPx)
    .lineTo(screenPoint.x, screenPoint.y + markerRadiusPx)
    .stroke({
      color:
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_MARKER_STROKE_COLOR,
      width:
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_MARKER_STROKE_WIDTH_PX,
      cap: "round",
    });
}
