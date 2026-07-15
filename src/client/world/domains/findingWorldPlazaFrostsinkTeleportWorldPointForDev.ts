import { computingWorldPlazaFrostsinkSiteCenterTileIndex } from '@/components/world/domains/computingWorldPlazaFrostsinkSiteCenterTileIndex';
import {
  DEFINING_WORLD_PLAZA_FROSTSINK_DISC_RADIUS_TILES,
  DEFINING_WORLD_PLAZA_FROSTSINK_DISCOVERY_MAX_RADIUS_GRID,
  DEFINING_WORLD_PLAZA_FROSTSINK_SITE_SPACING_CELL_TILES,
} from '@/components/world/domains/definingWorldPlazaFrostsinkBiomeConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  checkingWorldPlazaFrostsinkSiteActiveAtCenterTileIndex,
  resolvingWorldPlazaFrostsinkAtTileIndex,
} from '@/components/world/domains/resolvingWorldPlazaFrostsinkAtTileIndex';
import { resolvingWorldPlazaSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';

/**
 * Dev-only Frostsink teleport destination search.
 *
 * @module components/world/domains/findingWorldPlazaFrostsinkTeleportWorldPointForDev
 */

/**
 * Finds a world point just outside the nearest active Cryocore for dev teleport.
 */
export function findingWorldPlazaFrostsinkTeleportWorldPointForDev(): DefiningWorldPlazaWorldPoint | null {
  const cellSize = DEFINING_WORLD_PLAZA_FROSTSINK_SITE_SPACING_CELL_TILES;
  const searchCells =
    Math.ceil(
      DEFINING_WORLD_PLAZA_FROSTSINK_DISCOVERY_MAX_RADIUS_GRID / cellSize
    ) + 1;

  let nearestCenter: { tileX: number; tileY: number } | null = null;
  let nearestDistanceSquared = Number.POSITIVE_INFINITY;

  for (let cellY = -searchCells; cellY <= searchCells; cellY += 1) {
    for (let cellX = -searchCells; cellX <= searchCells; cellX += 1) {
      const probeTileX = cellX * cellSize + Math.floor(cellSize / 2);
      const probeTileY = cellY * cellSize + Math.floor(cellSize / 2);
      const center = computingWorldPlazaFrostsinkSiteCenterTileIndex(
        probeTileX,
        probeTileY
      );

      if (
        !checkingWorldPlazaFrostsinkSiteActiveAtCenterTileIndex(
          center.tileX,
          center.tileY
        )
      ) {
        continue;
      }

      const distanceSquared =
        center.tileX * center.tileX + center.tileY * center.tileY;

      if (distanceSquared >= nearestDistanceSquared) {
        continue;
      }

      nearestDistanceSquared = distanceSquared;
      nearestCenter = center;
    }
  }

  if (!nearestCenter) {
    return null;
  }

  const landingTileX =
    nearestCenter.tileX + DEFINING_WORLD_PLAZA_FROSTSINK_DISC_RADIUS_TILES + 2;
  const landingTileY = nearestCenter.tileY;
  const frostsink = resolvingWorldPlazaFrostsinkAtTileIndex(
    landingTileX,
    landingTileY
  );

  if (!frostsink) {
    return null;
  }

  const surfaceLayer = resolvingWorldPlazaSurfaceLayerAtTileIndex(
    landingTileX,
    landingTileY
  );

  return {
    x: landingTileX + 0.5,
    y: landingTileY + 0.5,
    layer: surfaceLayer,
  };
}
