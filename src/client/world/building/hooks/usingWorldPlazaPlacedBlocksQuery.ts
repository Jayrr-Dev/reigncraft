"use client";

import {
  DEFINING_WORLD_BUILDING_VIEWPORT_PLOT_SEARCH_TILE_RADIUS,
} from "@/components/world/building/domains/definingWorldBuildingBuildModeConstants";
import { listingWorldBuildingPlacedBlocksFromPlots } from "@/components/world/building/domains/listingWorldBuildingPlacedBlocksFromPlots";
import type { DefiningWorldBuildingPlacedBlock } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import type { DefiningWorldBuildingPlot } from "@/components/world/building/domains/definingWorldBuildingPlot";
import {
  DEFINING_WORLD_BUILDING_PLOTS_QUERY_KEY_ROOT,
} from "@/components/world/building/domains/definingWorldBuildingPlotConstants";
import {
  fetchingWorldBuildingPlotsByBounds,
  fetchingWorldBuildingPlotsByOwnerUserId,
  type FetchingWorldBuildingPlotsByBoundsInput,
} from "@/components/world/building/repositories/fetchingWorldBuildingPlotsByBounds";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from "@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

/** Params for {@link usingWorldPlazaPlacedBlocksQuery}. */
export interface UsingWorldPlazaPlacedBlocksQueryParams {
  isEnabled: boolean;
  onlineUserId: string | null;
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
}

/** Fresh plot payload returned after refetching server aggregates. */
export interface RefetchingWorldBuildingPlotsResult {
  plots: DefiningWorldBuildingPlot[];
  ownedPlots: DefiningWorldBuildingPlot[];
}

/** Result from {@link usingWorldPlazaPlacedBlocksQuery}. */
export interface UsingWorldPlazaPlacedBlocksQueryResult {
  plots: DefiningWorldBuildingPlot[];
  placedBlocks: DefiningWorldBuildingPlacedBlock[];
  ownedPlots: DefiningWorldBuildingPlot[];
  isLoading: boolean;
  queryErrorMessage: string | null;
  refetchingPlots: () => Promise<RefetchingWorldBuildingPlotsResult>;
}

/**
 * Resolves a tile bounds query window around a grid point.
 *
 * @param gridPoint - Player position in grid space.
 */
export function resolvingWorldBuildingViewportPlotBoundsFromGridPoint(
  gridPoint: DefiningWorldPlazaWorldPoint,
): FetchingWorldBuildingPlotsByBoundsInput {
  const standingTile = resolvingWorldPlazaIsometricTileIndexAtGridPoint(gridPoint);
  const radius = DEFINING_WORLD_BUILDING_VIEWPORT_PLOT_SEARCH_TILE_RADIUS;

  return {
    minTileX: standingTile.tileX - radius,
    minTileY: standingTile.tileY - radius,
    maxTileX: standingTile.tileX + radius,
    maxTileY: standingTile.tileY + radius,
  };
}

/**
 * Loads nearby build plots and flattens placed blocks for collision and rendering.
 *
 * @param params - Enable flag, user id, and live player position ref.
 */
export function usingWorldPlazaPlacedBlocksQuery({
  isEnabled,
  onlineUserId,
  playerPositionRef,
}: UsingWorldPlazaPlacedBlocksQueryParams): UsingWorldPlazaPlacedBlocksQueryResult {
  const plotsQuery = useQuery({
    queryKey: [DEFINING_WORLD_BUILDING_PLOTS_QUERY_KEY_ROOT, onlineUserId],
    queryFn: () => {
      const playerPosition = playerPositionRef.current ?? {
        x: 0,
        y: 0,
      };

      return fetchingWorldBuildingPlotsByBounds(
        resolvingWorldBuildingViewportPlotBoundsFromGridPoint(playerPosition),
      );
    },
    enabled: isEnabled,
    staleTime: 5_000,
    refetchInterval: 15_000,
  });

  const ownedPlotsQuery = useQuery({
    queryKey: ["world-building-owned-plots", onlineUserId],
    queryFn: () => fetchingWorldBuildingPlotsByOwnerUserId(onlineUserId ?? ""),
    enabled: isEnabled && Boolean(onlineUserId),
    staleTime: 10_000,
  });

  const plots = plotsQuery.data ?? [];
  const placedBlocks = useMemo(
    () => listingWorldBuildingPlacedBlocksFromPlots(plots),
    [plots],
  );

  return {
    plots,
    placedBlocks,
    ownedPlots: ownedPlotsQuery.data ?? [],
    isLoading: plotsQuery.isLoading || ownedPlotsQuery.isLoading,
    queryErrorMessage:
      plotsQuery.error instanceof Error
        ? plotsQuery.error.message
        : ownedPlotsQuery.error instanceof Error
          ? ownedPlotsQuery.error.message
          : null,
    refetchingPlots: async () => {
      const [viewportResult, ownedResult] = await Promise.all([
        plotsQuery.refetch(),
        ownedPlotsQuery.refetch(),
      ]);

      return {
        plots: viewportResult.data ?? [],
        ownedPlots: ownedResult.data ?? [],
      };
    },
  };
}
