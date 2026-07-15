/**
 * Candidate tiles beside a tree stump for wood-habitat mushrooms (utility only).
 *
 * Does not read chop state or spawn mushrooms. Caller supplies stump tile.
 *
 * @module components/world/mushrooms/domains/listingWorldPlazaMushroomCandidateTilePositionsNearStump
 */

import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import {
  DEFINING_WORLD_PLAZA_MUSHROOM_STUMP_NEAR_MAX_RADIUS_TILES,
  DEFINING_WORLD_PLAZA_MUSHROOM_STUMP_NEAR_MIN_RADIUS_TILES,
} from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomHabitatSpawnConstants';

export type ListingWorldPlazaMushroomCandidateTilePositionNearStump = {
  readonly tileX: number;
  readonly tileY: number;
  /** Chebyshev distance from the stump tile. */
  readonly chebyshevDistanceTiles: number;
};

export type ListingWorldPlazaMushroomCandidateTilePositionsNearStumpParams = {
  readonly stumpTileX: number;
  readonly stumpTileY: number;
  /** Inclusive. Defaults to `DEFINING_WORLD_PLAZA_MUSHROOM_STUMP_NEAR_MIN_RADIUS_TILES`. */
  readonly minRadiusTiles?: number;
  /** Inclusive. Defaults to `DEFINING_WORLD_PLAZA_MUSHROOM_STUMP_NEAR_MAX_RADIUS_TILES`. */
  readonly maxRadiusTiles?: number;
};

/**
 * Lists integer tiles in a Chebyshev annulus around a stump (stump tile excluded).
 * Order: top→bottom, left→right within each row.
 */
export function listingWorldPlazaMushroomCandidateTilePositionsNearStump({
  stumpTileX,
  stumpTileY,
  minRadiusTiles = DEFINING_WORLD_PLAZA_MUSHROOM_STUMP_NEAR_MIN_RADIUS_TILES,
  maxRadiusTiles = DEFINING_WORLD_PLAZA_MUSHROOM_STUMP_NEAR_MAX_RADIUS_TILES,
}: ListingWorldPlazaMushroomCandidateTilePositionsNearStumpParams): readonly ListingWorldPlazaMushroomCandidateTilePositionNearStump[] {
  if (
    !(
      Number.isFinite(minRadiusTiles) &&
      Number.isFinite(maxRadiusTiles) &&
      minRadiusTiles >= 1 &&
      maxRadiusTiles >= minRadiusTiles
    )
  ) {
    throw new Error(
      `Invalid stump-near radius range: min=${String(minRadiusTiles)} max=${String(maxRadiusTiles)}.`
    );
  }

  const candidates: ListingWorldPlazaMushroomCandidateTilePositionNearStump[] =
    [];

  for (
    let tileY = stumpTileY - maxRadiusTiles;
    tileY <= stumpTileY + maxRadiusTiles;
    tileY += 1
  ) {
    for (
      let tileX = stumpTileX - maxRadiusTiles;
      tileX <= stumpTileX + maxRadiusTiles;
      tileX += 1
    ) {
      const chebyshevDistanceTiles = computingWorldPlazaGridChebyshevDistance(
        stumpTileX,
        stumpTileY,
        tileX,
        tileY
      );

      if (
        chebyshevDistanceTiles < minRadiusTiles ||
        chebyshevDistanceTiles > maxRadiusTiles
      ) {
        continue;
      }

      candidates.push({
        tileX,
        tileY,
        chebyshevDistanceTiles,
      });
    }
  }

  return candidates;
}
