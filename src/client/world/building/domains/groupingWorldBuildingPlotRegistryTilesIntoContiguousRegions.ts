import type { DefiningWorldBuildingPlot } from '@/components/world/building/domains/definingWorldBuildingPlot';
import type { DefiningWorldBuildingPlotBounds } from '@/components/world/building/domains/definingWorldBuildingPlotBounds';

/**
 * Contiguous tile regions derived from one-tile plot claims for claim mode lists.
 * Contiguity is 8-connected (shared edge or corner).
 *
 * @module components/world/building/domains/groupingWorldBuildingPlotRegistryTilesIntoContiguousRegions
 */

/** One 8-connected claim blob (edge or corner adjacency). */
export interface DefiningWorldBuildingPlotRegistryContiguousRegion {
  /** Inclusive AABB covering the claimed tiles (may include empty cells). */
  bounds: DefiningWorldBuildingPlotBounds;
  /** Actual claimed tile count in this component. */
  tileCount: number;
}

/** Tile coordinate on the plot registry grid. */
interface DefiningWorldBuildingPlotRegistryTileCoordinate {
  tileX: number;
  tileY: number;
}

/**
 * Edge + corner neighbor offsets for 8-connected tile adjacency.
 * Matches claim expansion (`listingWorldBuildingClaimableTilePositionsForOwner`).
 */
