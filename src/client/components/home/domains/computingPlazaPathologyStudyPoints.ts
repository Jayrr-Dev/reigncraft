/**
 * Pathology study-point math.
 *
 * Sources (additive):
 * 1. Linked creature Bestiary studies: `floor(linkedCreatureStudies / 3)`.
 * 2. Infection hours: 1 Pathology point per completed in-game hour while
 *    carrying that disease (see computingWorldPlazaPathologyInfectionStudyHours).
 *
 * @module components/home/domains/computingPlazaPathologyStudyPoints
 */

/** Creature Study points required per one Pathology study point. */
export const DEFINING_PLAZA_PATHOLOGY_CREATURE_STUDIES_PER_POINT = 3 as const;

/**
 * Converts linked creature Study totals into Pathology study points.
 *
 * @param linkedCreatureStudies - Sum of Bestiary study points from carrier species.
 */
export function computingPlazaPathologyStudyPoints(
  linkedCreatureStudies: number
): number {
  const normalized = Math.max(0, Math.floor(linkedCreatureStudies));

  return Math.floor(
    normalized / DEFINING_PLAZA_PATHOLOGY_CREATURE_STUDIES_PER_POINT
  );
}

/**
 * Total Pathology study points from creature studies plus infection hours.
 *
 * @param linkedCreatureStudies - Sum of Bestiary study points from carriers.
 * @param infectionStudyPoints - Points earned while infected with the disease.
 */
export function computingPlazaPathologyTotalStudyPoints(
  linkedCreatureStudies: number,
  infectionStudyPoints = 0
): number {
  return (
    computingPlazaPathologyStudyPoints(linkedCreatureStudies) +
    Math.max(0, Math.floor(infectionStudyPoints))
  );
}
