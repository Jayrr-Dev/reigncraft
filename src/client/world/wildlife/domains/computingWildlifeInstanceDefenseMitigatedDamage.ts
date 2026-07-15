/**
 * Applies flat Defense mitigation to incoming wildlife physical damage.
 *
 * @module components/world/wildlife/domains/computingWildlifeInstanceDefenseMitigatedDamage
 */

import { DEFINING_WORLD_PLAZA_STRENGTH_DEFENSE_PIVOT } from '@/components/world/strength/domains/definingWorldPlazaStrengthIndexConstants';

/** Softens raw physical damage using the same pivot as strength-index Defense. */
export function computingWildlifeInstanceDefenseMitigatedDamage(
  rawAmount: number,
  effectiveDefense: number
): number {
  if (rawAmount <= 0 || effectiveDefense <= 0) {
    return rawAmount;
  }

  return (
    rawAmount /
    (1 + effectiveDefense / DEFINING_WORLD_PLAZA_STRENGTH_DEFENSE_PIVOT)
  );
}
