/**
 * Whether a spawned animal may treat the player as an on-sight combat target.
 *
 * @module components/world/wildlife/domains/checkingWildlifeMayAggroPlayerOnSight
 */

import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import { checkingWorldPlazaDevQaLoadEnabled } from '@/components/world/domains/managingWorldPlazaDevQaLoadStore';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
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
  if (checkingWorldPlazaDevQaLoadEnabled()) {
    return false;
  }

  if (
    !checkingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE_AI
    )
  ) {
    return false;
  }

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
    species.temperamentId === 'predator' ||
    species.temperamentId === 'ambusher' ||
    species.temperamentId === 'stalker'
  );
}
