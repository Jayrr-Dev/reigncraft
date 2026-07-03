import type { DefiningWorldBuildingPlot } from "@/components/world/building/domains/definingWorldBuildingPlot";
import type { DefiningWorldBuildingPlotBounds } from "@/components/world/building/domains/definingWorldBuildingPlotBounds";

/**
 * Contiguous tile regions derived from one-tile plot claims for claim mode lists.
 *
 * @module components/world/building/domains/groupingWorldBuildingPlotRegistryTilesIntoContiguousRegions
 */

/** One contiguous run or filled rectangle of claimed tiles. */
export interface DefiningWorldBuildingPlotRegistryContiguousRegion {
  bounds: DefiningWorldBuildingPlotBounds;
  tileCount: number;
}

/** Tile coordinate on the plot registry grid. */
interface DefiningWorldBuildingPlotRegistryTileCoordinate {
  tileX: number;
  tileY: number;
}

/** Cardinal neighbor offsets for 4-connected tile adjacency. */
const GROUPING_WORLD_BUILDING_PLOT_REGISTRY_TILE_NEIGHBOR_OFFSETS = [
  { tileX: 1, tileY: 0 },
  { tileX: -1, tileY: 0 },
  { tileX: 0, tileY: 1 },
  { tileX: 0, tileY: -1 },
] as const;

/**
 * Builds a stable lookup key for a tile coordinate.
 *
 * @param tileX - Tile column.
 * @param tileY - Tile row.
 */
function formattingWorldBuildingPlotRegistryTileCoordinateKey(
  tileX: number,
  tileY: number,
): string {
  return `${tileX},${tileY}`;
}

/**
 * Expands plot bounds into individual tile coordinates.
 *
 * @param plots - Claimed plot aggregates.
 */
