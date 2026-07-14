/**
 * Draws wildlife overhead vitals: hunger orb + optional HP/stamina bars.
 *
 * @module components/world/wildlife/domains/drawingWildlifeVitalsOnGraphics
 */

import { resolvingWorldPlazaHungerFillMidPixiColor } from '@/components/world/hunger/domains/resolvingWorldPlazaHungerFillColor';
import {
  DEFINING_WILDLIFE_HUNGER_CIRCLE_EMPTY_ALPHA,
  DEFINING_WILDLIFE_HUNGER_CIRCLE_EMPTY_COLOR,
  DEFINING_WILDLIFE_HUNGER_CIRCLE_FILL_ARC_STEPS,
  DEFINING_WILDLIFE_HUNGER_CIRCLE_GAP_FROM_BARS_PX,
  DEFINING_WILDLIFE_HUNGER_CIRCLE_INNER_RADIUS_PX,
  DEFINING_WILDLIFE_HUNGER_CIRCLE_OUTER_RADIUS_PX,
  DEFINING_WILDLIFE_HUNGER_CIRCLE_RING_COLOR,
  DEFINING_WILDLIFE_VITALS_BAR_GAP_PX,
  DEFINING_WILDLIFE_VITALS_BAR_HEIGHT_PX,
  DEFINING_WILDLIFE_VITALS_BAR_WIDTH_PX,
  DEFINING_WILDLIFE_VITALS_STAMINA_BAR_HEIGHT_PX,
} from '@/components/world/wildlife/domains/definingWildlifeVitalsBarConstants';
import type { Graphics } from 'pixi.js';

export type DrawingWildlifeVitalsOnGraphicsParams = {
  graphics: Graphics;
  healthRatio: number;
  staminaRatio: number;
  hungerRatio: number;
  /** When true, draw the circular hunger orb (player-style fill drain). */
  showHungerCircle: boolean;
  /** When true, draw HP + stamina tracks beside the hunger orb. */
  showBars: boolean;
};

/** Player HP bar thresholds reused for animals (green / orange / red). */
function resolvingWildlifeBarFillColor(healthRatio: number): number {
  if (healthRatio <= 0.25) {
    return 0x8f1010;
  }

  if (healthRatio <= 0.5) {
    return 0xc45c12;
  }

  return 0x1f9b3f;
}

/**
 * Fills the bottom portion of a circle (ratio 1 = full disc, 0 = empty).
 * Matches the HUD hunger orb draining upward from the bottom.
 */
function drawingWildlifeHungerCircleFill(
  graphics: Graphics,
  centerX: number,
  centerY: number,
  radius: number,
  hungerRatio: number,
  fillColor: number
): void {
  const clampedRatio = Math.min(1, Math.max(0, hungerRatio));

  if (clampedRatio <= 0) {
    return;
  }

  if (clampedRatio >= 1) {
    graphics.circle(centerX, centerY, radius).fill({ color: fillColor });
    return;
  }

  const waterY = centerY + radius * (1 - 2 * clampedRatio);
  const dy = waterY - centerY;
  const halfChord = Math.sqrt(Math.max(0, radius * radius - dy * dy));
  const rightAngle = Math.atan2(dy, halfChord);
  const leftAngle = Math.atan2(dy, -halfChord);
  let sweep = leftAngle - rightAngle;

  if (sweep <= 0) {
    sweep += Math.PI * 2;
  }

  const points: number[] = [
    centerX - halfChord,
    waterY,
    centerX + halfChord,
    waterY,
  ];

  for (
    let stepIndex = 1;
    stepIndex <= DEFINING_WILDLIFE_HUNGER_CIRCLE_FILL_ARC_STEPS;
    stepIndex += 1
  ) {
    const angle =
      rightAngle +
      (sweep * stepIndex) / DEFINING_WILDLIFE_HUNGER_CIRCLE_FILL_ARC_STEPS;
    points.push(
      centerX + Math.cos(angle) * radius,
      centerY + Math.sin(angle) * radius
    );
  }

  graphics.poly(points).fill({ color: fillColor });
}

