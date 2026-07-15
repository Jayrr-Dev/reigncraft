import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import { applyingWorldPlazaDamageRollDodgedAsZeroDamage } from '@/components/world/health/domains/applyingWorldPlazaDamageRollDodgedAsZeroDamage';
import { applyingWorldPlazaDamageRollMinimumOutcomeTier } from '@/components/world/health/domains/applyingWorldPlazaDamageRollMinimumOutcomeTier';
import { computingWorldPlazaEntityHealthEffectiveMax } from '@/components/world/health/domains/computingWorldPlazaEntityHealthEffectiveMax';
import { DEFINING_WORLD_PLAZA_ENTITY_DEATH_IMMUNITY_MINIMUM_HEALTH } from '@/components/world/health/domains/definingWorldPlazaEntityBuffImmunityDamageKinds';
import {
  shouldWorldPlazaEntityDamageKindAbsorbShield,
  shouldWorldPlazaEntityDamageKindUseDamageRoll,
} from '@/components/world/health/domains/definingWorldPlazaEntityDamageKindRegistry';
import type {
  DefiningWorldPlazaEntityDamageKind,
  DefiningWorldPlazaEntityHealthAppliedDamage,
  DefiningWorldPlazaEntityHealthDamageOptions,
  DefiningWorldPlazaEntityHealthState,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { resolvingWorldPlazaEntityHealthDamageRollBaseExpectedDamage } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthDamageRollBaseExpectedDamage';
import { resolvingWorldPlazaEntityHealthDamageRollParams } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthDamageRollParams';
import { resolvingWorldPlazaEntityHealthIncomingDamageMultiplier } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthIncomingDamageMultiplier';
import { rollingWorldPlazaDamageEngine } from '@/components/world/health/domains/rollingWorldPlazaDamageEngine';

export type ComputingWorldPlazaEntityHealthDamageParams = {
  state: DefiningWorldPlazaEntityHealthState;
  rawAmount: number;
  kind: DefiningWorldPlazaEntityDamageKind;
  nowMs: number;
  options?: DefiningWorldPlazaEntityHealthDamageOptions;
};

export type ComputingWorldPlazaEntityHealthDamageResult = {
  state: DefiningWorldPlazaEntityHealthState;
  appliedDamage: DefiningWorldPlazaEntityHealthAppliedDamage;
};

function shouldWorldPlazaEntityHealthRollDamage(
  kind: DefiningWorldPlazaEntityDamageKind,
  options: DefiningWorldPlazaEntityHealthDamageOptions
): boolean {
  if (options.skipDamageRoll === true) {
    return false;
  }

  return shouldWorldPlazaEntityDamageKindUseDamageRoll(kind);
}

function buildingWorldPlazaEntityHealthBlockedAppliedDamage(
  rawAmount: number
): DefiningWorldPlazaEntityHealthAppliedDamage {
  return {
    rawAmount,
    expectedDamage: null,
    rolledDamage: null,
    deviationScore: null,
    tier: null,
    afterModifiers: 0,
    absorbedByShield: 0,
    healthDamage: 0,
    wasBlocked: true,
  };
}

/**
 * Runs the incoming damage pipeline: invulnerability, statistical roll,
 * modifiers, low-health reduction, and shield absorption.
 */
export function computingWorldPlazaEntityHealthDamage({
  state,
  rawAmount,
  kind,
  nowMs,
  options = {},
}: ComputingWorldPlazaEntityHealthDamageParams): ComputingWorldPlazaEntityHealthDamageResult {
  const clampedRawAmount = Math.max(0, rawAmount);

  if (clampedRawAmount <= 0 || state.isDead) {
    return {
      state,
      appliedDamage:
        buildingWorldPlazaEntityHealthBlockedAppliedDamage(clampedRawAmount),
    };
  }

  if (state.damageKindImmunities.includes(kind)) {
    return {
      state,
      appliedDamage:
        buildingWorldPlazaEntityHealthBlockedAppliedDamage(clampedRawAmount),
    };
  }

  const isInvincibleBuffActive =
    state.invincibleUntilMs !== null && nowMs < state.invincibleUntilMs;

  if (isInvincibleBuffActive) {
    return {
      state,
      appliedDamage:
        buildingWorldPlazaEntityHealthBlockedAppliedDamage(clampedRawAmount),
    };
  }

  let expectedDamage: number | null = null;
  let rolledDamage: number | null = null;
  let deviationScore: number | null = null;
  let tier: DefiningWorldPlazaEntityHealthAppliedDamage['tier'] = null;

  const effectiveMax = computingWorldPlazaEntityHealthEffectiveMax(
    state,
    nowMs
  );
  const rollBaseExpectedDamage =
    resolvingWorldPlazaEntityHealthDamageRollBaseExpectedDamage({
      kind,
      rawAmount: clampedRawAmount,
      effectiveMaxHealth: effectiveMax,
    });
  let damageBeforeIncomingModifiers = rollBaseExpectedDamage;

  if (shouldWorldPlazaEntityHealthRollDamage(kind, options)) {
    const rollParams = resolvingWorldPlazaEntityHealthDamageRollParams({
      baseExpectedDamage: rollBaseExpectedDamage,
      defenderModifiers: [
        ...state.damageRollModifiers,
        ...(options.ephemeralDefenderDamageRollModifiers ?? []),
      ],
      attackerModifiers: options.attackerDamageRollModifiers ?? [],
      nowMs,
    });
    const resolvedRollMode =
      options.forcedRollMode ??
      (rollParams.isLockInActive
        ? 'lock_in'
        : rollParams.isChaoticActive
          ? 'chaotic'
          : 'normal');
    const resolvedForcedDeviationScore =
      options.forcedDeviationScore ??
      rollParams.forcedDeviationScore ??
      undefined;
    const rawRollResult = rollingWorldPlazaDamageEngine({
      expectedDamage: rollParams.expectedDamage,
      standardDeviation: rollParams.standardDeviation,
      luck: rollParams.luck,
      deviationBiasShift: rollParams.deviationBiasShift,
      rollMode: resolvedRollMode,
      forcedDeviationScore: resolvedForcedDeviationScore,
      random: options.random,
    });
    const shouldFloorMinimumTier =
      options.minimumOutcomeTier !== undefined &&
      options.forcedDeviationScore === undefined &&
      options.forcedRollMode === undefined &&
      rollParams.forcedDeviationScore === null;
    const flooredRollResult =
      shouldFloorMinimumTier && options.minimumOutcomeTier !== undefined
        ? applyingWorldPlazaDamageRollMinimumOutcomeTier(
            rawRollResult,
            options.minimumOutcomeTier
          )
        : rawRollResult;
    const rollResult = applyingWorldPlazaDamageRollDodgedAsZeroDamage(
      flooredRollResult,
      checkingWorldPlazaGenerationFeatureEnabled(
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.DODGE_ZERO_DAMAGE
      )
    );

    expectedDamage = rollResult.expectedDamage;
    rolledDamage = rollResult.rolledDamage;
    deviationScore = rollResult.deviationScore;
    tier = rollResult.tier;
    damageBeforeIncomingModifiers = rollResult.rolledDamage;
  }

  const afterModifiers =
    damageBeforeIncomingModifiers *
    resolvingWorldPlazaEntityHealthIncomingDamageMultiplier({
      state,
      nowMs,
      currentHealth: state.currentHealth,
      effectiveMaxHealth: effectiveMax,
    }) *
    (options.ephemeralIncomingDamageMultiplier ?? 1);

  const absorbedByShield = shouldWorldPlazaEntityDamageKindAbsorbShield(kind)
    ? Math.min(state.shieldPoints, afterModifiers)
    : 0;
  const healthDamage = Math.max(0, afterModifiers - absorbedByShield);
  const healthFloor = state.isDeathImmune
    ? DEFINING_WORLD_PLAZA_ENTITY_DEATH_IMMUNITY_MINIMUM_HEALTH
    : 0;
  const nextHealth = Math.max(healthFloor, state.currentHealth - healthDamage);
  const nextShield = Math.max(0, state.shieldPoints - absorbedByShield);

  const nextState: DefiningWorldPlazaEntityHealthState = {
    ...state,
    currentHealth: nextHealth,
    shieldPoints: nextShield,
    lastDamagedAtMs:
      healthDamage > 0 || absorbedByShield > 0 ? nowMs : state.lastDamagedAtMs,
    lastDamageKind:
      healthDamage > 0 || absorbedByShield > 0 ? kind : state.lastDamageKind,
    isDead: nextHealth <= 0,
  };

  return {
    state: nextState,
    appliedDamage: {
      rawAmount: clampedRawAmount,
      expectedDamage,
      rolledDamage,
      deviationScore,
      tier,
      afterModifiers,
      absorbedByShield,
      healthDamage,
      wasBlocked: false,
    },
  };
}
