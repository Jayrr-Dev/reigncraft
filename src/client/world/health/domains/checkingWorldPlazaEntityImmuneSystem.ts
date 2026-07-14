import { computingWorldPlazaEntityImmuneSystemContractionChanceMultiplier } from '@/components/world/health/domains/computingWorldPlazaEntityImmuneSystemEffects';
import type { DefiningWorldPlazaEntityDiseaseId } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { resolvingWorldPlazaEntityHealthDiseaseContractionTimedMultiplier } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthEffectiveTemperatureResistance';

/** Whether the player has acquired immunity to one disease id. */
export function checkingWorldPlazaEntityIsImmuneToDisease(
  state: DefiningWorldPlazaEntityHealthState,
  diseaseId: DefiningWorldPlazaEntityDiseaseId
): boolean {
  return state.diseaseImmunityIds.includes(diseaseId);
}

/** Whether the player already has an active instance of this disease. */
export function checkingWorldPlazaEntityHasActiveDiseaseId(
  state: DefiningWorldPlazaEntityHealthState,
  diseaseId: DefiningWorldPlazaEntityDiseaseId,
  worldEpochMs: number
): boolean {
  return state.diseaseEffects.some(
    (diseaseEffect) =>
      diseaseEffect.diseaseId === diseaseId &&
      diseaseEffect.expiresAtMs > worldEpochMs
  );
}

/** Whether a new disease infection may be applied. */
export function checkingWorldPlazaEntityCanContractDisease(
  state: DefiningWorldPlazaEntityHealthState,
  diseaseId: DefiningWorldPlazaEntityDiseaseId,
  worldEpochMs: number
): boolean {
  if (checkingWorldPlazaEntityIsImmuneToDisease(state, diseaseId)) {
    return false;
  }

  return !checkingWorldPlazaEntityHasActiveDiseaseId(
    state,
    diseaseId,
    worldEpochMs
  );
}

/** Scales a base meat disease chance by the player's immune system factor. */
export function resolvingWorldPlazaEntityDiseaseContractionChance(
  state: DefiningWorldPlazaEntityHealthState,
  baseChance: number
): number {
  const multiplier =
    computingWorldPlazaEntityImmuneSystemContractionChanceMultiplier(
      state.immuneSystemFactor
    ) *
    resolvingWorldPlazaEntityHealthDiseaseContractionTimedMultiplier(
      state,
      Date.now()
    );

  return Math.min(1, Math.max(0, baseChance * multiplier));
}
