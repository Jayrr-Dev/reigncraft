/**
 * Picks one bounded random-walk destination for a calm wander leg.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeWanderTargetPoint
 */

import { computingBoundedRandomWalk2dPathFromSeed } from '@/lib/probability/computingBoundedRandomWalk';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WILDLIFE_WANDER_SALT,
  DEFINING_WILDLIFE_WANDER_STEP_COUNT,
} from '@/components/world/wildlife/domains/definingWildlifeWanderConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { resolvingWildlifeWanderRoamArea } from '@/components/world/wildlife/domains/resolvingWildlifeWanderRoamArea';

export type ResolvingWildlifeWanderTargetPointParams = {
  readonly position: DefiningWorldPlazaWorldPoint;
  readonly roamAnchor: DefiningWorldPlazaWorldPoint;
  readonly species: DefiningWildlifeSpeciesDefinition;
  readonly timeBucket: number;
};

/**
 * Returns the end point of a seeded bounded random walk from the current
 * position, clamped to the species roam area.
 */
export function resolvingWildlifeWanderTargetPoint({
  position,
  roamAnchor,
  species,
  timeBucket,
}: ResolvingWildlifeWanderTargetPointParams): DefiningWorldPlazaWorldPoint {
  const area = resolvingWildlifeWanderRoamArea(roamAnchor, species);
  const path = computingBoundedRandomWalk2dPathFromSeed({
    seed: DEFINING_WILDLIFE_WANDER_SALT + timeBucket,
    start: position,
    stepCount: DEFINING_WILDLIFE_WANDER_STEP_COUNT,
    area,
    boundaryMode: 'rejectStep',
  });
  const destination = path[path.length - 1];

  return {
    x: destination.x,
    y: destination.y,
    layer: roamAnchor.layer,
  };
}
