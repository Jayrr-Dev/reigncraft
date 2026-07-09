/**
 * Per-instance player proximity aggro radius.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeInstancePlayerAggroRadius
 */

import { checkingWildlifeMayAggroPlayerOnSight } from '@/components/world/wildlife/domains/checkingWildlifeMayAggroPlayerOnSight';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeAggressionLevelProfile } from '@/components/world/wildlife/domains/resolvingWildlifeAggressionLevelFromAnchor';
import { resolvingWildlifeSpeciesAggroRadiusGrid } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesAggroRadiusGrid';

/** Minimum on-sight aggro radius for aggressive spawns (grid units). */
const RESOLVING_WILDLIFE_AGGRESSIVE_ON_SIGHT_MIN_AGGRO_RADIUS_GRID = 5;

/** Multiplier on species aggro radius for on-sight aggressive animals. */
const RESOLVING_WILDLIFE_AGGRESSIVE_ON_SIGHT_AGGRO_RADIUS_MULTIPLIER = 4;

/** Resolves how close the player can be before on-sight threat builds. */
export function resolvingWildlifeInstancePlayerAggroRadiusGrid(
  species: DefiningWildlifeSpeciesDefinition,
  instance: DefiningWildlifeInstance
): number {
  const profile = resolvingWildlifeAggressionLevelProfile(
    instance.aggressionLevel
  );

  const mayBuildOnSightThreat = checkingWildlifeMayAggroPlayerOnSight(
    species,
    instance.aggressionLevel,
    instance.hungerState.driveLevel
  );

  if (profile.proximityThreatMode !== 'onSight' || !mayBuildOnSightThreat) {
    return resolvingWildlifeSpeciesAggroRadiusGrid(species);
  }

  const baseAggroRadiusGrid = resolvingWildlifeSpeciesAggroRadiusGrid(species);

  return Math.max(
    baseAggroRadiusGrid *
      RESOLVING_WILDLIFE_AGGRESSIVE_ON_SIGHT_AGGRO_RADIUS_MULTIPLIER,
    RESOLVING_WILDLIFE_AGGRESSIVE_ON_SIGHT_MIN_AGGRO_RADIUS_GRID
  );
}
