'use client';

import { applyingWorldPlazaPlayerTeleportToWorldPoint } from '@/components/world/domains/applyingWorldPlazaPlayerTeleportToWorldPoint';
import type { DefiningWorldPlazaPlacedBlocksSceneRef } from '@/components/world/domains/definingWorldPlazaPlacedBlocksSceneRef';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { advancingWorldPlazaEnvironmentalTemperatureCelsius } from '@/components/world/health/domains/advancingWorldPlazaEnvironmentalTemperatureCelsius';
import { applyingWorldPlazaEntityBuff } from '@/components/world/health/domains/applyingWorldPlazaEntityBuff';
import { computingWorldPlazaEntityBleedPoolTotalDamage } from '@/components/world/health/domains/computingWorldPlazaEntityBleedPoolTotalDamage';
import { computingWorldPlazaEntityHealthDamage } from '@/components/world/health/domains/computingWorldPlazaEntityHealthDamage';
import { computingWorldPlazaEntityHealthDamageToHeal } from '@/components/world/health/domains/computingWorldPlazaEntityHealthDamageToHeal';
import { computingWorldPlazaEntityHealthEffectiveMax } from '@/components/world/health/domains/computingWorldPlazaEntityHealthEffectiveMax';
import { computingWorldPlazaEntityHealthRolledExpectedAmount } from '@/components/world/health/domains/computingWorldPlazaEntityHealthRolledExpectedAmount';
import { computingWorldPlazaEntityPoisonPoolTotalDamage } from '@/components/world/health/domains/computingWorldPlazaEntityPoisonPoolTotalDamage';
import { computingWorldPlazaEnvironmentalTemperatureHudExposure } from '@/components/world/health/domains/computingWorldPlazaEnvironmentalTemperatureHudExposure';
import {
  buildingWorldPlazaEnvironmentalHazardFromTemperatureCelsius,
  computingWorldPlazaEnvironmentalTemperatureTotalDamagePerSecond,
} from '@/components/world/health/domains/computingWorldPlazaTemperatureDamagePerSecond';
import { resolvingWorldPlazaDamageOutcomeTierForcedDeviationScore } from '@/components/world/health/domains/definingWorldPlazaDamageOutcomeTierForcedDeviationScores';
import type { DefiningWorldPlazaEntityBleedSeverity } from '@/components/world/health/domains/definingWorldPlazaEntityBleedSeverityRegistry';
import {
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_HUD_EPSILON,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_HUD_PUSH_INTERVAL_MS,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_RESPAWN_INVINCIBILITY_MS,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthConstants';
import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_PRESETS } from '@/components/world/health/domains/definingWorldPlazaEntityHealthDamageRollPresets';
import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_ENVIRONMENTAL_TEMPERATURE_TICK_INTERVAL_MS } from '@/components/world/health/domains/definingWorldPlazaEntityHealthFloatTextConstants';
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
  healingWorldPlazaEntityHealthWithAmplifiers,
  revivingWorldPlazaEntityHealthToFull,
  serializingWorldPlazaEntityHealthSyncSnapshot,
  settingWorldPlazaEntityHealthInvincible,
  tickingWorldPlazaEntityHealthState,
  togglingWorldPlazaEntityHealthDamageRollPreset,
} from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { mappingWorldPlazaDamageOutcomeTierToFloatTextKind } from '@/components/world/health/domains/mappingWorldPlazaDamageOutcomeTierToFloatTextKind';
import { mappingWorldPlazaEnvironmentalHazardKindToDamageKind } from '@/components/world/health/domains/mappingWorldPlazaEnvironmentalHazardKindToDamageKind';
import { resolvingWorldPlazaEntityHealthDamageRollParams } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthDamageRollParams';
import { applyingWorldPlazaEntityTemperatureResistanceToEnvironmentalDamageRates } from '@/components/world/health/domains/resolvingWorldPlazaEntityTemperatureResistanceMultiplier';
import { resolvingWorldPlazaEnvironmentalTemperatureForPlayerAtWorldPoint } from '@/components/world/health/domains/resolvingWorldPlazaEnvironmentalHazardForPlayerAtWorldPoint';

import { creatingWorldPlazaCharacterEngineInitialHealthState } from '@/components/world/character/domains/creatingWorldPlazaCharacterEngineInitialHealthState';
import type { DefiningWorldPlazaCharacterEngineDefinition } from '@/components/world/character/domains/definingWorldPlazaCharacterEngineTypes';
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
  /** When present and false, passive health regen is gated off (e.g. low hunger). */
  isHealthRegenAllowedRef?: React.RefObject<boolean>;
  /** Declarative character definition used to seed health, immunities, and buffs. */
  characterEngineDefinition?: DefiningWorldPlazaCharacterEngineDefinition;
}

