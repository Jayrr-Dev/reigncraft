/**
 * Wildlife run stamina tick (mirrors the player run stamina model).
 *
 * Running drains stamina; walking or idling regenerates it. At zero the
 * animal is exhausted and forced to walk until stamina recovers past the
 * fatigue-tier unlock. Continuous run time (`runningForSeconds`) feeds the
 * acceleration ramp in {@link computingWildlifeAcceleratedRunSpeed}.
 *
 * Fatigue ladder (all animals): 66% → 33% → full 100% heal; full bar resets.
 *
 * Default path keeps the legacy inline loop. Set
 * {@link DEFINING_STAMINA_CORE_TICK_OPT_IN} to route through
 * {@link advancingStaminaCoreTick}.
 *
 * @module components/world/wildlife/domains/advancingWildlifeStaminaTick
 */

import { advancingStaminaCoreTick } from '@/components/world/stamina/domains/advancingStaminaCoreTick';
import { DEFINING_STAMINA_CORE_TICK_OPT_IN } from '@/components/world/stamina/domains/definingStaminaCoreOptInConstants';
import { advancingWildlifeStaminaFatigueTier } from '@/components/world/wildlife/domains/advancingWildlifeStaminaFatigueTier';
import {
  DEFINING_WILDLIFE_STAMINA_FATIGUE_INITIAL_TIER,
  type DefiningWildlifeStaminaFatigueTier,
} from '@/components/world/wildlife/domains/definingWildlifeStaminaFatigueConstants';
import type { DefiningWildlifeSpeciesStaminaConfig } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeStaminaState } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeStaminaFatigueUseUnlockRatio } from '@/components/world/wildlife/domains/resolvingWildlifeStaminaFatigueUseUnlockRatio';

/** Stamina drained per second while running. */
export const DEFINING_WILDLIFE_STAMINA_DRAIN_PER_SECOND = 0.22;

/** Stamina regenerated per second while not running. */
export const DEFINING_WILDLIFE_STAMINA_REGEN_PER_SECOND = 0.15;

/**
 * @deprecated Use fatigue tiers. Kept as the first-cycle unlock (66%) for callers.
 */
export const DEFINING_WILDLIFE_STAMINA_EXHAUSTED_EXIT_RATIO = 0.66;

const DEFINING_WILDLIFE_DEFAULT_STAMINA_CONFIG: DefiningWildlifeSpeciesStaminaConfig =
  {
    drainMultiplier: 1,
    regenMultiplier: 1,
  };

export function creatingWildlifeInitialStaminaState(): DefiningWildlifeStaminaState {
  return {
    staminaRatio: 1,
    isExhausted: false,
    fatigueTier: DEFINING_WILDLIFE_STAMINA_FATIGUE_INITIAL_TIER,
    runningForSeconds: 0,
  };
}

export type AdvancingWildlifeStaminaTickResult = {
  state: DefiningWildlifeStaminaState;
  /** True when the animal is actually allowed to run this frame. */
  isRunning: boolean;
};

function resolvingNextRunningForSeconds(
  isRunning: boolean,
  previousRunningForSeconds: number,
  deltaSeconds: number
): number {
  if (!isRunning) {
    return 0;
  }

  return previousRunningForSeconds + Math.max(0, deltaSeconds);
}

function resolvingWildlifeStaminaFatigueTierOrInitial(
  fatigueTier: DefiningWildlifeStaminaFatigueTier | undefined
): DefiningWildlifeStaminaFatigueTier {
  return fatigueTier ?? DEFINING_WILDLIFE_STAMINA_FATIGUE_INITIAL_TIER;
}

function resettingWildlifeStaminaFatigueOnFullBar(
  state: DefiningWildlifeStaminaState,
  maxStaminaRatio: number
): DefiningWildlifeStaminaState {
  if (state.staminaRatio < maxStaminaRatio) {
    return state;
  }

  return {
    ...state,
    staminaRatio: maxStaminaRatio,
    fatigueTier: DEFINING_WILDLIFE_STAMINA_FATIGUE_INITIAL_TIER,
    isExhausted: false,
  };
}

