/**
 * Picks the closest in-range favorite prey instance for a predator.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeNearestFavoritePreyTargetId
 */

import { checkingWildlifeInstanceHasProvokedWildlifeAggro } from '@/components/world/wildlife/domains/checkingWildlifeInstanceHasProvokedWildlifeAggro';
import { checkingWildlifeSpeciesIsFavoritePrey } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesIsFavoritePrey';
import { DEFINING_WILDLIFE_FAVORITE_PREY_SIGHT_RADIUS_GRID } from '@/components/world/wildlife/domains/definingWildlifeFavoritePreyConstants';
import { checkingWildlifePredatorMayHuntPrey } from '@/components/world/wildlife/domains/definingWildlifeFoodChain';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type ResolvingWildlifeNearestFavoritePreyTargetIdParams = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  nearbyInstances: readonly DefiningWildlifeInstance[];
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
  sightRadiusGrid?: number;
  /** Defaults to 0 in tests that do not exercise Unnoticed provoke windows. */
  nowMs?: number;
};

/** Returns the nearest live favorite prey id within sight, if any. */
export function resolvingWildlifeNearestFavoritePreyTargetId({
  instance,
  species,
  nearbyInstances,
  resolveSpecies,
  sightRadiusGrid = DEFINING_WILDLIFE_FAVORITE_PREY_SIGHT_RADIUS_GRID,
  nowMs = 0,
}: ResolvingWildlifeNearestFavoritePreyTargetIdParams): string | null {
  if (!species.favoritePreySpeciesIds?.length) {
    return null;
  }

  const hungerDriveLevel =
    instance.hungerState.driveLevel === 'starving' ? 'starving' : 'hungry';

  let nearestTargetId: string | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const neighbor of nearbyInstances) {
    if (neighbor.instanceId === instance.instanceId || neighbor.isDead) {
      continue;
    }

    const preySpecies = resolveSpecies(neighbor.speciesId);

    if (
      !preySpecies ||
      !checkingWildlifeSpeciesIsFavoritePrey(species, preySpecies.speciesId) ||
      !checkingWildlifePredatorMayHuntPrey(
        species,
        preySpecies,
        hungerDriveLevel,
        {
          preyHasProvokedWildlifeAggro:
            checkingWildlifeInstanceHasProvokedWildlifeAggro(neighbor, nowMs),
        }
      )
    ) {
      continue;
    }

    const distance = Math.hypot(
      instance.position.x - neighbor.position.x,
      instance.position.y - neighbor.position.y
    );

    if (distance > sightRadiusGrid || distance >= nearestDistance) {
      continue;
    }

    nearestDistance = distance;
    nearestTargetId = neighbor.instanceId;
  }

  return nearestTargetId;
}
