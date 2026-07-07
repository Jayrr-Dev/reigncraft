/**
 * Rejects flee destinations that sit on top of the animal's current tile.
 *
 * @module components/world/wildlife/domains/checkingWildlifeFleeTargetHasMeaningfulLegDistance
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { DEFINING_WILDLIFE_FLEE_MIN_LEG_DISTANCE_GRID } from '@/components/world/wildlife/domains/definingWildlifeFleeConstants';

export type CheckingWildlifeFleeTargetHasMeaningfulLegDistanceParams = {
  position: DefiningWorldPlazaWorldPoint;
  fleeTargetPoint: DefiningWorldPlazaWorldPoint;
  minLegDistanceGrid?: number;
};

/**
 * Returns true when the flee destination is far enough away to produce movement.
 */
export function checkingWildlifeFleeTargetHasMeaningfulLegDistance({
  position,
  fleeTargetPoint,
  minLegDistanceGrid = DEFINING_WILDLIFE_FLEE_MIN_LEG_DISTANCE_GRID,
}: CheckingWildlifeFleeTargetHasMeaningfulLegDistanceParams): boolean {
  return (
    Math.hypot(
      fleeTargetPoint.x - position.x,
      fleeTargetPoint.y - position.y
    ) > minLegDistanceGrid
  );
}
