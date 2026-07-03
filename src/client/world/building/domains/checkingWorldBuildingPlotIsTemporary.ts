import type { DefiningWorldBuildingPlot } from "@/components/world/building/domains/definingWorldBuildingPlot";

/**
 * Helpers for distinguishing temporary build tiles from permanent plot claims.
 *
 * @module components/world/building/domains/checkingWorldBuildingPlotIsTemporary
 */

/**
 * Returns true when a plot row represents a temporary build tile.
 *
 * @param plot - Plot aggregate.
 */
export function checkingWorldBuildingPlotIsTemporary(
  plot: DefiningWorldBuildingPlot,
): boolean {
  return plot.isTemporary === true;
}

/**
 * Returns true when a plot row represents a permanent plot claim.
 *
 * @param plot - Plot aggregate.
 */
export function checkingWorldBuildingPlotIsPermanent(
  plot: DefiningWorldBuildingPlot,
): boolean {
  return !checkingWorldBuildingPlotIsTemporary(plot);
}
