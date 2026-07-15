/**
 * Draws the procedural Cyroborn body: sapphire crystal core plus soft ice aura.
 *
 * @module components/world/wildlife/domains/drawingWildlifeCyrobornGlowOrbOnGraphics
 */

import {
  DEFINING_WILDLIFE_CYROBORN_AURA_COLOR,
  DEFINING_WILDLIFE_CYROBORN_AURA_MID_ALPHA,
  DEFINING_WILDLIFE_CYROBORN_AURA_MID_RADIUS_PX,
  DEFINING_WILDLIFE_CYROBORN_AURA_OUTER_ALPHA,
  DEFINING_WILDLIFE_CYROBORN_AURA_PULSE_AMPLITUDE,
  DEFINING_WILDLIFE_CYROBORN_AURA_PULSE_PERIOD_MS,
  DEFINING_WILDLIFE_CYROBORN_AURA_RADIUS_PX,
  DEFINING_WILDLIFE_CYROBORN_BODY_ALPHA,
  DEFINING_WILDLIFE_CYROBORN_BODY_COLOR,
  DEFINING_WILDLIFE_CYROBORN_BODY_RADIUS_PX,
  DEFINING_WILDLIFE_CYROBORN_DEAD_BODY_COLOR,
  DEFINING_WILDLIFE_CYROBORN_MID_COLOR,
} from '@/components/world/wildlife/domains/definingWildlifeCyrobornConstants';
import type { Graphics } from 'pixi.js';

export type DrawingWildlifeCyrobornGlowOrbOptions = {
  nowMs: number;
  alphaScale?: number;
  isDead?: boolean;
};

/**
 * Clears and redraws the Cyroborn crystal orb centered at the graphics origin.
 */
export function drawingWildlifeCyrobornGlowOrbOnGraphics(
  graphics: Graphics,
  options: DrawingWildlifeCyrobornGlowOrbOptions
): void {
  const { nowMs, alphaScale = 1, isDead = false } = options;

  graphics.clear();

  if (alphaScale <= 0) {
    return;
  }

  if (isDead) {
    graphics.circle(0, 0, DEFINING_WILDLIFE_CYROBORN_BODY_RADIUS_PX).fill({
      color: DEFINING_WILDLIFE_CYROBORN_DEAD_BODY_COLOR,
      alpha: DEFINING_WILDLIFE_CYROBORN_BODY_ALPHA * alphaScale,
    });
    return;
  }

  const pulsePhase =
    (nowMs % DEFINING_WILDLIFE_CYROBORN_AURA_PULSE_PERIOD_MS) /
    DEFINING_WILDLIFE_CYROBORN_AURA_PULSE_PERIOD_MS;
  const pulse =
    Math.sin(pulsePhase * Math.PI * 2) *
    DEFINING_WILDLIFE_CYROBORN_AURA_PULSE_AMPLITUDE;

  graphics.circle(0, 0, DEFINING_WILDLIFE_CYROBORN_AURA_RADIUS_PX).fill({
    color: DEFINING_WILDLIFE_CYROBORN_AURA_COLOR,
    alpha: Math.min(
      1,
      (DEFINING_WILDLIFE_CYROBORN_AURA_OUTER_ALPHA + pulse) * alphaScale
    ),
  });

  graphics.circle(0, 0, DEFINING_WILDLIFE_CYROBORN_AURA_MID_RADIUS_PX).fill({
    color: DEFINING_WILDLIFE_CYROBORN_MID_COLOR,
    alpha: Math.min(
      1,
      (DEFINING_WILDLIFE_CYROBORN_AURA_MID_ALPHA + pulse * 0.5) * alphaScale
    ),
  });

  graphics.circle(0, 0, DEFINING_WILDLIFE_CYROBORN_BODY_RADIUS_PX).fill({
    color: DEFINING_WILDLIFE_CYROBORN_BODY_COLOR,
    alpha: DEFINING_WILDLIFE_CYROBORN_BODY_ALPHA * alphaScale,
  });

  // Small bright facet highlight so the orb reads as crystal, not a flat blob.
  graphics.circle(-3, -4, 3).fill({
    color: 0xffffff,
    alpha: 0.35 * alphaScale,
  });
}
