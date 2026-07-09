/**
 * Pure stamina advancement for the hold-to-run mechanic.
 *
 * Default path keeps the legacy inline loop. Set
 * {@link DEFINING_STAMINA_CORE_TICK_OPT_IN} to route the drain/regen/latch
 * through {@link advancingStaminaCoreTick}; fatigue tiers, depletion delay,
 * and action regen pause stay in this wrapper.
 *
 * @module components/world/domains/updatingWorldPlazaRunStamina
 */

import { applyingWorldPlazaPlayerStaminaOnFullDepletion } from '@/components/world/domains/applyingWorldPlazaPlayerStaminaOnFullDepletion';
import { checkingWorldPlazaPlayerStaminaFatigueCanUseStaminaAgain } from '@/components/world/domains/checkingWorldPlazaPlayerStaminaFatigueCanUseStaminaAgain';
import { checkingWorldPlazaRunStaminaRegenIsPaused } from '@/components/world/domains/checkingWorldPlazaRunStaminaRegenIsPaused';
import {
  DEFINING_WORLD_PLAZA_RUN_STAMINA_DEPLETION_REGEN_DELAY_MS,
  DEFINING_WORLD_PLAZA_RUN_STAMINA_DRAIN_PER_SECOND,
  DEFINING_WORLD_PLAZA_RUN_STAMINA_REGEN_PER_SECOND,
  type DefiningWorldPlazaRunStaminaState,
} from '@/components/world/domains/definingWorldPlazaRunStaminaConstants';
import { resettingWorldPlazaPlayerStaminaFatigueOnFullBar } from '@/components/world/domains/resettingWorldPlazaPlayerStaminaFatigueOnFullBar';
import { resolvingWorldPlazaPlayerStaminaFatigueRegenMultiplier } from '@/components/world/domains/resolvingWorldPlazaPlayerStaminaFatigueRegenMultiplier';
import { resolvingWorldPlazaPlayerStaminaFatigueUseUnlockRatio } from '@/components/world/domains/resolvingWorldPlazaPlayerStaminaFatigueRecoveryThreshold';
import { advancingStaminaCoreTick } from '@/components/world/stamina/domains/advancingStaminaCoreTick';
import { DEFINING_STAMINA_CORE_TICK_OPT_IN } from '@/components/world/stamina/domains/definingStaminaCoreOptInConstants';

export interface UpdatingWorldPlazaRunStaminaParams {
  /** Stamina state from the previous frame. */
  state: DefiningWorldPlazaRunStaminaState;
  /** Elapsed time since the previous frame (seconds). */
  deltaSeconds: number;
  /** Wall-clock ms for depletion delay and timestamps. */
  nowMs: number;
  /** True when the player is holding to run and actually moving. */
  isAttemptingRun: boolean;
  /**
   * Multiplier on run stamina drain this frame (1 = normal dry-land running).
   *
   * Ice running uses a higher value from ice slide stamina constants.
   */
  staminaDrainMultiplier?: number;
  /** Multiplier on stamina regeneration while resting (1 = normal). */
  staminaRegenMultiplier?: number;
}

export interface UpdatingWorldPlazaRunStaminaResult {
  /** Next stamina state. */
  state: DefiningWorldPlazaRunStaminaState;
  /** True when the avatar is running this frame (drained stamina). */
  isRunning: boolean;
}

function clampingRunStaminaRatio(ratio: number): number {
  if (ratio < 0) {
    return 0;
  }

  if (ratio > 1) {
    return 1;
  }

  return ratio;
}

function checkingWorldPlazaRunStaminaIsInDepletionHold(
  state: DefiningWorldPlazaRunStaminaState,
  nowMs: number
): boolean {
  return (
    state.isDepleted &&
    state.depletedAtMs !== null &&
    nowMs - state.depletedAtMs <
      DEFINING_WORLD_PLAZA_RUN_STAMINA_DEPLETION_REGEN_DELAY_MS
  );
}

