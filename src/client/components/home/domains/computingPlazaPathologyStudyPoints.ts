/**
 * Pathology study-point math from linked creature Bestiary studies.
 *
 * Formula (deterministic): `floor(linkedCreatureStudies / 3)`.
 * Each Bestiary Study point awarded on a species that can cause disease X
 * increments that disease's linkedCreatureStudies by the same amount (large
 * animals may award 1–3 per corpse). Every three linked points become one
 * Pathology study point used for tier unlocks.
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
