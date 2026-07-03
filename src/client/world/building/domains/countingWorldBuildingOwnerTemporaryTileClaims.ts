import { checkingWorldBuildingPlotIsTemporary } from "@/components/world/building/domains/checkingWorldBuildingPlotIsTemporary";
import type { DefiningWorldBuildingPlotOwnerLimits } from "@/components/world/building/domains/definingWorldBuildingPlotOwnerLimits";
import type { DefiningWorldBuildingPlot } from "@/components/world/building/domains/definingWorldBuildingPlot";

/**
 * Counts temporary tile claims for claim-mode limits.
 *
 * @module components/world/building/domains/countingWorldBuildingOwnerTemporaryTileClaims
 */

/**
 * User-facing copy when a player reaches their temporary tile cap.
 *
 * @param maxTemporaryTileCount - Per-user temporary tile cap.
 */
export function formattingWorldBuildingOwnerMaxTemporaryTileClaimRejectionMessage(
  maxTemporaryTileCount: number,
): string {
  return `You can have up to ${maxTemporaryTileCount} temporary tiles. Remove one before claiming another.`;
}

/**
 * Counts temporary tile claims owned by a player.
 *
 * @param plots - Viewport and draft plots visible to the claim session.
 * @param ownerUserId - Authenticated user id.
 */
export function countingWorldBuildingOwnerTemporaryTileClaims(
  plots: readonly DefiningWorldBuildingPlot[],
  ownerUserId: string,
): number {
  let temporaryTileCount = 0;

  for (const plot of plots) {
    if (plot.ownerId === ownerUserId && checkingWorldBuildingPlotIsTemporary(plot)) {
      temporaryTileCount += 1;
    }
  }

  return temporaryTileCount;
}

/**
 * Returns true when the player already owns the maximum number of temporary tiles.
 *
 * @param plots - Viewport and draft plots visible to the claim session.
 * @param ownerUserId - Authenticated user id.
 * @param plotOwnerLimits - Per-user plot and tile caps.
 */
export function checkingWorldBuildingOwnerHasReachedMaxTemporaryTileClaimCount(
  plots: readonly DefiningWorldBuildingPlot[],
  ownerUserId: string,
  plotOwnerLimits: DefiningWorldBuildingPlotOwnerLimits,
): boolean {
  return (
    countingWorldBuildingOwnerTemporaryTileClaims(plots, ownerUserId) >=
    plotOwnerLimits.maxTemporaryTileCount
  );
}
