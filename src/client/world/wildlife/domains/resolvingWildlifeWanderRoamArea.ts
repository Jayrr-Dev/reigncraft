/**
 * Resolves the roam bounds for one species wander leg.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeWanderRoamArea
 */

import type { DefiningRandomWalkArea } from '@/lib/probability/definingRandomWalkArea';
import {
  definingRandomWalkCircleAreaFromCenter,
  definingRandomWalkRectAreaFromCenter,
} from '@/lib/probability/definingRandomWalkArea';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WILDLIFE_WANDER_FALLBACK_HALF_EXTENT_GRID,
} from '@/components/world/wildlife/domains/definingWildlifeWanderConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';

/**
 * Territorial species roam inside a circle anchored at spawn.
 * Others keep the legacy ±3 grid envelope.
 */
export function resolvingWildlifeWanderRoamArea(
  roamAnchor: DefiningWorldPlazaWorldPoint,
  species: DefiningWildlifeSpeciesDefinition
): DefiningRandomWalkArea {
  if (species.territory) {
    return definingRandomWalkCircleAreaFromCenter(
      roamAnchor,
      species.territory.anchorRadiusGrid
    );
  }

  return definingRandomWalkRectAreaFromCenter(
    roamAnchor,
    DEFINING_WILDLIFE_WANDER_FALLBACK_HALF_EXTENT_GRID,
    DEFINING_WILDLIFE_WANDER_FALLBACK_HALF_EXTENT_GRID
  );
}
