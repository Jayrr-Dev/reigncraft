import {
  DEFINING_WILDLIFE_CORPSE_STUDY_DURATION_MAX_MS,
  DEFINING_WILDLIFE_CORPSE_STUDY_DURATION_MIN_MS,
  DEFINING_WILDLIFE_CORPSE_STUDY_MASS_MAX_KG,
  DEFINING_WILDLIFE_CORPSE_STUDY_MASS_MIN_KG,
} from '@/components/world/wildlife/domains/definingWildlifeCorpseStudyConstants';

/**
 * Maps species mass to a 3–10s study channel duration.
 */
export function computingWildlifeCorpseStudyDurationMs(massKg: number): number {
  const clampedMass = Math.min(
    DEFINING_WILDLIFE_CORPSE_STUDY_MASS_MAX_KG,
    Math.max(DEFINING_WILDLIFE_CORPSE_STUDY_MASS_MIN_KG, massKg)
  );
  const massSpan =
    DEFINING_WILDLIFE_CORPSE_STUDY_MASS_MAX_KG -
    DEFINING_WILDLIFE_CORPSE_STUDY_MASS_MIN_KG;
  const t =
    (clampedMass - DEFINING_WILDLIFE_CORPSE_STUDY_MASS_MIN_KG) / massSpan;
  const durationSpan =
    DEFINING_WILDLIFE_CORPSE_STUDY_DURATION_MAX_MS -
    DEFINING_WILDLIFE_CORPSE_STUDY_DURATION_MIN_MS;

  return Math.round(
    DEFINING_WILDLIFE_CORPSE_STUDY_DURATION_MIN_MS + t * durationSpan
  );
}
