import {
  DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_BASE_IMMUNITY_CHANCE,
  DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_FACTOR_BOOST_ON_CLEAR,
  DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_FACTOR_BOOST_ON_IMMUNITY,
  DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_FACTOR_MAX,
  DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_MAX_CONTRACTION_REDUCTION,
  DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_MAX_DURATION_REDUCTION,
  DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_MAX_IMMUNITY_CHANCE_BONUS,
  DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_MAX_SYMPTOM_REDUCTION,
} from '@/components/world/health/domains/definingWorldPlazaEntityImmuneSystemConstants';

export type PlazaMechanicsImmuneSystemGuideStats = {
  factorRangeLabel: string;
  maxContractionReductionPercent: number;
  maxDurationReductionPercent: number;
  maxSymptomReductionPercent: number;
  minImmunityChancePercent: number;
  maxImmunityChancePercent: number;
  factorBoostOnClear: number;
  factorBoostOnImmunity: number;
};

/** Numeric immune-system tuning for mechanics copy. */
export function resolvingPlazaMechanicsImmuneSystemGuideStats(): PlazaMechanicsImmuneSystemGuideStats {
  return {
    factorRangeLabel: `0-${DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_FACTOR_MAX}`,
    maxContractionReductionPercent: Math.round(
      DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_MAX_CONTRACTION_REDUCTION * 100
    ),
    maxDurationReductionPercent: Math.round(
      DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_MAX_DURATION_REDUCTION * 100
    ),
    maxSymptomReductionPercent: Math.round(
      DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_MAX_SYMPTOM_REDUCTION * 100
    ),
    minImmunityChancePercent: Math.round(
      DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_BASE_IMMUNITY_CHANCE * 100
    ),
    maxImmunityChancePercent: Math.round(
      (DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_BASE_IMMUNITY_CHANCE +
        DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_MAX_IMMUNITY_CHANCE_BONUS) *
        100
    ),
    factorBoostOnClear:
      DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_FACTOR_BOOST_ON_CLEAR,
    factorBoostOnImmunity:
      DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_FACTOR_BOOST_ON_IMMUNITY,
  };
}

/** Full mechanics-guide paragraph for the immune system. */
export function resolvingPlazaMechanicsImmuneSystemGuideDescription(): string {
  const stats = resolvingPlazaMechanicsImmuneSystemGuideStats();

  return `Your immune system factor (${stats.factorRangeLabel}) grows when you survive meat diseases. Higher factor means lower infection odds (up to ${stats.maxContractionReductionPercent}% less likely at max), shorter incubation and illness timers (up to ${stats.maxDurationReductionPercent}% shorter), and weaker symptoms (up to ${stats.maxSymptomReductionPercent}% less poison, bleed, confusion, and movement debuffs). When a disease ends you always gain +${stats.factorBoostOnClear} factor, then roll for permanent immunity to that specific disease (${stats.minImmunityChancePercent}% to ${stats.maxImmunityChancePercent}% chance based on factor). A successful immunity roll adds +${stats.factorBoostOnImmunity} factor and blocks that disease forever. Immune progress saves with your character.`;
}
