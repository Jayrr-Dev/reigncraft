/**
 * Spatial query radius for wildlife behavior neighbor lookups.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeBehaviorNeighborQueryRadiusGrid
 */

import { DEFINING_WILDLIFE_PREY_HUNT_RADIUS_GRID } from '@/components/world/wildlife/domains/definingWildlifeHuntConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { resolvingWildlifePreyProximityAttackRadiusGrid } from '@/components/world/wildlife/domains/resolvingWildlifePreyProximityAttackRadiusGrid';
import { resolvingWildlifeSpeciesAggroRadiusGrid } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesAggroRadiusGrid';

/**
 * Returns the radius used when querying nearby wildlife for AI blackboards.
 */
export function resolvingWildlifeBehaviorNeighborQueryRadiusGrid(
  species: DefiningWildlifeSpeciesDefinition
): number {
  const territoryWarnRadius = species.territory?.warnRadiusGrid ?? 0;

  return Math.max(
    DEFINING_WILDLIFE_PREY_HUNT_RADIUS_GRID,
    resolvingWildlifePreyProximityAttackRadiusGrid(species),
    resolvingWildlifeSpeciesAggroRadiusGrid(species),
    territoryWarnRadius
  );
}