export interface UsingWorldPlazaPlayerHealthResult {
  healthStateRef: React.RefObject<DefiningWorldPlazaEntityHealthState>;
  /** Smoothed local temperature used for environmental damage and frost slow. */
  localTemperatureCelsiusRef: React.RefObject<number | null>;
  healthSyncSnapshotRef: React.RefObject<DefiningWorldPlazaEntityHealthSyncSnapshot>;
  hudSnapshot: UsingWorldPlazaPlayerHealthHudSnapshot;
  takeDamageRef: React.RefObject<
    (
      amount: number,
      kind?: DefiningWorldPlazaEntityDamageKind,
      options?: Pick<
        DefiningWorldPlazaEntityHealthDamageOptions,
        | 'bypassInvincibilityFrames'
        | 'grantInvincibilityFrames'
        | 'forcedDeviationScore'
        | 'forcedRollMode'
      >
    ) => void
  >;
  healRef: React.RefObject<(amount: number) => void>;
  applyFallDamageRef: React.RefObject<(layerDelta: number) => void>;
  killRef: React.RefObject<() => void>;
  /**
   * Applies starvation damage directly to current health, bypassing shields
   * and the regen-delay reset (starvation ticks should not interrupt regen
   * recovery once hunger is restored).
   */
  applyStarvationDamageRef: React.RefObject<(amount: number) => void>;
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
      state.temperatureResistance,
      state,
      nowMs
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
  isHealthRegenAllowedRef,
  characterEngineDefinition,
}: UsingWorldPlazaPlayerHealthParams): UsingWorldPlazaPlayerHealthResult {
  const healthStateRef = useRef<DefiningWorldPlazaEntityHealthState>(
    characterEngineDefinition
      ? creatingWorldPlazaCharacterEngineInitialHealthState(
          characterEngineDefinition
        )
      : creatingWorldPlazaEntityHealthInitialState()
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
  const environmentalTemperatureLastTickAtMsRef = useRef<number | null>(null);
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

      let nextState = damageResult.state;

      if (kind === 'physical' && !damageResult.appliedDamage.wasBlocked) {
        const damageToHeal = computingWorldPlazaEntityHealthDamageToHeal({
          appliedDamage: damageResult.appliedDamage,
          physicalDamageLifestealModifiers:
            state.physicalDamageLifestealModifiers,
          incomingDamageHealModifiers: state.incomingDamageHealModifiers,
          nowMs,
        });

        if (damageToHeal.totalHealAmount > 0) {
          const healResult = healingWorldPlazaEntityHealthWithAmplifiers({
            receiverState: nextState,
            baseHealAmount: damageToHeal.totalHealAmount,
            nowMs,
          });
          nextState = healResult.state;
          enqueueFloatText(
            {
              kind: 'heal',
              amount: healResult.amplifiedHealAmount,
              damageKind: 'healing',
            },
            nowMs
          );
        }
      }

      return nextState;
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
        const healResult = healingWorldPlazaEntityHealthWithAmplifiers({
          receiverState: state,
          baseHealAmount: rolledAmount,
          nowMs,
        });

        if (floatKind === 'heal' && healResult.amplifiedHealAmount > 0) {
          enqueueFloatText(
            {
              kind: floatKind,
              amount: healResult.amplifiedHealAmount,
              damageKind: 'healing',
              outcomeTier: rollResult.tier,
              deviationScore: rollResult.deviationScore,
            },
            nowMs
          );
        } else if (floatKind === 'shield_gain' && rolledAmount > 0) {
          enqueueFloatText(
            {
              kind: floatKind,
              amount: rolledAmount,
              damageKind: null,
              outcomeTier: rollResult.tier,
              deviationScore: rollResult.deviationScore,
            },
            nowMs
          );
        }

        return floatKind === 'heal'
          ? healResult.state
          : applyAmount(state, rolledAmount, nowMs);
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

  useEffect(() => {
    if (!characterEngineDefinition) {
      return;
    }

    healthStateRef.current =
      creatingWorldPlazaCharacterEngineInitialHealthState(
        characterEngineDefinition,
        performance.now()
      );
    pushingHudSnapshot(performance.now());
  }, [characterEngineDefinition, pushingHudSnapshot]);

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
    (
      amount: number,
      kind?: DefiningWorldPlazaEntityDamageKind,
      options?: Pick<
        DefiningWorldPlazaEntityHealthDamageOptions,
        | 'bypassInvincibilityFrames'
        | 'grantInvincibilityFrames'
        | 'forcedDeviationScore'
        | 'forcedRollMode'
      >
    ) => void
  >(() => undefined);
  const healRef = useRef<(amount: number) => void>(() => undefined);
  const applyFallDamageRef = useRef<(layerDelta: number) => void>(
    () => undefined
  );
  const killRef = useRef<() => void>(() => undefined);
  const applyStarvationDamageRef = useRef<(amount: number) => void>(
    () => undefined
  );
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
      postRespawnInvincibilityUntilMsRef.current = 0;
      lastTickMsRef.current = null;
      localTemperatureCelsiusRef.current = null;
      environmentalTemperatureLastTickAtMsRef.current = null;
      applyStarvationDamageRef.current = () => undefined;
      pushingHudSnapshot(performance.now());
      return;
    }

    takeDamageRef.current = (amount, kind = 'physical', options) => {
      mutatingHealthState(
        (state, nowMs) =>
          applyingDamageWithFloatFeedback(state, amount, kind, nowMs, options),
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
            healingWorldPlazaEntityHealthWithAmplifiers({
              receiverState: currentState,
              baseHealAmount: rolledAmount,
              nowMs: appliedAtMs,
            }).state
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

    applyStarvationDamageRef.current = (amount) => {
      if (amount <= 0) {
        return;
      }

      mutatingHealthState((state, nowMs) => {
        const nextHealth = Math.max(0, state.currentHealth - amount);

        if (nextHealth > 0) {
          enqueueFloatText(
            { kind: 'damage', amount, damageKind: 'starvation' },
            nowMs
          );
        }

        return {
          ...state,
          currentHealth: nextHealth,
          lastDamageKind: 'starvation',
          isDead: nextHealth <= 0,
        };
      });
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
        const effectiveMaxHealth = computingWorldPlazaEntityHealthEffectiveMax(
          healthStateRef.current,
          frameTimeMs
        );
        const resistedRates = hazard
          ? applyingWorldPlazaEntityTemperatureResistanceToEnvironmentalDamageRates(
              {
                damagePerSecond: hazard.damagePerSecond,
                maxHealthPercentPerSecond: hazard.maxHealthPercentPerSecond,
                exposureKind: hazard.kind === 'cold' ? 'cold' : 'heat',
                resistance: healthStateRef.current.temperatureResistance,
              }
            )
          : null;
        const resistedDamagePerSecond = resistedRates
          ? computingWorldPlazaEnvironmentalTemperatureTotalDamagePerSecond(
              resistedRates.damagePerSecond,
              resistedRates.maxHealthPercentPerSecond,
              effectiveMaxHealth
            )
          : 0;

        if (hazard && resistedDamagePerSecond > 0) {
          const lastTickAtMs = environmentalTemperatureLastTickAtMsRef.current;

          if (lastTickAtMs === null) {
            // Exposure just started; first tick lands one interval later.
            environmentalTemperatureLastTickAtMsRef.current = frameTimeMs;
          } else {
            const elapsedMs = frameTimeMs - lastTickAtMs;

            if (
              elapsedMs >=
              DEFINING_WORLD_PLAZA_ENTITY_HEALTH_ENVIRONMENTAL_TEMPERATURE_TICK_INTERVAL_MS
            ) {
              const tickDamage = resistedDamagePerSecond * (elapsedMs / 1000);

              healthStateRef.current = applyingDamageWithFloatFeedback(
                healthStateRef.current,
                tickDamage,
                mappingWorldPlazaEnvironmentalHazardKindToDamageKind(
                  hazard.kind
                ),
                frameTimeMs,
                {
                  bypassInvincibilityFrames: true,
                  grantInvincibilityFrames: false,
                }
              );
              damageFlashUntilMsRef.current =
                frameTimeMs + USING_WORLD_PLAZA_PLAYER_HEALTH_DAMAGE_FLASH_MS;
              environmentalTemperatureLastTickAtMsRef.current = frameTimeMs;
            }
          }
        } else {
          environmentalTemperatureLastTickAtMsRef.current = null;
        }
      } else {
        localTemperatureCelsiusRef.current = null;
        environmentalTemperatureLastTickAtMsRef.current = null;
      }

      const previousHealth = healthStateRef.current.currentHealth;
      const previousShield = healthStateRef.current.shieldPoints;
      healthStateRef.current = tickingWorldPlazaEntityHealthState(
        healthStateRef.current,
        frameTimeMs,
        deltaMs,
        isHealthRegenAllowedRef?.current ?? true
      );

      const healthLost = previousHealth - healthStateRef.current.currentHealth;
      const shieldLost = previousShield - healthStateRef.current.shieldPoints;

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
    isHealthRegenAllowedRef,
    mutatingHealthState,
    placedBlocksRef,
    playerPositionRef,
    pushingHudSnapshot,
    respawningPlayer,
  ]);

  return {
    healthStateRef,
    localTemperatureCelsiusRef,
    healthSyncSnapshotRef,
    applyStarvationDamageRef,
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
