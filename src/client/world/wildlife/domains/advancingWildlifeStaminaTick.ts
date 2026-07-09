/**
 * Wildlife run stamina tick (mirrors the player run stamina model).
 *
 * Running drains stamina; walking or idling regenerates it. At zero the
 * animal is exhausted and forced to walk until stamina recovers past the
 * exit threshold.
 *
 * Default path keeps the legacy inline loop. Set
 * {@link DEFINING_STAMINA_CORE_TICK_OPT_IN} to route through
 * {@link advancingStaminaCoreTick}.
 *
 * @module components/world/wildlife/domains/advancingWildlifeStaminaTick
 */

import { advancingStaminaCoreTick } from '@/components/world/stamina/domains/advancingStaminaCoreTick';
import { DEFINING_STAMINA_CORE_TICK_OPT_IN } from '@/components/world/stamina/domains/definingStaminaCoreOptInConstants';
import type { DefiningWildlifeSpeciesStaminaConfig } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeStaminaState } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Stamina drained per second while running. */
export const DEFINING_WILDLIFE_STAMINA_DRAIN_PER_SECOND = 0.22;

/** Stamina regenerated per second while not running. */
export const DEFINING_WILDLIFE_STAMINA_REGEN_PER_SECOND = 0.15;

/** Ratio the animal must recover to before it may run again. */
export const DEFINING_WILDLIFE_STAMINA_EXHAUSTED_EXIT_RATIO = 0.35;

const DEFINING_WILDLIFE_DEFAULT_STAMINA_CONFIG: DefiningWildlifeSpeciesStaminaConfig =
  {
    drainMultiplier: 1,
    regenMultiplier: 1,
  };

export function creatingWildlifeInitialStaminaState(): DefiningWildlifeStaminaState {
  return { staminaRatio: 1, isExhausted: false };
}

export type AdvancingWildlifeStaminaTickResult = {
  state: DefiningWildlifeStaminaState;
  /** True when the animal is actually allowed to run this frame. */
  isRunning: boolean;
};

function advancingWildlifeStaminaTickLegacy(
  state: DefiningWildlifeStaminaState,
  wantsToRun: boolean,
  deltaSeconds: number,
  staminaConfig: DefiningWildlifeSpeciesStaminaConfig,
  exhaustedExitRatio: number,
  maxStaminaRatio: number
): AdvancingWildlifeStaminaTickResult {
  const isRunning = wantsToRun && !state.isExhausted && state.staminaRatio > 0;
  const drainPerSecond =
    DEFINING_WILDLIFE_STAMINA_DRAIN_PER_SECOND * staminaConfig.drainMultiplier;
  const regenPerSecond =
    DEFINING_WILDLIFE_STAMINA_REGEN_PER_SECOND * staminaConfig.regenMultiplier;

  const nextRatio = Math.min(
    maxStaminaRatio,
    Math.max(
      0,
      state.staminaRatio +
        (isRunning ? -drainPerSecond : regenPerSecond) * deltaSeconds
    )
  );

  const nextExhausted = state.isExhausted
    ? nextRatio < exhaustedExitRatio
    : nextRatio <= 0;

  return {
    state: { staminaRatio: nextRatio, isExhausted: nextExhausted },
    isRunning,
  };
}

function advancingWildlifeStaminaTickViaCore(
  state: DefiningWildlifeStaminaState,
  wantsToRun: boolean,
  deltaSeconds: number,
  staminaConfig: DefiningWildlifeSpeciesStaminaConfig,
  exhaustedExitRatio: number,
  maxStaminaRatio: number
): AdvancingWildlifeStaminaTickResult {
  const result = advancingStaminaCoreTick({
    state: {
      staminaRatio: state.staminaRatio,
      isRunLocked: state.isExhausted,
    },
    wantsToRun,
    deltaSeconds,
    config: {
      drainPerSecond:
        DEFINING_WILDLIFE_STAMINA_DRAIN_PER_SECOND *
        staminaConfig.drainMultiplier,
      regenPerSecond:
        DEFINING_WILDLIFE_STAMINA_REGEN_PER_SECOND *
        staminaConfig.regenMultiplier,
      runLockedExitRatio: exhaustedExitRatio,
      maxStaminaRatio,
    },
  });

  return {
    state: {
      staminaRatio: result.state.staminaRatio,
      isExhausted: result.state.isRunLocked,
    },
    isRunning: result.isRunning,
  };
}

/**
 * Advances stamina one frame given the animal's intent to run.
 */
export function advancingWildlifeStaminaTick(
  state: DefiningWildlifeStaminaState,
  wantsToRun: boolean,
  deltaSeconds: number,
  staminaConfig: DefiningWildlifeSpeciesStaminaConfig = DEFINING_WILDLIFE_DEFAULT_STAMINA_CONFIG,
  exhaustedExitRatio: number = DEFINING_WILDLIFE_STAMINA_EXHAUSTED_EXIT_RATIO,
  maxStaminaRatio = 1
): AdvancingWildlifeStaminaTickResult {
  if (DEFINING_STAMINA_CORE_TICK_OPT_IN) {
    return advancingWildlifeStaminaTickViaCore(
      state,
      wantsToRun,
      deltaSeconds,
      staminaConfig,
      exhaustedExitRatio,
      maxStaminaRatio
    );
  }

  return advancingWildlifeStaminaTickLegacy(
    state,
    wantsToRun,
    deltaSeconds,
    staminaConfig,
    exhaustedExitRatio,
    maxStaminaRatio
  );
}
