/**
 * Resolves which wildlife species textures should stay resident near the player.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeProximateSpeciesIdsAtWorldPoint
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaBiomeAtWorldPoint } from '@/components/world/domains/resolvingWorldPlazaBiomeAtWorldPoint';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { listingWildlifeSpeciesIdsForBiomeKinds } from '@/components/world/wildlife/domains/listingWildlifeSpeciesIdsForBiomeKinds';
import { resolvingWildlifeNearbyBiomeKindsAtWorldPoint } from '@/components/world/wildlife/domains/resolvingWildlifeNearbyBiomeKindsAtWorldPoint';
import type { ResolvingWildlifeTextureEvictionProfile } from '@/components/world/wildlife/domains/resolvingWildlifeTextureEvictionProfile';

/**
 * Builds the proximate pin set used by texture eviction.
 *
 * Mobile keeps only the highest-weight species from the player's current biome.
 * Desktop pins every species spawnable in the current tile plus the search ring.
 */
export function resolvingWildlifeProximateSpeciesIdsAtWorldPoint(
  worldPoint: DefiningWorldPlazaWorldPoint,
  evictionProfile: ResolvingWildlifeTextureEvictionProfile
): ReadonlySet<DefiningWildlifeSpeciesId> {
  if (evictionProfile.maxCachedSpecies !== null) {
    const currentBiomeKind =
      resolvingWorldPlazaBiomeAtWorldPoint(worldPoint).kind;

    return new Set(
      listingWildlifeSpeciesIdsForBiomeKinds(
        [currentBiomeKind],
        evictionProfile.maxCachedSpecies
      )
    );
  }

  const nearbyBiomeKinds =
    resolvingWildlifeNearbyBiomeKindsAtWorldPoint(worldPoint);

  return new Set(listingWildlifeSpeciesIdsForBiomeKinds(nearbyBiomeKinds));
}
