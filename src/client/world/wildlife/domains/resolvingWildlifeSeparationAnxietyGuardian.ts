/**
 * Picks the nearest larger same-species guardian for a young animal.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeSeparationAnxietyGuardian
 */

import {
  DEFINING_WILDLIFE_SEPARATION_ANXIETY_COMFORT_DISTANCE_GRID,
  DEFINING_WILDLIFE_SEPARATION_ANXIETY_SEARCH_RADIUS_GRID,
  DEFINING_WILDLIFE_SEPARATION_ANXIETY_TRIGGER_DISTANCE_GRID,
} from '@/components/world/wildlife/domains/definingWildlifeSeparationAnxietyConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeInstanceSizeTierFromSample } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceSizeTierFromSample';

export type ResolvingWildlifeSeparationAnxietyGuardianParams = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  nearbyInstances: readonly DefiningWildlifeInstance[];
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
  /** When already following, keep running until comfort distance. */
  isAlreadyFollowing?: boolean;
};

export type ResolvingWildlifeSeparationAnxietyGuardianResult = {
  guardian: DefiningWildlifeInstance;
  distanceGrid: number;
};

/**
 * Nearest living same-species animal with a strictly larger size tier,
 * within search radius, when the young animal is past the trigger distance
 * (or still closing from a prior follow).
 */
export function resolvingWildlifeSeparationAnxietyGuardian({
  instance,
  species,
  nearbyInstances,
  resolveSpecies,
  isAlreadyFollowing = false,
}: ResolvingWildlifeSeparationAnxietyGuardianParams): ResolvingWildlifeSeparationAnxietyGuardianResult | null {
  const youngSizeTier = resolvingWildlifeInstanceSizeTierFromSample(
    instance.sizeScaleSample,
    species
  );

  let nearest: ResolvingWildlifeSeparationAnxietyGuardianResult | null = null;

  for (const candidate of nearbyInstances) {
    if (candidate.instanceId === instance.instanceId) {
      continue;
    }

    if (candidate.isDead) {
      continue;
    }

    if (candidate.speciesId !== instance.speciesId) {
      continue;
    }

    const candidateSpecies = resolveSpecies(candidate.speciesId) ?? species;
    const candidateSizeTier = resolvingWildlifeInstanceSizeTierFromSample(
      candidate.sizeScaleSample,
      candidateSpecies
    );

    if (candidateSizeTier <= youngSizeTier) {
      continue;
    }

    const distanceGrid = Math.hypot(
      candidate.position.x - instance.position.x,
      candidate.position.y - instance.position.y
    );

    if (
      distanceGrid > DEFINING_WILDLIFE_SEPARATION_ANXIETY_SEARCH_RADIUS_GRID
    ) {
      continue;
    }

    if (!nearest || distanceGrid < nearest.distanceGrid) {
      nearest = { guardian: candidate, distanceGrid };
    }
  }

  if (!nearest) {
    return null;
  }

  const triggerDistance = isAlreadyFollowing
    ? DEFINING_WILDLIFE_SEPARATION_ANXIETY_COMFORT_DISTANCE_GRID
    : DEFINING_WILDLIFE_SEPARATION_ANXIETY_TRIGGER_DISTANCE_GRID;

  if (nearest.distanceGrid <= triggerDistance) {
    return null;
  }

  return nearest;
}
