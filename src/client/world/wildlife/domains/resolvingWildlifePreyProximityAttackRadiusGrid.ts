/**
 * Species-aware prey proximity engagement radius.
 *
 * @module components/world/wildlife/domains/resolvingWildlifePreyProximityAttackRadiusGrid
 */

import { DEFINING_WILDLIFE_PREY_PROXIMITY_ATTACK_RADIUS_GRID } from '@/components/world/wildlife/domains/definingWildlifeHuntConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';

/**
 * Returns the grid distance at which predators immediately engage prey.
 * Uses the larger of the global floor and the species on-sight aggro radius.
 */
export function resolvingWildlifePreyProximityAttackRadiusGrid(
  species: DefiningWildlifeSpeciesDefinition
): number {
  return Math.max(
    DEFINING_WILDLIFE_PREY_PROXIMITY_ATTACK_RADIUS_GRID,
    species.aggro.aggroRadiusGrid
  );
}
