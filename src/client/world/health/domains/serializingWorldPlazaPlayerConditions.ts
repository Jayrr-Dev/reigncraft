import type { DefiningWorldPlazaEntityHealthDiseaseEffect } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { PlazaSinglePlayerSavePlayerConditions } from '../../../../shared/plazaSinglePlayerSavesDevvit';

/** Serializes active disease effects for save-slot persistence. */
export function serializingWorldPlazaPlayerConditionsFromDiseaseEffects(
  diseaseEffects: readonly DefiningWorldPlazaEntityHealthDiseaseEffect[],
  worldEpochMs: number
): PlazaSinglePlayerSavePlayerConditions | null {
  const activeDiseaseEffects = diseaseEffects.filter(
    (diseaseEffect) => diseaseEffect.expiresAtMs > worldEpochMs
  );

  if (activeDiseaseEffects.length === 0) {
    return null;
  }

  return {
    diseaseEffects: activeDiseaseEffects.map((diseaseEffect) => ({
      id: diseaseEffect.id,
      diseaseId: diseaseEffect.diseaseId,
      contractedAtMs: diseaseEffect.contractedAtMs,
      symptomsStartAtMs: diseaseEffect.symptomsStartAtMs,
      expiresAtMs: diseaseEffect.expiresAtMs,
      pendingGrants: diseaseEffect.pendingGrants.map((pendingGrant) => ({
        grantIndex: pendingGrant.grantIndex,
        fireAtMs: pendingGrant.fireAtMs,
      })),
    })),
  };
}

/** Parses persisted illness state into live disease scheduler entries. */
export function parsingWorldPlazaPlayerConditionsDiseaseEffects(
  playerConditions: PlazaSinglePlayerSavePlayerConditions | null,
  worldEpochMs: number
): DefiningWorldPlazaEntityHealthDiseaseEffect[] {
  if (!playerConditions) {
    return [];
  }

  return playerConditions.diseaseEffects
    .filter((diseaseEffect) => diseaseEffect.expiresAtMs > worldEpochMs)
    .map((diseaseEffect) => ({
      id: diseaseEffect.id,
      diseaseId: diseaseEffect.diseaseId,
      contractedAtMs: diseaseEffect.contractedAtMs,
      symptomsStartAtMs: diseaseEffect.symptomsStartAtMs,
      expiresAtMs: diseaseEffect.expiresAtMs,
      pendingGrants: diseaseEffect.pendingGrants.map((pendingGrant) => ({
        grantIndex: pendingGrant.grantIndex,
        fireAtMs: pendingGrant.fireAtMs,
      })),
    }));
}
