/**
 * Builds habitat layout seats for one wood or pasture anchor.
 *
 * @module components/world/mushrooms/domains/resolvingWorldPlazaMushroomHabitatLayoutSeatsAtAnchor
 */

import { computingWorldPlazaMushroomBunchTilePositions } from '@/components/world/mushrooms/domains/computingWorldPlazaMushroomBunchTilePositions';
import { computingWorldPlazaMushroomRingTilePositions } from '@/components/world/mushrooms/domains/computingWorldPlazaMushroomRingTilePositions';
import { computingWorldPlazaMushroomSeedUnitFromTileIndex } from '@/components/world/mushrooms/domains/computingWorldPlazaMushroomSeedUnitFromTileIndex';
import {
  DEFINING_WORLD_PLAZA_MUSHROOM_CLUSTER_HONEY_RING_MODE_THRESHOLD,
  DEFINING_WORLD_PLAZA_MUSHROOM_NEAR_TREE_COUNT_SEED_SALT,
  DEFINING_WORLD_PLAZA_MUSHROOM_RING_ANGLE_SEED_SALT,
  DEFINING_WORLD_PLAZA_MUSHROOM_RING_COUNT_SEED_SALT,
  DEFINING_WORLD_PLAZA_MUSHROOM_WOOD_BUNCH_COUNT_SEED_SALT,
  DEFINING_WORLD_PLAZA_MUSHROOM_WOOD_LAYOUT_MODE_SEED_SALT,
} from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomConstants';
import {
  resolvingWorldPlazaMushroomNearTreeCountFromUnit,
  resolvingWorldPlazaMushroomRingCountFromUnit,
  resolvingWorldPlazaMushroomWoodBunchCountFromUnit,
} from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomHabitatLayoutRegistry';
import type { DefiningWorldPlazaMushroomCatalogEntry } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomRegistry';
import { listingWorldPlazaMushroomCandidateTilePositionsNearStump } from '@/components/world/mushrooms/domains/listingWorldPlazaMushroomCandidateTilePositionsNearStump';

export type ResolvingWorldPlazaMushroomHabitatLayoutSeat = {
  readonly tileX: number;
  readonly tileY: number;
};

export function resolvingWorldPlazaMushroomWoodHabitatLayoutSeatsAtAnchor(
  anchorTileX: number,
  anchorTileY: number,
  entry: DefiningWorldPlazaMushroomCatalogEntry
): readonly ResolvingWorldPlazaMushroomHabitatLayoutSeat[] {
  const speciesId = entry.speciesId;

  if (speciesId === 'ghost-wing') {
    const seatCount = resolvingWorldPlazaMushroomNearTreeCountFromUnit(
      computingWorldPlazaMushroomSeedUnitFromTileIndex(
        anchorTileX,
        anchorTileY,
        DEFINING_WORLD_PLAZA_MUSHROOM_NEAR_TREE_COUNT_SEED_SALT
      )
    );

    return listingWorldPlazaMushroomCandidateTilePositionsNearStump({
      stumpTileX: anchorTileX,
      stumpTileY: anchorTileY,
    }).slice(0, seatCount);
  }

  if (speciesId === 'cluster-honey') {
    const layoutModeUnit = computingWorldPlazaMushroomSeedUnitFromTileIndex(
      anchorTileX,
      anchorTileY,
      DEFINING_WORLD_PLAZA_MUSHROOM_WOOD_LAYOUT_MODE_SEED_SALT
    );

    if (
      layoutModeUnit <
      DEFINING_WORLD_PLAZA_MUSHROOM_CLUSTER_HONEY_RING_MODE_THRESHOLD
    ) {
      const ringCount = resolvingWorldPlazaMushroomRingCountFromUnit(
        computingWorldPlazaMushroomSeedUnitFromTileIndex(
          anchorTileX,
          anchorTileY,
          DEFINING_WORLD_PLAZA_MUSHROOM_RING_COUNT_SEED_SALT
        )
      );
      const startAngleRadians =
        computingWorldPlazaMushroomSeedUnitFromTileIndex(
          anchorTileX,
          anchorTileY,
          DEFINING_WORLD_PLAZA_MUSHROOM_RING_ANGLE_SEED_SALT
        ) *
        Math.PI *
        2;

      return computingWorldPlazaMushroomRingTilePositions({
        centerTileX: anchorTileX,
        centerTileY: anchorTileY,
        count: ringCount,
        startAngleRadians,
      });
    }
  }

  const bunchCount = resolvingWorldPlazaMushroomWoodBunchCountFromUnit(
    computingWorldPlazaMushroomSeedUnitFromTileIndex(
      anchorTileX,
      anchorTileY,
      DEFINING_WORLD_PLAZA_MUSHROOM_WOOD_BUNCH_COUNT_SEED_SALT
    )
  );
  const neighborRotationSteps = Math.floor(
    computingWorldPlazaMushroomSeedUnitFromTileIndex(
      anchorTileX,
      anchorTileY,
      DEFINING_WORLD_PLAZA_MUSHROOM_RING_ANGLE_SEED_SALT
    ) * 8
  );

  return computingWorldPlazaMushroomBunchTilePositions({
    centerTileX: anchorTileX,
    centerTileY: anchorTileY,
    count: bunchCount,
    includeCenterTile: false,
    neighborRotationSteps,
  });
}

export function resolvingWorldPlazaMushroomPastureHabitatLayoutSeatsAtAnchor(
  anchorTileX: number,
  anchorTileY: number,
  entry: DefiningWorldPlazaMushroomCatalogEntry
): readonly ResolvingWorldPlazaMushroomHabitatLayoutSeat[] {
  const ringCount = resolvingWorldPlazaMushroomRingCountFromUnit(
    computingWorldPlazaMushroomSeedUnitFromTileIndex(
      anchorTileX,
      anchorTileY,
      DEFINING_WORLD_PLAZA_MUSHROOM_RING_COUNT_SEED_SALT
    )
  );
  const startAngleRadians =
    computingWorldPlazaMushroomSeedUnitFromTileIndex(
      anchorTileX,
      anchorTileY,
      DEFINING_WORLD_PLAZA_MUSHROOM_RING_ANGLE_SEED_SALT
    ) *
    Math.PI *
    2;

  return computingWorldPlazaMushroomRingTilePositions({
    centerTileX: anchorTileX,
    centerTileY: anchorTileY,
    count: ringCount,
    startAngleRadians,
  });
}
