/**
 * Pack-size gate for social hunters before they may initiate a hunt.
 *
 * @module components/world/wildlife/domains/checkingWildlifeSocialHunterMayHunt
 */

import { checkingWildlifeInstanceIsSocialHunter } from '@/components/world/wildlife/domains/checkingWildlifeInstanceIsSocialHunter';
import { DEFINING_WILDLIFE_SOCIAL_HUNTER_MIN_PACK_COUNT } from '@/components/world/wildlife/domains/definingWildlifeSocialHunterConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { listingWildlifeNearbyInstancesAndSelf } from '@/components/world/wildlife/domains/listingWildlifeNearbyInstancesAndSelf';
import { listingWildlifeNearbyPackmates } from '@/components/world/wildlife/domains/listingWildlifeNearbyPackmates';

export type CheckingWildlifeSocialHunterMayHuntParams = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  nearbyInstances: readonly DefiningWildlifeInstance[];
};

/**
 * Non-social-hunters always may hunt. Social hunters need at least
 * {@link DEFINING_WILDLIFE_SOCIAL_HUNTER_MIN_PACK_COUNT} living area packmates
 * (including self) within stalk join radius.
 *
 * Simulation neighbor queries exclude self; this merges self back in before
 * counting so a pack of 3 is not treated as size 2.
 */
export function checkingWildlifeSocialHunterMayHunt({
  instance,
  species,
  nearbyInstances,
}: CheckingWildlifeSocialHunterMayHuntParams): boolean {
  if (!checkingWildlifeInstanceIsSocialHunter(instance, species)) {
    return true;
  }

  const packCount = listingWildlifeNearbyPackmates({
    instance,
    instances: listingWildlifeNearbyInstancesAndSelf(instance, nearbyInstances),
    includeDead: false,
  }).length;

  return packCount >= DEFINING_WILDLIFE_SOCIAL_HUNTER_MIN_PACK_COUNT;
}