function advancingWildlifeStaminaTickLegacy(
  state: DefiningWildlifeStaminaState,
  wantsToRun: boolean,
  deltaSeconds: number,
  staminaConfig: DefiningWildlifeSpeciesStaminaConfig,
  maxStaminaRatio: number
): AdvancingWildlifeStaminaTickResult {
  const fatigueTier = resolvingWildlifeStaminaFatigueTierOrInitial(
    state.fatigueTier
  );
  const isRunning = wantsToRun && !state.isExhausted && state.staminaRatio > 0;
  const drainPerSecond =
    DEFINING_WILDLIFE_STAMINA_DRAIN_PER_SECOND * staminaConfig.drainMultiplier;
  const regenPerSecond =
    DEFINING_WILDLIFE_STAMINA_REGEN_PER_SECOND * staminaConfig.regenMultiplier;

  if (isRunning) {
    const nextRatio = Math.min(
      maxStaminaRatio,
      Math.max(0, state.staminaRatio - drainPerSecond * deltaSeconds)
    );
    const hitZero = nextRatio <= 0;
    const runningForSeconds = resolvingNextRunningForSeconds(
      true,
      state.runningForSeconds,
      deltaSeconds
    );

    if (hitZero) {
      return {
        state: {
          staminaRatio: nextRatio,
          isExhausted: true,
          fatigueTier: advancingWildlifeStaminaFatigueTier(fatigueTier),
          runningForSeconds,
        },
        isRunning: true,
      };
    }

    return {
      state: {
        staminaRatio: nextRatio,
        isExhausted: false,
        fatigueTier,
        runningForSeconds,
      },
      isRunning: true,
    };
  }

  const nextRatio = Math.min(
    maxStaminaRatio,
    Math.max(0, state.staminaRatio + regenPerSecond * deltaSeconds)
  );
  const unlockRatio = resolvingWildlifeStaminaFatigueUseUnlockRatio(
    fatigueTier,
    maxStaminaRatio
  );
  const canRunAgain = state.isExhausted ? nextRatio >= unlockRatio : true;

  const recoveredState: DefiningWildlifeStaminaState = {
    staminaRatio: nextRatio,
    isExhausted: state.isExhausted && !canRunAgain,
    fatigueTier,
    runningForSeconds: 0,
  };

  return {
    state: resettingWildlifeStaminaFatigueOnFullBar(
      recoveredState,
      maxStaminaRatio
    ),
    isRunning: false,
  };
}

function advancingWildlifeStaminaTickViaCore(
  state: DefiningWildlifeStaminaState,
  wantsToRun: boolean,
  deltaSeconds: number,
  staminaConfig: DefiningWildlifeSpeciesStaminaConfig,
  maxStaminaRatio: number
): AdvancingWildlifeStaminaTickResult {
  const fatigueTier = resolvingWildlifeStaminaFatigueTierOrInitial(
    state.fatigueTier
  );
  const unlockRatio = resolvingWildlifeStaminaFatigueUseUnlockRatio(
    fatigueTier,
    maxStaminaRatio
  );

  if (wantsToRun && !state.isExhausted && state.staminaRatio > 0) {
    const drainPerSecond =
      DEFINING_WILDLIFE_STAMINA_DRAIN_PER_SECOND * staminaConfig.drainMultiplier;
    const projectedRatio = Math.min(
      maxStaminaRatio,
      Math.max(0, state.staminaRatio - drainPerSecond * deltaSeconds)
    );

    if (projectedRatio <= 0) {
      return {
        state: {
          staminaRatio: projectedRatio,
          isExhausted: true,
          fatigueTier: advancingWildlifeStaminaFatigueTier(fatigueTier),
          runningForSeconds: resolvingNextRunningForSeconds(
            true,
            state.runningForSeconds,
            deltaSeconds
          ),
        },
        isRunning: true,
      };
    }
  }

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
      runLockedExitRatio: unlockRatio,
      maxStaminaRatio,
    },
  });

  const nextState: DefiningWildlifeStaminaState = {
    staminaRatio: result.state.staminaRatio,
    isExhausted: result.state.isRunLocked,
    fatigueTier,
    runningForSeconds: resolvingNextRunningForSeconds(
      result.isRunning,
      state.runningForSeconds,
      deltaSeconds
    ),
  };

  return {
    state: resettingWildlifeStaminaFatigueOnFullBar(nextState, maxStaminaRatio),
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
  maxStaminaRatio = 1
): AdvancingWildlifeStaminaTickResult {
  if (DEFINING_STAMINA_CORE_TICK_OPT_IN) {
    return advancingWildlifeStaminaTickViaCore(
      state,
      wantsToRun,
      deltaSeconds,
      staminaConfig,
      maxStaminaRatio
    );
  }

  return advancingWildlifeStaminaTickLegacy(
    state,
    wantsToRun,
    deltaSeconds,
    staminaConfig,
    maxStaminaRatio
  );
}
