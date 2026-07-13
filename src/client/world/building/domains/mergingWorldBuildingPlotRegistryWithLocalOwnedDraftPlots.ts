import type { DefiningWorldBuildingPlot } from '@/components/world/building/domains/definingWorldBuildingPlot';

/**
 * Replaces the local player's registry plots with in-session draft ownership.
 *
 * Claim-mode capacity already reads the draft via viewport merge. The plots
 * list must use the same ownership snapshot so unclaims disappear immediately.
 *
 * @module components/world/building/domains/mergingWorldBuildingPlotRegistryWithLocalOwnedDraftPlots
 */

/**
 * Builds registry rows for claim-mode grouping with local draft ownership applied.
 *
 * @param registryPlots - Server plot registry rows.
 * @param localOwnedDraftPlots - Local player's plots from the active edit draft.
 * @param localUserId - Authenticated user id, if any.
 */
export function mergingWorldBuildingPlotRegistryWithLocalOwnedDraftPlots(
  registryPlots: readonly DefiningWorldBuildingPlot[],
  localOwnedDraftPlots: readonly DefiningWorldBuildingPlot[] | null | undefined,
  localUserId: string | null
): DefiningWorldBuildingPlot[] {
  if (!localUserId || !localOwnedDraftPlots) {
    return [...registryPlots];
  }

  const otherOwnerPlots = registryPlots.filter(
    (plot) => plot.ownerId !== localUserId
  );

  return [...otherOwnerPlots, ...localOwnedDraftPlots];
}
