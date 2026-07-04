'use client';

import { applyingWorldPlazaPlayerTeleportToWorldPoint } from '@/components/world/domains/applyingWorldPlazaPlayerTeleportToWorldPoint';
import type { DefiningWorldPlazaPlacedBlocksSceneRef } from '@/components/world/domains/definingWorldPlazaPlacedBlocksSceneRef';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { applyingWorldPlazaEntityBuff } from '@/components/world/health/domains/applyingWorldPlazaEntityBuff';
import { checkingWorldPlazaEntityBuffIsActive } from '@/components/world/health/domains/checkingWorldPlazaEntityBuffIsActive';
import { computingWorldPlazaEntityHealthDamage } from '@/components/world/health/domains/computingWorldPlazaEntityHealthDamage';
import { listingWorldPlazaEntityBuffDescriptors } from '@/components/world/health/domains/definingWorldPlazaEntityBuffRegistry';
import { computingWorldPlazaEntityHealthEffectiveMax } from '@/components/world/health/domains/computingWorldPlazaEntityHealthEffectiveMax';
import { computingWorldPlazaEntityHealthRolledExpectedAmount } from '@/components/world/health/domains/computingWorldPlazaEntityHealthRolledExpectedAmount';
import { resolvingWorldPlazaDamageOutcomeTierForcedDeviationScore } from '@/components/world/health/domains/definingWorldPlazaDamageOutcomeTierForcedDeviationScores';
import {
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_HUD_EPSILON,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_HUD_PUSH_INTERVAL_MS,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_LAVA_INSTANT_DAMAGE,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_RESPAWN_INVINCIBILITY_MS,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthConstants';
import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_PRESETS } from '@/components/world/health/domains/definingWorldPlazaEntityHealthDamageRollPresets';
import {
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_MIN_AMOUNT,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_REGEN_FLOAT_BATCH_INTERVAL_MS,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthFloatTextConstants';
import type { DefiningWorldPlazaEntityHealthFloatText } from '@/components/world/health/domains/definingWorldPlazaEntityHealthFloatTextTypes';
import type {
  DefiningWorldPlazaDamageOutcomeTier,
  DefiningWorldPlazaEntityDamageKind,
  DefiningWorldPlazaEntityHealthDamageOptions,
  DefiningWorldPlazaEntityHealthState,
  DefiningWorldPlazaEntityHealthSyncSnapshot,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { DefiningWorldPlazaEnvironmentalHazardKind } from '@/components/world/health/domains/definingWorldPlazaEnvironmentalHazardTypes';
import { DEFINING_WORLD_PLAZA_TEMPERATURE_DISPLAY_UNIT } from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';
import type { DefiningWorldPlazaTemperatureDisplayUnit } from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';
import {
  listingWorldPlazaEntityHealthActiveAttackerDamageRollPresetIds,
  listingWorldPlazaEntityHealthActiveDefenderDamageRollPresetIds,
  togglingWorldPlazaEntityHealthDamageRollPresetInList,
} from '@/components/world/health/domains/listingWorldPlazaEntityHealthActiveDamageRollPresetIds';
import {
  enqueueingWorldPlazaEntityHealthFloatText,
  pruningWorldPlazaEntityHealthFloatTexts,
} from '@/components/world/health/domains/managingWorldPlazaEntityHealthFloatTexts';
import {
  addingWorldPlazaEntityHealthDamageOverTime,
  addingWorldPlazaEntityHealthShield,
  addingWorldPlazaEntityHealthTemporaryMax,
  computingWorldPlazaEntityHealthFallDamage,
  creatingWorldPlazaEntityHealthInitialState,
  healingWorldPlazaEntityHealth,
  revivingWorldPlazaEntityHealthToFull,
  serializingWorldPlazaEntityHealthSyncSnapshot,
  settingWorldPlazaEntityHealthInvincible,
  tickingWorldPlazaEntityHealthState,
  togglingWorldPlazaEntityHealthDamageRollPreset,
} from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { mappingWorldPlazaDamageOutcomeTierToFloatTextKind } from '@/components/world/health/domains/mappingWorldPlazaDamageOutcomeTierToFloatTextKind';
import { resolvingWorldPlazaEntityHealthDamageRollParams } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthDamageRollParams';
import { applyingWorldPlazaEntityTemperatureResistanceToDamagePerSecond } from '@/components/world/health/domains/resolvingWorldPlazaEntityTemperatureResistanceMultiplier';
import {
  resolvingWorldPlazaEnvironmentalHazardForPlayerAtWorldPoint,
  resolvingWorldPlazaEnvironmentalTemperatureForPlayerAtWorldPoint,
} from '@/components/world/health/domains/resolvingWorldPlazaEnvironmentalHazardForPlayerAtWorldPoint';

import { useCallback, useEffect, useRef, useState } from 'react';

const USING_WORLD_PLAZA_PLAYER_HEALTH_DAMAGE_FLASH_MS = 250;

export type UsingWorldPlazaPlayerHealthDamageRollHudSnapshot = {
  expectedMultiplier: number;
  standardDeviationMultiplier: number;
  luck: number;
  blockBiasTotal: number;
  dodgeBiasTotal: number;
  criticalBiasTotal: number;
  deviationBiasShift: number;
  sampleExpectedDamage: number;
  sampleStandardDeviation: number;
  isLockInActive: boolean;
  isChaoticActive: boolean;
  activeDefenderPresetIds: readonly string[];
  activeAttackerPresetIds: readonly string[];
  activePresetIds: readonly string[];
};

export type UsingWorldPlazaPlayerHealthHudSnapshot = {
  currentHealth: number;
  effectiveMaxHealth: number;
  shieldPoints: number;
  healthRatio: number;
  isInvincible: boolean;
  isDead: boolean;
  isDamageFlashing: boolean;
  activeDotCount: number;
  floatingTexts: readonly DefiningWorldPlazaEntityHealthFloatText[];
  localTemperatureCelsius: number | null;
  temperatureDisplayUnit: DefiningWorldPlazaTemperatureDisplayUnit;
  temperatureResistance: DefiningWorldPlazaEntityHealthState['temperatureResistance'];
  damageRoll: UsingWorldPlazaPlayerHealthDamageRollHudSnapshot;
  activeBuffIds: readonly string[];
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
  /** Dev heal-in-place without teleport. */
  reviveRef: React.RefObject<() => void>;
  /** Full respawn at the plaza spawn point (death screen revive). */
  respawnRef: React.RefObject<() => void>;
  toggleInvincibleRef: React.RefObject<() => void>;
  doubleMaxHealthRef: React.RefObject<() => void>;
  halveMaxHealthRef: React.RefObject<() => void>;
  addTemporaryMaxHealthRef: React.RefObject<
    (amount: number, durationMs: number) => void
  >;
  addShieldRef: React.RefObject<(amount: number) => void>;
  addPoisonDotRef: React.RefObject<() => void>;
  addHalfDamageBuffRef: React.RefObject<() => void>;
  addHeatResistanceRef: React.RefObject<() => void>;
  addColdResistanceRef: React.RefObject<() => void>;
  toggleHeatImmunityRef: React.RefObject<() => void>;
  toggleColdImmunityRef: React.RefObject<() => void>;
  toggleTemperatureDisplayUnitRef: React.RefObject<() => void>;
  rollDamageRef: React.RefObject<
    (
      expectedDamage?: number,
      forcedTier?: DefiningWorldPlazaDamageOutcomeTier
    ) => void
  >;
  toggleDamageRollPresetRef: React.RefObject<(presetId: string) => void>;
  toggleBuffRef: React.RefObject<(buffId: string) => void>;
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
  attackerDamageRollModifiers: readonly DefiningWorldPlazaEntityHealthState['damageRollModifiers'][number][],
  nowMs: number,
  isDamageFlashing: boolean,
  floatingTexts: readonly DefiningWorldPlazaEntityHealthFloatText[],
  localTemperatureCelsius: number | null,
  temperatureDisplayUnit: DefiningWorldPlazaTemperatureDisplayUnit
): UsingWorldPlazaPlayerHealthHudSnapshot {
  const effectiveMaxHealth = computingWorldPlazaEntityHealthEffectiveMax(
    state,
    nowMs
  );
  const defenderModifierIds = state.damageRollModifiers.map(
    (modifier) => modifier.id
  );
  const attackerModifierIds = attackerDamageRollModifiers.map(
    (modifier) => modifier.id
  );
  const damageRollParams = resolvingWorldPlazaEntityHealthDamageRollParams({
    baseExpectedDamage: 100,
    defenderModifiers: state.damageRollModifiers,
    attackerModifiers: attackerDamageRollModifiers,
    nowMs,
  });
  const activeDefenderPresetIds =
    listingWorldPlazaEntityHealthActiveDefenderDamageRollPresetIds(
      defenderModifierIds
    );
  const activeAttackerPresetIds =
    listingWorldPlazaEntityHealthActiveAttackerDamageRollPresetIds(
      attackerModifierIds
    );
  const activeBuffIds = listingWorldPlazaEntityBuffDescriptors()
    .filter((descriptor) =>
      checkingWorldPlazaEntityBuffIsActive({
        buffId: descriptor.id,
        state,
        nowMs,
        defenderModifierIds,
        attackerModifierIds,
      })
    )
    .map((descriptor) => descriptor.id);

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
    floatingTexts,
    localTemperatureCelsius,
    temperatureDisplayUnit,
    temperatureResistance: state.temperatureResistance,
    damageRoll: {
      expectedMultiplier: damageRollParams.expectedMultiplier,
      standardDeviationMultiplier: damageRollParams.standardDeviationMultiplier,
      luck: damageRollParams.luckTotal,
      blockBiasTotal: damageRollParams.blockBiasTotal,
      dodgeBiasTotal: damageRollParams.dodgeBiasTotal,
      criticalBiasTotal: damageRollParams.criticalBiasTotal,
      deviationBiasShift: damageRollParams.deviationBiasShift,
      sampleExpectedDamage: damageRollParams.expectedDamage,
      sampleStandardDeviation: damageRollParams.standardDeviation,
      isLockInActive: damageRollParams.isLockInActive,
      isChaoticActive: damageRollParams.isChaoticActive,
      activeDefenderPresetIds,
      activeAttackerPresetIds,
      activePresetIds: [...activeDefenderPresetIds, ...activeAttackerPresetIds],
    },
    activeBuffIds,
  };
}

/**
 * Owns local player health: ticks regen/DoT, applies environmental hazards,
 * handles death state, and exposes dev-panel actions.
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
  const floatingTextsRef = useRef<DefiningWorldPlazaEntityHealthFloatText[]>(
    []
  );
  const lastBlockedFloatAtMsRef = useRef(0);
  const localTemperatureCelsiusRef = useRef<number | null>(null);
  const temperatureDisplayUnitRef =
    useRef<DefiningWorldPlazaTemperatureDisplayUnit>(
      DEFINING_WORLD_PLAZA_TEMPERATURE_DISPLAY_UNIT
    );
  const attackerDamageRollModifiersRef = useRef<
    DefiningWorldPlazaEntityHealthState['damageRollModifiers']
  >([]);
  const accumulatedRegenFloatAmountRef = useRef(0);
  const lastRegenFloatAtMsRef = useRef(0);

  isDaytimeRef.current = isDaytime;

  const [hudSnapshot, setHudSnapshot] =
    useState<UsingWorldPlazaPlayerHealthHudSnapshot>(() =>
      buildingHudSnapshot(
        healthStateRef.current,
        attackerDamageRollModifiersRef.current,
        performance.now(),
        false,
        [],
        null,
        temperatureDisplayUnitRef.current
      )
    );

  const enqueueFloatText = useCallback(
    (
      params: Omit<
        Parameters<typeof enqueueingWorldPlazaEntityHealthFloatText>[0],
        'floats' | 'lastBlockedFloatAtMs' | 'nowMs'
      >,
      nowMs: number
    ): void => {
      const result = enqueueingWorldPlazaEntityHealthFloatText({
        floats: floatingTextsRef.current,
        ...params,
        nowMs,
        lastBlockedFloatAtMs: lastBlockedFloatAtMsRef.current,
      });
      floatingTextsRef.current = result.floats;
      lastBlockedFloatAtMsRef.current = result.lastBlockedFloatAtMs;
    },
    []
  );

  const applyingDamageWithFloatFeedback = useCallback(
    (
      state: DefiningWorldPlazaEntityHealthState,
      amount: number,
      kind: DefiningWorldPlazaEntityDamageKind,
      nowMs: number,
      options?: Pick<
        DefiningWorldPlazaEntityHealthDamageOptions,
        | 'bypassInvincibilityFrames'
        | 'grantInvincibilityFrames'
        | 'forcedDeviationScore'
        | 'forcedRollMode'
      >
    ): DefiningWorldPlazaEntityHealthState => {
      const damageResult = computingWorldPlazaEntityHealthDamage({
        state,
        rawAmount: amount,
        kind,
        nowMs,
        options: {
          ...options,
          attackerDamageRollModifiers: attackerDamageRollModifiersRef.current,
        },
      });

      if (damageResult.appliedDamage.wasBlocked) {
        enqueueFloatText(
          { kind: 'blocked', amount: 0, damageKind: kind },
          nowMs
        );
      } else {
        if (damageResult.appliedDamage.absorbedByShield > 0) {
          enqueueFloatText(
            {
              kind: 'shield_absorb',
              amount: damageResult.appliedDamage.absorbedByShield,
              damageKind: kind,
            },
            nowMs
          );
        }

        const outcomeTier = damageResult.appliedDamage.tier;
        const isLowOutcomeTier =
          outcomeTier === 'softened' ||
          outcomeTier === 'blocked' ||
          outcomeTier === 'dodged';
        const rolledDisplayAmount =
          damageResult.appliedDamage.rolledDamage ?? 0;
        const shouldShowTierFloat =
          outcomeTier !== null &&
          (damageResult.appliedDamage.healthDamage > 0 || isLowOutcomeTier);
        const floatAmount =
          damageResult.appliedDamage.healthDamage > 0
            ? damageResult.appliedDamage.healthDamage
            : rolledDisplayAmount;

        if (shouldShowTierFloat) {
          enqueueFloatText(
            {
              kind: mappingWorldPlazaDamageOutcomeTierToFloatTextKind(
                outcomeTier
              ),
              amount: floatAmount,
              damageKind: kind,
              deviationScore: damageResult.appliedDamage.deviationScore,
            },
            nowMs
          );
        } else if (damageResult.appliedDamage.healthDamage > 0) {
          enqueueFloatText(
            {
              kind: 'damage',
              amount: damageResult.appliedDamage.healthDamage,
              damageKind: kind,
              deviationScore: damageResult.appliedDamage.deviationScore,
            },
            nowMs
          );
        }
      }

      return damageResult.state;
    },
    [enqueueFloatText]
  );

  const applyingRolledBeneficialWithFloatFeedback = useCallback(
    (
      state: DefiningWorldPlazaEntityHealthState,
      baseExpectedAmount: number,
      floatKind: 'heal' | 'shield_gain',
      nowMs: number,
      applyAmount: (
        currentState: DefiningWorldPlazaEntityHealthState,
        rolledAmount: number,
        appliedAtMs: number
      ) => DefiningWorldPlazaEntityHealthState
    ): DefiningWorldPlazaEntityHealthState => {
      const rollResult = computingWorldPlazaEntityHealthRolledExpectedAmount({
        state,
        baseExpectedAmount,
        attackerModifiers: attackerDamageRollModifiersRef.current,
        nowMs,
      });
      const rolledAmount = rollResult.rolledDamage;

      if (rolledAmount > 0) {
        enqueueFloatText(
          {
            kind: floatKind,
            amount: rolledAmount,
            damageKind: floatKind === 'heal' ? 'healing' : null,
            outcomeTier: rollResult.tier,
            deviationScore: rollResult.deviationScore,
          },
          nowMs
        );
      }

      return applyAmount(state, rolledAmount, nowMs);
    },
    [enqueueFloatText]
  );

  const pushingHudSnapshot = useCallback(
    (nowMs: number): void => {
      floatingTextsRef.current = pruningWorldPlazaEntityHealthFloatTexts(
        floatingTextsRef.current,
        nowMs
      );
      const isDamageFlashing = nowMs < damageFlashUntilMsRef.current;
      const nextSnapshot = buildingHudSnapshot(
        healthStateRef.current,
        attackerDamageRollModifiersRef.current,
        nowMs,
        isDamageFlashing,
        floatingTextsRef.current,
        localTemperatureCelsiusRef.current,
        temperatureDisplayUnitRef.current
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
          previous.activeDotCount === nextSnapshot.activeDotCount &&
          previous.floatingTexts === nextSnapshot.floatingTexts &&
          previous.localTemperatureCelsius ===
            nextSnapshot.localTemperatureCelsius &&
          previous.temperatureDisplayUnit ===
            nextSnapshot.temperatureDisplayUnit &&
          previous.temperatureResistance ===
            nextSnapshot.temperatureResistance &&
          previous.damageRoll.expectedMultiplier ===
            nextSnapshot.damageRoll.expectedMultiplier &&
          previous.damageRoll.standardDeviationMultiplier ===
            nextSnapshot.damageRoll.standardDeviationMultiplier &&
          previous.damageRoll.luck === nextSnapshot.damageRoll.luck &&
          previous.damageRoll.blockBiasTotal ===
            nextSnapshot.damageRoll.blockBiasTotal &&
          previous.damageRoll.dodgeBiasTotal ===
            nextSnapshot.damageRoll.dodgeBiasTotal &&
          previous.damageRoll.criticalBiasTotal ===
            nextSnapshot.damageRoll.criticalBiasTotal &&
          previous.damageRoll.deviationBiasShift ===
            nextSnapshot.damageRoll.deviationBiasShift &&
          previous.damageRoll.sampleExpectedDamage ===
            nextSnapshot.damageRoll.sampleExpectedDamage &&
          previous.damageRoll.sampleStandardDeviation ===
            nextSnapshot.damageRoll.sampleStandardDeviation &&
          previous.damageRoll.isLockInActive ===
            nextSnapshot.damageRoll.isLockInActive &&
          previous.damageRoll.isChaoticActive ===
            nextSnapshot.damageRoll.isChaoticActive &&
          previous.damageRoll.activePresetIds.join(',') ===
            nextSnapshot.damageRoll.activePresetIds.join(',') &&
          previous.activeBuffIds.join(',') ===
            nextSnapshot.activeBuffIds.join(',');

        return isUnchanged ? previous : nextSnapshot;
      });
    },
    [healthSyncSnapshotRef]
  );

  const mutatingHealthState = useCallback(
    (
      mutator: (
        state: DefiningWorldPlazaEntityHealthState,
        nowMs: number
      ) => DefiningWorldPlazaEntityHealthState,
      options?: { flashDamage?: boolean; emitHealFloat?: boolean }
    ): void => {
      const nowMs = performance.now();
      const previousHealth = healthStateRef.current.currentHealth;
      healthStateRef.current = mutator(healthStateRef.current, nowMs);

      if (options?.emitHealFloat) {
        const healedAmount =
          healthStateRef.current.currentHealth - previousHealth;

        if (healedAmount > 0) {
          enqueueFloatText(
            { kind: 'heal', amount: healedAmount, damageKind: 'healing' },
            nowMs
          );
        }
      }

      if (
        options?.flashDamage &&
        healthStateRef.current.currentHealth < previousHealth
      ) {
        damageFlashUntilMsRef.current =
          nowMs + USING_WORLD_PLAZA_PLAYER_HEALTH_DAMAGE_FLASH_MS;
      }

      pushingHudSnapshot(nowMs);
    },
    [enqueueFloatText, pushingHudSnapshot]
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
    enqueueFloatText(
      {
        kind: 'heal',
        amount: healthStateRef.current.currentHealth,
        damageKind: 'healing',
      },
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
    enqueueFloatText,
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
  const respawnRef = useRef<() => void>(() => undefined);
  const toggleInvincibleRef = useRef<() => void>(() => undefined);
  const doubleMaxHealthRef = useRef<() => void>(() => undefined);
  const halveMaxHealthRef = useRef<() => void>(() => undefined);
  const addTemporaryMaxHealthRef = useRef<
    (amount: number, durationMs: number) => void
  >(() => undefined);
  const addShieldRef = useRef<(amount: number) => void>(() => undefined);
  const addPoisonDotRef = useRef<() => void>(() => undefined);
  const addHalfDamageBuffRef = useRef<() => void>(() => undefined);
  const addHeatResistanceRef = useRef<() => void>(() => undefined);
  const addColdResistanceRef = useRef<() => void>(() => undefined);
  const toggleHeatImmunityRef = useRef<() => void>(() => undefined);
  const toggleColdImmunityRef = useRef<() => void>(() => undefined);
  const toggleTemperatureDisplayUnitRef = useRef<() => void>(() => undefined);
  const rollDamageRef = useRef<
    (
      expectedDamage?: number,
      forcedTier?: DefiningWorldPlazaDamageOutcomeTier
    ) => void
  >(() => undefined);
  const toggleDamageRollPresetRef = useRef<(presetId: string) => void>(
    () => undefined
  );
  const toggleBuffRef = useRef<(buffId: string) => void>(() => undefined);

  useEffect(() => {
    if (!isEnabled) {
      healthStateRef.current = creatingWorldPlazaEntityHealthInitialState();
      attackerDamageRollModifiersRef.current = [];
      floatingTextsRef.current = [];
      lastBlockedFloatAtMsRef.current = 0;
      accumulatedRegenFloatAmountRef.current = 0;
      lastRegenFloatAtMsRef.current = 0;
      lastTickMsRef.current = null;
      lastEnvironmentalHazardKindRef.current = null;
      localTemperatureCelsiusRef.current = null;
      pushingHudSnapshot(performance.now());
      return;
    }

    takeDamageRef.current = (amount, kind = 'physical') => {
      mutatingHealthState(
        (state, nowMs) =>
          applyingDamageWithFloatFeedback(state, amount, kind, nowMs),
        { flashDamage: true }
      );
    };

    healRef.current = (amount) => {
      mutatingHealthState((state, nowMs) =>
        applyingRolledBeneficialWithFloatFeedback(
          state,
          amount,
          'heal',
          nowMs,
          (currentState, rolledAmount, appliedAtMs) =>
            healingWorldPlazaEntityHealth(
              currentState,
              rolledAmount,
              appliedAtMs
            )
        )
      );
    };

    applyFallDamageRef.current = (layerDelta) => {
      const damage = computingWorldPlazaEntityHealthFallDamage(layerDelta);

      if (damage <= 0) {
        return;
      }

      mutatingHealthState(
        (state, nowMs) =>
          applyingDamageWithFloatFeedback(state, damage, 'fall', nowMs),
        { flashDamage: true }
      );
    };

    killRef.current = () => {
      mutatingHealthState((state, nowMs) =>
        applyingDamageWithFloatFeedback(
          state,
          state.currentHealth + state.shieldPoints,
          'physical',
          nowMs
        )
      );
    };

    reviveRef.current = () => {
      mutatingHealthState(
        (state, nowMs) => revivingWorldPlazaEntityHealthToFull(state, nowMs),
        { emitHealFloat: true }
      );
    };

    respawnRef.current = () => {
      respawningPlayer();
    };

    toggleInvincibleRef.current = () => {
      toggleBuffRef.current('invincibility-buff');
    };

    doubleMaxHealthRef.current = () => {
      mutatingHealthState((state, nowMs) => {
        enqueueFloatText(
          { kind: 'health_scale', amount: 2, damageKind: null },
          nowMs
        );
        return applyingWorldPlazaEntityBuff(
          state,
          'double-max-health-buff',
          nowMs
        );
      });
    };

    halveMaxHealthRef.current = () => {
      mutatingHealthState((state, nowMs) =>
        applyingWorldPlazaEntityBuff(state, 'halve-max-health-buff', nowMs)
      );
    };

    addTemporaryMaxHealthRef.current = (amount, durationMs) => {
      mutatingHealthState((state, nowMs) => {
        const rollResult = computingWorldPlazaEntityHealthRolledExpectedAmount({
          state,
          baseExpectedAmount: amount,
          attackerModifiers: attackerDamageRollModifiersRef.current,
          nowMs,
        });

        return addingWorldPlazaEntityHealthTemporaryMax(
          state,
          rollResult.rolledDamage,
          durationMs,
          nowMs
        );
      });
    };

    addShieldRef.current = (amount) => {
      mutatingHealthState((state, nowMs) =>
        applyingRolledBeneficialWithFloatFeedback(
          state,
          amount,
          'shield_gain',
          nowMs,
          (currentState, rolledAmount) =>
            addingWorldPlazaEntityHealthShield(currentState, rolledAmount)
        )
      );
    };

    addPoisonDotRef.current = () => {
      mutatingHealthState((state, nowMs) => {
        const rollResult = computingWorldPlazaEntityHealthRolledExpectedAmount({
          state,
          baseExpectedAmount: 5,
          attackerModifiers: attackerDamageRollModifiersRef.current,
          nowMs,
        });

        return addingWorldPlazaEntityHealthDamageOverTime(
          state,
          'poison',
          rollResult.rolledDamage,
          10_000,
          nowMs
        );
      });
    };

    addHalfDamageBuffRef.current = () => {
      toggleBuffRef.current('half-damage-buff');
    };

    addHeatResistanceRef.current = () => {
      mutatingHealthState((state, nowMs) =>
        applyingWorldPlazaEntityBuff(state, 'heat-resistance-buff', nowMs)
      );
    };

    addColdResistanceRef.current = () => {
      mutatingHealthState((state, nowMs) =>
        applyingWorldPlazaEntityBuff(state, 'cold-resistance-buff', nowMs)
      );
    };

    toggleHeatImmunityRef.current = () => {
      toggleBuffRef.current('heat-immunity-buff');
    };

    toggleColdImmunityRef.current = () => {
      toggleBuffRef.current('cold-immunity-buff');
    };

    toggleTemperatureDisplayUnitRef.current = () => {
      temperatureDisplayUnitRef.current =
        temperatureDisplayUnitRef.current === 'celsius'
          ? 'fahrenheit'
          : 'celsius';
      pushingHudSnapshot(performance.now());
    };

    rollDamageRef.current = (
      expectedDamage = 100,
      forcedTier?: DefiningWorldPlazaDamageOutcomeTier
    ) => {
      const rollOptions: Pick<
        DefiningWorldPlazaEntityHealthDamageOptions,
        'forcedDeviationScore' | 'forcedRollMode'
      > =
        forcedTier === undefined
          ? {}
          : forcedTier === 'true_strike'
            ? { forcedRollMode: 'lock_in' }
            : {
                forcedDeviationScore:
                  resolvingWorldPlazaDamageOutcomeTierForcedDeviationScore(
                    forcedTier
                  ),
              };

      mutatingHealthState(
        (state, nowMs) =>
          applyingDamageWithFloatFeedback(
            state,
            expectedDamage,
            'physical',
            nowMs,
            rollOptions
          ),
        { flashDamage: true }
      );
    };

    toggleBuffRef.current = (buffId) => {
      const preset =
        DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_PRESETS.find(
          (entry) => entry.id === buffId
        );

      if (preset) {
        if (preset.side === 'attacker') {
          attackerDamageRollModifiersRef.current =
            togglingWorldPlazaEntityHealthDamageRollPresetInList(
              attackerDamageRollModifiersRef.current,
              preset
            );
          pushingHudSnapshot(performance.now());
          return;
        }

        mutatingHealthState((state) =>
          togglingWorldPlazaEntityHealthDamageRollPreset(state, preset)
        );
        return;
      }

      if (buffId === 'temp-max-health-buff') {
        mutatingHealthState((state, nowMs) =>
          applyingWorldPlazaEntityBuff(state, buffId, nowMs, {
            attackerDamageRollModifiers:
              attackerDamageRollModifiersRef.current,
          })
        );
        return;
      }

      mutatingHealthState((state, nowMs) =>
        applyingWorldPlazaEntityBuff(state, buffId, nowMs, {
          attackerDamageRollModifiers: attackerDamageRollModifiersRef.current,
        })
      );
    };

    toggleDamageRollPresetRef.current = (presetId) => {
      toggleBuffRef.current(presetId);
    };

    const advancingHealthFrame = (frameTimeMs: number): void => {
      const previousMs = lastTickMsRef.current ?? frameTimeMs;
      const deltaMs = Math.max(0, frameTimeMs - previousMs);
      lastTickMsRef.current = frameTimeMs;

      const playerPosition = playerPositionRef.current;

      if (playerPosition) {
        const placedBlocksByTile =
          placedBlocksRef.current?.blocksByTile ?? new Map();
        localTemperatureCelsiusRef.current =
          resolvingWorldPlazaEnvironmentalTemperatureForPlayerAtWorldPoint({
            center: playerPosition,
            isDaytime: isDaytimeRef.current,
            placedBlocksByTile,
          });

        const hazard =
          resolvingWorldPlazaEnvironmentalHazardForPlayerAtWorldPoint({
            center: playerPosition,
            isDaytime: isDaytimeRef.current,
            placedBlocksByTile,
          });

        if (hazard) {
          const damageKind = mappingEnvironmentalHazardKindToDamageKind(
            hazard.kind
          );
          const previousHazardKind = lastEnvironmentalHazardKindRef.current;
          const exposureKind = hazard.kind === 'cold' ? 'cold' : 'heat';
          const resistedDamagePerSecond =
            applyingWorldPlazaEntityTemperatureResistanceToDamagePerSecond(
              hazard.damagePerSecond,
              exposureKind,
              healthStateRef.current.temperatureResistance
            );

          if (resistedDamagePerSecond > 0) {
            healthStateRef.current = addingWorldPlazaEntityHealthDamageOverTime(
              healthStateRef.current,
              damageKind,
              resistedDamagePerSecond,
              1_500,
              frameTimeMs
            );
          }

          if (hazard.kind === 'lava' && previousHazardKind !== 'lava') {
            const resistedLavaDamage =
              applyingWorldPlazaEntityTemperatureResistanceToDamagePerSecond(
                DEFINING_WORLD_PLAZA_ENTITY_HEALTH_LAVA_INSTANT_DAMAGE,
                'heat',
                healthStateRef.current.temperatureResistance
              );

            if (resistedLavaDamage > 0) {
              healthStateRef.current = applyingDamageWithFloatFeedback(
                healthStateRef.current,
                resistedLavaDamage,
                'environmental_lava',
                frameTimeMs
              );
              damageFlashUntilMsRef.current =
                frameTimeMs + USING_WORLD_PLAZA_PLAYER_HEALTH_DAMAGE_FLASH_MS;
            }
          }

          lastEnvironmentalHazardKindRef.current = hazard.kind;
        } else {
          lastEnvironmentalHazardKindRef.current = null;
        }
      } else {
        localTemperatureCelsiusRef.current = null;
      }

      const previousHealth = healthStateRef.current.currentHealth;
      const previousShield = healthStateRef.current.shieldPoints;
      healthStateRef.current = tickingWorldPlazaEntityHealthState(
        healthStateRef.current,
        frameTimeMs,
        deltaMs
      );

      const healthLost = previousHealth - healthStateRef.current.currentHealth;
      const healthGained =
        healthStateRef.current.currentHealth - previousHealth;
      const shieldLost = previousShield - healthStateRef.current.shieldPoints;

      if (healthGained > 0) {
        accumulatedRegenFloatAmountRef.current += healthGained;

        if (
          frameTimeMs - lastRegenFloatAtMsRef.current >=
            DEFINING_WORLD_PLAZA_ENTITY_HEALTH_REGEN_FLOAT_BATCH_INTERVAL_MS &&
          accumulatedRegenFloatAmountRef.current >=
            DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_MIN_AMOUNT
        ) {
          enqueueFloatText(
            {
              kind: 'heal_regen',
              amount: accumulatedRegenFloatAmountRef.current,
              damageKind: 'healing',
            },
            frameTimeMs
          );
          accumulatedRegenFloatAmountRef.current = 0;
          lastRegenFloatAtMsRef.current = frameTimeMs;
        }
      }

      if (shieldLost > 0) {
        enqueueFloatText(
          {
            kind: 'shield_absorb',
            amount: shieldLost,
            damageKind: healthStateRef.current.lastDamageKind,
          },
          frameTimeMs
        );
      }

      if (healthLost > 0) {
        enqueueFloatText(
          {
            kind: 'damage',
            amount: healthLost,
            damageKind: healthStateRef.current.lastDamageKind,
          },
          frameTimeMs
        );
        damageFlashUntilMsRef.current =
          frameTimeMs + USING_WORLD_PLAZA_PLAYER_HEALTH_DAMAGE_FLASH_MS;
      }

      if (
        floatingTextsRef.current.length > 0 ||
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
    applyingDamageWithFloatFeedback,
    applyingRolledBeneficialWithFloatFeedback,
    enqueueFloatText,
    isEnabled,
    mutatingHealthState,
    placedBlocksRef,
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
    respawnRef,
    toggleInvincibleRef,
    doubleMaxHealthRef,
    halveMaxHealthRef,
    addTemporaryMaxHealthRef,
    addShieldRef,
    addPoisonDotRef,
    addHalfDamageBuffRef,
    addHeatResistanceRef,
    addColdResistanceRef,
    toggleHeatImmunityRef,
    toggleColdImmunityRef,
    toggleTemperatureDisplayUnitRef,
    rollDamageRef,
    toggleDamageRollPresetRef,
    toggleBuffRef,
  };
}
