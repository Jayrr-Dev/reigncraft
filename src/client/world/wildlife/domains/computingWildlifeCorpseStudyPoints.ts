import {
  DEFINING_WILDLIFE_CORPSE_STUDY_MASS_MAX_KG,
  DEFINING_WILDLIFE_CORPSE_STUDY_MASS_MIN_KG,
  DEFINING_WILDLIFE_CORPSE_STUDY_POINTS_MAX,
  DEFINING_WILDLIFE_CORPSE_STUDY_POINTS_MIN,
} from '@/components/world/wildlife/domains/definingWildlifeCorpseStudyConstants';

/**
 * Maps species mass to study points awarded for one completed corpse Study (1–3).
 */
export function computingWildlifeCorpseStudyPoints(massKg: number): number {
  const clampedMass = Math.min(
    DEFINING_WILDLIFE_CORPSE_STUDY_MASS_MAX_KG,
    Math.max(DEFINING_WILDLIFE_CORPSE_STUDY_MASS_MIN_KG, massKg)
  );
  const massSpan =
    DEFINING_WILDLIFE_CORPSE_STUDY_MASS_MAX_KG -
    DEFINING_WILDLIFE_CORPSE_STUDY_MASS_MIN_KG;
  const t =
    (clampedMass - DEFINING_WILDLIFE_CORPSE_STUDY_MASS_MIN_KG) / massSpan;
  const pointsSpan =
    DEFINING_WILDLIFE_CORPSE_STUDY_POINTS_MAX -
    DEFINING_WILDLIFE_CORPSE_STUDY_POINTS_MIN;

  return Math.round(DEFINING_WILDLIFE_CORPSE_STUDY_POINTS_MIN + t * pointsSpan);
}
