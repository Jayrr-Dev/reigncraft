/**
 * Locks sticky spawn-pack alpha ids onto living packmates.
 *
 * @module components/world/wildlife/domains/applyingWildlifeSpawnPackAlphaLocks
 */

import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { listingWildlifeSpawnPackmates } from '@/components/world/wildlife/domains/listingWildlifeSpawnPackmates';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import {
  listingWildlifeInstances,
  replacingWildlifeInstance,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { resolvingWildlifePackAlphaInstanceId } from '@/components/world/wildlife/domains/resolvingWildlifePackAlphaInstanceId';

export type ApplyingWildlifeSpawnPackAlphaLocksParams = {
  store: ManagingWildlifeInstanceStore;
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
};

/**
 * Ensures every multi-member spawn pack shares one sticky alpha id.
 * Clears the lock on solo survivors so a later packmate can re-elect.
 */
export function applyingWildlifeSpawnPackAlphaLocks({
  store,
  resolveSpecies,
}: ApplyingWildlifeSpawnPackAlphaLocksParams): void {
  const liveInstances = listingWildlifeInstances(store).filter(
    (instance) => !instance.isDead
  );
  const visitedPackKeys = new Set<string>();

  for (const instance of liveInstances) {
    const packmates = listingWildlifeSpawnPackmates({
      instance,
      instances: liveInstances,
      includeDead: false,
    });
    const packKey = packmates
      .map((packmate) => packmate.instanceId)
      .sort()
      .join('|');

    if (visitedPackKeys.has(packKey)) {
      continue;
    }

    visitedPackKeys.add(packKey);

    if (packmates.length <= 1) {
      const solo = packmates[0];

      if (solo && solo.packAlphaInstanceId) {
        replacingWildlifeInstance(store, {
          ...solo,
          packAlphaInstanceId: null,
        });
      }

      continue;
    }

    const alphaInstanceId = resolvingWildlifePackAlphaInstanceId({
      packmates,
      resolveSpecies,
    });

    if (!alphaInstanceId) {
      continue;
    }

    for (const packmate of packmates) {
      if (packmate.packAlphaInstanceId === alphaInstanceId) {
        continue;
      }

      replacingWildlifeInstance(store, {
        ...packmate,
        packAlphaInstanceId: alphaInstanceId,
      });
    }
  }
}
