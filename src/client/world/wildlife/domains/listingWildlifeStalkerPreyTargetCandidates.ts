/**
 * Lists prey ids a stalker alpha may randomly commit to.
 *
 * @module components/world/wildlife/domains/listingWildlifeStalkerPreyTargetCandidates
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWildlifeIsMotivatedToHunt } from '@/components/world/wildlife/domains/checkingWildlifeIsMotivatedToHunt';
import { checkingWildlifeMayAggroPlayerOnSight } from '@/components/world/wildlife/domains/checkingWildlifeMayAggroPlayerOnSight';
import { checkingWildlifeSpeciesIsFavoritePrey } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesIsFavoritePrey';
import { DEFINING_WILDLIFE_FAVORITE_PREY_SIGHT_RADIUS_GRID } from '@/components/world/wildlife/domains/definingWildlifeFavoritePreyConstants';
import { checkingWildlifePredatorMayHuntPrey } from '@/components/world/wildlife/domains/definingWildlifeFoodChain';
import { DEFINING_WILDLIFE_PREY_HUNT_RADIUS_GRID } from '@/components/world/wildlife/domains/definingWildlifeHuntConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeInstancePlayerAggroRadiusGrid } from '@/components/world/wildlife/domains/resolvingWildlifeInstancePlayerAggroRadius';
import { resolvingWildlifePreyProximityAttackRadiusGrid } from '@/components/world/wildlife/domains/resolvingWildlifePreyProximityAttackRadiusGrid';

export type ListingWildlifeStalkerPreyTargetCandidatesParams = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  nearbyInstances: readonly DefiningWildlifeInstance[];
  playerPosition: DefiningWorldPlazaWorldPoint | null;
  playerUserId: string | null;
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
};

/** Returns every prey target currently in scent or proximity range for stalking. */
export function listingWildlifeStalkerPreyTargetCandidates({
  instance,
  species,
  nearbyInstances,
  playerPosition,
  playerUserId,
  resolveSpecies,
}: ListingWildlifeStalkerPreyTargetCandidatesParams): string[] {
  const candidates: string[] = [];
  const proximityAttackRadiusGrid =
    resolvingWildlifePreyProximityAttackRadiusGrid(species);
  const hungerDriveLevel =
    instance.hungerState.driveLevel === 'starving' ? 'starving' : 'hungry';
  const motivatedToHunt = checkingWildlifeIsMotivatedToHunt(
    species,
    instance.hungerState.driveLevel
  );

  if (playerUserId && playerPosition) {
    const distanceToPlayer = Math.hypot(
      instance.position.x - playerPosition.x,
      instance.position.y - playerPosition.y
    );

    if (
      distanceToPlayer <=
      resolvingWildlifeInstancePlayerAggroRadiusGrid(species, instance)
    ) {
      if (
        checkingWildlifeMayAggroPlayerOnSight(
          species,
          instance.aggressionLevel,
          instance.hungerState.driveLevel
        )
      ) {
        candidates.push(playerUserId);
      }
    }
  }

  for (const neighbor of nearbyInstances) {
    if (neighbor.instanceId === instance.instanceId || neighbor.isDead) {
      continue;
    }

    const preySpecies = resolveSpecies(neighbor.speciesId);

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
      instance.position.x - neighbor.position.x,
      instance.position.y - neighbor.position.y
    );

    const inProximityRange = distance <= proximityAttackRadiusGrid;
    const inScentRange = distance <= DEFINING_WILDLIFE_PREY_HUNT_RADIUS_GRID;
    const isFavoritePrey = checkingWildlifeSpeciesIsFavoritePrey(
      species,
      preySpecies.speciesId
    );
    const inFavoritePreySightRange =
      distance <= DEFINING_WILDLIFE_FAVORITE_PREY_SIGHT_RADIUS_GRID;

    if (!inProximityRange && !inScentRange && !inFavoritePreySightRange) {
      continue;
    }

    if (isFavoritePrey && inFavoritePreySightRange) {
      candidates.push(neighbor.instanceId);
      continue;
    }

    if (inProximityRange || motivatedToHunt) {
      candidates.push(neighbor.instanceId);
    }
  }

  return candidates;
}
