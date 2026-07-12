/**
 * Screen-space hover offset for a floating fairy orb.
 *
 * Combines a constant lift with slow desynced sine bob and sway so each fairy
 * traces its own lazy drifting path instead of gliding flat along the ground.
 * Dead fairies drop the hover entirely and rest on the ground.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeFairyHoverOffsetPx
 */

import {
  DEFINING_WILDLIFE_FAIRY_HOVER_BOB_AMPLITUDE_PX,
  DEFINING_WILDLIFE_FAIRY_HOVER_BOB_PERIOD_MS,
  DEFINING_WILDLIFE_FAIRY_HOVER_LIFT_PX,
  DEFINING_WILDLIFE_FAIRY_HOVER_SWAY_AMPLITUDE_PX,
  DEFINING_WILDLIFE_FAIRY_HOVER_SWAY_PERIOD_MS,
} from '@/components/world/wildlife/domains/definingWildlifeFairyConstants';

/** Cheap stable hash so each fairy bobs on its own phase. */
function hashingFairyPhaseSeed(instanceId: string): number {
  let hash = 0;

  for (let index = 0; index < instanceId.length; index += 1) {
    hash = (hash * 31 + instanceId.charCodeAt(index)) % 997;
  }

  return hash / 997;
}

/**
 * Returns the {x, y} screen offset to add to the fairy orb position.
 * Negative y lifts the orb above its grid anchor.
 */
export function resolvingWildlifeFairyHoverOffsetPx(
  instanceId: string,
  nowMs: number,
  isDead: boolean
): { x: number; y: number } {
  if (isDead) {
    return { x: 0, y: 0 };
  }

  const phaseSeed = hashingFairyPhaseSeed(instanceId);
  const bobPhase =
    ((nowMs / DEFINING_WILDLIFE_FAIRY_HOVER_BOB_PERIOD_MS) + phaseSeed) *
    Math.PI *
    2;
  const swayPhase =
    ((nowMs / DEFINING_WILDLIFE_FAIRY_HOVER_SWAY_PERIOD_MS) + phaseSeed * 2) *
    Math.PI *
    2;

  return {
    x: Math.sin(swayPhase) * DEFINING_WILDLIFE_FAIRY_HOVER_SWAY_AMPLITUDE_PX,
    y:
      -DEFINING_WILDLIFE_FAIRY_HOVER_LIFT_PX +
      Math.sin(bobPhase) * DEFINING_WILDLIFE_FAIRY_HOVER_BOB_AMPLITUDE_PX,
  };
}
