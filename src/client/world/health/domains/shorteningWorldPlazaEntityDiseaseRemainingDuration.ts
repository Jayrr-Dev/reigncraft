import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { resolvingWorldPlazaEntityDiseaseWorldEpochMs } from '@/components/world/health/domains/resolvingWorldPlazaEntityDiseaseWorldEpochMs';

const DEFINING_WORLD_PLAZA_DISEASE_SHORTEN_REMAINING_FACTOR = 0.6;

/**
 * Cuts remaining disease time by 40% (symptoms and expiry).
 */
export function shorteningWorldPlazaEntityDiseaseRemainingDuration(
  state: DefiningWorldPlazaEntityHealthState,
  worldEpochMs: number = resolvingWorldPlazaEntityDiseaseWorldEpochMs()
): DefiningWorldPlazaEntityHealthState {
  if (state.diseaseEffects.length === 0) {
    return state;
  }

  return {
    ...state,
    diseaseEffects: state.diseaseEffects.map((effect) => {
      if (effect.expiresAtMs <= worldEpochMs) {
        return effect;
      }

      const remainingMs = effect.expiresAtMs - worldEpochMs;
      const shortenedRemainingMs =
        remainingMs * DEFINING_WORLD_PLAZA_DISEASE_SHORTEN_REMAINING_FACTOR;
      const nextExpiresAtMs = worldEpochMs + shortenedRemainingMs;
      const symptomsRemainingMs = Math.max(
        0,
        effect.symptomsStartAtMs - worldEpochMs
      );
      const nextSymptomsStartAtMs =
        symptomsRemainingMs > 0
          ? worldEpochMs +
            symptomsRemainingMs *
              DEFINING_WORLD_PLAZA_DISEASE_SHORTEN_REMAINING_FACTOR
          : effect.symptomsStartAtMs;

      return {
        ...effect,
        symptomsStartAtMs: nextSymptomsStartAtMs,
        expiresAtMs: nextExpiresAtMs,
      };
    }),
  };
}
