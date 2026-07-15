import { computingWorldBuildingTileChebyshevDistanceToPlotBounds } from '@/components/world/building/domains/computingWorldBuildingTileChebyshevDistanceToPlotBounds';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { DefiningWorldBuildingPlot } from '@/components/world/building/domains/definingWorldBuildingPlot';
import {
  DEFINING_WORLD_PLAZA_INFINITE_MAP_SPAWN_X_PX,
  DEFINING_WORLD_PLAZA_INFINITE_MAP_SPAWN_Y_PX,
} from '@/components/world/domains/definingWorldPlazaInfiniteMapConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from '@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint';
import { resolvingWorldPlazaWorldPointNearPlotBoundsForTeleport } from '@/components/world/domains/resolvingWorldPlazaWorldPointNearPlotBoundsForTeleport';

/**
 * Picks a remake spawn near the nearest owned claim, or origin when none exist.
 *
 * @module components/world/health/domains/resolvingWorldPlazaNearestOwnedClaimRespawnWorldPoint
 */

/** World origin used when the player has no owned claims. */
export const DEFINING_WORLD_PLAZA_DEATH_RESPAWN_ORIGIN_WORLD_POINT = {
  x: DEFINING_WORLD_PLAZA_INFINITE_MAP_SPAWN_X_PX,
  y: DEFINING_WORLD_PLAZA_INFINITE_MAP_SPAWN_Y_PX,
  layer: 1,
} as const satisfies DefiningWorldPlazaWorldPoint;

/**
 * Returns a walkable remake point beside the nearest owned plot to `fromWorldPoint`.
 * Falls back to origin (0, 0) when the player owns no claims.
 *
 * @param fromWorldPoint - Death / current position used for nearest-claim search.
 * @param ownedPlots - Plots owned by the local player (including temporary drafts).
 * @param placedBlocks - Blocks used for walkability near the chosen claim.
 */
export function resolvingWorldPlazaNearestOwnedClaimRespawnWorldPoint(
  fromWorldPoint: DefiningWorldPlazaWorldPoint,
  ownedPlots: readonly DefiningWorldBuildingPlot[],
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[] = []
): DefiningWorldPlazaWorldPoint {
  if (ownedPlots.length === 0) {
    return { ...DEFINING_WORLD_PLAZA_DEATH_RESPAWN_ORIGIN_WORLD_POINT };
  }

  const fromTile =
    resolvingWorldPlazaIsometricTileIndexAtGridPoint(fromWorldPoint);
  let nearestPlot: DefiningWorldBuildingPlot | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const plot of ownedPlots) {
    const distanceToBounds =
      computingWorldBuildingTileChebyshevDistanceToPlotBounds(
        { tileX: fromTile.tileX, tileY: fromTile.tileY },
        plot.bounds
      );

    if (distanceToBounds >= nearestDistance) {
      continue;
    }

    nearestDistance = distanceToBounds;
    nearestPlot = plot;
  }

  if (!nearestPlot) {
    return { ...DEFINING_WORLD_PLAZA_DEATH_RESPAWN_ORIGIN_WORLD_POINT };
  }

  return resolvingWorldPlazaWorldPointNearPlotBoundsForTeleport(
    nearestPlot.bounds,
    placedBlocks
  );
}
