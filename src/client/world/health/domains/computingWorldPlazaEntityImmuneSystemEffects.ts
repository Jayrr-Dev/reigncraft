import {
  DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_BASE_IMMUNITY_CHANCE,
  DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_FACTOR_MAX,
  DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_MAX_CONTRACTION_REDUCTION,
  DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_MAX_DURATION_REDUCTION,
  DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_MAX_IMMUNITY_CHANCE_BONUS,
  DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_MAX_SYMPTOM_REDUCTION,
} from '@/components/world/health/domains/definingWorldPlazaEntityImmuneSystemConstants';

/** Clamps and normalizes immune system factor to 0..1. */
export function resolvingWorldPlazaEntityImmuneSystemNormalizedFactor(
  immuneSystemFactor: number
): number {
  const clampedFactor = Math.min(
    DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_FACTOR_MAX,
    Math.max(0, immuneSystemFactor)
  );

  return clampedFactor / DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_FACTOR_MAX;
}

/** Multiplier on base disease contraction chance (lower = less likely). */
export function computingWorldPlazaEntityImmuneSystemContractionChanceMultiplier(
  immuneSystemFactor: number
): number {
  const normalizedFactor =
    resolvingWorldPlazaEntityImmuneSystemNormalizedFactor(immuneSystemFactor);

  return (
    1 -
    normalizedFactor *
      DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_MAX_CONTRACTION_REDUCTION
  );
}

/** Multiplier on incubation, illness, and symptom durations (lower = shorter). */
export function computingWorldPlazaEntityImmuneSystemDurationMultiplier(
  immuneSystemFactor: number
): number {
  const normalizedFactor =
    resolvingWorldPlazaEntityImmuneSystemNormalizedFactor(immuneSystemFactor);

  return (
    1 -
    normalizedFactor *
      DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_MAX_DURATION_REDUCTION
  );
}

/** Multiplier on symptom damage and debuff strength (lower = weaker). */
export function computingWorldPlazaEntityImmuneSystemSymptomStrengthMultiplier(
  immuneSystemFactor: number
): number {
  const normalizedFactor =
    resolvingWorldPlazaEntityImmuneSystemNormalizedFactor(immuneSystemFactor);

  return (
    1 -
    normalizedFactor *
      DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_MAX_SYMPTOM_REDUCTION
  );
}

/** Chance to acquire per-disease immunity when an illness ends. */
export function computingWorldPlazaEntityImmuneSystemDiseaseImmunityChance(
  immuneSystemFactor: number
): number {
  const normalizedFactor =
    resolvingWorldPlazaEntityImmuneSystemNormalizedFactor(immuneSystemFactor);

  return (
    DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_BASE_IMMUNITY_CHANCE +
    normalizedFactor *
      DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_MAX_IMMUNITY_CHANCE_BONUS
  );
}

/** Scales a debuff multiplier toward neutral (1) based on symptom strength. */
export function computingWorldPlazaEntityImmuneSystemWeakenedDebuffMultiplier(
  baseMultiplier: number,
  symptomStrengthMultiplier: number
): number {
  return 1 - (1 - baseMultiplier) * symptomStrengthMultiplier;
}

/** Scales a timed duration by the immune-system duration multiplier. */
export function computingWorldPlazaEntityImmuneSystemScaledDurationMs(
  durationMs: number,
  durationMultiplier: number
): number {
  return Math.max(0, Math.round(durationMs * durationMultiplier));
}
