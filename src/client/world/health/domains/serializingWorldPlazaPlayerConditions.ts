import type { DefiningWorldPlazaEntityDiseaseId } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import type {
  DefiningWorldPlazaEntityHealthDiseaseEffect,
  DefiningWorldPlazaEntityHealthState,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_FACTOR_INITIAL } from '@/components/world/health/domains/definingWorldPlazaEntityImmuneSystemConstants';
import { DEFINING_WORLD_PLAZA_HUNGER_INITIAL_RATIO } from '@/components/world/hunger/domains/definingWorldPlazaHungerConstants';
import type { PlazaSinglePlayerSavePlayerConditions } from '../../../../shared/plazaSinglePlayerSavesDevvit';

export type ParsingWorldPlazaPlayerConditionsResult = {
  diseaseEffects: DefiningWorldPlazaEntityHealthDiseaseEffect[];
  immuneSystemFactor: number;
  diseaseImmunityIds: DefiningWorldPlazaEntityDiseaseId[];
  currentHealth: number | null;
  hungerRatio: number | null;
};

function checkingWorldPlazaPlayerConditionsHasPersistedData(
  playerConditions: PlazaSinglePlayerSavePlayerConditions
): boolean {
  return (
    playerConditions.diseaseEffects.length > 0 ||
    (playerConditions.immuneSystemFactor ?? 0) > 0 ||
    (playerConditions.diseaseImmunityIds?.length ?? 0) > 0 ||
    typeof playerConditions.currentHealth === 'number' ||
    typeof playerConditions.hungerRatio === 'number'
  );
}

export type SerializingWorldPlazaPlayerConditionsParams = {
  state: DefiningWorldPlazaEntityHealthState;
  worldEpochMs: number;
  hungerRatio: number;
};

/** Serializes disease, immune-system, HP, and hunger state for save-slot persistence. */
export function serializingWorldPlazaPlayerConditionsFromHealthState({
  state,
  worldEpochMs,
  hungerRatio,
}: SerializingWorldPlazaPlayerConditionsParams): PlazaSinglePlayerSavePlayerConditions | null {
  const activeDiseaseEffects = state.diseaseEffects.filter(
    (diseaseEffect) => diseaseEffect.expiresAtMs > worldEpochMs
  );
  const clampedHungerRatio = Math.min(1, Math.max(0, hungerRatio));
  const playerConditions: PlazaSinglePlayerSavePlayerConditions = {
    diseaseEffects: activeDiseaseEffects.map((diseaseEffect) => ({
      id: diseaseEffect.id,
      diseaseId: diseaseEffect.diseaseId,
      contractedAtMs: diseaseEffect.contractedAtMs,
      symptomsStartAtMs: diseaseEffect.symptomsStartAtMs,
      expiresAtMs: diseaseEffect.expiresAtMs,
      symptomStrengthMultiplier: diseaseEffect.symptomStrengthMultiplier,
      durationMultiplier: diseaseEffect.durationMultiplier,
      pathologyStudyHoursCredited: diseaseEffect.pathologyStudyHoursCredited,
      pendingGrants: diseaseEffect.pendingGrants.map((pendingGrant) => ({
        grantIndex: pendingGrant.grantIndex,
        fireAtMs: pendingGrant.fireAtMs,
      })),
    })),
    immuneSystemFactor: state.immuneSystemFactor,
    diseaseImmunityIds: [...state.diseaseImmunityIds],
    currentHealth: Math.max(0, state.currentHealth),
    hungerRatio: clampedHungerRatio,
  };

  if (!checkingWorldPlazaPlayerConditionsHasPersistedData(playerConditions)) {
    return null;
  }

  return playerConditions;
}

function parsingPersistedFiniteRatio(
  value: unknown,
  min: number,
  max: number
): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null;
  }

  return Math.min(max, Math.max(min, value));
}

/** Parses persisted illness, vitals, and immune-system state into live fields. */
export function parsingWorldPlazaPlayerConditions(
  playerConditions: PlazaSinglePlayerSavePlayerConditions | null,
  worldEpochMs: number
): ParsingWorldPlazaPlayerConditionsResult {
  if (!playerConditions) {
    return {
      diseaseEffects: [],
      immuneSystemFactor:
        DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_FACTOR_INITIAL,
      diseaseImmunityIds: [],
      currentHealth: null,
      hungerRatio: null,
    };
  }

  const diseaseEffects = playerConditions.diseaseEffects
    .filter((diseaseEffect) => diseaseEffect.expiresAtMs > worldEpochMs)
    .map((diseaseEffect) => ({
      id: diseaseEffect.id,
      diseaseId: diseaseEffect.diseaseId,
      contractedAtMs: diseaseEffect.contractedAtMs,
      symptomsStartAtMs: diseaseEffect.symptomsStartAtMs,
      expiresAtMs: diseaseEffect.expiresAtMs,
      symptomStrengthMultiplier: diseaseEffect.symptomStrengthMultiplier ?? 1,
      durationMultiplier: diseaseEffect.durationMultiplier ?? 1,
      pathologyStudyHoursCredited:
        diseaseEffect.pathologyStudyHoursCredited ?? 0,
      pendingGrants: diseaseEffect.pendingGrants.map((pendingGrant) => ({
        grantIndex: pendingGrant.grantIndex,
        fireAtMs: pendingGrant.fireAtMs,
      })),
    }));

  const diseaseImmunityIds = (playerConditions.diseaseImmunityIds ?? []).filter(
    (diseaseId): diseaseId is DefiningWorldPlazaEntityDiseaseId =>
      typeof diseaseId === 'string'
  );

  return {
    diseaseEffects,
    immuneSystemFactor:
      playerConditions.immuneSystemFactor ??
      DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_FACTOR_INITIAL,
    diseaseImmunityIds,
    currentHealth: parsingPersistedFiniteRatio(
      playerConditions.currentHealth,
      0,
      Number.POSITIVE_INFINITY
    ),
    hungerRatio: parsingPersistedFiniteRatio(
      playerConditions.hungerRatio,
      0,
      DEFINING_WORLD_PLAZA_HUNGER_INITIAL_RATIO
    ),
  };
}
