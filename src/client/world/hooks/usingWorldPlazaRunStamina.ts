'use client';

import { consumingWorldPlazaJumpStamina } from '@/components/world/domains/consumingWorldPlazaJumpStamina';
import { consumingWorldPlazaRollStamina } from '@/components/world/domains/consumingWorldPlazaRollStamina';
import { DEFINING_WORLD_PLAZA_ICE_SLIDE_STAMINA_DRAIN_MULTIPLIER } from '@/components/world/domains/definingWorldPlazaIceSlideConstants';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import {
  DEFINING_WORLD_PLAZA_RUN_STAMINA_HOLD_TO_RUN_MS,
  DEFINING_WORLD_PLAZA_RUN_STAMINA_HUD_PUSH_INTERVAL_MS,
  DEFINING_WORLD_PLAZA_RUN_STAMINA_INITIAL_STATE,
  DEFINING_WORLD_PLAZA_RUN_STAMINA_MAX_FRAME_DELTA_SECONDS,
  type DefiningWorldPlazaRunStaminaState,
} from '@/components/world/domains/definingWorldPlazaRunStaminaConstants';
import { beginningWorldPlazaPerformanceSample } from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import { updatingWorldPlazaRunStamina } from '@/components/world/domains/updatingWorldPlazaRunStamina';
import { checkingWorldPlazaEntityActionLocked } from '@/components/world/health/domains/checkingWorldPlazaEntityActionLocked';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { resolvingWorldPlazaEntityHealthMovementMultipliers } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthMovementMultipliers';
import type { ResolvingWorldPlazaHungerMovementEffects } from '@/components/world/hunger/domains/resolvingWorldPlazaHungerMovementEffects';
import { useEffect, useRef, useState } from 'react';

/** Neutral hunger movement effects used when hunger is disabled or not wired. */
const USING_WORLD_PLAZA_RUN_STAMINA_NEUTRAL_HUNGER_EFFECTS: ResolvingWorldPlazaHungerMovementEffects =
  {
    speedMultiplier: 1,
    staminaDrainMultiplier: 1,
    staminaRegenMultiplier: 1,
    jumpCostMultiplier: 1,
    isSprintDisabled: false,
    isJumpDisabled: false,
    isHealthDraining: false,
  };

/** Smallest stamina-ratio change worth a HUD re-render. */
const USING_WORLD_PLAZA_RUN_STAMINA_HUD_EPSILON = 0.01;

export interface UsingWorldPlazaRunStaminaParams {
  /** When false, stamina resets full and running is forced off. */
  isEnabled: boolean;
  /** True while the avatar is moving toward a click target or via keyboard. */
  isWalkingRef: React.RefObject<boolean>;
  /** True while a double-click run is active for the current walk target. */
  isClickRunIntentRef?: React.RefObject<boolean>;
  /** True while the pointer is held down on the plaza. */
  isPointerHeldRef: React.RefObject<boolean>;
  /** {@link performance.now} timestamp of the latest pointer press. */
  pointerHeldSinceMsRef: React.RefObject<number>;
  /** True while Shift is held for keyboard running (no hold delay). */
  isRunKeyHeldRef?: React.RefObject<boolean>;
  /** True while the avatar is actively running on frozen water (written each frame). */
  isRunningOnIceRef?: React.RefObject<boolean>;
  /** Ref written each frame; shared with click movement for mobile tap-to-jump. */
  isRunningRef: React.RefObject<boolean>;
  /** Live player health state for stamina buff multipliers. */
  healthStateRef?: React.RefObject<DefiningWorldPlazaEntityHealthState>;
  /** Live hunger movement/stamina tier effects, composed with health multipliers. */
  hungerMovementMultipliersRef?: React.RefObject<ResolvingWorldPlazaHungerMovementEffects>;
  /** Optional shared stamina state ref for other gameplay systems. */
  runStaminaStateRef?: React.RefObject<DefiningWorldPlazaRunStaminaState>;
  /**
   * Optional live multiplier on roll stamina cost (animal leap profiles).
   * Composed with health / hunger jump-cost multipliers.
   */
  rollStaminaCostMultiplierRef?: React.RefObject<number>;
}

