import { checkingWorldBuildingPlotIsTemporary } from "@/components/world/building/domains/checkingWorldBuildingPlotIsTemporary";
import type { DefiningWorldBuildingPlot } from "@/components/world/building/domains/definingWorldBuildingPlot";

/**
 * Lists temporary build tiles owned by one player.
 *
 * @module components/world/building/domains/listingWorldBuildingTemporaryPlotsForOwner
 */

/**
 * Returns temporary plots owned by the authenticated player, newest first.
 *
 * @param plots - Effective plot list for the active session.
 * @param ownerUserId - Authenticated user id.
 */
export function listingWorldBuildingTemporaryPlotsForOwner(
  plots: readonly DefiningWorldBuildingPlot[],
  ownerUserId: string,
): DefiningWorldBuildingPlot[] {
  return plots
    .filter(
      (plot) =>
        plot.ownerId === ownerUserId && checkingWorldBuildingPlotIsTemporary(plot),
    )
    .sort((leftPlot, rightPlot) =>
      rightPlot.createdAt.localeCompare(leftPlot.createdAt),
    );
}
