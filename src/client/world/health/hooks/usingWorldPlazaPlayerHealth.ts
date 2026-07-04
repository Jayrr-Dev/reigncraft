'use client';

import { applyingWorldPlazaPlayerTeleportToWorldPoint } from '@/components/world/domains/applyingWorldPlazaPlayerTeleportToWorldPoint';
import type { DefiningWorldPlazaPlacedBlocksSceneRef } from '@/components/world/domains/definingWorldPlazaPlacedBlocksSceneRef';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { computingWorldPlazaEntityHealthEffectiveMax } from '@/components/world/health/domains/computingWorldPlazaEntityHealthEffectiveMax';
import {
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_HUD_EPSILON,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_HUD_PUSH_INTERVAL_MS,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_LAVA_INSTANT_DAMAGE,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_RESPAWN_INVINCIBILITY_MS,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthConstants';
import type {
  DefiningWorldPlazaEntityDamageKind,
  DefiningWorldPlazaEntityHealthState,
  DefiningWorldPlazaEntityHealthSyncSnapshot,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { DefiningWorldPlazaEnvironmentalHazardKind } from '@/components/world/health/domains/definingWorldPlazaEnvironmentalHazardTypes';
import {
  addingWorldPlazaEntityHealthDamageOverTime,
  addingWorldPlazaEntityHealthIncomingDamageModifier,
  addingWorldPlazaEntityHealthShield,
  addingWorldPlazaEntityHealthTemporaryMax,
  computingWorldPlazaEntityHealthFallDamage,
  creatingWorldPlazaEntityHealthInitialState,
  doublingWorldPlazaEntityHealthMax,
  halvingWorldPlazaEntityHealthMax,
  healingWorldPlazaEntityHealth,
  removingWorldPlazaEntityHealthIncomingDamageModifier,
  revivingWorldPlazaEntityHealthToFull,
  serializingWorldPlazaEntityHealthSyncSnapshot,
  settingWorldPlazaEntityHealthInvincible,
  takingWorldPlazaEntityHealthDamage,
  tickingWorldPlazaEntityHealthState,
  togglingWorldPlazaEntityHealthInvincible,
} from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { resolvingWorldPlazaEnvironmentalHazardForPlayerAtWorldPoint } from '@/components/world/health/domains/resolvingWorldPlazaEnvironmentalHazardForPlayerAtWorldPoint';
import { useCallback, useEffect, useRef, useState } from 'react';

const USING_WORLD_PLAZA_PLAYER_HEALTH_DEV_ARMOR_MODIFIER_ID =
  'dev-armor-reduction' as const;

const USING_WORLD_PLAZA_PLAYER_HEALTH_DAMAGE_FLASH_MS = 250;

export type UsingWorldPlazaPlayerHealthHudSnapshot = {
  currentHealth: number;
  effectiveMaxHealth: number;
  shieldPoints: number;
  healthRatio: number;
  isInvincible: boolean;
  isDead: boolean;
  isDamageFlashing: boolean;
  activeDotCount: number;
};

export interface UsingWorldPlazaPlayerHealthParams {
  isEnabled: boolean;
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  respawnWorldPoint: DefiningWorldPlazaWorldPoint;
  isDaytime: boolean;
  walkTargetRef: React.RefObject<DefiningWorldPlazaWorldPoint | null>;
  isWalkingRef: React.RefObject<boolean>;
  isJumpingRef: React.RefObject<boolean>;
  localAvatarMotionStateRef: React.RefObject<{
    motionKind: string;
    facingDirection: string;
    jumpStartedAtMs: number;
    jumpArcPeakScreenPx: number;
    layer: number;
  }>;
  placedBlocksRef: React.RefObject<DefiningWorldPlazaPlacedBlocksSceneRef>;
  syncingMovePositionRef?: React.RefObject<(() => void) | null>;
  healthSyncSnapshotRef: React.RefObject<DefiningWorldPlazaEntityHealthSyncSnapshot>;
}

export interface UsingWorldPlazaPlayerHealthResult {
  healthStateRef: React.RefObject<DefiningWorldPlazaEntityHealthState>;
  healthSyncSnapshotRef: React.RefObject<DefiningWorldPlazaEntityHealthSyncSnapshot>;
  hudSnapshot: UsingWorldPlazaPlayerHealthHudSnapshot;
  takeDamageRef: React.RefObject<
    (amount: number, kind?: DefiningWorldPlazaEntityDamageKind) => void
  >;
  healRef: React.RefObject<(amount: number) => void>;
  applyFallDamageRef: React.RefObject<(layerDelta: number) => void>;
  killRef: React.RefObject<() => void>;
  reviveRef: React.RefObject<() => void>;
  toggleInvincibleRef: React.RefObject<() => void>;
  doubleMaxHealthRef: React.RefObject<() => void>;
  halveMaxHealthRef: React.RefObject<() => void>;
  addTemporaryMaxHealthRef: React.RefObject<
    (amount: number, durationMs: number) => void
  >;
  addShieldRef: React.RefObject<(amount: number) => void>;
  addPoisonDotRef: React.RefObject<() => void>;
  addHalfDamageBuffRef: React.RefObject<() => void>;
  toggleArmorRef: React.RefObject<() => void>;
}

function mappingEnvironmentalHazardKindToDamageKind(
  kind: DefiningWorldPlazaEnvironmentalHazardKind
): DefiningWorldPlazaEntityDamageKind {
  if (kind === 'lava') {
    return 'environmental_lava';
  }

  if (kind === 'heat') {
    return 'environmental_heat';
  }

  return 'environmental_cold';
}

function buildingHudSnapshot(
  state: DefiningWorldPlazaEntityHealthState,
  nowMs: number,
  isDamageFlashing: boolean
): UsingWorldPlazaPlayerHealthHudSnapshot {
  const effectiveMaxHealth = computingWorldPlazaEntityHealthEffectiveMax(
    state,
    nowMs
  );

  return {
    currentHealth: state.currentHealth,
    effectiveMaxHealth,
    shieldPoints: state.shieldPoints,
    healthRatio:
      effectiveMaxHealth > 0 ? state.currentHealth / effectiveMaxHealth : 0,
    isInvincible:
      state.invincibleUntilMs !== null && nowMs < state.invincibleUntilMs,
    isDead: state.isDead,
    isDamageFlashing,
    activeDotCount: state.damageOverTimeEffects.length,
  };
}

/**
 * Owns local player health: ticks regen/DoT, applies environmental hazards,
 * handles death respawn, and exposes dev-panel actions.
 */
export function usingWorldPlazaPlayerHealth({
  isEnabled,
  playerPositionRef,
  respawnWorldPoint,
  isDaytime,
  walkTargetRef,
  isWalkingRef,
  isJumpingRef,
  localAvatarMotionStateRef,
  placedBlocksRef,
  syncingMovePositionRef,
  healthSyncSnapshotRef,
}: UsingWorldPlazaPlayerHealthParams): UsingWorldPlazaPlayerHealthResult {
  const healthStateRef = useRef<DefiningWorldPlazaEntityHealthState>(
    creatingWorldPlazaEntityHealthInitialState()
  );
  const lastTickMsRef = useRef<number | null>(null);
  const lastHudPushMsRef = useRef(0);
  const damageFlashUntilMsRef = useRef(0);
  const lastEnvironmentalHazardKindRef =
    useRef<DefiningWorldPlazaEnvironmentalHazardKind | null>(null);
  const isDaytimeRef = useRef(isDaytime);
  const isRespawningRef = useRef(false);

  isDaytimeRef.current = isDaytime;

  const [hudSnapshot, setHudSnapshot] =
    useState<UsingWorldPlazaPlayerHealthHudSnapshot>(() =>
      buildingHudSnapshot(healthStateRef.current, performance.now(), false)
    );

  const pushingHudSnapshot = useCallback((nowMs: number): void => {
    const isDamageFlashing = nowMs < damageFlashUntilMsRef.current;
    const nextSnapshot = buildingHudSnapshot(
      healthStateRef.current,
      nowMs,
      isDamageFlashing
    );

    healthSyncSnapshotRef.current =
      serializingWorldPlazaEntityHealthSyncSnapshot(
        healthStateRef.current,
        nowMs
      );

    setHudSnapshot((previous) => {
      const isUnchanged =
        Math.abs(previous.currentHealth - nextSnapshot.currentHealth) <
          DEFINING_WORLD_PLAZA_ENTITY_HEALTH_HUD_EPSILON &&
        Math.abs(
          previous.effectiveMaxHealth - nextSnapshot.effectiveMaxHealth
        ) < DEFINING_WORLD_PLAZA_ENTITY_HEALTH_HUD_EPSILON &&
        Math.abs(previous.shieldPoints - nextSnapshot.shieldPoints) < 0.5 &&
        previous.isInvincible === nextSnapshot.isInvincible &&
        previous.isDead === nextSnapshot.isDead &&
        previous.isDamageFlashing === nextSnapshot.isDamageFlashing &&
        previous.activeDotCount === nextSnapshot.activeDotCount;

      return isUnchanged ? previous : nextSnapshot;
    });
  }, []);

  const mutatingHealthState = useCallback(
    (
      mutator: (
        state: DefiningWorldPlazaEntityHealthState,
        nowMs: number
      ) => DefiningWorldPlazaEntityHealthState,
      options?: { flashDamage?: boolean }
    ): void => {
      const nowMs = performance.now();
      const previousHealth = healthStateRef.current.currentHealth;
      healthStateRef.current = mutator(healthStateRef.current, nowMs);

      if (
        options?.flashDamage &&
        healthStateRef.current.currentHealth < previousHealth
      ) {
        damageFlashUntilMsRef.current =
          nowMs + USING_WORLD_PLAZA_PLAYER_HEALTH_DAMAGE_FLASH_MS;
      }

      pushingHudSnapshot(nowMs);
    },
    [pushingHudSnapshot]
  );

  const respawningPlayer = useCallback((): void => {
    if (isRespawningRef.current) {
      return;
    }

    isRespawningRef.current = true;
    const nowMs = performance.now();

    applyingWorldPlazaPlayerTeleportToWorldPoint({
      destinationWorldPoint: respawnWorldPoint,
      placedBlocks: placedBlocksRef.current?.blocks ?? [],
      playerPositionRef,
      walkTargetRef,
      isWalkingRef,
      isJumpingRef,
      localAvatarMotionStateRef,
      syncingMovePositionRef: syncingMovePositionRef ?? { current: null },
    });

    healthStateRef.current = settingWorldPlazaEntityHealthInvincible(
      revivingWorldPlazaEntityHealthToFull(healthStateRef.current, nowMs),
      DEFINING_WORLD_PLAZA_ENTITY_HEALTH_RESPAWN_INVINCIBILITY_MS,
      nowMs
    );
    lastEnvironmentalHazardKindRef.current = null;
    syncingMovePositionRef?.current?.();
    pushingHudSnapshot(nowMs);
    isRespawningRef.current = false;
  }, [
    isJumpingRef,
    isWalkingRef,
    localAvatarMotionStateRef,
    placedBlocksRef,
    playerPositionRef,
    pushingHudSnapshot,
    respawnWorldPoint,
    syncingMovePositionRef,
    walkTargetRef,
  ]);

  const takeDamageRef = useRef<
    (amount: number, kind?: DefiningWorldPlazaEntityDamageKind) => void
  >(() => undefined);
  const healRef = useRef<(amount: number) => void>(() => undefined);
  const applyFallDamageRef = useRef<(layerDelta: number) => void>(
    () => undefined
  );
  const killRef = useRef<() => void>(() => undefined);
  const reviveRef = useRef<() => void>(() => undefined);
  const toggleInvincibleRef = useRef<() => void>(() => undefined);
  const doubleMaxHealthRef = useRef<() => void>(() => undefined);
  const halveMaxHealthRef = useRef<() => void>(() => undefined);
  const addTemporaryMaxHealthRef = useRef<
    (amount: number, durationMs: number) => void
  >(() => undefined);
  const addShieldRef = useRef<(amount: number) => void>(() => undefined);
  const addPoisonDotRef = useRef<() => void>(() => undefined);
  const addHalfDamageBuffRef = useRef<() => void>(() => undefined);
  const toggleArmorRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    if (!isEnabled) {
      healthStateRef.current = creatingWorldPlazaEntityHealthInitialState();
      lastTickMsRef.current = null;
      lastEnvironmentalHazardKindRef.current = null;
      pushingHudSnapshot(performance.now());
      return;
    }

    takeDamageRef.current = (amount, kind = 'physical') => {
      mutatingHealthState(
        (state, nowMs) =>
          takingWorldPlazaEntityHealthDamage(state, amount, kind, nowMs),
        { flashDamage: true }
      );
    };

    healRef.current = (amount) => {
      mutatingHealthState((state, nowMs) =>
        healingWorldPlazaEntityHealth(state, amount, nowMs)
      );
    };

    applyFallDamageRef.current = (layerDelta) => {
      const damage = computingWorldPlazaEntityHealthFallDamage(layerDelta);

      if (damage <= 0) {
        return;
      }

      mutatingHealthState(
        (state, nowMs) =>
          takingWorldPlazaEntityHealthDamage(state, damage, 'fall', nowMs),
        { flashDamage: true }
      );
    };

    killRef.current = () => {
      mutatingHealthState((state, nowMs) =>
        takingWorldPlazaEntityHealthDamage(
          state,
          state.currentHealth + state.shieldPoints,
          'physical',
          nowMs
        )
      );
    };

    reviveRef.current = () => {
      mutatingHealthState((state, nowMs) =>
        revivingWorldPlazaEntityHealthToFull(state, nowMs)
      );
    };

    toggleInvincibleRef.current = () => {
      mutatingHealthState((state, nowMs) =>
        togglingWorldPlazaEntityHealthInvincible(state, nowMs)
      );
    };

    doubleMaxHealthRef.current = () => {
      mutatingHealthState((state, nowMs) =>
        doublingWorldPlazaEntityHealthMax(state, nowMs)
      );
    };

    halveMaxHealthRef.current = () => {
      mutatingHealthState((state, nowMs) =>
        halvingWorldPlazaEntityHealthMax(state, nowMs)
      );
    };

    addTemporaryMaxHealthRef.current = (amount, durationMs) => {
      mutatingHealthState((state, nowMs) =>
        addingWorldPlazaEntityHealthTemporaryMax(
          state,
          amount,
          durationMs,
          nowMs
        )
      );
    };

    addShieldRef.current = (amount) => {
      mutatingHealthState((state) =>
        addingWorldPlazaEntityHealthShield(state, amount)
      );
    };

    addPoisonDotRef.current = () => {
      mutatingHealthState((state, nowMs) =>
        addingWorldPlazaEntityHealthDamageOverTime(
          state,
          'poison',
          5,
          10_000,
          nowMs
        )
      );
    };

    addHalfDamageBuffRef.current = () => {
      mutatingHealthState((state) =>
        addingWorldPlazaEntityHealthIncomingDamageModifier(state, {
          id: 'dev-half-damage',
          multiplier: 0.5,
          expiresAtMs: performance.now() + 30_000,
        })
      );
    };

    toggleArmorRef.current = () => {
      const hasArmor = healthStateRef.current.incomingDamageModifiers.some(
        (modifier) =>
          modifier.id === USING_WORLD_PLAZA_PLAYER_HEALTH_DEV_ARMOR_MODIFIER_ID
      );

      mutatingHealthState((state) =>
        hasArmor
          ? removingWorldPlazaEntityHealthIncomingDamageModifier(
              state,
              USING_WORLD_PLAZA_PLAYER_HEALTH_DEV_ARMOR_MODIFIER_ID
            )
          : addingWorldPlazaEntityHealthIncomingDamageModifier(state, {
              id: USING_WORLD_PLAZA_PLAYER_HEALTH_DEV_ARMOR_MODIFIER_ID,
              multiplier: 0.75,
              expiresAtMs: null,
            })
      );
    };

    const advancingHealthFrame = (frameTimeMs: number): void => {
      const previousMs = lastTickMsRef.current ?? frameTimeMs;
      const deltaMs = Math.max(0, frameTimeMs - previousMs);
      lastTickMsRef.current = frameTimeMs;

      const playerPosition = playerPositionRef.current;

      if (playerPosition) {
        const hazard =
          resolvingWorldPlazaEnvironmentalHazardForPlayerAtWorldPoint({
            center: playerPosition,
            isDaytime: isDaytimeRef.current,
          });

        if (hazard) {
          const damageKind = mappingEnvironmentalHazardKindToDamageKind(
            hazard.kind
          );
          const previousHazardKind = lastEnvironmentalHazardKindRef.current;

          healthStateRef.current = addingWorldPlazaEntityHealthDamageOverTime(
            healthStateRef.current,
            damageKind,
            hazard.damagePerSecond,
            1_500,
            frameTimeMs
          );

          if (hazard.kind === 'lava' && previousHazardKind !== 'lava') {
            healthStateRef.current = takingWorldPlazaEntityHealthDamage(
              healthStateRef.current,
              DEFINING_WORLD_PLAZA_ENTITY_HEALTH_LAVA_INSTANT_DAMAGE,
              'environmental_lava',
              frameTimeMs
            );
            damageFlashUntilMsRef.current =
              frameTimeMs + USING_WORLD_PLAZA_PLAYER_HEALTH_DAMAGE_FLASH_MS;
          }

          lastEnvironmentalHazardKindRef.current = hazard.kind;
        } else {
          lastEnvironmentalHazardKindRef.current = null;
        }
      }

      const previousHealth = healthStateRef.current.currentHealth;
      healthStateRef.current = tickingWorldPlazaEntityHealthState(
        healthStateRef.current,
        frameTimeMs,
        deltaMs
      );

      if (healthStateRef.current.currentHealth < previousHealth) {
        damageFlashUntilMsRef.current =
          frameTimeMs + USING_WORLD_PLAZA_PLAYER_HEALTH_DAMAGE_FLASH_MS;
      }

      if (healthStateRef.current.isDead) {
        respawningPlayer();
      }

      if (
        frameTimeMs - lastHudPushMsRef.current >=
        DEFINING_WORLD_PLAZA_ENTITY_HEALTH_HUD_PUSH_INTERVAL_MS
      ) {
        lastHudPushMsRef.current = frameTimeMs;
        pushingHudSnapshot(frameTimeMs);
      }
    };

    const unsubscribeDomOverlayFrame = subscribingWorldPlazaDomOverlayFrame(
      (_deltaMs, frameTimeMs) => {
        advancingHealthFrame(frameTimeMs);
      }
    );

    return () => {
      unsubscribeDomOverlayFrame();
    };
  }, [
    isEnabled,
    mutatingHealthState,
    playerPositionRef,
    pushingHudSnapshot,
    respawningPlayer,
  ]);

  return {
    healthStateRef,
    healthSyncSnapshotRef,
    hudSnapshot,
    takeDamageRef,
    healRef,
    applyFallDamageRef,
    killRef,
    reviveRef,
    toggleInvincibleRef,
    doubleMaxHealthRef,
    halveMaxHealthRef,
    addTemporaryMaxHealthRef,
    addShieldRef,
    addPoisonDotRef,
    addHalfDamageBuffRef,
    toggleArmorRef,
  };
}