function updatingWorldPlazaRunStaminaLegacy({
  state,
  deltaSeconds,
  nowMs,
  isAttemptingRun,
  staminaDrainMultiplier = 1,
  staminaRegenMultiplier = 1,
}: UpdatingWorldPlazaRunStaminaParams): UpdatingWorldPlazaRunStaminaResult {
  const canRun = isAttemptingRun && !state.isDepleted && state.staminaRatio > 0;

  if (canRun) {
    const nextRatio = clampingRunStaminaRatio(
      state.staminaRatio -
        DEFINING_WORLD_PLAZA_RUN_STAMINA_DRAIN_PER_SECOND *
          staminaDrainMultiplier *
          deltaSeconds
    );
    const hitZero = nextRatio <= 0;

    if (hitZero) {
      return {
        state: applyingWorldPlazaPlayerStaminaOnFullDepletion({
          state,
          nextStaminaRatio: nextRatio,
          nowMs,
        }),
        isRunning: true,
      };
    }

    return {
      state: {
        ...state,
        staminaRatio: nextRatio,
      },
      isRunning: true,
    };
  }

  if (checkingWorldPlazaRunStaminaIsInDepletionHold(state, nowMs)) {
    return {
      state: {
        staminaRatio: 0,
        fatigueTier: state.fatigueTier,
        isDepleted: true,
        depletedAtMs: state.depletedAtMs,
        regenPausedUntilMs: state.regenPausedUntilMs,
      },
      isRunning: false,
    };
  }

  if (checkingWorldPlazaRunStaminaRegenIsPaused(state, nowMs)) {
    return {
      state,
      isRunning: false,
    };
  }

  const fatigueRegenMultiplier =
    resolvingWorldPlazaPlayerStaminaFatigueRegenMultiplier(state.fatigueTier);
  const nextRatio = clampingRunStaminaRatio(
    state.staminaRatio +
      DEFINING_WORLD_PLAZA_RUN_STAMINA_REGEN_PER_SECOND *
        staminaRegenMultiplier *
        fatigueRegenMultiplier *
        deltaSeconds
  );

  const canUseStaminaAgain = checkingWorldPlazaPlayerStaminaFatigueCanUseStaminaAgain(
    state,
    nextRatio
  );
  const clearedRegenPause =
    state.regenPausedUntilMs !== null && nowMs >= state.regenPausedUntilMs
      ? null
      : state.regenPausedUntilMs;

  const recoveredState: DefiningWorldPlazaRunStaminaState = {
    staminaRatio: nextRatio,
    fatigueTier: state.fatigueTier,
    isDepleted: canUseStaminaAgain ? false : state.isDepleted,
    depletedAtMs: canUseStaminaAgain ? null : state.depletedAtMs,
    regenPausedUntilMs: canUseStaminaAgain ? null : clearedRegenPause,
  };

  return {
    state: resettingWorldPlazaPlayerStaminaFatigueOnFullBar(recoveredState),
    isRunning: false,
  };
}

function updatingWorldPlazaRunStaminaViaCore({
  state,
  deltaSeconds,
  nowMs,
  isAttemptingRun,
  staminaDrainMultiplier = 1,
  staminaRegenMultiplier = 1,
}: UpdatingWorldPlazaRunStaminaParams): UpdatingWorldPlazaRunStaminaResult {
  if (checkingWorldPlazaRunStaminaIsInDepletionHold(state, nowMs)) {
    return {
      state: {
        staminaRatio: 0,
        fatigueTier: state.fatigueTier,
        isDepleted: true,
        depletedAtMs: state.depletedAtMs,
        regenPausedUntilMs: state.regenPausedUntilMs,
      },
      isRunning: false,
    };
  }

  if (checkingWorldPlazaRunStaminaRegenIsPaused(state, nowMs)) {
    return {
      state,
      isRunning: false,
    };
  }

  const fatigueRegenMultiplier =
    resolvingWorldPlazaPlayerStaminaFatigueRegenMultiplier(state.fatigueTier);
  const wasDepleted = state.isDepleted;
  const coreResult = advancingStaminaCoreTick({
    state: {
      staminaRatio: state.staminaRatio,
      isRunLocked: state.isDepleted,
    },
    wantsToRun: isAttemptingRun,
    deltaSeconds,
    config: {
      drainPerSecond:
        DEFINING_WORLD_PLAZA_RUN_STAMINA_DRAIN_PER_SECOND *
        staminaDrainMultiplier,
      regenPerSecond:
        DEFINING_WORLD_PLAZA_RUN_STAMINA_REGEN_PER_SECOND *
        staminaRegenMultiplier *
        fatigueRegenMultiplier,
      runLockedExitRatio:
        resolvingWorldPlazaPlayerStaminaFatigueUseUnlockRatio(state.fatigueTier),
      maxStaminaRatio: 1,
    },
  });

  if (coreResult.isRunning && coreResult.state.isRunLocked && !wasDepleted) {
    return {
      state: applyingWorldPlazaPlayerStaminaOnFullDepletion({
        state,
        nextStaminaRatio: coreResult.state.staminaRatio,
        nowMs,
      }),
      isRunning: true,
    };
  }

  if (coreResult.isRunning) {
    return {
      state: {
        ...state,
        staminaRatio: coreResult.state.staminaRatio,
      },
      isRunning: true,
    };
  }

  const unlocked = wasDepleted && !coreResult.state.isRunLocked;
  const clearedRegenPause =
    state.regenPausedUntilMs !== null && nowMs >= state.regenPausedUntilMs
      ? null
      : state.regenPausedUntilMs;

  const recoveredState: DefiningWorldPlazaRunStaminaState = {
    staminaRatio: coreResult.state.staminaRatio,
    fatigueTier: state.fatigueTier,
    isDepleted: coreResult.state.isRunLocked,
    depletedAtMs: unlocked ? null : state.depletedAtMs,
    regenPausedUntilMs: unlocked ? null : clearedRegenPause,
  };

  return {
    state: resettingWorldPlazaPlayerStaminaFatigueOnFullBar(recoveredState),
    isRunning: false,
  };
}

/**
 * Advances stamina by one frame: drains while running, regenerates otherwise,
 * and latches a depletion lockout once stamina reaches zero.
 *
 * @param params - Previous state, frame delta, and run intent.
 */
export function updatingWorldPlazaRunStamina(
  params: UpdatingWorldPlazaRunStaminaParams
): UpdatingWorldPlazaRunStaminaResult {
  if (DEFINING_STAMINA_CORE_TICK_OPT_IN) {
    return updatingWorldPlazaRunStaminaViaCore(params);
  }

  return updatingWorldPlazaRunStaminaLegacy(params);
}
