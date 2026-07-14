'use client';

import type { DefiningWorldPlazaPickedFlowerTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedFlowers';
import { listingWorldPlazaLocalPickedFlowers } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedFlowers';
import { fetchingWorldHarvestDevvitPickedFlowers } from '@/components/world/harvest/repositories/callingWorldHarvestDevvitApi';
import { useQuery } from '@tanstack/react-query';
import {
  WORLD_HARVEST_DEVVIT_PICKED_FLOWERS_API_PATH,
  WORLD_HARVEST_DEVVIT_PICKED_FLOWERS_POLL_INTERVAL_MS,
} from '../../../../shared/worldHarvestDevvit';

export const DEFINING_WORLD_PLAZA_PICKED_FLOWERS_QUERY_KEY_ROOT =
  'world-picked-flowers' as const;

export type UsingWorldPlazaPickedFlowersParams = {
  readonly enabled: boolean;
  readonly localPersistenceOwnerId?: string | null;
  readonly redditUserId?: string | null;
  readonly saveSlotIndex?: number | null;
};

export type UsingWorldPlazaPickedFlowersResult = {
  readonly pickedFlowerStateByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaPickedFlowerTileState
  >;
  readonly isReady: boolean;
};

/**
 * Returns true when picked flowers should persist locally instead of via Devvit.
 */
export function checkingWorldPlazaPickedFlowersUseLocalPersistence(
  localPersistenceOwnerId: string | null | undefined,
  redditUserId: string | null | undefined
): boolean {
  return (
    typeof localPersistenceOwnerId === 'string' &&
    localPersistenceOwnerId.length > 0 &&
    (redditUserId == null || redditUserId.length === 0)
  );
}

function mappingWorldHarvestDevvitPickedFlowers(
  tiles: Awaited<ReturnType<typeof fetchingWorldHarvestDevvitPickedFlowers>>
): ListingWorldPlazaPickedFlowersMappedResult {
  const pickedFlowerStateByTileKey = new Map<
    string,
    DefiningWorldPlazaPickedFlowerTileState
  >();

  for (const tile of tiles) {
    pickedFlowerStateByTileKey.set(tile.tileKey, {
      isPicked: true,
    });
  }

  return { pickedFlowerStateByTileKey };
}

type ListingWorldPlazaPickedFlowersMappedResult = {
  readonly pickedFlowerStateByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaPickedFlowerTileState
  >;
};

/**
 * Loads picked-flower state for rendering and interaction.
 */
export function usingWorldPlazaPickedFlowers({
  enabled,
  localPersistenceOwnerId = null,
  redditUserId = null,
  saveSlotIndex = null,
}: UsingWorldPlazaPickedFlowersParams): UsingWorldPlazaPickedFlowersResult {
  const useLocalPersistence =
    checkingWorldPlazaPickedFlowersUseLocalPersistence(
      localPersistenceOwnerId,
      redditUserId
    );

  const localPickedFlowersQuery = useQuery({
    queryKey: [
      DEFINING_WORLD_PLAZA_PICKED_FLOWERS_QUERY_KEY_ROOT,
      'local',
      localPersistenceOwnerId,
    ],
    queryFn: () =>
      listingWorldPlazaLocalPickedFlowers(localPersistenceOwnerId ?? ''),
    enabled: enabled && useLocalPersistence && Boolean(localPersistenceOwnerId),
    staleTime: 500,
    refetchInterval: WORLD_HARVEST_DEVVIT_PICKED_FLOWERS_POLL_INTERVAL_MS,
  });

  const devvitPickedFlowersQuery = useQuery({
    queryKey: [
      DEFINING_WORLD_PLAZA_PICKED_FLOWERS_QUERY_KEY_ROOT,
      'devvit',
      redditUserId,
      saveSlotIndex,
    ],
    queryFn: async () =>
      mappingWorldHarvestDevvitPickedFlowers(
        await fetchingWorldHarvestDevvitPickedFlowers(
          WORLD_HARVEST_DEVVIT_PICKED_FLOWERS_API_PATH,
          saveSlotIndex
        )
      ),
    enabled: enabled && !useLocalPersistence && Boolean(redditUserId),
    staleTime: 500,
    refetchInterval: WORLD_HARVEST_DEVVIT_PICKED_FLOWERS_POLL_INTERVAL_MS,
  });

  if (useLocalPersistence) {
    return {
      pickedFlowerStateByTileKey:
        localPickedFlowersQuery.data?.pickedFlowerStateByTileKey ?? new Map(),
      isReady:
        !enabled ||
        !localPersistenceOwnerId ||
        localPickedFlowersQuery.isSuccess,
    };
  }

  return {
    pickedFlowerStateByTileKey:
      devvitPickedFlowersQuery.data?.pickedFlowerStateByTileKey ?? new Map(),
    isReady: !enabled || !redditUserId || devvitPickedFlowersQuery.isSuccess,
  };
}
