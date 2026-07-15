import {
  clearingWorldPlazaEntityDiseaseScopedGrantEffects,
  clearingWorldPlazaEntityOrphanedDiseaseScopedGrantEffects,
} from '@/components/world/health/domains/clearingWorldPlazaEntityDiseaseScopedGrantEffects';
import {
  DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SEVERITY_SORT_ORDER,
  resolvingWorldPlazaEntityDiseaseDescriptor,
  type DefiningWorldPlazaEntityDiseaseSeverity,
} from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/** Removes active disease instances at or below a given registered severity. */
export function clearingWorldPlazaEntityDiseaseEffectsByMaxSeverity(
  state: DefiningWorldPlazaEntityHealthState,
  maxSeverity: DefiningWorldPlazaEntityDiseaseSeverity
): DefiningWorldPlazaEntityHealthState {
  const maxSortOrder =
    DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SEVERITY_SORT_ORDER[maxSeverity];
  const effectsToClear = state.diseaseEffects.filter(
    (diseaseEffect) =>
      DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SEVERITY_SORT_ORDER[
        resolvingWorldPlazaEntityDiseaseDescriptor(diseaseEffect.diseaseId).severity
      ] <= maxSortOrder
  );

  let nextState: DefiningWorldPlazaEntityHealthState = {
    ...state,
    diseaseEffects: state.diseaseEffects.filter(
      (diseaseEffect) => !effectsToClear.includes(diseaseEffect)
    ),
  };

  for (const diseaseEffect of effectsToClear) {
    nextState = clearingWorldPlazaEntityDiseaseScopedGrantEffects(
      nextState,
      diseaseEffect.id
    );
  }

  return clearingWorldPlazaEntityOrphanedDiseaseScopedGrantEffects(nextState);
}
