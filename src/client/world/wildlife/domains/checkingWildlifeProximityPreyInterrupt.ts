/**
 * Fast checks for whether a predator should break idle and engage nearby prey.
 *
 * @module components/world/wildlife/domains/checkingWildlifeProximityPreyInterrupt
 */

import { checkingWildlifeSocialHunterMayHunt } from '@/components/world/wildlife/domains/checkingWildlifeSocialHunterMayHunt';
import { checkingWildlifeSpeciesIsFavoritePrey } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesIsFavoritePrey';
import { DEFINING_WILDLIFE_FAVORITE_PREY_SIGHT_RADIUS_GRID } from '@/components/world/wildlife/domains/definingWildlifeFavoritePreyConstants';
import { checkingWildlifePredatorMayHuntPrey } from '@/components/world/wildlife/domains/definingWildlifeFoodChain';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifePreyProximityAttackRadiusGrid } from '@/components/world/wildlife/domains/resolvingWildlifePreyProximityAttackRadiusGrid';

export type CheckingWildlifeProximityPreyInterruptParams = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  nearbyInstances: readonly DefiningWildlifeInstance[];
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
};

/**
 * Returns true when valid prey is close enough that a predator should re-think
 * immediately instead of staying on idle or graze.
 */
export function checkingWildlifeProximityPreyInterrupt({
  instance,
  species,
  nearbyInstances,
  resolveSpecies,
}: CheckingWildlifeProximityPreyInterruptParams): boolean {
  if (species.diet === 'herbivore') {
    return false;
  }

  if (
    !checkingWildlifeSocialHunterMayHunt({
      instance,
      species,
      nearbyInstances,
    })
  ) {
    return false;
  }

  const proximityRadiusGrid =
    resolvingWildlifePreyProximityAttackRadiusGrid(species);
  const hungerDriveLevel =
    instance.hungerState.driveLevel === 'starving' ? 'starving' : 'hungry';

  for (const candidate of nearbyInstances) {
    if (candidate.instanceId === instance.instanceId || candidate.isDead) {
      continue;
    }

    const preySpecies = resolveSpecies(candidate.speciesId);

    if (
      !preySpecies ||
      !checkingWildlifePredatorMayHuntPrey(
        species,
        preySpecies,
        hungerDriveLevel
      )
    ) {
      continue;
    }

    const distance = Math.hypot(
      instance.position.x - candidate.position.x,
      instance.position.y - candidate.position.y
    );

    if (checkingWildlifeSpeciesIsFavoritePrey(species, preySpecies.speciesId)) {
      if (distance <= DEFINING_WILDLIFE_FAVORITE_PREY_SIGHT_RADIUS_GRID) {
        return true;
      }
    }

    if (distance <= proximityRadiusGrid) {
      return true;
    }
  }

  return false;
}