function drawingWildlifeHungerCircle(
  graphics: Graphics,
  hungerRatio: number,
  centerX: number,
  centerY: number
): void {
  const outerRadius = DEFINING_WILDLIFE_HUNGER_CIRCLE_OUTER_RADIUS_PX;
  const innerRadius = DEFINING_WILDLIFE_HUNGER_CIRCLE_INNER_RADIUS_PX;

  graphics.circle(centerX, centerY, outerRadius).fill({
    color: DEFINING_WILDLIFE_HUNGER_CIRCLE_RING_COLOR,
  });
  graphics.circle(centerX, centerY, innerRadius).fill({
    color: DEFINING_WILDLIFE_HUNGER_CIRCLE_EMPTY_COLOR,
    alpha: DEFINING_WILDLIFE_HUNGER_CIRCLE_EMPTY_ALPHA,
  });

  drawingWildlifeHungerCircleFill(
    graphics,
    centerX,
    centerY,
    innerRadius,
    hungerRatio,
    resolvingWorldPlazaHungerFillMidPixiColor(hungerRatio)
  );
}

function drawingWildlifeHealthAndStaminaBars(
  graphics: Graphics,
  healthRatio: number,
  staminaRatio: number
): void {
  const barLeft = -DEFINING_WILDLIFE_VITALS_BAR_WIDTH_PX / 2;
  const clampedHealth = Math.min(1, Math.max(0, healthRatio));
  const clampedStamina = Math.min(1, Math.max(0, staminaRatio));

  graphics
    .rect(
      barLeft,
      0,
      DEFINING_WILDLIFE_VITALS_BAR_WIDTH_PX,
      DEFINING_WILDLIFE_VITALS_BAR_HEIGHT_PX
    )
    .fill({ color: 0x1a140f, alpha: 0.9 });

  if (clampedHealth > 0) {
    graphics
      .rect(
        barLeft,
        0,
        DEFINING_WILDLIFE_VITALS_BAR_WIDTH_PX * clampedHealth,
        DEFINING_WILDLIFE_VITALS_BAR_HEIGHT_PX
      )
      .fill({ color: resolvingWildlifeBarFillColor(clampedHealth) });
  }

  const staminaTop =
    DEFINING_WILDLIFE_VITALS_BAR_HEIGHT_PX +
    DEFINING_WILDLIFE_VITALS_BAR_GAP_PX;

  graphics
    .rect(
      barLeft,
      staminaTop,
      DEFINING_WILDLIFE_VITALS_BAR_WIDTH_PX,
      DEFINING_WILDLIFE_VITALS_STAMINA_BAR_HEIGHT_PX
    )
    .fill({ color: 0x1a140f, alpha: 0.9 });

  if (clampedStamina > 0) {
    graphics
      .rect(
        barLeft,
        staminaTop,
        DEFINING_WILDLIFE_VITALS_BAR_WIDTH_PX * clampedStamina,
        DEFINING_WILDLIFE_VITALS_STAMINA_BAR_HEIGHT_PX
      )
      .fill({ color: 0xd9a521 });
  }
}

/**
 * Clears and redraws wildlife overhead vitals onto a Pixi Graphics object.
 */
export function drawingWildlifeVitalsOnGraphics({
  graphics,
  healthRatio,
  staminaRatio,
  hungerRatio,
  showHungerCircle,
  showBars,
}: DrawingWildlifeVitalsOnGraphicsParams): void {
  graphics.clear();

  if (!showHungerCircle && !showBars) {
    return;
  }

  if (showBars) {
    drawingWildlifeHealthAndStaminaBars(graphics, healthRatio, staminaRatio);
  }

  if (!showHungerCircle) {
    return;
  }

  const barsHeight =
    DEFINING_WILDLIFE_VITALS_BAR_HEIGHT_PX +
    DEFINING_WILDLIFE_VITALS_BAR_GAP_PX +
    DEFINING_WILDLIFE_VITALS_STAMINA_BAR_HEIGHT_PX;
  const hungerCenterX = showBars
    ? -DEFINING_WILDLIFE_VITALS_BAR_WIDTH_PX / 2 -
      DEFINING_WILDLIFE_HUNGER_CIRCLE_GAP_FROM_BARS_PX -
      DEFINING_WILDLIFE_HUNGER_CIRCLE_OUTER_RADIUS_PX
    : 0;
  const hungerCenterY = showBars ? barsHeight / 2 : 0;

  drawingWildlifeHungerCircle(
    graphics,
    hungerRatio,
    hungerCenterX,
    hungerCenterY
  );
}
