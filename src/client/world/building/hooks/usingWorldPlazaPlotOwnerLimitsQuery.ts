"use client";

import { DEFINING_WORLD_BUILDING_PLOT_OWNER_LIMITS_QUERY_KEY_ROOT } from "@/components/world/building/domains/definingWorldBuildingPlotConstants";
import type { DefiningWorldBuildingPlotOwnerLimits } from "@/components/world/building/domains/definingWorldBuildingPlotOwnerLimits";
import { resolvingWorldBuildingPlotOwnerLimits } from "@/components/world/building/domains/resolvingWorldBuildingPlotOwnerLimits";
import { fetchingWorldBuildingPlotOwnerLimitsByUserId } from "@/components/world/building/repositories/fetchingWorldBuildingPlotOwnerLimitsByUserId";
import { useQuery } from "@tanstack/react-query";

/** Params for {@link usingWorldPlazaPlotOwnerLimitsQuery}. */
export interface UsingWorldPlazaPlotOwnerLimitsQueryParams {
  userId: string | null;
  isEnabled?: boolean;
}

/** Result from {@link usingWorldPlazaPlotOwnerLimitsQuery}. */
export interface UsingWorldPlazaPlotOwnerLimitsQueryResult {
  plotOwnerLimits: DefiningWorldBuildingPlotOwnerLimits;
  isLoading: boolean;
  queryErrorMessage: string | null;
}

/**
 * Loads per-user plot and tile claim limits for plaza building.
 *
 * @param params - Auth user id and optional enable flag.
 */
export function usingWorldPlazaPlotOwnerLimitsQuery({
  userId,
  isEnabled = true,
}: UsingWorldPlazaPlotOwnerLimitsQueryParams): UsingWorldPlazaPlotOwnerLimitsQueryResult {
  const limitsQuery = useQuery({
    queryKey: [DEFINING_WORLD_BUILDING_PLOT_OWNER_LIMITS_QUERY_KEY_ROOT, userId],
    queryFn: () => fetchingWorldBuildingPlotOwnerLimitsByUserId(userId as string),
    enabled: isEnabled && Boolean(userId),
    staleTime: 60_000,
  });

  return {
    plotOwnerLimits: limitsQuery.data ?? resolvingWorldBuildingPlotOwnerLimits(null),
    isLoading: limitsQuery.isLoading,
    queryErrorMessage:
      limitsQuery.error instanceof Error ? limitsQuery.error.message : null,
  };
}
