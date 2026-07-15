/**
 * Runtime bridge to live wildlife instances for chest key qualification.
 *
 * @module components/world/chest/domains/registeringWorldPlazaChestWildlifeInstancesLookup
 */

import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

type ListingWorldPlazaChestWildlifeInstances =
  () => readonly DefiningWildlifeInstance[];

let listingWorldPlazaChestWildlifeInstancesLookup: ListingWorldPlazaChestWildlifeInstances | null =
  null;

/** Registers wildlife listing for chest strongest-key checks (scene mount). */
export function registeringWorldPlazaChestWildlifeInstancesLookup(
  lookup: ListingWorldPlazaChestWildlifeInstances | null
): void {
  listingWorldPlazaChestWildlifeInstancesLookup = lookup;
}

/** Lists wildlife instances for chest key checks, or empty when unregistered. */
export function listingWorldPlazaChestWildlifeInstancesForKeyChecks(): readonly DefiningWildlifeInstance[] {
  return listingWorldPlazaChestWildlifeInstancesLookup?.() ?? [];
}
