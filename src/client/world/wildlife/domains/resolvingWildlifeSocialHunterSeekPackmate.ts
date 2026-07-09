/**
 * Picks the nearest packmate a social hunter should run toward while under strength.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeSocialHunterSeekPackmate
 */

import { checkingWildlifeSameStalkPackSpecies } from '@/components/world/wildlife/domains/definingWildlifeOmegaWolfConstants';
import {
  DEFINING_WILDLIFE_SOCIAL_HUNTER_COMFORT_DISTANCE_GRID,
  DEFINING_WILDLIFE_SOCIAL_HUNTER_SEARCH_RADIUS_GRID,
} from '@/components/world/wildlife/domains/definingWildlifeSocialHunterConstants';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type ResolvingWildlifeSocialHunterSeekPackmateParams = {
  instance: DefiningWildlifeInstance;
  nearbyInstances: readonly DefiningWildlifeInstance[];
};

export type ResolvingWildlifeSocialHunterSeekPackmateResult = {
  packmate: DefiningWildlifeInstance;
  distanceGrid: number;
};

/**
 * Nearest living same-stalk-pack ally within search radius that is still farther
 * than comfort distance. Allies already within comfort are skipped so a clustered
 * pair keeps recruiting a third wolf farther out. Grey and omega mix as one pack.
 */
export function resolvingWildlifeSocialHunterSeekPackmate({
  instance,
  nearbyInstances,
}: ResolvingWildlifeSocialHunterSeekPackmateParams): ResolvingWildlifeSocialHunterSeekPackmateResult | null {
  let nearest: ResolvingWildlifeSocialHunterSeekPackmateResult | null = null;

  for (const candidate of nearbyInstances) {
    if (candidate.instanceId === instance.instanceId) {
      continue;
    }

    if (candidate.isDead) {
      continue;
    }

    if (
      !checkingWildlifeSameStalkPackSpecies(
        candidate.speciesId,
        instance.speciesId
      )
    ) {
      continue;
    }

    const distanceGrid = Math.hypot(
      candidate.position.x - instance.position.x,
      candidate.position.y - instance.position.y
    );

    if (distanceGrid > DEFINING_WILDLIFE_SOCIAL_HUNTER_SEARCH_RADIUS_GRID) {
      continue;
    }

    if (distanceGrid <= DEFINING_WILDLIFE_SOCIAL_HUNTER_COMFORT_DISTANCE_GRID) {
      continue;
    }

    if (!nearest || distanceGrid < nearest.distanceGrid) {
      nearest = { packmate: candidate, distanceGrid };
    }
  }

  return nearest;
}
