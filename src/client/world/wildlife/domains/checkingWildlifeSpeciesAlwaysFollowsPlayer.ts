/**
 * True when a species permanently trails the local player.
 *
 * @module components/world/wildlife/domains/checkingWildlifeSpeciesAlwaysFollowsPlayer
 */

import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';

export function checkingWildlifeSpeciesAlwaysFollowsPlayer(
  species: Pick<DefiningWildlifeSpeciesDefinition, 'alwaysFollowsPlayer'>
): boolean {
  return species.alwaysFollowsPlayer === true;
}