export interface UsingWorldPlazaRunStaminaResult {
  /** Authoritative running flag read by the avatar each Pixi frame. */
  isRunningRef: React.RefObject<boolean>;
  /** Live stamina state for gameplay systems that read depletion synchronously. */
  runStaminaStateRef: React.RefObject<DefiningWorldPlazaRunStaminaState>;
  /** Spends jump stamina synchronously; returns false when blocked. */
  tryConsumingJumpStaminaRef: React.RefObject<(isRunJump: boolean) => boolean>;
  /** Spends roll dodge stamina synchronously; returns false when blocked. */
  tryConsumingRollStaminaRef: React.RefObject<() => boolean>;
  /** Current stamina as a 0..1 ratio for the HUD bar. */
  staminaRatio: number;
  /** True while actively running (HUD highlight). */
  isRunning: boolean;
  /** True while running is locked out after depletion. */
  isDepleted: boolean;
}

/**
 * Owns click/keyboard run stamina: advances a 0..1 stamina ratio on its own
 * animation-frame loop, writes the authoritative
 * {@link UsingWorldPlazaRunStaminaResult.isRunningRef} for the avatar, and
 * exposes throttled state for the HUD bar.
 *
 * @param params - Enable flag plus the walk/pointer intent refs.
 */
export function usingWorldPlazaRunStamina({
  isEnabled,
  isWalkingRef,
  isClickRunIntentRef,
  isPointerHeldRef,
  pointerHeldSinceMsRef,
  isRunKeyHeldRef,
  isRunningOnIceRef,
  isRunningRef,
  healthStateRef,
  hungerMovementMultipliersRef,
  runStaminaStateRef: externalRunStaminaStateRef,
  rollStaminaCostMultiplierRef,
}: UsingWorldPlazaRunStaminaParams): UsingWorldPlazaRunStaminaResult {
  const tryConsumingJumpStaminaRef = useRef<(isRunJump: boolean) => boolean>(
    () => false
  );
  const tryConsumingRollStaminaRef = useRef<() => boolean>(() => false);
  const internalStaminaStateRef = useRef<DefiningWorldPlazaRunStaminaState>({
    ...DEFINING_WORLD_PLAZA_RUN_STAMINA_INITIAL_STATE,
  });
  const staminaStateRef = externalRunStaminaStateRef ?? internalStaminaStateRef;
  const lastFrameMsRef = useRef<number | null>(null);
  const lastHudPushMsRef = useRef(0);

  const [hudState, setHudState] = useState({
    staminaRatio: DEFINING_WORLD_PLAZA_RUN_STAMINA_INITIAL_STATE.staminaRatio,
    isRunning: false,
    isDepleted: false,
  });

  useEffect(() => {
    if (!isEnabled) {
      staminaStateRef.current = {
        ...DEFINING_WORLD_PLAZA_RUN_STAMINA_INITIAL_STATE,
      };
      isRunningRef.current = false;
      tryConsumingJumpStaminaRef.current = () => false;
      tryConsumingRollStaminaRef.current = () => false;
      lastFrameMsRef.current = null;
      return;
    }

    tryConsumingJumpStaminaRef.current = (isRunJump: boolean): boolean => {
      const nowMs = performance.now();
      const movementMultipliers = healthStateRef?.current
        ? resolvingWorldPlazaEntityHealthMovementMultipliers(
            healthStateRef.current,
            nowMs
          )
        : {
            staminaDrainMultiplier: 1,
            staminaRegenMultiplier: 1,
            staminaJumpCostMultiplier: 1,
            jumpLayerReachMultiplier: 1,
          };
      const hungerEffects =
        hungerMovementMultipliersRef?.current ??
        USING_WORLD_PLAZA_RUN_STAMINA_NEUTRAL_HUNGER_EFFECTS;

      const isSprintLocked = healthStateRef?.current
        ? checkingWorldPlazaEntityActionLocked(
            healthStateRef.current,
            'sprint',
            nowMs
          )
        : false;
      const isJumpLocked = healthStateRef?.current
        ? checkingWorldPlazaEntityActionLocked(
            healthStateRef.current,
            'jump',
            nowMs
          )
        : false;

      const isSprintDisabled = hungerEffects.isSprintDisabled || isSprintLocked;

      if (isRunJump && isSprintDisabled) {
        return false;
      }

      if (hungerEffects.isJumpDisabled || isJumpLocked) {
        return false;
      }

      const { state, didConsume } = consumingWorldPlazaJumpStamina({
        state: staminaStateRef.current,
        isRunJump,
        nowMs,
        staminaJumpCostMultiplier:
          movementMultipliers.staminaJumpCostMultiplier *
          hungerEffects.jumpCostMultiplier,
      });

      if (!didConsume) {
        return false;
      }

      staminaStateRef.current = state;
      setHudState({
        staminaRatio: state.staminaRatio,
        isRunning: isRunningRef.current,
        isDepleted: state.isDepleted,
      });

      return true;
    };

    tryConsumingRollStaminaRef.current = (): boolean => {
      const nowMs = performance.now();

      if (
        healthStateRef?.current &&
        checkingWorldPlazaEntityActionLocked(
          healthStateRef.current,
          'roll',
          nowMs
        )
      ) {
        return false;
      }

      const movementMultipliers = healthStateRef?.current
        ? resolvingWorldPlazaEntityHealthMovementMultipliers(
            healthStateRef.current,
            nowMs
          )
        : {
            staminaDrainMultiplier: 1,
            staminaRegenMultiplier: 1,
            staminaJumpCostMultiplier: 1,
            jumpLayerReachMultiplier: 1,
          };
      const hungerEffects =
        hungerMovementMultipliersRef?.current ??
        USING_WORLD_PLAZA_RUN_STAMINA_NEUTRAL_HUNGER_EFFECTS;

      const { state, didConsume } = consumingWorldPlazaRollStamina({
        state: staminaStateRef.current,
        nowMs,
        staminaRollCostMultiplier:
          movementMultipliers.staminaJumpCostMultiplier *
          hungerEffects.jumpCostMultiplier *
          (rollStaminaCostMultiplierRef?.current ?? 1),
      });

      if (!didConsume) {
        return false;
      }

      staminaStateRef.current = state;
      setHudState({
        staminaRatio: state.staminaRatio,
        isRunning: isRunningRef.current,
        isDepleted: state.isDepleted,
      });

      return true;
    };

    const advancingStaminaFrame = (nowMs: number): void => {
      const previousMs = lastFrameMsRef.current ?? nowMs;
      const deltaSeconds = Math.min(
        DEFINING_WORLD_PLAZA_RUN_STAMINA_MAX_FRAME_DELTA_SECONDS,
        Math.max(0, (nowMs - previousMs) / 1000)
      );
      lastFrameMsRef.current = nowMs;

      const pointerHeldDurationMs =
        isPointerHeldRef.current && pointerHeldSinceMsRef.current > 0
          ? nowMs - pointerHeldSinceMsRef.current
          : 0;
      const isHoldToRun =
        pointerHeldDurationMs >=
        DEFINING_WORLD_PLAZA_RUN_STAMINA_HOLD_TO_RUN_MS;

      const hungerEffects =
        hungerMovementMultipliersRef?.current ??
        USING_WORLD_PLAZA_RUN_STAMINA_NEUTRAL_HUNGER_EFFECTS;

      const isSprintLocked = healthStateRef?.current
        ? checkingWorldPlazaEntityActionLocked(
            healthStateRef.current,
            'sprint',
            nowMs
          )
        : false;

      const isSprintDisabled = hungerEffects.isSprintDisabled || isSprintLocked;

      const isAttemptingRun =
        isWalkingRef.current &&
        !isSprintDisabled &&
        (Boolean(isClickRunIntentRef?.current) ||
          Boolean(isRunKeyHeldRef?.current) ||
          isHoldToRun);

      const movementMultipliers = healthStateRef?.current
        ? resolvingWorldPlazaEntityHealthMovementMultipliers(
            healthStateRef.current,
            nowMs
          )
        : {
            staminaDrainMultiplier: 1,
            staminaRegenMultiplier: 1,
            staminaJumpCostMultiplier: 1,
            jumpLayerReachMultiplier: 1,
          };

      const { state, isRunning } = updatingWorldPlazaRunStamina({
        state: staminaStateRef.current,
        deltaSeconds,
        nowMs,
        isAttemptingRun,
        staminaDrainMultiplier:
          (isRunningOnIceRef?.current
            ? DEFINING_WORLD_PLAZA_ICE_SLIDE_STAMINA_DRAIN_MULTIPLIER
            : 1) *
          movementMultipliers.staminaDrainMultiplier *
          hungerEffects.staminaDrainMultiplier,
        staminaRegenMultiplier:
          movementMultipliers.staminaRegenMultiplier *
          hungerEffects.staminaRegenMultiplier,
      });

      const staminaMaxMultiplier =
        'staminaMaxMultiplier' in movementMultipliers
          ? movementMultipliers.staminaMaxMultiplier
          : 1;
      const cappedRatio =
        staminaMaxMultiplier < 1
          ? Math.min(state.staminaRatio, staminaMaxMultiplier)
          : state.staminaRatio;
      const cappedState =
        cappedRatio === state.staminaRatio
          ? state
          : { ...state, staminaRatio: cappedRatio };

      staminaStateRef.current = cappedState;
      isRunningRef.current = isRunning;

      if (
        nowMs - lastHudPushMsRef.current >=
        DEFINING_WORLD_PLAZA_RUN_STAMINA_HUD_PUSH_INTERVAL_MS
      ) {
        lastHudPushMsRef.current = nowMs;
        setHudState((previous) => {
          const isUnchanged =
            Math.abs(previous.staminaRatio - cappedState.staminaRatio) <
              USING_WORLD_PLAZA_RUN_STAMINA_HUD_EPSILON &&
            previous.isRunning === isRunning &&
            previous.isDepleted === cappedState.isDepleted;

          if (isUnchanged) {
            return previous;
          }

          return {
            staminaRatio: cappedState.staminaRatio,
            isRunning,
            isDepleted: cappedState.isDepleted,
          };
        });
      }
    };

    const advancingStaminaFromAnimationFrame = (frameTimeMs: number): void => {
      const finishStaminaTickSample = beginningWorldPlazaPerformanceSample(
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.PLAYER_STAMINA_TICK
      );
      advancingStaminaFrame(frameTimeMs);
      finishStaminaTickSample();
    };

    // Own rAF: run/stamina must keep working when Features `dom-overlays` is
    // off (blank-slate bisect). Shared overlay pump skips callbacks then.
    let animationFrameId = 0;
    const tickingStaminaAnimationFrame = (frameTimeMs: number): void => {
      advancingStaminaFromAnimationFrame(frameTimeMs);
      animationFrameId = window.requestAnimationFrame(
        tickingStaminaAnimationFrame
      );
    };
    animationFrameId = window.requestAnimationFrame(
      tickingStaminaAnimationFrame
    );

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      tryConsumingJumpStaminaRef.current = () => false;
      tryConsumingRollStaminaRef.current = () => false;
    };
  }, [
    isClickRunIntentRef,
    isEnabled,
    isPointerHeldRef,
    isRunKeyHeldRef,
    isRunningOnIceRef,
    isRunningRef,
    isWalkingRef,
    healthStateRef,
    hungerMovementMultipliersRef,
    pointerHeldSinceMsRef,
  ]);

  return {
    isRunningRef,
    runStaminaStateRef: staminaStateRef,
    tryConsumingJumpStaminaRef,
    tryConsumingRollStaminaRef,
    staminaRatio: hudState.staminaRatio,
    isRunning: hudState.isRunning,
    isDepleted: hudState.isDepleted,
  };
}
