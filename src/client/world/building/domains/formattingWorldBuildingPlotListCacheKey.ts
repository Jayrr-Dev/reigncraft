import type { DefiningWorldBuildingPlot } from "@/components/world/building/domains/definingWorldBuildingPlot";

/**
 * Cache keys for build plot overlay redraw decisions.
 *
 * @module components/world/building/domains/formattingWorldBuildingPlotListCacheKey
 */

/**
 * Builds a stable cache key from owned plot ids and bounds.
 *
 * @param plots - Owned plots visible to the local player.
 */
export function formattingWorldBuildingPlotListCacheKey(
  plots: readonly DefiningWorldBuildingPlot[],
): string {
  return plots
    .map(
      (plot) =>
        `${plot.plotId}:${plot.isTemporary ? "temp" : "perm"}:${plot.bounds.minTileX},${plot.bounds.minTileY},${plot.bounds.maxTileX},${plot.bounds.maxTileY}`,
    )
    .join("|");
}
