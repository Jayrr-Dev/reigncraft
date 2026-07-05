'use client';

import { applyingWorldPlazaPlayerTeleportToWorldPoint } from '@/components/world/domains/applyingWorldPlazaPlayerTeleportToWorldPoint';
import type { DefiningWorldPlazaPlacedBlocksSceneRef } from '@/components/world/domains/definingWorldPlazaPlacedBlocksSceneRef';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { advancingWorldPlazaEnvironmentalTemperatureCelsius } from '@/components/world/health/domains/advancingWorldPlazaEnvironmentalTemperatureCelsius';
import { applyingWorldPlazaEntityBuff } from '@/components/world/health/domains/applyingWorldPlazaEntityBuff';
import { computingWorldPlazaEntityBleedPoolTotalDamage } from '@/components/world/health/domains/computingWorldPlazaEntityBleedPoolTotalDamage';
import { computingWorldPlazaEntityHealthDamage } from '@/components/world/health/domains/computingWorldPlazaEntityHealthDamage';
import { computingWorldPlazaEntityHealthEffectiveMax } from '@/components/world/health/domains/computingWorldPlazaEntityHealthEffectiveMax';
import { computingWorldPlazaEntityHealthRolledExpectedAmount } from '@/components/world/health/domains/computingWorldPlazaEntityHealthRolledExpectedAmount';
import { computingWorldPlazaEntityPoisonPoolTotalDamage } from '@/components/world/health/domains/computingWorldPlazaEntityPoisonPoolTotalDamage';
import { computingWorldPlazaEnvironmentalTemperatureHudExposure } from '@/components/world/health/domains/computingWorldPlazaEnvironmentalTemperatureHudExposure';
import {
  applyingWorldPlazaEnvironmentalTemperatureDamageForFrame,
  buildingWorldPlazaEnvironmentalHazardFromTemperatureCelsius,
} from '@/components/world/health/domains/computingWorldPlazaTemperatureDamagePerSecond';
import { resolvingWorldPlazaDamageOutcomeTierForcedDeviationScore } from '@/components/world/health/domains/definingWorldPlazaDamageOutcomeTierForcedDeviationScores';
import type { DefiningWorldPlazaEntityBleedSeverity } from '@/components/world/health/domains/definingWorldPlazaEntityBleedSeverityRegistry';
import {
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_HUD_EPSILON,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_HUD_PUSH_INTERVAL_MS,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_RESPAWN_INVINCIBILITY_MS,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthConstants';
import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_PRESETS } from '@/components/world/health/domains/definingWorldPlazaEntityHealthDamageRollPresets';
import {
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_ENVIRONMENTAL_TEMPERATURE_FLOAT_BATCH_INTERVAL_MS,
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
import {
  DEFINING_WORLD_PLAZA_ENTITY_POTENTIAL_DAMAGE_DEV_EXPECTED_DAMAGE,
  DEFINING_WORLD_PLAZA_ENTITY_POTENTIAL_DAMAGE_DEV_RESOLVE_DELAY_MS,
} from '@/components/world/health/domains/definingWorldPlazaEntityPotentialDamageConstants';
import type { DefiningWorldPlazaEntityStatusEffectHudRow } from '@/components/world/health/domains/definingWorldPlazaEntityStatusEffectHudRowTypes';
import { DEFINING_WORLD_PLAZA_TEMPERATURE_DISPLAY_UNIT } from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';
import type { DefiningWorldPlazaTemperatureDisplayUnit } from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';
import type { DefiningWorldPlazaEntityActiveBuffHudEntry } from '@/components/world/health/domains/listingWorldPlazaEntityActiveBuffHudEntries';
import { listingWorldPlazaEntityActiveBuffHudEntries } from '@/components/world/health/domains/listingWorldPlazaEntityActiveBuffHudEntries';
import {
  listingWorldPlazaEntityHealthActiveAttackerDamageRollPresetIds,
  listingWorldPlazaEntityHealthActiveDefenderDamageRollPresetIds,
  togglingWorldPlazaEntityHealthDamageRollPresetInList,
} from '@/components/world/health/domains/listingWorldPlazaEntityHealthActiveDamageRollPresetIds';
import {
  areWorldPlazaEntityStatusEffectHudRowsUnchanged,
  listingWorldPlazaEntityStatusEffectHudRows,
} from '@/components/world/health/domains/listingWorldPlazaEntityStatusEffectHudRows';
import {
  enqueueingWorldPlazaEntityHealthFloatText,
  pruningWorldPlazaEntityHealthFloatTexts,
} from '@/components/world/health/domains/managingWorldPlazaEntityHealthFloatTexts';
import {
  addingWorldPlazaEntityHealthShield,
  addingWorldPlazaEntityHealthTemporaryMax,
  applyingWorldPlazaEntityHealthBleed,
  applyingWorldPlazaEntityHealthPoison,
  applyingWorldPlazaEntityHealthPotentialDamageFromState,
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
import { mappingWorldPlazaEnvironmentalHazardKindToDamageKind } from '@/components/world/health/domains/mappingWorldPlazaEnvironmentalHazardKindToDamageKind';
import { resolvingWorldPlazaEntityHealthDamageRollParams } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthDamageRollParams';
import { applyingWorldPlazaEntityTemperatureResistanceToDamagePerSecond } from '@/components/world/health/domains/resolvingWorldPlazaEntityTemperatureResistanceMultiplier';
import { resolvingWorldPlazaEnvironmentalTemperatureForPlayerAtWorldPoint } from '@/components/world/health/domains/resolvingWorldPlazaEnvironmentalHazardForPlayerAtWorldPoint';

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
  lastDamageKind: DefiningWorldPlazaEntityHealthState['lastDamageKind'];
  activeDotCount: number;
  activeBleedCount: number;
  activePoisonCount: number;
  activePotentialDamageCount: number;
  floatingTexts: readonly DefiningWorldPlazaEntityHealthFloatText[];
  localTemperatureCelsius: number | null;
  temperatureDisplayUnit: DefiningWorldPlazaTemperatureDisplayUnit;
  temperatureResistance: DefiningWorldPlazaEntityHealthState['temperatureResistance'];
  damageRoll: UsingWorldPlazaPlayerHealthDamageRollHudSnapshot;
  activeBuffIds: readonly string[];
  activeBuffs: readonly DefiningWorldPlazaEntityActiveBuffHudEntry[];
  statusEffectHudRows: readonly DefiningWorldPlazaEntityStatusEffectHudRow[];
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
  applyPoisonRef: React.RefObject<
    (
      potency: DefiningWorldPlazaEntityPoisonPotency,
      flatExpectedDamage?: number
    ) => void
  >;
  applyBleedRef: React.RefObject<
    (
      severity: DefiningWorldPlazaEntityBleedSeverity,
      flatExpectedDamage?: number
    ) => void
  >;
  applyPotentialDamageRef: React.RefObject<
    (expectedDamage?: number, resolveDelayMs?: number) => void
  >;
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
  /** Expiry timestamp for post-respawn invincibility blink on the local avatar. */
  postRespawnInvincibilityUntilMsRef: React.RefObject<number>;
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
  const activeBuffs = listingWorldPlazaEntityActiveBuffHudEntries({
    state,
    nowMs,
    defenderModifierIds,
    attackerModifierIds,
  });
  const activeBuffIds = activeBuffs.map((buff) => buff.id);
  const environmentalTemperatureExposure =
    computingWorldPlazaEnvironmentalTemperatureHudExposure(
      localTemperatureCelsius,
      state.temperatureResistance
    );
  const statusEffectHudRows = listingWorldPlazaEntityStatusEffectHudRows({
    state,
    nowMs,
    environmentalTemperatureExposure,
  });

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
    lastDamageKind: state.lastDamageKind,
    activeDotCount: state.damageOverTimeEffects.length,
    activeBleedCount: state.bleedEffects.length,
    activePoisonCount: state.poisonEffects.length,
    activePotentialDamageCount: state.potentialDamageEffects.length,
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
    activeBuffs,
    statusEffectHudRows,
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
  const accumulatedEnvironmentalTemperatureFloatAmountRef = useRef(0);
  const accumulatedEnvironmentalTemperatureFloatKindRef =
    useRef<DefiningWorldPlazaEntityDamageKind | null>(null);
  const lastEnvironmentalTemperatureFloatAtMsRef = useRef(0);
  const postRespawnInvincibilityUntilMsRef = useRef(0);

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

  const flushingEnvironmentalTemperatureFloat = useCallback(
    (nowMs: number): void => {
      const damageKind =
        accumulatedEnvironmentalTemperatureFloatKindRef.current;
      const amount = accumulatedEnvironmentalTemperatureFloatAmountRef.current;

      if (
        damageKind !== null &&
        amount >= DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_MIN_AMOUNT
      ) {
        enqueueFloatText(
          {
            kind: 'damage',
            amount,
            damageKind,
          },
          nowMs
        );
      }

      accumulatedEnvironmentalTemperatureFloatAmountRef.current = 0;
      accumulatedEnvironmentalTemperatureFloatKindRef.current = null;
      lastEnvironmentalTemperatureFloatAtMsRef.current = nowMs;
    },
    [enqueueFloatText]
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
          previous.lastDamageKind === nextSnapshot.lastDamageKind &&
          previous.isDamageFlashing === nextSnapshot.isDamageFlashing &&
          previous.activeDotCount === nextSnapshot.activeDotCount &&
          previous.activeBleedCount === nextSnapshot.activeBleedCount &&
          previous.activePoisonCount === nextSnapshot.activePoisonCount &&
          previous.activePotentialDamageCount ===
            nextSnapshot.activePotentialDamageCount &&
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
            nextSnapshot.activeBuffIds.join(',') &&
          previous.activeBuffs.length === nextSnapshot.activeBuffs.length &&
          previous.activeBuffs.every(
            (buff, index) =>
              buff.id === nextSnapshot.activeBuffs[index]?.id &&
              buff.expiresAtMs === nextSnapshot.activeBuffs[index]?.expiresAtMs
          ) &&
          areWorldPlazaEntityStatusEffectHudRowsUnchanged(
            previous.statusEffectHudRows,
            nextSnapshot.statusEffectHudRows
          );

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
    postRespawnInvincibilityUntilMsRef.current =
      nowMs + DEFINING_WORLD_PLAZA_ENTITY_HEALTH_RESPAWN_INVINCIBILITY_MS;
    enqueueFloatText(
      {
        kind: 'heal',
        amount: healthStateRef.current.currentHealth,
        damageKind: 'healing',
      },
      nowMs
    );
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
  const applyPoisonRef = useRef<
    (
      potency: DefiningWorldPlazaEntityPoisonPotency,
      flatExpectedDamage?: number
    ) => void
  >(() => undefined);
  const applyBleedRef = useRef<
    (
      severity: DefiningWorldPlazaEntityBleedSeverity,
      flatExpectedDamage?: number
    ) => void
  >(() => undefined);
  const applyPotentialDamageRef = useRef<
    (expectedDamage?: number, resolveDelayMs?: number) => void
  >(() => undefined);
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
      postRespawnInvincibilityUntilMsRef.current = 0;
      lastTickMsRef.current = null;
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

    applyPoisonRef.current = (potency, flatExpectedDamage = 10) => {
      mutatingHealthState((state, nowMs) => {
        const poisonPool = computingWorldPlazaEntityPoisonPoolTotalDamage({
          state,
          potency,
          flatExpectedDamage,
          attackerModifiers: attackerDamageRollModifiersRef.current,
          nowMs,
        });

        return applyingWorldPlazaEntityHealthPoison(
          state,
          potency,
          poisonPool.totalPoisonDamage,
          nowMs
        );
      });
    };

    applyBleedRef.current = (severity, flatExpectedDamage = 10) => {
      mutatingHealthState((state, nowMs) => {
        const bleedPool = computingWorldPlazaEntityBleedPoolTotalDamage({
          state,
          severity,
          flatExpectedDamage,
          attackerModifiers: attackerDamageRollModifiersRef.current,
          nowMs,
        });

        return applyingWorldPlazaEntityHealthBleed(
          state,
          severity,
          bleedPool.totalBleedDamage,
          nowMs
        );
      });
    };

    applyPotentialDamageRef.current = (
      expectedDamage = DEFINING_WORLD_PLAZA_ENTITY_POTENTIAL_DAMAGE_DEV_EXPECTED_DAMAGE,
      resolveDelayMs = DEFINING_WORLD_PLAZA_ENTITY_POTENTIAL_DAMAGE_DEV_RESOLVE_DELAY_MS
    ) => {
      mutatingHealthState((state, nowMs) =>
        applyingWorldPlazaEntityHealthPotentialDamageFromState(
          state,
          expectedDamage,
          resolveDelayMs,
          nowMs
        )
      );
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
            attackerDamageRollModifiers: attackerDamageRollModifiersRef.current,
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
      let temperatureHealthLostThisFrame = 0;
      let temperatureDamageKindThisFrame: DefiningWorldPlazaEntityDamageKind | null =
        null;

      if (playerPosition) {
        const placedBlocksByTile =
          placedBlocksRef.current?.blocksByTile ?? new Map();
        const targetTemperatureCelsius =
          resolvingWorldPlazaEnvironmentalTemperatureForPlayerAtWorldPoint({
            center: playerPosition,
            isDaytime: isDaytimeRef.current,
            placedBlocksByTile,
          });
        const previousTemperatureCelsius = localTemperatureCelsiusRef.current;

        localTemperatureCelsiusRef.current =
          previousTemperatureCelsius === null
            ? targetTemperatureCelsius
            : advancingWorldPlazaEnvironmentalTemperatureCelsius({
                currentCelsius: previousTemperatureCelsius,
                targetCelsius: targetTemperatureCelsius,
                deltaMs,
              });

        const hazard =
          buildingWorldPlazaEnvironmentalHazardFromTemperatureCelsius(
            localTemperatureCelsiusRef.current
          );

        if (hazard) {
          const damageKind =
            mappingWorldPlazaEnvironmentalHazardKindToDamageKind(hazard.kind);
          const exposureKind = hazard.kind === 'cold' ? 'cold' : 'heat';
          const resistedDamagePerSecond =
            applyingWorldPlazaEntityTemperatureResistanceToDamagePerSecond(
              hazard.damagePerSecond,
              exposureKind,
              healthStateRef.current.temperatureResistance
            );

          if (resistedDamagePerSecond > 0) {
            const healthBeforeTemperatureDamage =
              healthStateRef.current.currentHealth;
            healthStateRef.current =
              applyingWorldPlazaEnvironmentalTemperatureDamageForFrame({
                state: healthStateRef.current,
                damageKind,
                damagePerSecond: resistedDamagePerSecond,
                deltaMs,
                nowMs: frameTimeMs,
              });
            temperatureHealthLostThisFrame = Math.max(
              0,
              healthBeforeTemperatureDamage -
                healthStateRef.current.currentHealth
            );
            temperatureDamageKindThisFrame = damageKind;
          }
        } else if (
          accumulatedEnvironmentalTemperatureFloatAmountRef.current > 0
        ) {
          flushingEnvironmentalTemperatureFloat(frameTimeMs);
        }
      } else {
        localTemperatureCelsiusRef.current = null;

        if (accumulatedEnvironmentalTemperatureFloatAmountRef.current > 0) {
          flushingEnvironmentalTemperatureFloat(frameTimeMs);
        }
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
        const nonTemperatureHealthLost = Math.max(
          0,
          healthLost - temperatureHealthLostThisFrame
        );

        if (temperatureHealthLostThisFrame > 0) {
          if (temperatureDamageKindThisFrame !== null) {
            if (
              accumulatedEnvironmentalTemperatureFloatKindRef.current !==
                null &&
              accumulatedEnvironmentalTemperatureFloatKindRef.current !==
                temperatureDamageKindThisFrame
            ) {
              flushingEnvironmentalTemperatureFloat(frameTimeMs);
            }

            accumulatedEnvironmentalTemperatureFloatKindRef.current =
              temperatureDamageKindThisFrame;
            accumulatedEnvironmentalTemperatureFloatAmountRef.current +=
              temperatureHealthLostThisFrame;

            if (
              frameTimeMs - lastEnvironmentalTemperatureFloatAtMsRef.current >=
              DEFINING_WORLD_PLAZA_ENTITY_HEALTH_ENVIRONMENTAL_TEMPERATURE_FLOAT_BATCH_INTERVAL_MS
            ) {
              flushingEnvironmentalTemperatureFloat(frameTimeMs);
            }
          }
        }

        if (nonTemperatureHealthLost > 0) {
          enqueueFloatText(
            {
              kind: 'damage',
              amount: nonTemperatureHealthLost,
              damageKind: healthStateRef.current.lastDamageKind,
            },
            frameTimeMs
          );
        }

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
    flushingEnvironmentalTemperatureFloat,
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
    applyPoisonRef,
    applyBleedRef,
    applyPotentialDamageRef,
    addHalfDamageBuffRef,
    addHeatResistanceRef,
    addColdResistanceRef,
    toggleHeatImmunityRef,
    toggleColdImmunityRef,
    toggleTemperatureDisplayUnitRef,
    rollDamageRef,
    toggleDamageRollPresetRef,
    toggleBuffRef,
    postRespawnInvincibilityUntilMsRef,
  };
}
