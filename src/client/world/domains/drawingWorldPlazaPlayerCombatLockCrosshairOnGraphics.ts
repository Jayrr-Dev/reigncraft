/**
 * Draws the player combat lock-on crosshair into a Pixi Graphics.
 *
 * @module components/world/domains/drawingWorldPlazaPlayerCombatLockCrosshairOnGraphics
 */

import {
  DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_CROSSHAIR_ARM_GAP_PX,
  DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_CROSSHAIR_ARM_LENGTH_PX,
  DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_CROSSHAIR_FILL_ALPHA,
  DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_CROSSHAIR_FILL_COLOR,
  DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_CROSSHAIR_RING_RADIUS_PX,
  DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_CROSSHAIR_STROKE_COLOR,
  DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_CROSSHAIR_STROKE_WIDTH_PX,
} from '@/components/world/domains/definingWorldPlazaPlayerCombatLockConstants';
import type { Graphics } from 'pixi.js';

/**
 * Clears and redraws a centered ring + four tick arms (matches hover cursor SVG).
 */
export function drawingWorldPlazaPlayerCombatLockCrosshairOnGraphics(
  graphics: Graphics
): void {
  graphics.clear();

  const ringRadius =
    DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_CROSSHAIR_RING_RADIUS_PX;
  const armGap = DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_CROSSHAIR_ARM_GAP_PX;
  const armLength =
    DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_CROSSHAIR_ARM_LENGTH_PX;
  const strokeColor =
    DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_CROSSHAIR_STROKE_COLOR;
  const strokeWidth =
    DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_CROSSHAIR_STROKE_WIDTH_PX;

  graphics.circle(0, 0, ringRadius);
  graphics.fill({
    color: DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_CROSSHAIR_FILL_COLOR,
    alpha: DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_CROSSHAIR_FILL_ALPHA,
  });

  graphics.circle(0, 0, ringRadius);
  graphics.stroke({
    color: strokeColor,
    width: strokeWidth,
    join: 'round',
    cap: 'round',
  });

  const armOuter = armGap + armLength;
  const arms: ReadonlyArray<readonly [number, number, number, number]> = [
    [0, -armOuter, 0, -armGap],
    [0, armGap, 0, armOuter],
    [-armOuter, 0, -armGap, 0],
    [armGap, 0, armOuter, 0],
  ];

  for (const [x1, y1, x2, y2] of arms) {
    graphics.moveTo(x1, y1);
    graphics.lineTo(x2, y2);
    graphics.stroke({
      color: strokeColor,
      width: strokeWidth,
      join: 'round',
      cap: 'round',
    });
  }
}
