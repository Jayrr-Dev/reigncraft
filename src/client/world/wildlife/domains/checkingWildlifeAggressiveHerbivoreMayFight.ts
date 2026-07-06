/**
 * Whether an aggressive-spawn herbivore should retaliate instead of fleeing.
 *
 * @module components/world/wildlife/domains/checkingWildlifeAggressiveHerbivoreMayFight
 */

import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Returns true when a herbivore with an aggressive spawn roll is fighting back. */
export function checkingWildlifeAggressiveHerbivoreMayFight(
  species: DefiningWildlifeSpeciesDefinition,
  instance: DefiningWildlifeInstance
): boolean {
  if (instance.aggressionLevel !== 'aggressive') {
    return false;
  }

  if (species.diet !== 'herbivore') {
    return false;
  }

  return instance.aggroState.activeTargetId !== null;
}
