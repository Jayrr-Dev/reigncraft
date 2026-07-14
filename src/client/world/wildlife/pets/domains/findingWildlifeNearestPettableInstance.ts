/**
 * Finds the nearest living pettable wildlife instance to a world point.
 *
 * @module components/world/wildlife/pets/domains/findingWildlifeNearestPettableInstance
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  checkingWildlifeSpeciesIsPettable,
  resolvingWildlifeDocilePetKind,
} from '@/components/world/wildlife/domains/checkingWildlifeSpeciesIsPettable';
import type { DefiningWildlifeDocilePetKind } from '@/components/world/wildlife/domains/definingWildlifeDocilePetConstants';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  listingWildlifeInstances,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';

export type FindingWildlifeNearestPettableInstanceParams = {
  store: ManagingWildlifeInstanceStore;
  origin: DefiningWorldPlazaWorldPoint;
  /** When set, only match this pet kind (e.g. dog). */
  petKind?: DefiningWildlifeDocilePetKind;
};

/**
 * Closest living pettable animal (optionally filtered to cats or dogs).
 */
export function findingWildlifeNearestPettableInstance({
  store,
  origin,
  petKind,
}: FindingWildlifeNearestPettableInstanceParams): DefiningWildlifeInstance | null {
  let closest: DefiningWildlifeInstance | null = null;
  let closestDistanceSquared = Number.POSITIVE_INFINITY;

  for (const instance of listingWildlifeInstances(store)) {
    if (instance.isDead) {
      continue;
    }

    if (!checkingWildlifeSpeciesIsPettable(instance.speciesId)) {
      continue;
    }

    if (petKind !== undefined) {
      const kind = resolvingWildlifeDocilePetKind(instance.speciesId);

      if (kind !== petKind) {
        continue;
      }
    }

    const distanceX = instance.position.x - origin.x;
    const distanceY = instance.position.y - origin.y;
    const distanceSquared = distanceX * distanceX + distanceY * distanceY;

    if (distanceSquared < closestDistanceSquared) {
      closest = instance;
      closestDistanceSquared = distanceSquared;
    }
  }

  return closest;
}
