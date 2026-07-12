import { checkingWorldBuildingPlotIsPermanent } from '@/components/world/building/domains/checkingWorldBuildingPlotIsTemporary';
import type { DefiningWorldBuildingPlot } from '@/components/world/building/domains/definingWorldBuildingPlot';
import type { DefiningWorldBuildingPlotBounds } from '@/components/world/building/domains/definingWorldBuildingPlotBounds';
import {
  groupingWorldBuildingPlotRegistryTilesIntoContiguousRegions,
  type DefiningWorldBuildingPlotRegistryContiguousRegion,
} from '@/components/world/building/domains/groupingWorldBuildingPlotRegistryTilesIntoContiguousRegions';

/**
 * Grouped plot registry row for claim mode sidebar lists.
 *
 * @module components/world/building/domains/definingWorldBuildingPlotRegistryOwnerGroup
 */

/** One owner's plots in the registry list. */
export interface DefiningWorldBuildingPlotRegistryOwnerGroup {
  ownerUserId: string;
  ownerDisplayLabel: string;
  /** Total tile claims owned by this player. */
  tileClaimCount: number;
  /** Logical plots (8-connected claim blobs) owned by this player. */
  ownedPlotCount: number;
  plots: DefiningWorldBuildingPlot[];
  contiguousRegions: DefiningWorldBuildingPlotRegistryContiguousRegion[];
  isLocalPlayer: boolean;
}

/**
 * Groups registry plots by owner for the claim mode sidebar.
 *
 * @param registryPlots - All plots from the registry query.
 * @param localUserId - Authenticated user id, if any.
 * @param ownerDisplayLabelByUserId - Resolved owner labels keyed by user id.
 */
export function groupingWorldBuildingPlotRegistryEntriesByOwner(
  registryPlots: readonly DefiningWorldBuildingPlot[],
  localUserId: string | null,
  ownerDisplayLabelByUserId: Readonly<Record<string, string>>
): DefiningWorldBuildingPlotRegistryOwnerGroup[] {
  const plotsByOwnerId = new Map<string, DefiningWorldBuildingPlot[]>();

  for (const plot of registryPlots) {
    if (!checkingWorldBuildingPlotIsPermanent(plot)) {
      continue;
    }

    const existingPlots = plotsByOwnerId.get(plot.ownerId) ?? [];
    existingPlots.push(plot);
    plotsByOwnerId.set(plot.ownerId, existingPlots);
  }

  const ownerGroups: DefiningWorldBuildingPlotRegistryOwnerGroup[] = [];

  for (const [ownerUserId, plots] of plotsByOwnerId.entries()) {
    const sortedPlots = [...plots].sort((leftPlot, rightPlot) =>
      rightPlot.createdAt.localeCompare(leftPlot.createdAt)
    );

    const contiguousRegions =
      groupingWorldBuildingPlotRegistryTilesIntoContiguousRegions(sortedPlots);

    ownerGroups.push({
      ownerUserId,
      ownerDisplayLabel:
        ownerDisplayLabelByUserId[ownerUserId]?.trim() || 'Member',
      tileClaimCount: plots.length,
      ownedPlotCount: contiguousRegions.length,
      plots: sortedPlots,
      contiguousRegions,
      isLocalPlayer: Boolean(localUserId) && ownerUserId === localUserId,
    });
  }

  return ownerGroups.sort((leftGroup, rightGroup) => {
    if (leftGroup.isLocalPlayer !== rightGroup.isLocalPlayer) {
      return leftGroup.isLocalPlayer ? -1 : 1;
    }

    if (leftGroup.tileClaimCount !== rightGroup.tileClaimCount) {
      return rightGroup.tileClaimCount - leftGroup.tileClaimCount;
    }

    return leftGroup.ownerDisplayLabel.localeCompare(
      rightGroup.ownerDisplayLabel
    );
  });
}

/**
 * Keeps only the signed-in viewer's plot groups for claim mode UI.
 *
 * @param ownerGroups - Registry rows grouped by owner
 * @param localUserId - Authenticated user id, if any
 */
export function filteringWorldBuildingPlotRegistryOwnerGroupsForLocalViewer(
  ownerGroups: readonly DefiningWorldBuildingPlotRegistryOwnerGroup[],
  localUserId: string | null
): DefiningWorldBuildingPlotRegistryOwnerGroup[] {
  if (!localUserId) {
    return [];
  }

  return ownerGroups.filter((ownerGroup) => ownerGroup.isLocalPlayer);
}

/**
 * Keeps the viewer's plots and non-unfriended players' plots for claim mode UI.
 *
 * Everyone is a friend by default unless listed in {@link unfriendedUserIds}.
 *
 * @param ownerGroups - Registry rows grouped by owner
 * @param localUserId - Authenticated user id, if any
 * @param unfriendedUserIds - Auth user ids the viewer has unfriended
 */
export function filteringWorldBuildingPlotRegistryOwnerGroupsForClaimModeViewer(
  ownerGroups: readonly DefiningWorldBuildingPlotRegistryOwnerGroup[],
  localUserId: string | null,
  unfriendedUserIds: ReadonlySet<string>
): DefiningWorldBuildingPlotRegistryOwnerGroup[] {
  if (!localUserId) {
    return [];
  }

  return ownerGroups.filter(
    (ownerGroup) =>
      ownerGroup.isLocalPlayer || !unfriendedUserIds.has(ownerGroup.ownerUserId)
  );
}

/**
 * Formats a plot tile coordinate label for registry list rows.
 *
 * @param plot - Claimed plot aggregate.
 */
export function formattingWorldBuildingPlotRegistryTileLabel(
  plot: DefiningWorldBuildingPlot
): string {
  return formattingWorldBuildingPlotRegistryBoundsLabel(plot.bounds);
}

/**
 * Formats inclusive plot bounds for registry list rows.
 *
 * @param bounds - Plot tile bounds.
 */
export function formattingWorldBuildingPlotRegistryBoundsLabel(
  bounds: DefiningWorldBuildingPlotBounds
): string {
  const { minTileX, minTileY, maxTileX, maxTileY } = bounds;

  if (minTileX === maxTileX && minTileY === maxTileY) {
    return `(${minTileX}, ${minTileY})`;
  }

  return `(${minTileX}, ${minTileY}) to (${maxTileX}, ${maxTileY})`;
}
