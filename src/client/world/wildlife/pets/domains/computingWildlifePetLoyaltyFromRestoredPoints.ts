/**
 * Converts restored study-style loyalty points into the pet loyalty scale.
 *
 * @module components/world/wildlife/pets/domains/computingWildlifePetLoyaltyFromRestoredPoints
 */

/** Maps restored point totals onto 0..1000 via square root. */
export function computingWildlifePetLoyaltyFromRestoredPoints(
  restoredPoints: number
): number {
  if (restoredPoints <= 0) {
    return 0;
  }

  return Math.round(Math.sqrt(restoredPoints));
}
