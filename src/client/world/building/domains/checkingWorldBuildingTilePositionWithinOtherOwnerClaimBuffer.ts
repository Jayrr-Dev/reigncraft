import { computingWorldBuildingTileChebyshevDistanceToPlotBounds } from "@/components/world/building/domains/computingWorldBuildingTileChebyshevDistanceToPlotBounds";
import { DEFINING_WORLD_BUILDING_PLOT_OTHER_OWNER_MIN_CLAIM_DISTANCE_TILES } from "@/components/world/building/domains/definingWorldBuildingPlotConstants";
import type { DefiningWorldBuildingPlot } from "@/components/world/building/domains/definingWorldBuildingPlot";
import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";

/**
 * Checks whether a claim tile sits inside another player's claim buffer.
 *
 * @module components/world/building/domains/checkingWorldBuildingTilePositionWithinOtherOwnerClaimBuffer
 */

/**
 * Returns true when the tile is closer than the minimum allowed distance to
 * any other player's plot.
 *
 * @param viewportPlots - Plots visible in the current claim session.
 * @param tilePosition - Candidate claim tile.
 * @param claimingOwnerUserId - Authenticated user attempting the claim.
 */
export function checkingWorldBuildingTilePositionWithinOtherOwnerClaimBuffer(
  viewportPlots: readonly DefiningWorldBuildingPlot[],
  tilePosition: DefiningWorldBuildingTilePosition,
  claimingOwnerUserId: string,
): boolean {
  const otherOwnerPlots = viewportPlots.filter(
    (plot) => plot.ownerId !== claimingOwnerUserId,
  );

  for (const plot of otherOwnerPlots) {
    const distanceToPlotBounds =
      computingWorldBuildingTileChebyshevDistanceToPlotBounds(
        tilePosition,
        plot.bounds,
      );

    if (
      distanceToPlotBounds <
      DEFINING_WORLD_BUILDING_PLOT_OTHER_OWNER_MIN_CLAIM_DISTANCE_TILES
    ) {
      return true;
    }
  }

  return false;
}

/**
 * User-facing rejection copy when a claim is too close to another player.
 */
export const CHECKING_WORLD_BUILDING_TILE_OTHER_OWNER_CLAIM_BUFFER_REJECTION_MESSAGE =
  "Stay at least 3 tiles away from other players' land." as const;
