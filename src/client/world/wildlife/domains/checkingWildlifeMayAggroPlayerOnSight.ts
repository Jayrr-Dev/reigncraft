/**
 * Whether a spawned animal may treat the player as an on-sight combat target.
 *
 * @module components/world/wildlife/domains/checkingWildlifeMayAggroPlayerOnSight
 */

import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type {
  DefiningWildlifeAggressionLevel,
  DefiningWildlifeHungerDriveLevel,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeAggressionLevelProfile } from '@/components/world/wildlife/domains/resolvingWildlifeAggressionLevelFromAnchor';

/**
 * Returns true when this animal may open combat on sight (ambush, predator rush).
 */
export function checkingWildlifeMayAggroPlayerOnSight(
  species: DefiningWildlifeSpeciesDefinition,
  aggressionLevel: DefiningWildlifeAggressionLevel,
  hungerDriveLevel: DefiningWildlifeHungerDriveLevel
): boolean {
  const profile = resolvingWildlifeAggressionLevelProfile(aggressionLevel);

  if (profile.aggressionLevel === 'tame') {
    return false;
  }

  if (!profile.mayAttackPlayerOnSight) {
    return hungerDriveLevel === 'hungry' || hungerDriveLevel === 'starving';
  }

  if (species.diet === 'herbivore') {
    if (
      aggressionLevel === 'aggressive' &&
      species.aggressionSpawn.aggressiveAttacksOnSight === true
    ) {
      return true;
    }

    return species.temperamentId === 'retaliator';
  }

  return (
    species.temperamentId === 'predator' || species.temperamentId === 'ambusher'
  );
}
