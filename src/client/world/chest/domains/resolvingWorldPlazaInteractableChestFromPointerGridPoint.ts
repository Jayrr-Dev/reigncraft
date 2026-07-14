/**
 * Resolves the nearest chest under the pointer.
 *
 * @module components/world/chest/domains/resolvingWorldPlazaInteractableChestFromPointerGridPoint
 */

import { DEFINING_WORLD_PLAZA_CHEST_POINTER_HIT_RADIUS_TILES } from '@/components/world/chest/domains/definingWorldPlazaChestConstants';
import type { DefiningWorldPlazaChestId } from '@/components/world/chest/domains/definingWorldPlazaChestTypes';
import {
  listingWorldPlazaChestInstances,
  type ManagingWorldPlazaChestInstanceStore,
} from '@/components/world/chest/domains/managingWorldPlazaChestInstanceStore';
import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';

export type ResolvingWorldPlazaInteractableChestFromPointerGridPointResult = {
  readonly chestId: DefiningWorldPlazaChestId;
  readonly worldX: number;
  readonly worldY: number;
  readonly distanceTiles: number;
};

/**
 * Resolves the nearest chest under the pointer (any state — labels decide actions).
 */
export function resolvingWorldPlazaInteractableChestFromPointerGridPoint(
  pointerGridX: number,
  pointerGridY: number,
  pointerHitRadiusTiles: number = DEFINING_WORLD_PLAZA_CHEST_POINTER_HIT_RADIUS_TILES,
  store?: ManagingWorldPlazaChestInstanceStore
): ResolvingWorldPlazaInteractableChestFromPointerGridPointResult | null {
  let closestMatch: ResolvingWorldPlazaInteractableChestFromPointerGridPointResult | null =
    null;

  for (const instance of listingWorldPlazaChestInstances(store)) {
    const distance = computingWorldPlazaGridChebyshevDistance(
      pointerGridX,
      pointerGridY,
      instance.position.x,
      instance.position.y
    );

    if (distance > pointerHitRadiusTiles) {
      continue;
    }

    if (!closestMatch || distance < closestMatch.distanceTiles) {
      closestMatch = {
        chestId: instance.chestId,
        worldX: instance.position.x,
        worldY: instance.position.y,
        distanceTiles: distance,
      };
    }
  }

  return closestMatch;
}
