/**
 * Picks a random land tile one step from the player for fishing ground drops.
 *
 * @module components/world/fishing/domains/resolvingWorldPlazaFishingCatchGroundDropTile
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWorldPlazaTerrainOccupiesWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainObstacleKindFromFeature';
import { DEFINING_WORLD_PLAZA_FISHING_CATCH_GROUND_DROP_NEIGHBOR_OFFSETS } from '@/components/world/fishing/domains/definingWorldPlazaFishingConstants';

export type ResolvingWorldPlazaFishingCatchGroundDropTile = {
  readonly tileX: number;
  readonly tileY: number;
};

export type ResolvingWorldPlazaFishingCatchGroundDropTileParams = {
  readonly playerPosition: DefiningWorldPlazaWorldPoint;
  /** Unit random in [0, 1). Inject for tests. */
  readonly rollUnit?: () => number;
  readonly checkingWaterAtTile?: (tileX: number, tileY: number) => boolean;
};

/**
 * Random Chebyshev-1 neighbor that is not water.
 * Falls back to the player tile when every neighbor is water.
 */
export function resolvingWorldPlazaFishingCatchGroundDropTile({
  playerPosition,
  rollUnit = Math.random,
  checkingWaterAtTile = checkingWorldPlazaTerrainOccupiesWaterAtTileIndex,
}: ResolvingWorldPlazaFishingCatchGroundDropTileParams): ResolvingWorldPlazaFishingCatchGroundDropTile {
  const playerTileX = Math.floor(playerPosition.x);
  const playerTileY = Math.floor(playerPosition.y);

  const landNeighbors: ResolvingWorldPlazaFishingCatchGroundDropTile[] = [];

  for (const offset of DEFINING_WORLD_PLAZA_FISHING_CATCH_GROUND_DROP_NEIGHBOR_OFFSETS) {
    const tileX = playerTileX + offset.offsetX;
    const tileY = playerTileY + offset.offsetY;

    if (checkingWaterAtTile(tileX, tileY)) {
      continue;
    }

    landNeighbors.push({ tileX, tileY });
  }

  if (landNeighbors.length === 0) {
    return { tileX: playerTileX, tileY: playerTileY };
  }

  const pickIndex = Math.min(
    landNeighbors.length - 1,
    Math.floor(rollUnit() * landNeighbors.length)
  );

  return landNeighbors[pickIndex]!;
}
