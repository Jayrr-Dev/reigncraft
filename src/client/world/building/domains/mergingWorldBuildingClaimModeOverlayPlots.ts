import { checkingWorldBuildingPlotIsTemporary } from "@/components/world/building/domains/checkingWorldBuildingPlotIsTemporary";
import type { DefiningWorldBuildingPlot } from "@/components/world/building/domains/definingWorldBuildingPlot";

/**
 * Merges viewport plots with distant owned temporary tiles for claim overlays.
 *
 * @module components/world/building/domains/mergingWorldBuildingClaimModeOverlayPlots
 */

/**
 * Returns viewport plots plus owned temporary plots that fall outside the viewport query.
 *
 * @param viewportPlots - Plots loaded around the player.
 * @param ownedPlots - All plots owned by the local user.
 * @param localUserId - Authenticated user id.
 */
export function mergingWorldBuildingClaimModeOverlayPlots(
  viewportPlots: readonly DefiningWorldBuildingPlot[],
  ownedPlots: readonly DefiningWorldBuildingPlot[],
  localUserId: string | null,
): DefiningWorldBuildingPlot[] {
  if (!localUserId) {
    return [...viewportPlots];
  }

  const viewportPlotIds = new Set(viewportPlots.map((plot) => plot.plotId));
  const distantOwnedTemporaryPlots = ownedPlots.filter(
    (plot) =>
      plot.ownerId === localUserId &&
      checkingWorldBuildingPlotIsTemporary(plot) &&
      !viewportPlotIds.has(plot.plotId),
  );

  if (distantOwnedTemporaryPlots.length === 0) {
    return [...viewportPlots];
  }

  return [...viewportPlots, ...distantOwnedTemporaryPlots];
}
