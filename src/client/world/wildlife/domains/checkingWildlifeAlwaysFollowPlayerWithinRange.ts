/**
 * True when an always-follow companion is still within its player leash.
 *
 * @module components/world/wildlife/domains/checkingWildlifeAlwaysFollowPlayerWithinRange
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWildlifeSpeciesAlwaysFollowsPlayer } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesAlwaysFollowsPlayer';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';

export function checkingWildlifeAlwaysFollowPlayerWithinRange(
  species: Pick<
    DefiningWildlifeSpeciesDefinition,
    'alwaysFollowsPlayer' | 'alwaysFollowMaxDistanceGrid'
  >,
  instancePosition: Pick<DefiningWorldPlazaWorldPoint, 'x' | 'y'>,
  playerPosition: Pick<DefiningWorldPlazaWorldPoint, 'x' | 'y'> | null
): boolean {
  if (!checkingWildlifeSpeciesAlwaysFollowsPlayer(species)) {
    return false;
  }

  if (!playerPosition) {
    return false;
  }

  const maxDistanceGrid = species.alwaysFollowMaxDistanceGrid;

  if (maxDistanceGrid == null) {
    return true;
  }

  const distanceGrid = Math.hypot(
    instancePosition.x - playerPosition.x,
    instancePosition.y - playerPosition.y
  );

  return distanceGrid <= maxDistanceGrid;
}
