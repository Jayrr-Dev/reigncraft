import type { DefiningWorldPlazaEntityDiseaseId } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import type {
  DefiningWorldPlazaEntityHealthDiseaseEffect,
  DefiningWorldPlazaEntityHealthState,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_FACTOR_INITIAL } from '@/components/world/health/domains/definingWorldPlazaEntityImmuneSystemConstants';
import type { PlazaSinglePlayerSavePlayerConditions } from '../../../../shared/plazaSinglePlayerSavesDevvit';

export type ParsingWorldPlazaPlayerConditionsResult = {
  diseaseEffects: DefiningWorldPlazaEntityHealthDiseaseEffect[];
  immuneSystemFactor: number;
  diseaseImmunityIds: DefiningWorldPlazaEntityDiseaseId[];
};

function checkingWorldPlazaPlayerConditionsHasPersistedData(
  playerConditions: PlazaSinglePlayerSavePlayerConditions
): boolean {
  return (
    playerConditions.diseaseEffects.length > 0 ||
    (playerConditions.immuneSystemFactor ?? 0) > 0 ||
    (playerConditions.diseaseImmunityIds?.length ?? 0) > 0
  );
}

/** Serializes disease and immune-system state for save-slot persistence. */
export function serializingWorldPlazaPlayerConditionsFromHealthState(
  state: DefiningWorldPlazaEntityHealthState,
  worldEpochMs: number
): PlazaSinglePlayerSavePlayerConditions | null {
  const activeDiseaseEffects = state.diseaseEffects.filter(
    (diseaseEffect) => diseaseEffect.expiresAtMs > worldEpochMs
  );
  const playerConditions: PlazaSinglePlayerSavePlayerConditions = {
    diseaseEffects: activeDiseaseEffects.map((diseaseEffect) => ({
      id: diseaseEffect.id,
      diseaseId: diseaseEffect.diseaseId,
      contractedAtMs: diseaseEffect.contractedAtMs,
      symptomsStartAtMs: diseaseEffect.symptomsStartAtMs,
      expiresAtMs: diseaseEffect.expiresAtMs,
      symptomStrengthMultiplier: diseaseEffect.symptomStrengthMultiplier,
      durationMultiplier: diseaseEffect.durationMultiplier,
      pendingGrants: diseaseEffect.pendingGrants.map((pendingGrant) => ({
        grantIndex: pendingGrant.grantIndex,
        fireAtMs: pendingGrant.fireAtMs,
      })),
    })),
    immuneSystemFactor: state.immuneSystemFactor,
    diseaseImmunityIds: [...state.diseaseImmunityIds],
  };

  if (!checkingWorldPlazaPlayerConditionsHasPersistedData(playerConditions)) {
    return null;
  }

  return playerConditions;
}

/** Parses persisted illness and immune-system state into live health fields. */
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
  };
}
