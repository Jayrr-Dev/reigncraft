/**
 * Candidate pasture tiles for grass / fairy-ring mushrooms (utility only).
 *
 * Does not spawn mushrooms. Scans a tile AABB and keeps pasture biomes.
 *
 * @module components/world/mushrooms/domains/listingWorldPlazaMushroomCandidateTilePositionsInPastureBounds
 */

import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import { resolvingWorldPlazaBiomeAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';
import { checkingWorldPlazaMushroomPastureBiomeKind } from '@/components/world/mushrooms/domains/checkingWorldPlazaMushroomHabitatSpawn';
import {
  DEFINING_WORLD_PLAZA_MUSHROOM_PASTURE_BIOME_KINDS,
  DEFINING_WORLD_PLAZA_MUSHROOM_PASTURE_DEFAULT_RING_COUNT,
} from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomHabitatSpawnConstants';
import {
  computingWorldPlazaMushroomRingTilePositions,
  type ComputingWorldPlazaMushroomRingTilePosition,
} from '@/components/world/mushrooms/domains/computingWorldPlazaMushroomRingTilePositions';
import type { DefiningWorldPlazaMushroomRingSpawnCount } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomRingSpawnConstants';

export type ListingWorldPlazaMushroomCandidateTilePositionInPasture = {
  readonly tileX: number;
  readonly tileY: number;
  readonly biomeKind: DefiningWorldPlazaBiomeKind;
};

export type ListingWorldPlazaMushroomCandidateTilePositionsInPastureBoundsParams =
  {
    readonly minTileX: number;
    readonly maxTileX: number;
    readonly minTileY: number;
    readonly maxTileY: number;
    /**
     * Biome kinds treated as pasture. Defaults to plains + savanna.
     */
    readonly pastureBiomeKinds?: readonly DefiningWorldPlazaBiomeKind[];
    /**
     * Inject for tests. Defaults to `resolvingWorldPlazaBiomeAtTileIndex(...).kind`.
     */
    readonly resolveBiomeKindAtTile?: (
      tileX: number,
      tileY: number
    ) => DefiningWorldPlazaBiomeKind;
  };

export type ListingWorldPlazaMushroomPastureRingTilePositionsParams = {
  readonly centerTileX: number;
  readonly centerTileY: number;
  readonly count?: DefiningWorldPlazaMushroomRingSpawnCount;
  readonly radiusTiles?: number;
  readonly startAngleRadians?: number;
};

function checkingWorldPlazaMushroomPastureBiomeKindAgainstAllowList(
  biomeKind: DefiningWorldPlazaBiomeKind,
  pastureBiomeKinds: readonly DefiningWorldPlazaBiomeKind[]
): boolean {
  if (pastureBiomeKinds === DEFINING_WORLD_PLAZA_MUSHROOM_PASTURE_BIOME_KINDS) {
    return checkingWorldPlazaMushroomPastureBiomeKind(biomeKind);
  }

  return pastureBiomeKinds.includes(biomeKind);
}

/**
 * Lists tiles inside an inclusive AABB whose biome is pasture-like.
 */
export function listingWorldPlazaMushroomCandidateTilePositionsInPastureBounds({
  minTileX,
  maxTileX,
  minTileY,
  maxTileY,
  pastureBiomeKinds = DEFINING_WORLD_PLAZA_MUSHROOM_PASTURE_BIOME_KINDS,
  resolveBiomeKindAtTile = (tileX, tileY) =>
    resolvingWorldPlazaBiomeAtTileIndex(tileX, tileY).kind,
}: ListingWorldPlazaMushroomCandidateTilePositionsInPastureBoundsParams): readonly ListingWorldPlazaMushroomCandidateTilePositionInPasture[] {
  if (
    !(
      Number.isFinite(minTileX) &&
      Number.isFinite(maxTileX) &&
      Number.isFinite(minTileY) &&
      Number.isFinite(maxTileY) &&
      maxTileX >= minTileX &&
      maxTileY >= minTileY
    )
  ) {
    throw new Error(
      `Invalid pasture tile bounds: (${String(minTileX)},${String(minTileY)})..(${String(maxTileX)},${String(maxTileY)}).`
    );
  }

  const candidates: ListingWorldPlazaMushroomCandidateTilePositionInPasture[] =
    [];

  for (let tileY = minTileY; tileY <= maxTileY; tileY += 1) {
    for (let tileX = minTileX; tileX <= maxTileX; tileX += 1) {
      const biomeKind = resolveBiomeKindAtTile(tileX, tileY);

      if (
        !checkingWorldPlazaMushroomPastureBiomeKindAgainstAllowList(
          biomeKind,
          pastureBiomeKinds
        )
      ) {
        continue;
      }

      candidates.push({
        tileX,
        tileY,
        biomeKind,
      });
    }
  }

  return candidates;
}

/**
 * Fairy-ring seats for pasture mushrooms (wraps ring utility; not wired).
 */
export function listingWorldPlazaMushroomPastureRingTilePositions({
  centerTileX,
  centerTileY,
  count = DEFINING_WORLD_PLAZA_MUSHROOM_PASTURE_DEFAULT_RING_COUNT,
  radiusTiles,
  startAngleRadians,
}: ListingWorldPlazaMushroomPastureRingTilePositionsParams): readonly ComputingWorldPlazaMushroomRingTilePosition[] {
  return computingWorldPlazaMushroomRingTilePositions({
    centerTileX,
    centerTileY,
    count,
    radiusTiles,
    startAngleRadians,
  });
}
