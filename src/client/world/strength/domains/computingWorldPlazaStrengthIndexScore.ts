/**
 * Pure strength-index math over a normalized strength profile.
 *
 * Model: strength is the geometric mean of survival (effective health) and
 * offense (damage per second), swayed by a bounded mobility factor, then
 * normalized so the baseline player profile scores 100.
 *
 * @module components/world/strength/domains/computingWorldPlazaStrengthIndexScore
 */

import {
  DEFINING_WORLD_PLAZA_STRENGTH_BASELINE_INDEX,
  DEFINING_WORLD_PLAZA_STRENGTH_BASELINE_REFERENCE,
  DEFINING_WORLD_PLAZA_STRENGTH_DEFENSE_PIVOT,
  DEFINING_WORLD_PLAZA_STRENGTH_MOBILITY_FACTOR_MAX,
  DEFINING_WORLD_PLAZA_STRENGTH_MOBILITY_FACTOR_MIN,
  DEFINING_WORLD_PLAZA_STRENGTH_MOBILITY_WEIGHT,
  DEFINING_WORLD_PLAZA_STRENGTH_NOMINAL_FIGHT_SECONDS,
  type DefiningWorldPlazaStrengthModifier,
  type DefiningWorldPlazaStrengthModifierScope,
  type DefiningWorldPlazaStrengthProfile,
} from '@/components/world/strength/domains/definingWorldPlazaStrengthIndexConstants';

/** Per-component numbers behind one strength index, for tooltips and tuning. */
export type ComputingWorldPlazaStrengthIndexBreakdown = {
  /** Max health + regen contribution, multiplied by defense mitigation. */
  readonly effectiveHealth: number;
  /** Attack power times swings per second. */
  readonly damagePerSecond: number;
  /** Clamped run-speed sway around 1. */
  readonly mobilityFactor: number;
  /** Product of all `total`-scope modifier multipliers. */
  readonly totalModifierFactor: number;
  /** Modifiers that actually applied, echoed for explainability. */
  readonly appliedModifiers: readonly DefiningWorldPlazaStrengthModifier[];
};

/** Final scored result for one entity profile. */
export type ComputingWorldPlazaStrengthIndexResult = {
  readonly subjectId: string;
  readonly displayName: string;
  /** Normalized score; the baseline player profile scores 100. */
  readonly strengthIndex: number;
  readonly breakdown: ComputingWorldPlazaStrengthIndexBreakdown;
};

function computingModifierProduct(
  modifiers: readonly DefiningWorldPlazaStrengthModifier[],
  scope: DefiningWorldPlazaStrengthModifierScope
): number {
  return modifiers
    .filter((modifier) => modifier.scope === scope)
    .reduce((product, modifier) => product * modifier.multiplier, 1);
}

function computingEffectiveHealth(
  maxHealth: number,
  healthRegenPerSecond: number,
  defense: number
): number {
  const healthWithRegen =
    maxHealth +
    healthRegenPerSecond * DEFINING_WORLD_PLAZA_STRENGTH_NOMINAL_FIGHT_SECONDS;
  const defenseMitigation =
    1 + Math.max(0, defense) / DEFINING_WORLD_PLAZA_STRENGTH_DEFENSE_PIVOT;

  return healthWithRegen * defenseMitigation;
}

function computingMobilityFactor(runSpeedGridPerSecond: number): number {
  const baselineRun =
    DEFINING_WORLD_PLAZA_STRENGTH_BASELINE_REFERENCE.runSpeedGridPerSecond;
  const rawFactor =
    1 +
    DEFINING_WORLD_PLAZA_STRENGTH_MOBILITY_WEIGHT *
      (runSpeedGridPerSecond / baselineRun - 1);

  return Math.min(
    DEFINING_WORLD_PLAZA_STRENGTH_MOBILITY_FACTOR_MAX,
    Math.max(DEFINING_WORLD_PLAZA_STRENGTH_MOBILITY_FACTOR_MIN, rawFactor)
  );
}

function computingRawPower(
  effectiveHealth: number,
  damagePerSecond: number,
  mobilityFactor: number
): number {
  return (
    Math.sqrt(Math.max(0, effectiveHealth) * Math.max(0, damagePerSecond)) *
    mobilityFactor
  );
}

const COMPUTING_WORLD_PLAZA_STRENGTH_BASELINE_RAW_POWER = computingRawPower(
  computingEffectiveHealth(
    DEFINING_WORLD_PLAZA_STRENGTH_BASELINE_REFERENCE.maxHealth,
    DEFINING_WORLD_PLAZA_STRENGTH_BASELINE_REFERENCE.healthRegenPerSecond,
    DEFINING_WORLD_PLAZA_STRENGTH_BASELINE_REFERENCE.defense
  ),
  DEFINING_WORLD_PLAZA_STRENGTH_BASELINE_REFERENCE.attackPower *
    DEFINING_WORLD_PLAZA_STRENGTH_BASELINE_REFERENCE.attacksPerSecond,
  1
);

/** Scores one normalized profile into a comparable strength index. */
export function computingWorldPlazaStrengthIndexScore(
  profile: DefiningWorldPlazaStrengthProfile
): ComputingWorldPlazaStrengthIndexResult {
  const survivalModifier = computingModifierProduct(
    profile.modifiers,
    'survival'
  );
  const offenseModifier = computingModifierProduct(
    profile.modifiers,
    'offense'
  );
  const mobilityModifier = computingModifierProduct(
    profile.modifiers,
    'mobility'
  );
  const totalModifierFactor = computingModifierProduct(
    profile.modifiers,
    'total'
  );

  const effectiveHealth =
    computingEffectiveHealth(
      profile.maxHealth,
      profile.healthRegenPerSecond,
      profile.defense
    ) * survivalModifier;
  const damagePerSecond =
    profile.attackPower * profile.attacksPerSecond * offenseModifier;
  // Mobility modifiers scale run speed before the sway so clamps still hold.
  const mobilityFactor = computingMobilityFactor(
    profile.runSpeedGridPerSecond * mobilityModifier
  );

  const rawPower =
    computingRawPower(effectiveHealth, damagePerSecond, mobilityFactor) *
    totalModifierFactor;

  const strengthIndex = Math.round(
    (rawPower / COMPUTING_WORLD_PLAZA_STRENGTH_BASELINE_RAW_POWER) *
      DEFINING_WORLD_PLAZA_STRENGTH_BASELINE_INDEX
  );

  return {
    subjectId: profile.subjectId,
    displayName: profile.displayName,
    strengthIndex,
    breakdown: {
      effectiveHealth,
      damagePerSecond,
      mobilityFactor,
      totalModifierFactor,
      appliedModifiers: profile.modifiers,
    },
  };
}
