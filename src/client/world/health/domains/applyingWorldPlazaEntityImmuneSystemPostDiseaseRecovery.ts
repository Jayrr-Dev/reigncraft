import { checkingWorldPlazaEntityIsImmuneToDisease } from '@/components/world/health/domains/checkingWorldPlazaEntityImmuneSystem';
import { computingWorldPlazaEntityImmuneSystemDiseaseImmunityChance } from '@/components/world/health/domains/computingWorldPlazaEntityImmuneSystemEffects';
import type { DefiningWorldPlazaEntityDiseaseId } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import {
  DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_FACTOR_BOOST_ON_CLEAR,
  DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_FACTOR_BOOST_ON_IMMUNITY,
  DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_FACTOR_MAX,
} from '@/components/world/health/domains/definingWorldPlazaEntityImmuneSystemConstants';

function clampingWorldPlazaEntityImmuneSystemFactor(
  immuneSystemFactor: number
): number {
  return Math.min(
    DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_FACTOR_MAX,
    Math.max(0, immuneSystemFactor)
  );
}

export type ApplyingWorldPlazaEntityImmuneSystemPostDiseaseRecoveryResult = {
  state: DefiningWorldPlazaEntityHealthState;
  didAcquireDiseaseImmunity: boolean;
};

/**
 * Boosts immune system factor and optionally grants per-disease immunity
 * when one illness run ends.
 */
export function applyingWorldPlazaEntityImmuneSystemPostDiseaseRecovery(
  state: DefiningWorldPlazaEntityHealthState,
  diseaseId: DefiningWorldPlazaEntityDiseaseId,
  random: () => number = Math.random
): ApplyingWorldPlazaEntityImmuneSystemPostDiseaseRecoveryResult {
  let nextFactor =
    state.immuneSystemFactor +
    DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_FACTOR_BOOST_ON_CLEAR;

  if (checkingWorldPlazaEntityIsImmuneToDisease(state, diseaseId)) {
    return {
      state: {
        ...state,
        immuneSystemFactor:
          clampingWorldPlazaEntityImmuneSystemFactor(nextFactor),
      },
      didAcquireDiseaseImmunity: false,
    };
  }

  const immunityChance =
    computingWorldPlazaEntityImmuneSystemDiseaseImmunityChance(
      state.immuneSystemFactor
    );
  const didAcquireDiseaseImmunity = random() < immunityChance;

  if (didAcquireDiseaseImmunity) {
    nextFactor +=
      DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_FACTOR_BOOST_ON_IMMUNITY;

    return {
      state: {
        ...state,
        immuneSystemFactor:
          clampingWorldPlazaEntityImmuneSystemFactor(nextFactor),
        diseaseImmunityIds: [...state.diseaseImmunityIds, diseaseId],
      },
      didAcquireDiseaseImmunity: true,
    };
  }

  return {
    state: {
      ...state,
      immuneSystemFactor:
        clampingWorldPlazaEntityImmuneSystemFactor(nextFactor),
    },
    didAcquireDiseaseImmunity: false,
  };
}
