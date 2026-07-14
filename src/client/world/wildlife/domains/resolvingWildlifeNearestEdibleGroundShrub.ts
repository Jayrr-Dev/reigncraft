/**
 * Nearest unpicked berry shrub for wildlife plant-eater foraging.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeNearestEdibleGroundShrub
 */

import { checkingWorldPlazaShrubDecorationAtTileIndex } from '@/components/world/domains/checkingWorldPlazaShrubDecorationAtTileIndex';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWorldPlazaRuntimeShrubIsPicked } from '@/components/world/harvest/domains/registeringWorldPlazaPickedShrubsLookup';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RED } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import {
  formattingWildlifeGroundShrubItemId,
  type DefiningWildlifeGroundShrubTile,
} from '@/components/world/wildlife/domains/definingWildlifeGroundShrubIdConstants';
import { DEFINING_WILDLIFE_GROUND_SHRUB_SCENT_RADIUS_GRID } from '@/components/world/wildlife/domains/definingWildlifeHuntConstants';
import { checkingWildlifeGroundShrubOptimisticIsPicked } from '@/components/world/wildlife/domains/managingWildlifeGroundShrubBridge';

export type ResolvingWildlifeNearestEdibleGroundShrub =
  DefiningWildlifeGroundShrubTile & {
    readonly itemTypeId: string;
    readonly distanceGrid: number;
    readonly groundItemId: string;
  };

/** Resolves the closest unpicked berry shrub tile within scent range. */
export function resolvingWildlifeNearestEdibleGroundShrub(
  position: DefiningWorldPlazaWorldPoint
): ResolvingWildlifeNearestEdibleGroundShrub | null {
  const centerTileX = Math.floor(position.x);
  const centerTileY = Math.floor(position.y);
  const radius = Math.ceil(DEFINING_WILDLIFE_GROUND_SHRUB_SCENT_RADIUS_GRID);

  let nearest: ResolvingWildlifeNearestEdibleGroundShrub | null = null;
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
        checkingWorldPlazaRuntimeShrubIsPicked(tileX, tileY) ||
        checkingWildlifeGroundShrubOptimisticIsPicked(tileX, tileY)
      ) {
        continue;
      }

      if (!checkingWorldPlazaShrubDecorationAtTileIndex(tileX, tileY)) {
        continue;
      }

      const targetX = tileX + 0.5;
      const targetY = tileY + 0.5;
      const distance = Math.hypot(position.x - targetX, position.y - targetY);

      if (
        distance > DEFINING_WILDLIFE_GROUND_SHRUB_SCENT_RADIUS_GRID ||
        distance >= nearestDistance
      ) {
        continue;
      }

      nearest = {
        tileX,
        tileY,
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RED,
        distanceGrid: distance,
        groundItemId: formattingWildlifeGroundShrubItemId(tileX, tileY),
      };
      nearestDistance = distance;
    }
  }

  return nearest;
}
