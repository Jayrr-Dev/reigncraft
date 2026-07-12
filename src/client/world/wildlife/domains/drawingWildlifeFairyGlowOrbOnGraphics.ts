/**
 * Draws the procedural fairy body: hard gold pixel core plus soft aura rings.
 * Dead fairies render as a plain grey dot with no glow.
 *
 * @module components/world/wildlife/domains/drawingWildlifeFairyGlowOrbOnGraphics
 */

import {
  DEFINING_WILDLIFE_FAIRY_AURA_COLOR,
  DEFINING_WILDLIFE_FAIRY_AURA_MID_ALPHA,
  DEFINING_WILDLIFE_FAIRY_AURA_MID_RADIUS_PX,
  DEFINING_WILDLIFE_FAIRY_AURA_OUTER_ALPHA,
  DEFINING_WILDLIFE_FAIRY_AURA_PULSE_AMPLITUDE,
  DEFINING_WILDLIFE_FAIRY_AURA_PULSE_PERIOD_MS,
  DEFINING_WILDLIFE_FAIRY_AURA_RADIUS_PX,
  DEFINING_WILDLIFE_FAIRY_BODY_ALPHA,
  DEFINING_WILDLIFE_FAIRY_BODY_COLOR,
  DEFINING_WILDLIFE_FAIRY_BODY_RADIUS_PX,
  DEFINING_WILDLIFE_FAIRY_DEAD_BODY_COLOR,
} from '@/components/world/wildlife/domains/definingWildlifeFairyConstants';
import type { Graphics } from 'pixi.js';

export type DrawingWildlifeFairyGlowOrbOptions = {
  nowMs: number;
  alphaScale?: number;
  isDead?: boolean;
};

/**
 * Clears and redraws the fairy glow orb centered at the graphics origin.
 */
export function drawingWildlifeFairyGlowOrbOnGraphics(
  graphics: Graphics,
  options: DrawingWildlifeFairyGlowOrbOptions
): void {
  const { nowMs, alphaScale = 1, isDead = false } = options;

  graphics.clear();

  if (alphaScale <= 0) {
    return;
  }

  if (isDead) {
    graphics.circle(0, 0, DEFINING_WILDLIFE_FAIRY_BODY_RADIUS_PX).fill({
      color: DEFINING_WILDLIFE_FAIRY_DEAD_BODY_COLOR,
      alpha: DEFINING_WILDLIFE_FAIRY_BODY_ALPHA * alphaScale,
    });
    return;
  }

  const pulsePhase =
    (nowMs % DEFINING_WILDLIFE_FAIRY_AURA_PULSE_PERIOD_MS) /
    DEFINING_WILDLIFE_FAIRY_AURA_PULSE_PERIOD_MS;
  const pulse =
    Math.sin(pulsePhase * Math.PI * 2) *
    DEFINING_WILDLIFE_FAIRY_AURA_PULSE_AMPLITUDE;

  graphics.circle(0, 0, DEFINING_WILDLIFE_FAIRY_AURA_RADIUS_PX).fill({
    color: DEFINING_WILDLIFE_FAIRY_AURA_COLOR,
    alpha: Math.min(
      1,
      (DEFINING_WILDLIFE_FAIRY_AURA_OUTER_ALPHA + pulse) * alphaScale
    ),
  });

  graphics.circle(0, 0, DEFINING_WILDLIFE_FAIRY_AURA_MID_RADIUS_PX).fill({
    color: DEFINING_WILDLIFE_FAIRY_AURA_COLOR,
    alpha: Math.min(
      1,
      (DEFINING_WILDLIFE_FAIRY_AURA_MID_ALPHA + pulse) * alphaScale
    ),
  });

  graphics.circle(0, 0, DEFINING_WILDLIFE_FAIRY_BODY_RADIUS_PX).fill({
    color: DEFINING_WILDLIFE_FAIRY_BODY_COLOR,
    alpha: DEFINING_WILDLIFE_FAIRY_BODY_ALPHA * alphaScale,
  });
}