function listingWorldBuildingPlotRegistryTileCoordinatesFromPlots(
  plots: readonly DefiningWorldBuildingPlot[],
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
          tileY,
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
 * Finds 4-connected tile components from a coordinate set.
 *
 * @param tileCoordinates - All claimed tile coordinates for one owner.
 */
function groupingWorldBuildingPlotRegistryTileCoordinatesIntoConnectedComponents(
  tileCoordinates: readonly DefiningWorldBuildingPlotRegistryTileCoordinate[],
): DefiningWorldBuildingPlotRegistryTileCoordinate[][] {
  const tileKeySet = new Set(
    tileCoordinates.map((tileCoordinate) =>
      formattingWorldBuildingPlotRegistryTileCoordinateKey(
        tileCoordinate.tileX,
        tileCoordinate.tileY,
      ),
    ),
  );
  const visitedTileKeys = new Set<string>();
  const connectedComponents: DefiningWorldBuildingPlotRegistryTileCoordinate[][] =
    [];

  for (const startTile of tileCoordinates) {
    const startTileKey = formattingWorldBuildingPlotRegistryTileCoordinateKey(
      startTile.tileX,
      startTile.tileY,
    );

    if (visitedTileKeys.has(startTileKey)) {
      continue;
    }

    const componentTiles: DefiningWorldBuildingPlotRegistryTileCoordinate[] = [];
    const pendingTileKeys = [startTileKey];
    visitedTileKeys.add(startTileKey);

    while (pendingTileKeys.length > 0) {
      const currentTileKey = pendingTileKeys.pop();

      if (!currentTileKey) {
        continue;
      }

      const [tileXText, tileYText] = currentTileKey.split(",");
      const tileX = Number(tileXText);
      const tileY = Number(tileYText);
      componentTiles.push({ tileX, tileY });

      for (const neighborOffset of GROUPING_WORLD_BUILDING_PLOT_REGISTRY_TILE_NEIGHBOR_OFFSETS) {
        const neighborTileKey = formattingWorldBuildingPlotRegistryTileCoordinateKey(
          tileX + neighborOffset.tileX,
          tileY + neighborOffset.tileY,
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
 * Returns filled-rectangle bounds when every tile in the box is claimed.
 *
 * @param componentTiles - One connected tile component.
 */
function resolvingWorldBuildingPlotRegistryFilledRectangleBoundsFromTiles(
  componentTiles: readonly DefiningWorldBuildingPlotRegistryTileCoordinate[],
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

  const boundsWidth = maxTileX - minTileX + 1;
  const boundsHeight = maxTileY - minTileY + 1;

  if (componentTiles.length !== boundsWidth * boundsHeight) {
    return null;
  }

  return {
    minTileX,
    minTileY,
    maxTileX,
    maxTileY,
  };
}

/**
 * Lists every maximal horizontal or vertical run inside a tile set.
 *
 * @param componentTiles - Connected tile component.
 * @param axis - Axis to scan for consecutive runs.
 */
function listingWorldBuildingPlotRegistryMaximalTileRunsAlongAxis(
  componentTiles: readonly DefiningWorldBuildingPlotRegistryTileCoordinate[],
  axis: "horizontal" | "vertical",
): DefiningWorldBuildingPlotBounds[] {
  const tileRuns: DefiningWorldBuildingPlotBounds[] = [];

  if (axis === "horizontal") {
    const tileYs = [
      ...new Set(componentTiles.map((tileCoordinate) => tileCoordinate.tileY)),
    ].sort((leftValue, rightValue) => leftValue - rightValue);

    for (const tileY of tileYs) {
      const tileXs = componentTiles
        .filter((tileCoordinate) => tileCoordinate.tileY === tileY)
        .map((tileCoordinate) => tileCoordinate.tileX)
        .sort((leftValue, rightValue) => leftValue - rightValue);

      let runStart = tileXs[0];
      let runEnd = tileXs[0];

      for (let index = 1; index < tileXs.length; index += 1) {
        const nextTileX = tileXs[index];

        if (nextTileX === runEnd + 1) {
          runEnd = nextTileX;
          continue;
        }

        tileRuns.push({
          minTileX: runStart,
          maxTileX: runEnd,
          minTileY: tileY,
          maxTileY: tileY,
        });
        runStart = nextTileX;
        runEnd = nextTileX;
      }

      tileRuns.push({
        minTileX: runStart,
        maxTileX: runEnd,
        minTileY: tileY,
        maxTileY: tileY,
      });
    }

    return tileRuns;
  }

  const tileXs = [
    ...new Set(componentTiles.map((tileCoordinate) => tileCoordinate.tileX)),
  ].sort((leftValue, rightValue) => leftValue - rightValue);

  for (const tileX of tileXs) {
    const tileYs = componentTiles
      .filter((tileCoordinate) => tileCoordinate.tileX === tileX)
      .map((tileCoordinate) => tileCoordinate.tileY)
      .sort((leftValue, rightValue) => leftValue - rightValue);

    let runStart = tileYs[0];
    let runEnd = tileYs[0];

    for (let index = 1; index < tileYs.length; index += 1) {
      const nextTileY = tileYs[index];

      if (nextTileY === runEnd + 1) {
        runEnd = nextTileY;
        continue;
      }

      tileRuns.push({
        minTileX: tileX,
        maxTileX: tileX,
        minTileY: runStart,
        maxTileY: runEnd,
      });
      runStart = nextTileY;
      runEnd = nextTileY;
    }

    tileRuns.push({
      minTileX: tileX,
      maxTileX: tileX,
      minTileY: runStart,
      maxTileY: runEnd,
    });
  }

  return tileRuns;
}

/**
 * Returns the tile keys covered by inclusive bounds.
 *
 * @param bounds - Inclusive tile bounds.
 */
function listingWorldBuildingPlotRegistryTileKeysInBounds(
  bounds: DefiningWorldBuildingPlotBounds,
): string[] {
  const tileKeys: string[] = [];

  for (let tileX = bounds.minTileX; tileX <= bounds.maxTileX; tileX += 1) {
    for (let tileY = bounds.minTileY; tileY <= bounds.maxTileY; tileY += 1) {
      tileKeys.push(
        formattingWorldBuildingPlotRegistryTileCoordinateKey(tileX, tileY),
      );
    }
  }

  return tileKeys;
}

/**
 * Counts tiles in one inclusive bounds run.
 *
 * @param bounds - Inclusive tile bounds.
 */
function countingWorldBuildingPlotRegistryTilesInBounds(
  bounds: DefiningWorldBuildingPlotBounds,
): number {
  return listingWorldBuildingPlotRegistryTileKeysInBounds(bounds).length;
}

/**
 * Greedily splits an irregular component into the fewest line segments.
 *
 * @param componentTiles - Connected tile component.
 */
function listingWorldBuildingPlotRegistryGreedyTileRunsForComponent(
  componentTiles: readonly DefiningWorldBuildingPlotRegistryTileCoordinate[],
): DefiningWorldBuildingPlotBounds[] {
  const remainingTileKeys = new Set(
    componentTiles.map((tileCoordinate) =>
      formattingWorldBuildingPlotRegistryTileCoordinateKey(
        tileCoordinate.tileX,
        tileCoordinate.tileY,
      ),
    ),
  );
  const tileRuns: DefiningWorldBuildingPlotBounds[] = [];

  while (remainingTileKeys.size > 0) {
    const candidateRuns = [
      ...listingWorldBuildingPlotRegistryMaximalTileRunsAlongAxis(
        componentTiles.filter((tileCoordinate) =>
          remainingTileKeys.has(
            formattingWorldBuildingPlotRegistryTileCoordinateKey(
              tileCoordinate.tileX,
              tileCoordinate.tileY,
            ),
          ),
        ),
        "horizontal",
      ),
      ...listingWorldBuildingPlotRegistryMaximalTileRunsAlongAxis(
        componentTiles.filter((tileCoordinate) =>
          remainingTileKeys.has(
            formattingWorldBuildingPlotRegistryTileCoordinateKey(
              tileCoordinate.tileX,
              tileCoordinate.tileY,
            ),
          ),
        ),
        "vertical",
      ),
    ];

    let selectedRun = candidateRuns[0];
    let selectedRunTileCount = countingWorldBuildingPlotRegistryTilesInBounds(
      selectedRun,
    );

    for (const candidateRun of candidateRuns) {
      const candidateRunTileCount =
        countingWorldBuildingPlotRegistryTilesInBounds(candidateRun);

      if (candidateRunTileCount > selectedRunTileCount) {
        selectedRun = candidateRun;
        selectedRunTileCount = candidateRunTileCount;
      }
    }

    tileRuns.push(selectedRun);

    for (const tileKey of listingWorldBuildingPlotRegistryTileKeysInBounds(
      selectedRun,
    )) {
      remainingTileKeys.delete(tileKey);
    }
  }

  return tileRuns;
}

/**
 * Chooses the most compact run layout for an irregular connected component.
 *
 * @param componentTiles - Connected tile component.
 */
function listingWorldBuildingPlotRegistryCompactTileRunsForComponent(
  componentTiles: readonly DefiningWorldBuildingPlotRegistryTileCoordinate[],
): DefiningWorldBuildingPlotBounds[] {
  const filledRectangleBounds =
    resolvingWorldBuildingPlotRegistryFilledRectangleBoundsFromTiles(
      componentTiles,
    );

  if (filledRectangleBounds) {
    return [filledRectangleBounds];
  }

  return listingWorldBuildingPlotRegistryGreedyTileRunsForComponent(
    componentTiles,
  );
}

/**
 * Sorts contiguous regions for stable claim list display.
 *
 * @param leftRegion - First region.
 * @param rightRegion - Second region.
 */
function comparingWorldBuildingPlotRegistryContiguousRegionsForDisplay(
  leftRegion: DefiningWorldBuildingPlotRegistryContiguousRegion,
  rightRegion: DefiningWorldBuildingPlotRegistryContiguousRegion,
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
 * @param plots - All claimed plots for one owner.
 */
export function groupingWorldBuildingPlotRegistryTilesIntoContiguousRegions(
  plots: readonly DefiningWorldBuildingPlot[],
): DefiningWorldBuildingPlotRegistryContiguousRegion[] {
  const tileCoordinates =
    listingWorldBuildingPlotRegistryTileCoordinatesFromPlots(plots);

  if (tileCoordinates.length === 0) {
    return [];
  }

  const connectedComponents =
    groupingWorldBuildingPlotRegistryTileCoordinatesIntoConnectedComponents(
      tileCoordinates,
    );
  const contiguousRegions: DefiningWorldBuildingPlotRegistryContiguousRegion[] =
    [];

  for (const componentTiles of connectedComponents) {
    const tileRuns =
      listingWorldBuildingPlotRegistryCompactTileRunsForComponent(componentTiles);

    for (const bounds of tileRuns) {
      contiguousRegions.push({
        bounds,
        tileCount: countingWorldBuildingPlotRegistryTilesInBounds(bounds),
      });
    }
  }

  return contiguousRegions.sort(
    comparingWorldBuildingPlotRegistryContiguousRegionsForDisplay,
  );
}

/**
 * Formats contiguous region bounds for claim mode list badges.
 *
 * @param bounds - Inclusive tile bounds for one region.
 */
export function formattingWorldBuildingPlotRegistryContiguousRegionLabel(
  bounds: DefiningWorldBuildingPlotBounds,
): string {
  const { minTileX, minTileY, maxTileX, maxTileY } = bounds;

  if (minTileX === maxTileX && minTileY === maxTileY) {
    return `(${minTileX}, ${minTileY})`;
  }

  return `(${minTileX}, ${minTileY}) to (${maxTileX}, ${maxTileY})`;
}
