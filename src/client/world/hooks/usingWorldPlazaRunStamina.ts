"use client";

import { consumingWorldPlazaJumpStamina } from "@/components/world/domains/consumingWorldPlazaJumpStamina";
import {
  DEFINING_WORLD_PLAZA_RUN_STAMINA_HOLD_TO_RUN_MS,
  DEFINING_WORLD_PLAZA_RUN_STAMINA_HUD_PUSH_INTERVAL_MS,
  DEFINING_WORLD_PLAZA_RUN_STAMINA_INITIAL_STATE,
  DEFINING_WORLD_PLAZA_RUN_STAMINA_MAX_FRAME_DELTA_SECONDS,
  type DefiningWorldPlazaRunStaminaState,
} from "@/components/world/domains/definingWorldPlazaRunStaminaConstants";
import { DEFINING_WORLD_PLAZA_ICE_SLIDE_STAMINA_DRAIN_MULTIPLIER } from "@/components/world/domains/definingWorldPlazaIceSlideConstants";
import { updatingWorldPlazaRunStamina } from "@/components/world/domains/updatingWorldPlazaRunStamina";
import { useEffect, useRef, useState } from "react";

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
}

export interface UsingWorldPlazaRunStaminaResult {
  /** Authoritative running flag read by the avatar each Pixi frame. */
  isRunningRef: React.RefObject<boolean>;
  /** Spends jump stamina synchronously; returns false when blocked. */
  tryConsumingJumpStaminaRef: React.RefObject<(isRunJump: boolean) => boolean>;
  /** Current stamina as a 0..1 ratio for the HUD bar. */
  staminaRatio: number;
  /** True while actively running (HUD highlight). */
  isRunning: boolean;
  /** True while running is locked out after depletion. */
  isDepleted: boolean;
}

/**
 * Owns click/keyboard run stamina: advances a 0..1 stamina ratio on its own rAF loop,
 * writes the authoritative {@link UsingWorldPlazaRunStaminaResult.isRunningRef}
 * for the avatar, and exposes throttled state for the HUD bar.
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
}: UsingWorldPlazaRunStaminaParams): UsingWorldPlazaRunStaminaResult {
  const tryConsumingJumpStaminaRef = useRef<(isRunJump: boolean) => boolean>(
    () => false,
  );
  const staminaStateRef = useRef<DefiningWorldPlazaRunStaminaState>({
    ...DEFINING_WORLD_PLAZA_RUN_STAMINA_INITIAL_STATE,
  });
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
      lastFrameMsRef.current = null;
      return;
    }

    tryConsumingJumpStaminaRef.current = (isRunJump: boolean): boolean => {
      const nowMs = performance.now();
      const { state, didConsume } = consumingWorldPlazaJumpStamina({
        state: staminaStateRef.current,
        isRunJump,
        nowMs,
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

    let animationFrameId = 0;

    const advancingStaminaFrame = (nowMs: number): void => {
      const previousMs = lastFrameMsRef.current ?? nowMs;
      const deltaSeconds = Math.min(
        DEFINING_WORLD_PLAZA_RUN_STAMINA_MAX_FRAME_DELTA_SECONDS,
        Math.max(0, (nowMs - previousMs) / 1000),
      );
      lastFrameMsRef.current = nowMs;

      const pointerHeldDurationMs =
        isPointerHeldRef.current && pointerHeldSinceMsRef.current > 0
          ? nowMs - pointerHeldSinceMsRef.current
          : 0;
      const isHoldToRun =
        pointerHeldDurationMs >=
        DEFINING_WORLD_PLAZA_RUN_STAMINA_HOLD_TO_RUN_MS;

      const isAttemptingRun =
        isWalkingRef.current &&
        (Boolean(isClickRunIntentRef?.current) ||
          Boolean(isRunKeyHeldRef?.current) ||
          isHoldToRun);

      const { state, isRunning } = updatingWorldPlazaRunStamina({
        state: staminaStateRef.current,
        deltaSeconds,
        nowMs,
        isAttemptingRun,
        staminaDrainMultiplier: isRunningOnIceRef?.current
          ? DEFINING_WORLD_PLAZA_ICE_SLIDE_STAMINA_DRAIN_MULTIPLIER
          : 1,
      });
      staminaStateRef.current = state;
      isRunningRef.current = isRunning;

      if (
        nowMs - lastHudPushMsRef.current >=
        DEFINING_WORLD_PLAZA_RUN_STAMINA_HUD_PUSH_INTERVAL_MS
      ) {
        lastHudPushMsRef.current = nowMs;
        setHudState((previous) => {
          const isUnchanged =
            Math.abs(previous.staminaRatio - state.staminaRatio) <
              USING_WORLD_PLAZA_RUN_STAMINA_HUD_EPSILON &&
            previous.isRunning === isRunning &&
            previous.isDepleted === state.isDepleted;

          if (isUnchanged) {
            return previous;
          }

          return {
            staminaRatio: state.staminaRatio,
            isRunning,
            isDepleted: state.isDepleted,
          };
        });
      }

      animationFrameId = window.requestAnimationFrame(advancingStaminaFrame);
    };

    animationFrameId = window.requestAnimationFrame(advancingStaminaFrame);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      tryConsumingJumpStaminaRef.current = () => false;
    };
  }, [isClickRunIntentRef, isEnabled, isPointerHeldRef, isRunKeyHeldRef, isRunningOnIceRef, isRunningRef, isWalkingRef, pointerHeldSinceMsRef]);

  return {
    isRunningRef,
    tryConsumingJumpStaminaRef,
    staminaRatio: hudState.staminaRatio,
    isRunning: hudState.isRunning,
    isDepleted: hudState.isDepleted,
  };
}
