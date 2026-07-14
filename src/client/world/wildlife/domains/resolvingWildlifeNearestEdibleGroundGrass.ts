/**
 * Nearest uncleared long-grass clump for wildlife plant-eater foraging.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeNearestEdibleGroundGrass
 */

import { checkingWorldPlazaLongGrassDecorationAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLongGrassDecorationAtTileIndex';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWorldPlazaRuntimeLongGrassIsCleared } from '@/components/world/harvest/domains/registeringWorldPlazaClearedLongGrassLookup';
import {
  formattingWildlifeGroundGrassItemId,
  type DefiningWildlifeGroundGrassTile,
} from '@/components/world/wildlife/domains/definingWildlifeGroundGrassIdConstants';
import { DEFINING_WILDLIFE_GROUND_GRASS_SCENT_RADIUS_GRID } from '@/components/world/wildlife/domains/definingWildlifeHuntConstants';
import { checkingWildlifeGroundGrassOptimisticIsCleared } from '@/components/world/wildlife/domains/managingWildlifeGroundGrassBridge';

export type ResolvingWildlifeNearestEdibleGroundGrass =
  DefiningWildlifeGroundGrassTile & {
    readonly distanceGrid: number;
    readonly groundItemId: string;
  };

export function resolvingWildlifeNearestEdibleGroundGrass(
  position: DefiningWorldPlazaWorldPoint
): ResolvingWildlifeNearestEdibleGroundGrass | null {
  const centerTileX = Math.floor(position.x);
  const centerTileY = Math.floor(position.y);
  const radius = Math.ceil(DEFINING_WILDLIFE_GROUND_GRASS_SCENT_RADIUS_GRID);

  let nearest: ResolvingWildlifeNearestEdibleGroundGrass | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (let tileY = centerTileY - radius; tileY <= centerTileY + radius; tileY++) {
    for (
      let tileX = centerTileX - radius;
      tileX <= centerTileX + radius;
      tileX++
    ) {
      if (
        checkingWorldPlazaRuntimeLongGrassIsCleared(tileX, tileY) ||
        checkingWildlifeGroundGrassOptimisticIsCleared(tileX, tileY)
      ) {
        continue;
      }

      if (!checkingWorldPlazaLongGrassDecorationAtTileIndex(tileX, tileY)) {
        continue;
      }

      const targetX = tileX + 0.5;
      const targetY = tileY + 0.5;
      const distance = Math.hypot(position.x - targetX, position.y - targetY);

      if (
        distance > DEFINING_WILDLIFE_GROUND_GRASS_SCENT_RADIUS_GRID ||
        distance >= nearestDistance
      ) {
        continue;
      }

      nearest = {
        tileX,
        tileY,
        distanceGrid: distance,
        groundItemId: formattingWildlifeGroundGrassItemId(tileX, tileY),
      };
      nearestDistance = distance;
    }
  }

  return nearest;
}
