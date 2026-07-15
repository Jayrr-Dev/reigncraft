/**
 * Resolves Cyroborn avatar scale multiplier from jump / attack / death progress.
 *
 * @module components/world/domains/resolvingWorldPlazaCyrobornScalePulseMultiplier
 */

import {
  computingWorldPlazaEaseBumpProgress,
  computingWorldPlazaEaseInCubic,
  computingWorldPlazaEaseInOutCubic,
  computingWorldPlazaEaseOutQuad,
} from '@/components/world/domains/computingWorldPlazaEasing';
import {
  DEFINING_WORLD_PLAZA_CYROBORN_ATTACK_GROW_AMOUNT,
  DEFINING_WORLD_PLAZA_CYROBORN_ATTACK_SETTLE_SHRINK_AMOUNT,
  DEFINING_WORLD_PLAZA_CYROBORN_DEATH_IMPLODE_HIDE_SCALE,
  DEFINING_WORLD_PLAZA_CYROBORN_JUMP_SHRINK_AMOUNT,
  DEFINING_WORLD_PLAZA_CYROBORN_SCALE_PULSE_SKIN_ID,
} from '@/components/world/domains/definingWorldPlazaCyrobornScalePulseConstants';

export type ResolvingWorldPlazaCyrobornScalePulseMultiplierParams = {
  readonly skinId: string;
  /** Jump flight progress 0..1, or null when grounded. */
  readonly jumpProgress: number | null;
  /** Attack / cast strip progress 0..1, or null when idle. */
  readonly attackProgress: number | null;
  /**
   * Death implode progress 0..1 (1 = fully collapsed). When set, overrides
   * jump/attack pulses so the crystal vanishes cleanly.
   */
  readonly deathProgress: number | null;
};

export type ResolvingWorldPlazaCyrobornScalePulseResult = {
  readonly scaleMultiplier: number;
  /** True when the body should be hidden after implode. */
  readonly hideBody: boolean;
};

/**
 * True when this skin uses the Cyroborn crystal scale pulse.
 */
export function checkingWorldPlazaCyrobornScalePulseApplies(
  skinId: string
): boolean {
  return skinId === DEFINING_WORLD_PLAZA_CYROBORN_SCALE_PULSE_SKIN_ID;
}

/**
 * Jump shrink: ease-out into the apex dip, ease bump for a soft landing recover.
 */
function resolvingCyrobornJumpScaleMultiplier(jumpProgress: number): number {
  const bump = computingWorldPlazaEaseBumpProgress(
    jumpProgress,
    computingWorldPlazaEaseOutQuad
  );
  return 1 - DEFINING_WORLD_PLAZA_CYROBORN_JUMP_SHRINK_AMOUNT * bump;
}

/**
 * Attack pulse: grow through mid-cast, then settle with a slight overshoot shrink.
 */
function resolvingCyrobornAttackScaleMultiplier(
  attackProgress: number
): number {
  const growBump = computingWorldPlazaEaseBumpProgress(
    attackProgress,
    computingWorldPlazaEaseInOutCubic
  );

  const settleWindowStart = 0.55;
  const settleProgress =
    attackProgress <= settleWindowStart
      ? 0
      : (attackProgress - settleWindowStart) / (1 - settleWindowStart);
  const settleBump = computingWorldPlazaEaseBumpProgress(
    settleProgress,
    computingWorldPlazaEaseInOutCubic
  );

  return (
    1 +
    DEFINING_WORLD_PLAZA_CYROBORN_ATTACK_GROW_AMOUNT * growBump -
    DEFINING_WORLD_PLAZA_CYROBORN_ATTACK_SETTLE_SHRINK_AMOUNT * settleBump
  );
}

/**
 * Death implode: ease-in cubic from 1 → 0 (accelerating collapse to nothing).
 */
function resolvingCyrobornDeathScaleMultiplier(deathProgress: number): number {
  const implode = computingWorldPlazaEaseInCubic(deathProgress);
  return Math.max(0, 1 - implode);
}

/**
 * Combined scale multiplier for Cyroborn. Non-Cyroborn skins always return rest.
 * Death overrides jump/attack. Jump and attack multiply when both active.
 */
export function resolvingWorldPlazaCyrobornScalePulseMultiplier(
  params: ResolvingWorldPlazaCyrobornScalePulseMultiplierParams
): ResolvingWorldPlazaCyrobornScalePulseResult {
  if (!checkingWorldPlazaCyrobornScalePulseApplies(params.skinId)) {
    return { scaleMultiplier: 1, hideBody: false };
  }

  if (params.deathProgress !== null) {
    const scaleMultiplier = resolvingCyrobornDeathScaleMultiplier(
      params.deathProgress
    );
    return {
      scaleMultiplier,
      hideBody: scaleMultiplier <= DEFINING_WORLD_PLAZA_CYROBORN_DEATH_IMPLODE_HIDE_SCALE,
    };
  }

  let scaleMultiplier = 1;

  if (params.jumpProgress !== null) {
    scaleMultiplier *= resolvingCyrobornJumpScaleMultiplier(params.jumpProgress);
  }

  if (params.attackProgress !== null) {
    scaleMultiplier *= resolvingCyrobornAttackScaleMultiplier(
      params.attackProgress
    );
  }

  return { scaleMultiplier, hideBody: false };
}
