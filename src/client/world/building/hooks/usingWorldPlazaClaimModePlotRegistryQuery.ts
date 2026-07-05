'use client';

import { USER_PROFILE_UNFRIENDED_USER_IDS_QUERY_KEY } from '@/components/friends/domains/definingUserProfileFriend';
import { fetchingUserProfileUnfriendedUserIds } from '@/components/friends/utils/fetchingUserProfileUnfriendedUserIds';
import {
  DEFINING_WORLD_BUILDING_PLOT_OWNER_LABELS_QUERY_KEY_ROOT,
  DEFINING_WORLD_BUILDING_PLOTS_REGISTRY_QUERY_KEY_ROOT,
} from '@/components/world/building/domains/definingWorldBuildingClaimModeConstants';
import {
  filteringWorldBuildingPlotRegistryOwnerGroupsForClaimModeViewer,
  groupingWorldBuildingPlotRegistryEntriesByOwner,
} from '@/components/world/building/domains/groupingWorldBuildingPlotRegistryEntriesByOwner';
import { fetchingWorldBuildingPlotOwnerDisplayLabelsByUserIds } from '@/components/world/building/repositories/fetchingWorldBuildingPlotOwnerDisplayLabelsByUserIds';
import { fetchingWorldBuildingPlotsRegistry } from '@/components/world/building/repositories/fetchingWorldBuildingPlotsRegistry';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

/** Params for {@link usingWorldPlazaClaimModePlotRegistryQuery}. */
export interface UsingWorldPlazaClaimModePlotRegistryQueryParams {
  isEnabled: boolean;
  localUserId: string | null;
}

/** Result from {@link usingWorldPlazaClaimModePlotRegistryQuery}. */
export interface UsingWorldPlazaClaimModePlotRegistryQueryResult {
  ownerGroups: ReturnType<
    typeof groupingWorldBuildingPlotRegistryEntriesByOwner
  >;
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

  const unfriendedUserIdsQuery = useQuery({
    queryKey: [...USER_PROFILE_UNFRIENDED_USER_IDS_QUERY_KEY, localUserId],
    queryFn: () => fetchingUserProfileUnfriendedUserIds(localUserId ?? ''),
    enabled: isEnabled && Boolean(localUserId),
    staleTime: Infinity,
  });

  const unfriendedUserIds = useMemo(() => {
    return new Set(unfriendedUserIdsQuery.data?.userIds ?? []);
  }, [unfriendedUserIdsQuery.data?.userIds]);

  const ownerUserIds = useMemo(() => {
    if (!localUserId) {
      return [];
    }

    const registryPlots = registryQuery.data ?? [];
    const labelUserIds = new Set<string>([localUserId]);

    for (const plot of registryPlots) {
      if (
        plot.ownerId === localUserId ||
        !unfriendedUserIds.has(plot.ownerId)
      ) {
        labelUserIds.add(plot.ownerId);
      }
    }

    return [...labelUserIds];
  }, [localUserId, registryQuery.data, unfriendedUserIds]);

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
          ownerLabelsQuery.data ?? {}
        ),
        localUserId,
        unfriendedUserIds
      ),
    [localUserId, ownerLabelsQuery.data, registryQuery.data, unfriendedUserIds]
  );

  return {
    ownerGroups,
    isLoading:
      registryQuery.isLoading ||
      unfriendedUserIdsQuery.isLoading ||
      ownerLabelsQuery.isLoading,
    queryErrorMessage:
      registryQuery.error instanceof Error
        ? registryQuery.error.message
        : unfriendedUserIdsQuery.error instanceof Error
          ? unfriendedUserIdsQuery.error.message
          : ownerLabelsQuery.error instanceof Error
            ? ownerLabelsQuery.error.message
            : null,
    refetchingRegistry: async () => {
      await Promise.all([
        registryQuery.refetch(),
        unfriendedUserIdsQuery.refetch(),
        ownerLabelsQuery.refetch(),
      ]);
    },
  };
}
