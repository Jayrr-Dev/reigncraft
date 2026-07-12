import { checkingWorldBuildingTileClaimableForOwner } from '@/components/world/building/domains/checkingWorldBuildingTileClaimableForOwner';
import {
  findingWorldBuildingPlotContainingTilePosition,
  type DefiningWorldBuildingPlot,
} from '@/components/world/building/domains/definingWorldBuildingPlot';
import type { DefiningWorldBuildingPlotOwnerLimits } from '@/components/world/building/domains/definingWorldBuildingPlotOwnerLimits';
import {
  creatingWorldBuildingTilePosition,
  formattingWorldBuildingTilePositionKey,
  type DefiningWorldBuildingTilePosition,
} from '@/components/world/building/domains/definingWorldBuildingTilePosition';

/**
 * Grid offsets used when expanding claimable tiles from owned plots
 * (8-connected: edges + corners).
 *
 * @module components/world/building/domains/listingWorldBuildingClaimableTilePositionsForOwner
 */

/** Neighbor offsets checked around each owned plot tile. */
const LISTING_WORLD_BUILDING_CLAIMABLE_TILE_NEIGHBOR_OFFSETS = [
  { tileX: 1, tileY: 0 },
  { tileX: -1, tileY: 0 },
  { tileX: 0, tileY: 1 },
  { tileX: 0, tileY: -1 },
  { tileX: 1, tileY: 1 },
  { tileX: 1, tileY: -1 },
  { tileX: -1, tileY: 1 },
  { tileX: -1, tileY: -1 },
] as const;

/**
 * Lists unclaimed tiles adjacent to the local player's owned plots.
 *
 * @param viewportPlots - Plots visible in the current claim session.
 * @param ownerUserId - Authenticated user id.
 * @param plotOwnerLimits - Per-user plot and tile caps.
 */
export function listingWorldBuildingClaimableTilePositionsForOwner(
  viewportPlots: readonly DefiningWorldBuildingPlot[],
  ownerUserId: string,
  plotOwnerLimits: DefiningWorldBuildingPlotOwnerLimits
): DefiningWorldBuildingTilePosition[] {
  const ownedPlots = viewportPlots.filter(
    (plot) => plot.ownerId === ownerUserId
  );

  if (ownedPlots.length === 0) {
    return [];
  }

  const claimableTileKeys = new Set<string>();
  const claimableTiles: DefiningWorldBuildingTilePosition[] = [];

  for (const plot of ownedPlots) {
    for (
      let tileY = plot.bounds.minTileY;
      tileY <= plot.bounds.maxTileY;
      tileY += 1
    ) {
      for (
        let tileX = plot.bounds.minTileX;
        tileX <= plot.bounds.maxTileX;
        tileX += 1
      ) {
        for (const offset of LISTING_WORLD_BUILDING_CLAIMABLE_TILE_NEIGHBOR_OFFSETS) {
          const candidateTilePosition = creatingWorldBuildingTilePosition(
            tileX + offset.tileX,
            tileY + offset.tileY
          );

          if (
            findingWorldBuildingPlotContainingTilePosition(
              viewportPlots,
              candidateTilePosition
            ) !== null
          ) {
            continue;
          }

          const candidateTileKey = formattingWorldBuildingTilePositionKey(
            candidateTilePosition
          );

          if (claimableTileKeys.has(candidateTileKey)) {
            continue;
          }

          if (
            !checkingWorldBuildingTileClaimableForOwner(
              viewportPlots,
              candidateTilePosition,
              ownerUserId,
              plotOwnerLimits
            )
          ) {
            continue;
          }

          claimableTileKeys.add(candidateTileKey);
          claimableTiles.push(candidateTilePosition);
        }
      }
    }
  }

  return claimableTiles;
}
