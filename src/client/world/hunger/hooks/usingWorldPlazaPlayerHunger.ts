'use client';

/**
 * Owns local player hunger: ticks activity-based drain on its own rAF loop,
 * rolls starvation damage into player health, and exposes throttled HUD
 * state plus refs for movement systems to read tier effects.
 *
 * Client-authoritative and local-only, mirroring the run-stamina ref pattern.
 *
 * @module components/world/hunger/hooks/usingWorldPlazaPlayerHunger
 */

import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { advancingWorldPlazaHungerTick } from '@/components/world/hunger/domains/advancingWorldPlazaHungerTick';
import {
  DEFINING_WORLD_PLAZA_HUNGER_HEALTH_REGEN_MIN_RATIO,
  DEFINING_WORLD_PLAZA_HUNGER_HUD_EPSILON,
  DEFINING_WORLD_PLAZA_HUNGER_HUD_PUSH_INTERVAL_MS,
  DEFINING_WORLD_PLAZA_HUNGER_JUMP_COST_RATIO,
  DEFINING_WORLD_PLAZA_HUNGER_MAX_FRAME_DELTA_SECONDS,
  DEFINING_WORLD_PLAZA_HUNGER_RUN_JUMP_COST_RATIO,
  resolvingWorldPlazaHungerTier,
  type DefiningWorldPlazaHungerTier,
} from '@/components/world/hunger/domains/definingWorldPlazaHungerConstants';
import { DEFINING_WORLD_PLAZA_HUNGER_INITIAL_STATE } from '@/components/world/hunger/domains/definingWorldPlazaHungerTypes';
import type { DefiningWorldPlazaHungerState } from '@/components/world/hunger/domains/definingWorldPlazaHungerTypes';
import {
  resolvingWorldPlazaHungerMovementEffects,
  type ResolvingWorldPlazaHungerMovementEffects,
} from '@/components/world/hunger/domains/resolvingWorldPlazaHungerMovementEffects';
import { useEffect, useMemo, useRef, useState } from 'react';

/** Neutral movement effects while hunger is disabled. */
const USING_WORLD_PLAZA_PLAYER_HUNGER_NEUTRAL_EFFECTS: ResolvingWorldPlazaHungerMovementEffects =
  {
    speedMultiplier: 1,
    staminaDrainMultiplier: 1,
    staminaRegenMultiplier: 1,
    jumpCostMultiplier: 1,
    isSprintDisabled: false,
    isJumpDisabled: false,
    isHealthDraining: false,
  };

export type UsingWorldPlazaPlayerHungerHudSnapshot = {
  /** Current hunger as a 0..1 ratio. */
  hungerRatio: number;
  /** Named tier for HUD styling and toasts. */
  tier: DefiningWorldPlazaHungerTier;
  /** True while starvation is actively draining health. */
  isStarving: boolean;
};

export interface UsingWorldPlazaPlayerHungerParams {
  /** When false, hunger resets full and no drain/starvation applies. */
  isEnabled: boolean;
  /** True while the avatar is moving (click or keyboard walk). */
  isWalkingRef: React.RefObject<boolean>;
  /** True while the avatar is actively running/sprinting. */
  isRunningRef: React.RefObject<boolean>;
  /** Per-character metabolism multiplier from the selected avatar definition. */
  metabolismMultiplier?: number;
  /** Applies starvation damage directly to health, bypassing shields and regen-delay reset. */
  applyStarvationDamageRef?: React.RefObject<(amount: number) => void>;
  /** Live effective max health, used to convert starvation percent-of-max into a flat amount. */
  effectiveMaxHealthRef?: React.RefObject<number>;
  /** Written every frame: true when hunger is above the regen-gating threshold. */
  isHealthRegenAllowedRef?: React.RefObject<boolean>;
}