const GROUPING_WORLD_BUILDING_PLOT_REGISTRY_TILE_NEIGHBOR_OFFSETS = [
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
 * Builds a stable lookup key for a tile coordinate.
 *
 * @param tileX - Tile column.
 * @param tileY - Tile row.
 */
function formattingWorldBuildingPlotRegistryTileCoordinateKey(
  tileX: number,
  tileY: number
): string {
  return `${tileX},${tileY}`;
}

/**
 * Expands plot bounds into individual tile coordinates.
 *
 * @param plots - Claimed plot aggregates.
 */
function listingWorldBuildingPlotRegistryTileCoordinatesFromPlots(
  plots: readonly DefiningWorldBuildingPlot[]
): DefiningWorldBuildingPlotRegistryTileCoordinate[] {
  const tileCoordinateKeys = new Set<string>();
  const tileCoordinates: DefiningWorldBuildingPlotRegistryTileCoordinate[] = [];

  for (const plot of plots) {
    for (
      let tileX = plot.bounds.minTileX;
      tileX <= plot.bounds.maxTileX;
      tileX += 1
    ) {
      for (
        let tileY = plot.bounds.minTileY;
        tileY <= plot.bounds.maxTileY;
        tileY += 1
      ) {
        const tileKey = formattingWorldBuildingPlotRegistryTileCoordinateKey(
          tileX,
          tileY
        );

        if (tileCoordinateKeys.has(tileKey)) {
          continue;
        }

        tileCoordinateKeys.add(tileKey);
        tileCoordinates.push({ tileX, tileY });
      }
    }
  }

  return tileCoordinates;
}

/**
 * Finds 8-connected tile components from a coordinate set.
 *
 * @param tileCoordinates - All claimed tile coordinates for one owner.
 */
function groupingWorldBuildingPlotRegistryTileCoordinatesIntoConnectedComponents(
  tileCoordinates: readonly DefiningWorldBuildingPlotRegistryTileCoordinate[]
): DefiningWorldBuildingPlotRegistryTileCoordinate[][] {
  const tileKeySet = new Set(
    tileCoordinates.map((tileCoordinate) =>
      formattingWorldBuildingPlotRegistryTileCoordinateKey(
        tileCoordinate.tileX,
        tileCoordinate.tileY
      )
    )
  );
  const visitedTileKeys = new Set<string>();
  const connectedComponents: DefiningWorldBuildingPlotRegistryTileCoordinate[][] =
    [];

  for (const startTile of tileCoordinates) {
    const startTileKey = formattingWorldBuildingPlotRegistryTileCoordinateKey(
      startTile.tileX,
      startTile.tileY
    );

    if (visitedTileKeys.has(startTileKey)) {
      continue;
    }

    const componentTiles: DefiningWorldBuildingPlotRegistryTileCoordinate[] =
      [];
    const pendingTileKeys = [startTileKey];
    visitedTileKeys.add(startTileKey);

    while (pendingTileKeys.length > 0) {
      const currentTileKey = pendingTileKeys.pop();

      if (!currentTileKey) {
        continue;
      }

      const [tileXText, tileYText] = currentTileKey.split(',');
      const tileX = Number(tileXText);
      const tileY = Number(tileYText);
      componentTiles.push({ tileX, tileY });

      for (const neighborOffset of GROUPING_WORLD_BUILDING_PLOT_REGISTRY_TILE_NEIGHBOR_OFFSETS) {
        const neighborTileKey =
          formattingWorldBuildingPlotRegistryTileCoordinateKey(
            tileX + neighborOffset.tileX,
            tileY + neighborOffset.tileY
          );

        if (
          !tileKeySet.has(neighborTileKey) ||
          visitedTileKeys.has(neighborTileKey)
        ) {
          continue;
        }

        visitedTileKeys.add(neighborTileKey);
        pendingTileKeys.push(neighborTileKey);
      }
    }

    connectedComponents.push(componentTiles);
  }

  return connectedComponents;
}

/**
 * Builds inclusive AABB bounds for one connected tile component.
 *
 * @param componentTiles - One connected tile component.
 */
function resolvingWorldBuildingPlotRegistryBoundsFromTiles(
  componentTiles: readonly DefiningWorldBuildingPlotRegistryTileCoordinate[]
): DefiningWorldBuildingPlotBounds | null {
  if (componentTiles.length === 0) {
    return null;
  }

  let minTileX = componentTiles[0].tileX;
  let maxTileX = componentTiles[0].tileX;
  let minTileY = componentTiles[0].tileY;
  let maxTileY = componentTiles[0].tileY;

  for (const tileCoordinate of componentTiles) {
    minTileX = Math.min(minTileX, tileCoordinate.tileX);
    maxTileX = Math.max(maxTileX, tileCoordinate.tileX);
    minTileY = Math.min(minTileY, tileCoordinate.tileY);
    maxTileY = Math.max(maxTileY, tileCoordinate.tileY);
  }

  return {
    minTileX,
    minTileY,
    maxTileX,
    maxTileY,
  };
}

/**
 * Sorts contiguous regions for stable claim list display.
 *
 * @param leftRegion - First region.
 * @param rightRegion - Second region.
 */
function comparingWorldBuildingPlotRegistryContiguousRegionsForDisplay(
  leftRegion: DefiningWorldBuildingPlotRegistryContiguousRegion,
  rightRegion: DefiningWorldBuildingPlotRegistryContiguousRegion
): number {
  if (leftRegion.bounds.minTileY !== rightRegion.bounds.minTileY) {
    return leftRegion.bounds.minTileY - rightRegion.bounds.minTileY;
  }

  if (leftRegion.bounds.minTileX !== rightRegion.bounds.minTileX) {
    return leftRegion.bounds.minTileX - rightRegion.bounds.minTileX;
  }

  if (leftRegion.bounds.maxTileY !== rightRegion.bounds.maxTileY) {
    return leftRegion.bounds.maxTileY - rightRegion.bounds.maxTileY;
  }

  return leftRegion.bounds.maxTileX - rightRegion.bounds.maxTileX;
}

/**
 * Groups one owner's plot claims into contiguous regions for the claim sidebar.
 *
 * One region = one 8-connected component (edge or corner touch counts).
 *
 * @param plots - All claimed plots for one owner.
 */
export function groupingWorldBuildingPlotRegistryTilesIntoContiguousRegions(
  plots: readonly DefiningWorldBuildingPlot[]
): DefiningWorldBuildingPlotRegistryContiguousRegion[] {
  const tileCoordinates =
    listingWorldBuildingPlotRegistryTileCoordinatesFromPlots(plots);

  if (tileCoordinates.length === 0) {
    return [];
  }

  const connectedComponents =
    groupingWorldBuildingPlotRegistryTileCoordinatesIntoConnectedComponents(
      tileCoordinates
    );
  const contiguousRegions: DefiningWorldBuildingPlotRegistryContiguousRegion[] =
    [];

  for (const componentTiles of connectedComponents) {
    const bounds =
      resolvingWorldBuildingPlotRegistryBoundsFromTiles(componentTiles);

    if (!bounds) {
      continue;
    }

    contiguousRegions.push({
      bounds,
      tileCount: componentTiles.length,
    });
  }

  return contiguousRegions.sort(
    comparingWorldBuildingPlotRegistryContiguousRegionsForDisplay
  );
}

/**
 * Formats contiguous region bounds for claim mode list badges.
 *
 * @param bounds - Inclusive tile bounds for one region.
 */
export function formattingWorldBuildingPlotRegistryContiguousRegionLabel(
  bounds: DefiningWorldBuildingPlotBounds
): string {
  const { minTileX, minTileY, maxTileX, maxTileY } = bounds;

  if (minTileX === maxTileX && minTileY === maxTileY) {
    return `(${minTileX}, ${minTileY})`;
  }

  return `(${minTileX}, ${minTileY}) to (${maxTileX}, ${maxTileY})`;
}
