/**
 * Screen-space hover offset for glowOrb wildlife (fairy, Cyroborn, …).
 *
 * @module components/world/wildlife/domains/resolvingWildlifeGlowOrbHoverOffsetPx
 */

import {
  DEFINING_WILDLIFE_CYROBORN_HOVER_BOB_AMPLITUDE_PX,
  DEFINING_WILDLIFE_CYROBORN_HOVER_BOB_PERIOD_MS,
  DEFINING_WILDLIFE_CYROBORN_HOVER_LIFT_PX,
  DEFINING_WILDLIFE_CYROBORN_HOVER_SWAY_AMPLITUDE_PX,
  DEFINING_WILDLIFE_CYROBORN_HOVER_SWAY_PERIOD_MS,
  DEFINING_WILDLIFE_CYROBORN_SPECIES_ID,
} from '@/components/world/wildlife/domains/definingWildlifeCyrobornConstants';
import {
  DEFINING_WILDLIFE_FAIRY_HOVER_BOB_AMPLITUDE_PX,
  DEFINING_WILDLIFE_FAIRY_HOVER_BOB_PERIOD_MS,
  DEFINING_WILDLIFE_FAIRY_HOVER_LIFT_PX,
  DEFINING_WILDLIFE_FAIRY_HOVER_SWAY_AMPLITUDE_PX,
  DEFINING_WILDLIFE_FAIRY_HOVER_SWAY_PERIOD_MS,
} from '@/components/world/wildlife/domains/definingWildlifeFairyConstants';

type GlowOrbHoverProfile = {
  liftPx: number;
  bobAmplitudePx: number;
  bobPeriodMs: number;
  swayAmplitudePx: number;
  swayPeriodMs: number;
};

const FAIRY_HOVER: GlowOrbHoverProfile = {
  liftPx: DEFINING_WILDLIFE_FAIRY_HOVER_LIFT_PX,
  bobAmplitudePx: DEFINING_WILDLIFE_FAIRY_HOVER_BOB_AMPLITUDE_PX,
  bobPeriodMs: DEFINING_WILDLIFE_FAIRY_HOVER_BOB_PERIOD_MS,
  swayAmplitudePx: DEFINING_WILDLIFE_FAIRY_HOVER_SWAY_AMPLITUDE_PX,
  swayPeriodMs: DEFINING_WILDLIFE_FAIRY_HOVER_SWAY_PERIOD_MS,
};

const CYROBORN_HOVER: GlowOrbHoverProfile = {
  liftPx: DEFINING_WILDLIFE_CYROBORN_HOVER_LIFT_PX,
  bobAmplitudePx: DEFINING_WILDLIFE_CYROBORN_HOVER_BOB_AMPLITUDE_PX,
  bobPeriodMs: DEFINING_WILDLIFE_CYROBORN_HOVER_BOB_PERIOD_MS,
  swayAmplitudePx: DEFINING_WILDLIFE_CYROBORN_HOVER_SWAY_AMPLITUDE_PX,
  swayPeriodMs: DEFINING_WILDLIFE_CYROBORN_HOVER_SWAY_PERIOD_MS,
};

function hashingGlowOrbPhaseSeed(instanceId: string): number {
  let hash = 0;

  for (let index = 0; index < instanceId.length; index += 1) {
    hash = (hash * 31 + instanceId.charCodeAt(index)) % 997;
  }

  return hash / 997;
}

function resolvingGlowOrbHoverProfile(speciesId: string): GlowOrbHoverProfile {
  if (speciesId === DEFINING_WILDLIFE_CYROBORN_SPECIES_ID) {
    return CYROBORN_HOVER;
  }

  return FAIRY_HOVER;
}

/**
 * Returns the {x, y} screen offset to add to a glowOrb body position.
 * Negative y lifts the orb above its grid anchor.
 */
export function resolvingWildlifeGlowOrbHoverOffsetPx(
  speciesId: string,
  instanceId: string,
  nowMs: number,
  isDead: boolean
): { x: number; y: number } {
  if (isDead) {
    return { x: 0, y: 0 };
  }

  const profile = resolvingGlowOrbHoverProfile(speciesId);
  const phaseSeed = hashingGlowOrbPhaseSeed(instanceId);
  const bobPhase = (nowMs / profile.bobPeriodMs + phaseSeed) * Math.PI * 2;
  const swayPhase =
    (nowMs / profile.swayPeriodMs + phaseSeed * 2) * Math.PI * 2;

  return {
    x: Math.sin(swayPhase) * profile.swayAmplitudePx,
    y: -profile.liftPx + Math.sin(bobPhase) * profile.bobAmplitudePx,
  };
}

/**
 * Hover lift used for vitals / name-tag clearance (constant, no bob).
 */
export function resolvingWildlifeGlowOrbHoverLiftPx(speciesId: string): number {
  return resolvingGlowOrbHoverProfile(speciesId).liftPx;
}