export interface UsingWorldPlazaPlayerHungerResult {
  /** Throttled hunger snapshot for the HUD. */
  hungerHudSnapshot: UsingWorldPlazaPlayerHungerHudSnapshot;
  /** Live hunger tier movement/stamina effects, read every frame by movement systems. */
  hungerMovementMultipliersRef: React.RefObject<ResolvingWorldPlazaHungerMovementEffects>;
  /** Spends hunger for a jump; fire-and-forget. */
  consumingJumpHungerRef: React.RefObject<(isRunJump: boolean) => void>;
  /** Restores hunger by a ratio amount (e.g. from eating food). Returns false when already full. */
  eatingFoodRef: React.RefObject<(hungerRestoreRatio: number) => boolean>;
  /** Resets hunger to full (e.g. on respawn). */
  resettingHungerRef: React.RefObject<() => void>;
}

/**
 * Owns local player hunger: ticks drain/starvation, and exposes refs for
 * movement systems plus a throttled HUD snapshot.
 */
export function usingWorldPlazaPlayerHunger({
  isEnabled,
  isWalkingRef,
  isRunningRef,
  metabolismMultiplier = 1,
  applyStarvationDamageRef,
  effectiveMaxHealthRef,
  isHealthRegenAllowedRef,
}: UsingWorldPlazaPlayerHungerParams): UsingWorldPlazaPlayerHungerResult {
  const hungerStateRef = useRef<DefiningWorldPlazaHungerState>({
    ...DEFINING_WORLD_PLAZA_HUNGER_INITIAL_STATE,
  });
  const lastFrameMsRef = useRef<number | null>(null);
  const lastHudPushMsRef = useRef(0);
  const hungerMovementMultipliersRef =
    useRef<ResolvingWorldPlazaHungerMovementEffects>(
      USING_WORLD_PLAZA_PLAYER_HUNGER_NEUTRAL_EFFECTS
    );

  const [hudState, setHudState] =
    useState<UsingWorldPlazaPlayerHungerHudSnapshot>(() => ({
      hungerRatio: hungerStateRef.current.hungerRatio,
      tier: resolvingWorldPlazaHungerTier(hungerStateRef.current.hungerRatio),
      isStarving: false,
    }));

  const consumingJumpHungerRef = useRef<(isRunJump: boolean) => void>(
    () => undefined
  );
  const eatingFoodRef = useRef<(hungerRestoreRatio: number) => boolean>(
    () => false
  );
  const resettingHungerRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    if (!isEnabled) {
      hungerStateRef.current = { ...DEFINING_WORLD_PLAZA_HUNGER_INITIAL_STATE };
      hungerMovementMultipliersRef.current =
        USING_WORLD_PLAZA_PLAYER_HUNGER_NEUTRAL_EFFECTS;
      lastFrameMsRef.current = null;
      consumingJumpHungerRef.current = () => undefined;
      eatingFoodRef.current = () => false;
      resettingHungerRef.current = () => undefined;

      if (isHealthRegenAllowedRef) {
        isHealthRegenAllowedRef.current = true;
      }

      setHudState({
        hungerRatio: DEFINING_WORLD_PLAZA_HUNGER_INITIAL_STATE.hungerRatio,
        tier: 'well_fed',
        isStarving: false,
      });
      return;
    }

    const pushingHudSnapshot = (): void => {
      const hungerRatio = hungerStateRef.current.hungerRatio;
      const tier = resolvingWorldPlazaHungerTier(hungerRatio);
      const isStarving =
        hungerMovementMultipliersRef.current.isHealthDraining;

      setHudState((previous) => {
        const isUnchanged =
          Math.abs(previous.hungerRatio - hungerRatio) <
            DEFINING_WORLD_PLAZA_HUNGER_HUD_EPSILON &&
          previous.tier === tier &&
          previous.isStarving === isStarving;

        return isUnchanged ? previous : { hungerRatio, tier, isStarving };
      });
    };

    consumingJumpHungerRef.current = (isRunJump: boolean): void => {
      const cost = isRunJump
        ? DEFINING_WORLD_PLAZA_HUNGER_RUN_JUMP_COST_RATIO
        : DEFINING_WORLD_PLAZA_HUNGER_JUMP_COST_RATIO;

      hungerStateRef.current = {
        ...hungerStateRef.current,
        hungerRatio: Math.max(
          0,
          hungerStateRef.current.hungerRatio - cost * metabolismMultiplier
        ),
      };
    };

    eatingFoodRef.current = (hungerRestoreRatio: number): boolean => {
      if (hungerStateRef.current.hungerRatio >= 1) {
        return false;
      }

      hungerStateRef.current = {
        hungerRatio: Math.min(
          1,
          hungerStateRef.current.hungerRatio + hungerRestoreRatio
        ),
        lastStarvationTickAtMs: null,
      };
      pushingHudSnapshot();

      return true;
    };

    resettingHungerRef.current = (): void => {
      hungerStateRef.current = { ...DEFINING_WORLD_PLAZA_HUNGER_INITIAL_STATE };
      pushingHudSnapshot();
    };

    const advancingHungerFrame = (frameTimeMs: number): void => {
      const previousMs = lastFrameMsRef.current ?? frameTimeMs;
      const deltaSeconds = Math.min(
        DEFINING_WORLD_PLAZA_HUNGER_MAX_FRAME_DELTA_SECONDS,
        Math.max(0, (frameTimeMs - previousMs) / 1000)
      );
      lastFrameMsRef.current = frameTimeMs;

      const { state, starvationDamagePercentOfMaxHealth } =
        advancingWorldPlazaHungerTick({
          state: hungerStateRef.current,
          deltaSeconds,
          nowMs: frameTimeMs,
          isWalking: isWalkingRef.current,
          isSprinting: isRunningRef.current,
          metabolismMultiplier,
        });
      hungerStateRef.current = state;
      hungerMovementMultipliersRef.current =
        resolvingWorldPlazaHungerMovementEffects(state.hungerRatio);

      if (isHealthRegenAllowedRef) {
        isHealthRegenAllowedRef.current =
          state.hungerRatio > DEFINING_WORLD_PLAZA_HUNGER_HEALTH_REGEN_MIN_RATIO;
      }

      if (
        starvationDamagePercentOfMaxHealth > 0 &&
        applyStarvationDamageRef?.current
      ) {
        const effectiveMaxHealth = effectiveMaxHealthRef?.current ?? 0;
        const damageAmount =
          (starvationDamagePercentOfMaxHealth / 100) * effectiveMaxHealth;

        if (damageAmount > 0) {
          applyStarvationDamageRef.current(damageAmount);
        }
      }

      if (
        frameTimeMs - lastHudPushMsRef.current >=
        DEFINING_WORLD_PLAZA_HUNGER_HUD_PUSH_INTERVAL_MS
      ) {
        lastHudPushMsRef.current = frameTimeMs;
        pushingHudSnapshot();
      }
    };

    const unsubscribeDomOverlayFrame = subscribingWorldPlazaDomOverlayFrame(
      (_deltaMs, frameTimeMs) => {
        advancingHungerFrame(frameTimeMs);
      }
    );

    return () => {
      unsubscribeDomOverlayFrame();
      consumingJumpHungerRef.current = () => undefined;
      eatingFoodRef.current = () => false;
      resettingHungerRef.current = () => undefined;
    };
  }, [
    applyStarvationDamageRef,
    effectiveMaxHealthRef,
    isEnabled,
    isHealthRegenAllowedRef,
    isRunningRef,
    isWalkingRef,
    metabolismMultiplier,
  ]);

  return useMemo(
    () => ({
      hungerHudSnapshot: hudState,
      hungerMovementMultipliersRef,
      consumingJumpHungerRef,
      eatingFoodRef,
      resettingHungerRef,
    }),
    [hudState]
  );
}
