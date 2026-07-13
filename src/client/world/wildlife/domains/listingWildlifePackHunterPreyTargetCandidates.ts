/**
 * Lists prey candidates a PackHunter alpha may randomly commit to.
 *
 * @module components/world/wildlife/domains/listingWildlifePackHunterPreyTargetCandidates
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWildlifeInstanceHasProvokedWildlifeAggro } from '@/components/world/wildlife/domains/checkingWildlifeInstanceHasProvokedWildlifeAggro';
import { checkingWildlifeIsMotivatedToHunt } from '@/components/world/wildlife/domains/checkingWildlifeIsMotivatedToHunt';
import { checkingWildlifeMayAggroPlayerOnSight } from '@/components/world/wildlife/domains/checkingWildlifeMayAggroPlayerOnSight';
import { checkingWildlifeSpeciesIsFavoritePrey } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesIsFavoritePrey';
import { DEFINING_WILDLIFE_FAVORITE_PREY_SIGHT_RADIUS_GRID } from '@/components/world/wildlife/domains/definingWildlifeFavoritePreyConstants';
import {
  checkingWildlifePredatorMayHuntPrey,
  DEFINING_WILDLIFE_PLAYER_REFERENCE_MASS_KG,
} from '@/components/world/wildlife/domains/definingWildlifeFoodChain';
import { DEFINING_WILDLIFE_PREY_HUNT_RADIUS_GRID } from '@/components/world/wildlife/domains/definingWildlifeHuntConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeStalkPreyPickCandidate } from '@/components/world/wildlife/domains/definingWildlifeStalkPreyPickCandidate';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeInstancePlayerAggroRadiusGrid } from '@/components/world/wildlife/domains/resolvingWildlifeInstancePlayerAggroRadius';
import { resolvingWildlifePreyProximityAttackRadiusGrid } from '@/components/world/wildlife/domains/resolvingWildlifePreyProximityAttackRadiusGrid';

export type ListingWildlifePackHunterPreyTargetCandidatesParams = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  nearbyInstances: readonly DefiningWildlifeInstance[];
  playerPosition: DefiningWorldPlazaWorldPoint | null;
  playerUserId: string | null;
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
  /** Defaults to 0 in tests that do not exercise Unnoticed provoke windows. */
  nowMs?: number;
};

/** Returns every prey target currently in scent or proximity range for stalking. */
export function listingWildlifePackHunterPreyTargetCandidates({
  instance,
  species,
  nearbyInstances,
  playerPosition,
  playerUserId,
  resolveSpecies,
  nowMs = 0,
}: ListingWildlifePackHunterPreyTargetCandidatesParams): DefiningWildlifeStalkPreyPickCandidate[] {
  const candidates: DefiningWildlifeStalkPreyPickCandidate[] = [];
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
        candidates.push({
          targetId: playerUserId,
          massKg: DEFINING_WILDLIFE_PLAYER_REFERENCE_MASS_KG,
          isFavoritePrey: false,
        });
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

    const effectiveMassKg =
      preySpecies.massKg * Math.max(0.01, neighbor.sizeScaleSample);

    if (isFavoritePrey && inFavoritePreySightRange) {
      candidates.push({
        targetId: neighbor.instanceId,
        massKg: effectiveMassKg,
        isFavoritePrey: true,
      });
      continue;
    }

    if (inProximityRange || motivatedToHunt) {
      candidates.push({
        targetId: neighbor.instanceId,
        massKg: effectiveMassKg,
        isFavoritePrey,
      });
    }
  }

  return candidates;
}
