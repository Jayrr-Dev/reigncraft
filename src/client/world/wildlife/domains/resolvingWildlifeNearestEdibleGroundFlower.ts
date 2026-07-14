/**
 * Nearest unpicked pickable biome flower for wildlife plant-eater foraging.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeNearestEdibleGroundFlower
 */

import { checkingWorldPlazaPickableFlowerDecorationAtTileIndex } from '@/components/world/domains/checkingWorldPlazaPickableFlowerDecorationAtTileIndex';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaFlowerSpeciesAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaFlowerSpeciesAtTileIndex';
import { checkingWorldPlazaRuntimeFlowerIsPicked } from '@/components/world/harvest/domains/registeringWorldPlazaPickedFlowersLookup';
import { resolvingWorldPlazaFlowerItemTypeIdFromSpeciesId } from '@/components/world/inventory/domains/definingWorldPlazaInventoryFlowerSpriteSheetConstants';
import {
  formattingWildlifeGroundFlowerItemId,
  type DefiningWildlifeGroundFlowerTile,
} from '@/components/world/wildlife/domains/definingWildlifeGroundFlowerIdConstants';
import { DEFINING_WILDLIFE_GROUND_FLOWER_SCENT_RADIUS_GRID } from '@/components/world/wildlife/domains/definingWildlifeHuntConstants';
import { checkingWildlifeGroundFlowerOptimisticIsPicked } from '@/components/world/wildlife/domains/managingWildlifeGroundFlowerBridge';

export type ResolvingWildlifeNearestEdibleGroundFlower =
  DefiningWildlifeGroundFlowerTile & {
    readonly itemTypeId: string;
    readonly distanceGrid: number;
    readonly groundItemId: string;
  };

/** Resolves the closest edible biome flower tile within scent range. */
export function resolvingWildlifeNearestEdibleGroundFlower(
  position: DefiningWorldPlazaWorldPoint
): ResolvingWildlifeNearestEdibleGroundFlower | null {
  const centerTileX = Math.floor(position.x);
  const centerTileY = Math.floor(position.y);
  const radius = Math.ceil(DEFINING_WILDLIFE_GROUND_FLOWER_SCENT_RADIUS_GRID);

  let nearest: ResolvingWildlifeNearestEdibleGroundFlower | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (
    let tileY = centerTileY - radius;
    tileY <= centerTileY + radius;
    tileY++
  ) {
    for (
      let tileX = centerTileX - radius;
      tileX <= centerTileX + radius;
      tileX++
    ) {
      if (
        checkingWorldPlazaRuntimeFlowerIsPicked(tileX, tileY) ||
        checkingWildlifeGroundFlowerOptimisticIsPicked(tileX, tileY)
      ) {
        continue;
      }

      if (
        !checkingWorldPlazaPickableFlowerDecorationAtTileIndex(tileX, tileY)
      ) {
        continue;
      }

      const targetX = tileX + 0.5;
      const targetY = tileY + 0.5;
      const distance = Math.hypot(position.x - targetX, position.y - targetY);

      if (
        distance > DEFINING_WILDLIFE_GROUND_FLOWER_SCENT_RADIUS_GRID ||
        distance >= nearestDistance
      ) {
        continue;
      }

      const speciesId = resolvingWorldPlazaFlowerSpeciesAtTileIndex(
        tileX,
        tileY
      );
      const itemTypeId =
        resolvingWorldPlazaFlowerItemTypeIdFromSpeciesId(speciesId);

      nearest = {
        tileX,
        tileY,
        itemTypeId,
        distanceGrid: distance,
        groundItemId: formattingWildlifeGroundFlowerItemId(tileX, tileY),
      };
      nearestDistance = distance;
    }
  }

  return nearest;
}
