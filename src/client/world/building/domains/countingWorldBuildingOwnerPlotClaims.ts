import { checkingWorldBuildingPlotIsPermanent } from '@/components/world/building/domains/checkingWorldBuildingPlotIsTemporary';
import type { DefiningWorldBuildingPlot } from '@/components/world/building/domains/definingWorldBuildingPlot';
import type { DefiningWorldBuildingPlotOwnerLimits } from '@/components/world/building/domains/definingWorldBuildingPlotOwnerLimits';
import { groupingWorldBuildingPlotRegistryTilesIntoContiguousRegions } from '@/components/world/building/domains/groupingWorldBuildingPlotRegistryTilesIntoContiguousRegions';

/**
 * Counts owned plots and tile claims for claim-mode limits.
 *
 * A plot is one 8-connected group of claimed tiles (edge or corner touch).
 * Each tile claim is still stored as its own row until a future consolidation pass.
 *
 * @module components/world/building/domains/countingWorldBuildingOwnerPlotClaims
 */

/**
 * User-facing copy when a player reaches their tile claim cap.
 *
 * @param maxTileClaimCount - Per-user tile claim cap.
 */
export function formattingWorldBuildingOwnerMaxTileClaimRejectionMessage(
  maxTileClaimCount: number
): string {
  return `Your plot can include up to ${maxTileClaimCount} tiles. Unclaim one before claiming more.`;
}

/**
 * User-facing copy when a player reaches their owned plot cap.
 *
 * @param maxOwnedPlotCount - Per-user plot cap.
 */
export function formattingWorldBuildingOwnerMaxOwnedPlotRejectionMessage(
  maxOwnedPlotCount: number
): string {
  if (maxOwnedPlotCount === 1) {
    return 'You can only have one plot. Claim tiles next to your land to expand it.';
  }

  return `You can own up to ${maxOwnedPlotCount} plots. Expand an existing plot or unclaim tiles before starting another base.`;
}

/**
 * Counts tile claims owned by a player in the effective plot list.
 *
 * @param plots - Viewport and draft plots visible to the claim session.
 * @param ownerUserId - Authenticated user id.
 */
export function countingWorldBuildingOwnerPlotTileClaims(
  plots: readonly DefiningWorldBuildingPlot[],
  ownerUserId: string
): number {
  const ownedPlotIds = new Set<string>();

  for (const plot of plots) {
    if (
      plot.ownerId === ownerUserId &&
      checkingWorldBuildingPlotIsPermanent(plot)
    ) {
      ownedPlotIds.add(plot.plotId);
    }
  }

  return ownedPlotIds.size;
}

/**
 * Counts logical plots (contiguous claim regions) owned by a player.
 *
 * @param plots - Viewport and draft plots visible to the claim session.
 * @param ownerUserId - Authenticated user id.
 */
export function countingWorldBuildingOwnerOwnedPlotCount(
  plots: readonly DefiningWorldBuildingPlot[],
  ownerUserId: string
): number {
  const ownedPlots = plots.filter(
    (plot) =>
      plot.ownerId === ownerUserId && checkingWorldBuildingPlotIsPermanent(plot)
  );

  return groupingWorldBuildingPlotRegistryTilesIntoContiguousRegions(ownedPlots)
    .length;
}

/**
 * @deprecated Use {@link countingWorldBuildingOwnerPlotTileClaims}.
 */
export function countingWorldBuildingOwnerPlotClaims(
  plots: readonly DefiningWorldBuildingPlot[],
  ownerUserId: string
): number {
  return countingWorldBuildingOwnerPlotTileClaims(plots, ownerUserId);
}

/**
 * Returns true when the player already owns the maximum number of tile claims.
 *
 * @param plots - Viewport and draft plots visible to the claim session.
 * @param ownerUserId - Authenticated user id.
 * @param plotOwnerLimits - Per-user plot and tile caps.
 */
export function checkingWorldBuildingOwnerHasReachedMaxTileClaimCount(
  plots: readonly DefiningWorldBuildingPlot[],
  ownerUserId: string,
  plotOwnerLimits: DefiningWorldBuildingPlotOwnerLimits
): boolean {
  return (
    countingWorldBuildingOwnerPlotTileClaims(plots, ownerUserId) >=
    plotOwnerLimits.maxTileClaimCount
  );
}

/**
 * Returns true when the player already owns the maximum number of plots.
 *
 * @param plots - Viewport and draft plots visible to the claim session.
 * @param ownerUserId - Authenticated user id.
 * @param plotOwnerLimits - Per-user plot and tile caps.
 */
export function checkingWorldBuildingOwnerHasReachedMaxOwnedPlotCount(
  plots: readonly DefiningWorldBuildingPlot[],
  ownerUserId: string,
  plotOwnerLimits: DefiningWorldBuildingPlotOwnerLimits
): boolean {
  return (
    countingWorldBuildingOwnerOwnedPlotCount(plots, ownerUserId) >=
    plotOwnerLimits.maxOwnedPlotCount
  );
}

/**
 * @deprecated Use {@link checkingWorldBuildingOwnerHasReachedMaxTileClaimCount}.
 */
export function checkingWorldBuildingOwnerHasReachedMaxPlotClaimCount(
  plots: readonly DefiningWorldBuildingPlot[],
  ownerUserId: string,
  plotOwnerLimits: DefiningWorldBuildingPlotOwnerLimits
): boolean {
  return checkingWorldBuildingOwnerHasReachedMaxTileClaimCount(
    plots,
    ownerUserId,
    plotOwnerLimits
  );
}
