"use client";

import {
  filteringWorldBuildingPlotRegistryOwnerGroupsForClaimModeViewer,
  groupingWorldBuildingPlotRegistryEntriesByOwner,
} from "@/components/world/building/domains/groupingWorldBuildingPlotRegistryEntriesByOwner";
import {
  DEFINING_WORLD_BUILDING_PLOT_OWNER_LABELS_QUERY_KEY_ROOT,
  DEFINING_WORLD_BUILDING_PLOTS_REGISTRY_QUERY_KEY_ROOT,
} from "@/components/world/building/domains/definingWorldBuildingClaimModeConstants";
import { fetchingWorldBuildingPlotOwnerDisplayLabelsByUserIds } from "@/components/world/building/repositories/fetchingWorldBuildingPlotOwnerDisplayLabelsByUserIds";
import { fetchingWorldBuildingPlotsRegistry } from "@/components/world/building/repositories/fetchingWorldBuildingPlotsRegistry";
import { PAGING_USER_PROFILE_FRIENDS_PAGE_SIZE } from "@/components/friends/domains/definingUserProfileFriend";
import { fetchingUserProfileFriends } from "@/components/friends/utils/fetchingUserProfileFriends";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

/** Params for {@link usingWorldPlazaClaimModePlotRegistryQuery}. */
export interface UsingWorldPlazaClaimModePlotRegistryQueryParams {
  isEnabled: boolean;
  localUserId: string | null;
}

/** Result from {@link usingWorldPlazaClaimModePlotRegistryQuery}. */
export interface UsingWorldPlazaClaimModePlotRegistryQueryResult {
  ownerGroups: ReturnType<typeof groupingWorldBuildingPlotRegistryEntriesByOwner>;
  isLoading: boolean;
  queryErrorMessage: string | null;
  refetchingRegistry: () => Promise<void>;
}

/**
 * Loads the global plot registry, friend ids, and owner labels for claim mode.
 *
 * @param params - Enable flag and local auth user id.
 */
export function usingWorldPlazaClaimModePlotRegistryQuery({
  isEnabled,
  localUserId,
}: UsingWorldPlazaClaimModePlotRegistryQueryParams): UsingWorldPlazaClaimModePlotRegistryQueryResult {
  const registryQuery = useQuery({
    queryKey: [DEFINING_WORLD_BUILDING_PLOTS_REGISTRY_QUERY_KEY_ROOT],
    queryFn: fetchingWorldBuildingPlotsRegistry,
    enabled: isEnabled,
    staleTime: 10_000,
    refetchInterval: 30_000,
  });

  const friendsQuery = useQuery({
    queryKey: ["user-profile-friends", "claim-mode"],
    queryFn: () =>
      fetchingUserProfileFriends({
        page: 1,
        pageSize: PAGING_USER_PROFILE_FRIENDS_PAGE_SIZE,
      }),
    enabled: isEnabled && Boolean(localUserId),
    staleTime: 30_000,
  });

  const friendUserIds = useMemo(() => {
    return new Set(
      (friendsQuery.data?.rows ?? []).map((friendRow) => friendRow.userId),
    );
  }, [friendsQuery.data?.rows]);

  const ownerUserIds = useMemo(() => {
    if (!localUserId) {
      return [];
    }

    const registryPlots = registryQuery.data ?? [];
    const labelUserIds = new Set<string>([localUserId]);

    for (const plot of registryPlots) {
      if (friendUserIds.has(plot.ownerId)) {
        labelUserIds.add(plot.ownerId);
      }
    }

    return [...labelUserIds];
  }, [friendUserIds, localUserId, registryQuery.data]);

  const ownerLabelsQuery = useQuery({
    queryKey: [
      DEFINING_WORLD_BUILDING_PLOT_OWNER_LABELS_QUERY_KEY_ROOT,
      ownerUserIds,
    ],
    queryFn: () =>
      fetchingWorldBuildingPlotOwnerDisplayLabelsByUserIds(ownerUserIds),
    enabled: isEnabled && ownerUserIds.length > 0,
    staleTime: 60_000,
  });

  const ownerGroups = useMemo(
    () =>
      filteringWorldBuildingPlotRegistryOwnerGroupsForClaimModeViewer(
        groupingWorldBuildingPlotRegistryEntriesByOwner(
          registryQuery.data ?? [],
          localUserId,
          ownerLabelsQuery.data ?? {},
        ),
        localUserId,
        friendUserIds,
      ),
    [friendUserIds, localUserId, ownerLabelsQuery.data, registryQuery.data],
  );

  return {
    ownerGroups,
    isLoading:
      registryQuery.isLoading ||
      friendsQuery.isLoading ||
      ownerLabelsQuery.isLoading,
    queryErrorMessage:
      registryQuery.error instanceof Error
        ? registryQuery.error.message
        : friendsQuery.error instanceof Error
          ? friendsQuery.error.message
          : ownerLabelsQuery.error instanceof Error
            ? ownerLabelsQuery.error.message
            : null,
    refetchingRegistry: async () => {
      await Promise.all([
        registryQuery.refetch(),
        friendsQuery.refetch(),
        ownerLabelsQuery.refetch(),
      ]);
    },
  };
}
