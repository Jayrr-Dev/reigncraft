/**
 * Spatial query radius for wildlife behavior neighbor lookups.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeBehaviorNeighborQueryRadiusGrid
 */

import { resolvingWildlifeSpeciesTerritoryConfig } from '@/components/world/wildlife/domains/checkingWildlifeTerritoryIntrusion';
import { DEFINING_WILDLIFE_PREY_HUNT_RADIUS_GRID } from '@/components/world/wildlife/domains/definingWildlifeHuntConstants';
import { DEFINING_WILDLIFE_SEPARATION_ANXIETY_SEARCH_RADIUS_GRID } from '@/components/world/wildlife/domains/definingWildlifeSeparationAnxietyConstants';
import { DEFINING_WILDLIFE_SOCIAL_HUNTER_SEARCH_RADIUS_GRID } from '@/components/world/wildlife/domains/definingWildlifeSocialHunterConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { DEFINING_WILDLIFE_STALK_PACK_JOIN_RADIUS_GRID } from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';
import type { DefiningWildlifeAggressionLevel } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifePreyProximityAttackRadiusGrid } from '@/components/world/wildlife/domains/resolvingWildlifePreyProximityAttackRadiusGrid';
import { resolvingWildlifeSpeciesAggroRadiusGrid } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesAggroRadiusGrid';

/**
 * Returns the radius used when querying nearby wildlife for AI blackboards.
 */
export function resolvingWildlifeBehaviorNeighborQueryRadiusGrid(
  species: DefiningWildlifeSpeciesDefinition,
  aggressionLevel?: DefiningWildlifeAggressionLevel
): number {
  const territoryWarnRadius =
    resolvingWildlifeSpeciesTerritoryConfig(species, aggressionLevel)
      ?.warnRadiusGrid ?? 0;

  return Math.max(
    DEFINING_WILDLIFE_PREY_HUNT_RADIUS_GRID,
    DEFINING_WILDLIFE_SEPARATION_ANXIETY_SEARCH_RADIUS_GRID,
    DEFINING_WILDLIFE_STALK_PACK_JOIN_RADIUS_GRID,
    DEFINING_WILDLIFE_SOCIAL_HUNTER_SEARCH_RADIUS_GRID,
    resolvingWildlifePreyProximityAttackRadiusGrid(species),
    resolvingWildlifeSpeciesAggroRadiusGrid(species),
    territoryWarnRadius
  );
}
